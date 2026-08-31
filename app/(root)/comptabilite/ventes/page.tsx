"use client";

import { useMemo, useState } from "react";
import {
    AlertCircle,
    Banknote,
    Loader2,
    ReceiptText,
} from "lucide-react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import type {
    Payment,
    PaymentMethod,
    PaymentStatus,
} from "@/core/types/ventes/type";

import { PaymentStats } from "@/components/peiments/PaymentStats";
import { PaymentFilters } from "@/components/peiments/PaymentFilters";
import { PaymentsTable } from "@/components/peiments/PaymentsTable";

import { SaleCard } from "@/components/sales/SalesCard";

import { usePayments } from "@/core/hooks/payments/usePayments";
import { useSales } from "@/core/hooks/sales/useSales";
import { CreateSaleDialog } from "@/components/sales/CreateSaleDialog.tsx";

export default function PaymentsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] =
        useState<PaymentStatus | "all">("all");
    const [method, setMethod] =
        useState<PaymentMethod | "all">("all");

    const {
        data: sales = [],
        isLoading: isLoadingSales,
        isError: isSalesError,
    } = useSales();

    const {
        data: payments = [],
        isLoading: isLoadingPayments,
        isError: isPaymentsError,
    } = usePayments();

    const filteredPayments = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return payments.filter((payment) => {
            const matchesStatus =
                status === "all" ||
                payment.status === status;

            const matchesMethod =
                method === "all" ||
                payment.payment_method === method;

            const searchableValues = [
                payment.reference,
                payment.transaction_reference,
                payment.sale?.reference,
                payment.sale?.prospects?.full_name,
                payment.sale?.prospects?.phone,
            ];

            const matchesSearch =
                normalizedSearch.length === 0 ||
                searchableValues.some((value) =>
                    value
                        ?.toLowerCase()
                        .includes(normalizedSearch)
                );

            return (
                matchesStatus &&
                matchesMethod &&
                matchesSearch
            );
        });
    }, [payments, search, status, method]);

    /*
     * Les montants restants sont calculés depuis les ventes,
     * pas depuis les paiements. Sinon une même vente peut être
     * comptabilisée plusieurs fois.
     */
    const stats = useMemo(() => {
        const totalCollected = payments.reduce(
            (total, payment) => {
                if (payment.status !== "confirme") {
                    return total;
                }

                return total + payment.amount;
            },
            0
        );

        const pendingAmount = payments.reduce(
            (total, payment) => {
                if (
                    String(payment.status) !==
                    "en_attente"
                ) {
                    return total;
                }

                return total + payment.amount;
            },
            0
        );

        const totalRemaining = sales.reduce(
            (total, sale) =>
                total + sale.remaining_amount,
            0
        );

        return {
            totalCollected,
            pendingAmount,
            totalRemaining,
            totalSales: sales.length,
        };
    }, [payments, sales]);

    function handleReset(): void {
        setSearch("");
        setStatus("all");
        setMethod("all");
    }

    function handleView(payment: Payment): void {
        console.log("Paiement sélectionné :", payment);
    }

    return (
        <div className="min-h-screen bg-background p-4 text-foreground md:p-6">
            <div className="mx-auto max-w-[1600px] space-y-6">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Ventes et paiements
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Gérez les ventes, les encaissements
                            et les règlements des clients.
                        </p>
                    </div>

                    <CreateSaleDialog />
                </header>

                <PaymentStats
                    totalCollected={stats.totalCollected}
                    pendingAmount={stats.pendingAmount}
                    totalRemaining={stats.totalRemaining}
                    totalSales={stats.totalSales}
                />

                <Tabs
                    defaultValue="sales"
                    className="space-y-5"
                >
                    <TabsList className="grid h-auto w-full grid-cols-2 md:w-[420px]">
                        <TabsTrigger
                            value="sales"
                            className="gap-2 py-2.5"
                        >
                            <ReceiptText className="size-4" />
                            Ventes
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                {sales.length}
                            </span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="payments"
                            className="gap-2 py-2.5"
                        >
                            <Banknote className="size-4" />
                            Paiements
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                {payments.length}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="sales"
                        className="mt-0"
                    >
                        {isLoadingSales && (
                            <LoadingState message="Chargement des ventes..." />
                        )}

                        {isSalesError && (
                            <ErrorState message="Impossible de charger les ventes." />
                        )}

                        {!isLoadingSales &&
                            !isSalesError &&
                            sales.length === 0 && (
                                <EmptyState
                                    title="Aucune vente"
                                    description="Créez votre première vente pour commencer à enregistrer ses paiements."
                                />
                            )}

                        {!isLoadingSales &&
                            !isSalesError &&
                            sales.length > 0 && (
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {sales.map((sale) => (
                                        <SaleCard
                                            key={sale.id}
                                            sale={sale}
                                            
                                            onView={(
                                                selectedSale
                                            ) => {
                                                console.log(
                                                    "Vente :",
                                                    selectedSale
                                                );
                                            }}
                                            onEdit={(
                                                selectedSale
                                            ) => {
                                                console.log(
                                                    "Modifier :",
                                                    selectedSale
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                    </TabsContent>

                    <TabsContent
                        value="payments"
                        className="mt-0 space-y-5"
                    >
                        <PaymentFilters
                            search={search}
                            status={status}
                            method={method}
                            onSearchChange={setSearch}
                            onStatusChange={setStatus}
                            onMethodChange={setMethod}
                            onReset={handleReset}
                        />

                        {isLoadingPayments && (
                            <LoadingState message="Chargement des paiements..." />
                        )}

                        {isPaymentsError && (
                            <ErrorState message="Impossible de charger les paiements." />
                        )}

                        {!isLoadingPayments &&
                            !isPaymentsError &&
                            filteredPayments.length ===
                                0 && (
                                <EmptyState
                                    title="Aucun paiement"
                                    description={
                                        payments.length === 0
                                            ? "Aucun paiement n’a encore été enregistré."
                                            : "Aucun paiement ne correspond aux filtres sélectionnés."
                                    }
                                />
                            )}

                        {!isLoadingPayments &&
                            !isPaymentsError &&
                            filteredPayments.length >
                                0 && (
                                <PaymentsTable
                                    payments={
                                        filteredPayments
                                    }
                                    onView={handleView}
                                />
                            )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function LoadingState({
    message,
}: {
    message: string;
}) {
    return (
        <div className="flex min-h-48 items-center justify-center rounded-xl border bg-card">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                {message}
            </div>
        </div>
    );
}

function ErrorState({
    message,
}: {
    message: string;
}) {
    return (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-3 text-sm text-destructive">
                <AlertCircle className="size-5" />
                {message}
            </div>
        </div>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <ReceiptText className="size-6 text-muted-foreground" />
            </div>

            <h2 className="font-semibold">{title}</h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}