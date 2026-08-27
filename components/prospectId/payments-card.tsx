import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    CheckCircle2,
    Plus,
} from "lucide-react";



interface Props {
    customer: Customer360;
}

export function PaymentsCard({
    customer,
}: Props) {
    const total = customer.land?.price || 0;

    const paid = customer.payments
        .filter((payment) => payment.status === "paid")
        .reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

    const remaining = Math.max(total - paid, 0);

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">
                    Paiements effectués
                </h2>

                <button className="text-xs font-semibold text-primary">
                    Voir tout
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Amount
                    label="Prix total"
                    amount={total}
                />

                <Amount
                    label="Payé"
                    amount={paid}
                    positive
                />

                <Amount
                    label="Solde"
                    amount={remaining}
                    negative
                />
            </div>

            <div className="mt-4 divide-y rounded-lg border">
                {customer.payments.map((payment) => (
                    <div
                        key={payment.id}
                        className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <p className="text-sm font-medium">
                                {payment.label}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {payment.date}
                                {payment.reference &&
                                    ` · ${payment.reference}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-semibold">
                                {formatMoney(payment.amount)}
                            </span>

                            <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Reçu
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium hover:bg-muted">
                <Plus className="h-4 w-4" />
                Enregistrer un paiement
            </button>
        </section>
    );
}

function Amount({
    label,
    amount,
    positive,
    negative,
}: {
    label: string;
    amount: number;
    positive?: boolean;
    negative?: boolean;
}) {
    return (
        <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p
                className={[
                    "mt-1 text-sm font-bold",
                    positive && "text-emerald-600",
                    negative && "text-red-600",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {formatMoney(amount)}
            </p>
        </div>
    );
}

function formatMoney(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value) +
        " FCFA";
}