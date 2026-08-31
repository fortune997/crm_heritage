import { Payment, Sale } from "@/core/types/ventes/type";
import supabase from "@/core/lib/supabase";
import { CreatePaymentInput } from "@/core/hooks/payments/usePayments";

export async function fetchPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
        .from("payments")
        .select(`
            id,
            sale_id,
            reference,
            amount,
            payment_method,
            status,
            payment_date,
            transaction_reference,
            notes,
            created_by,
            created_at,
            updated_at,

            sale:sales (
                id,
                reference,
                prospect_id,
                site_id,
                sale_amount,
                total_paid,
                remaining_amount,
                payment_schedule,
                status,
                created_at,
                updated_at,

                prospects:prospects (
                    id,
                    full_name,
                    phone,
                    email
                ),

                sites:sites (
                    id,
                    nom_titre,
                    ville,
                    quartier
                )
            )
        `)
        .order("payment_date", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            `Erreur lors de la récupération des paiements : ${error.message}`
        );
    }

    return (data ?? []).map((payment) => {
        const sale = Array.isArray(payment.sale)
            ? payment.sale[0]
            : payment.sale;

        if (!sale) {
            throw new Error(
                `La vente associée au paiement ${payment.id} est introuvable.`
            );
        }

        const prospect = Array.isArray(sale.prospects)
            ? sale.prospects[0]
            : sale.prospects;

        const site = Array.isArray(sale.sites)
            ? sale.sites[0]
            : sale.sites;

        if (!prospect) {
            throw new Error(
                `Le prospect associé à la vente ${sale.reference} est introuvable.`
            );
        }

        return {
            id: payment.id,
            sale_id: payment.sale_id,
            reference: payment.reference,
            amount: payment.amount,
            payment_method: payment.payment_method,
            status: payment.status,
            payment_date: payment.payment_date,
            transaction_reference:
                payment.transaction_reference ?? null,
            notes: payment.notes ?? null,
            created_by: payment.created_by ?? null,
            created_at: payment.created_at,
            updated_at: payment.updated_at,

            sale: {
                id: sale.id,
                reference: sale.reference,

                prospect_id: sale.prospect_id,
                site_id: sale.site_id,

                sale_amount: sale.sale_amount,
                total_paid: sale.total_paid,
                remaining_amount: sale.remaining_amount,

                payment_schedule: sale.payment_schedule,
                status: sale.status,

                created_at: sale.created_at,
                updated_at: sale.updated_at,

                prospects: {
                    id: prospect.id,
                    full_name: prospect.full_name,
                    phone: prospect.phone ?? null,
                    email: prospect.email ?? null,
                },

                sites: site
                    ? {
                        id: site.id,
                        nom_titre: site.nom_titre,
                        ville: site.ville ?? null,
                        quartier: site.quartier ?? null,
                    }
                    : null,
            },
        };
    });
}

export async function getPaymentsBySale(
    saleId: string
): Promise<Payment[]> {
    const { data, error } = await supabase
        .from("payments")
        .select(`
            *,
            sale:sales(
                *,
                prospect:prospects(*),
                site:sites(*)
            )
        `)
        .eq("sale_id", saleId)
        .order("payment_date", {
            ascending: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as Payment[];
}

export async function getSaleById(
    saleId: string
): Promise<Sale> {
    const { data, error } = await supabase
        .from("sales")
        .select(`
            *,
            prospect:prospects(*),
            site:sites(*)
        `)
        .eq("id", saleId)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Vente introuvable");
    }

    return data as Sale}
    
export async function createPayment(
    input: CreatePaymentInput
): Promise<Payment> {




    if (!input.created_by) {
        throw new Error(
            "Vous devez être connecté pour enregistrer un paiement"
        );
    }

    if (input.amount <= 0) {
        throw new Error(
            "Le montant doit être supérieur à zéro"
        );
    }

    /*
     * On récupère la vente avant l'insertion pour donner
     * une erreur compréhensible à la comptable.
     */
    const { data: saleData, error: saleError } =
        await supabase
            .from("sales")
            .select(`
                *,
                prospect:prospects(*),
                site:sites(*)
            `)
            .eq("id", input.sale_id)
            .maybeSingle();

    if (saleError) {
        throw new Error(saleError.message);
    }

    if (!saleData) {
        throw new Error(
            "La vente sélectionnée est introuvable"
        );
    }

    const sale = saleData as Sale;

    if (sale.remaining_amount <= 0) {
        throw new Error(
            "Cette vente est déjà entièrement payée"
        );
    }

    if (
        input.status === "confirme" &&
        input.amount > sale.remaining_amount
    ) {
        throw new Error(
            `Le montant dépasse le reste à payer de ${formatCurrency(
                sale.remaining_amount
            )}`
        );
    }

    if (
        input.payment_method !== "especes" &&
        !input.transaction_reference?.trim()
    ) {
        throw new Error(
            "La référence de transaction est obligatoire"
        );
    }

    const { data, error } = await supabase
        .from("payments")
        .insert({
            sale_id: input.sale_id,
            amount: input.amount,
            payment_method:
                input.payment_method,
            status: input.status,
            payment_date: input.payment_date,
            transaction_reference:
                input.transaction_reference?.trim() ||
                null,
            notes: input.notes?.trim() || null,
            created_by: input.created_by,
        })
        .select(`
            *,
            sale:sales(
                *,
                prospect:prospects(*),
                site:sites(*)
            )
        `)
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new Error(
                "Cette référence de transaction a déjà été utilisée"
            );
        }

        if (error.code === "23514") {
            throw new Error(
                "Le mode ou le statut du paiement n'est pas autorisé par la base de données"
            );
        }

        if (error.code === "23503") {
            throw new Error(
                "La vente associée à ce paiement n'existe plus"
            );
        }

        throw new Error(error.message);
    }

    return data as Payment;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
};

