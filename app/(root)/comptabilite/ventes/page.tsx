"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Payment, PaymentMethod, PaymentStatus } from "@/core/types/ventes/type";
import { PaymentStats } from "@/components/peiments/PaymentStats";
import { PaymentFilters } from "@/components/peiments/PaymentFilters";
import { PaymentsTable } from "@/components/peiments/PaymentsTable";
import { usePayments } from "@/core/hooks/payments/usePayments";



export default function PaymentsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] =
        useState<PaymentStatus | "all">("all");

    const [method, setMethod] =
        useState<PaymentMethod | "all">("all");

    const filters = useMemo(
        () => ({
            search,
            status,
            method,
        }),
        [search, status, method]
    );

    const {
        data: payments = [],
        isLoading,
        isError,
    } = usePayments();

    const stats = useMemo(() => {
        return payments.reduce(
            (accumulator, payment) => {
                if (payment.status === "confirme") {
                    accumulator.totalCollected += payment.amount;
                }

                /*   accumulator.totalRemaining +=
                      payment.sale.remaining_amount; */

                return accumulator;
            },
            {
                totalCollected: 0,
                pendingAmount: 0,
                totalRemaining: 0,
            }
        );
    }, [payments]);

    const handleReset = () => {
        setSearch("");
        setStatus("all");
        setMethod("all");
    };

    const handleView = (payment: Payment) => {
        console.log("Paiement :", payment);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Paiements & ventes
                    </h1>

                    <p className="text-muted-foreground">
                        Gérez les ventes, encaissements et règlements
                        de vos clients.
                    </p>
                </div>

                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nouveau paiement
                </Button>
            </div>

            <PaymentStats
                totalCollected={stats.totalCollected}
                pendingAmount={stats.pendingAmount}
                totalRemaining={stats.totalRemaining}
                totalSales={new Set(
                    payments.map(
                        (payment) => payment.sale_id
                    )
                ).size}
            />

            <PaymentFilters
                search={search}
                status={status}
                method={method}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onMethodChange={setMethod}
                onReset={handleReset}
            />

            {isLoading && (
                <div className="rounded-lg border p-10 text-center text-muted-foreground">
                    Chargement des paiements...
                </div>
            )}

            {isError && (
                <div className="rounded-lg border border-destructive/50 p-10 text-center text-destructive">
                    Impossible de charger les paiements.
                </div>
            )}

            {!isLoading && !isError && (
                <PaymentsTable
                    payments={payments}
                    onView={handleView}
                />
            )}
        </div>
    );
}