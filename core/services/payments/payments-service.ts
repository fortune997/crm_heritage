import { Payment } from "@/core/types/ventes/type";
import supabase from "@/core/lib/supabase";

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

                prospect:prospects (
                    id,
                    full_name,
                    phone,
                    email
                ),

                site:sites (
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

        const prospect = Array.isArray(sale.prospect)
            ? sale.prospect[0]
            : sale.prospect;

        const site = Array.isArray(sale.site)
            ? sale.site[0]
            : sale.site;

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

                prospect: {
                    id: prospect.id,
                    full_name: prospect.full_name,
                    phone: prospect.phone ?? null,
                    email: prospect.email ?? null,
                },

                site: site
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