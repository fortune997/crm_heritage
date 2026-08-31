"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    Banknote,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Loader2,
    ReceiptText,
    UserRound,
    WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";


import type {
    Payment,
    PaymentMethod,
    PaymentStatus,
    Sale,
} from "@/core/types/ventes/type";
import { cn } from "@/lib/utils";
import { useSaleById, useSalePayments } from "@/core/hooks/payments/usePayments";
import { RegisterPaymentDialog } from "@/components/peiments/RegisterPaymentDialog";

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

function getProgress(sale: Sale): number {
    if (sale.sale_amount <= 0) {
        return 0;
    }

    const percentage =
        (sale.total_paid / sale.sale_amount) * 100;

    return Math.min(
        Math.max(percentage, 0),
        100
    );
}

function getPaymentMethodLabel(
    method: PaymentMethod
): string {
    switch (String(method)) {
        case "espece":
        case "cash":
            return "Espèces";

        case "mobile_money":
            return "Mobile Money";

        case "virement":
        case "bank_transfer":
            return "Virement bancaire";

        case "cheque":
        case "check":
            return "Chèque";

        default:
            return String(method);
    }
}

function getPaymentStatus(
    status: PaymentStatus
): {
    label: string;
    className: string;
} {
    switch (String(status)) {
        case "confirme":
        case "completed":
            return {
                label: "Confirmé",
                className:
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            };

        case "en_attente":
        case "pending":
            return {
                label: "En attente",
                className:
                    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
            };

        case "annule":
        case "cancelled":
            return {
                label: "Annulé",
                className:
                    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
            };

        default:
            return {
                label: String(status),
                className:
                    "border-border bg-muted text-muted-foreground",
            };
    }
}

const SalePaymentsPage =()=> {
    const router = useRouter();

    const params = useParams<{
        id: string;
    }>();

    const id = params.id;

    const {
        data: sale ,
        isLoading: isLoadingSale,
        isError: isSaleError,
        error: saleError,
    } = useSaleById(id);

    const {
        data: payments = [],
        isLoading: isLoadingPayments,
        isError: isPaymentsError,
    } = useSalePayments(id);

    if (isLoadingSale) {
        return (
            <PageMessage
                icon={Loader2}
                message="Chargement de la vente..."
                iconClassName="animate-spin"
            />
        );
    }

    if (isSaleError || !sale) {
        return (
            <PageMessage
                icon={AlertCircle}
                message={
                    saleError instanceof Error
                        ? saleError.message
                        : "Impossible de charger la vente"
                }
                iconClassName="text-destructive"
            />
        );
    }

    const progress = getProgress(sale);
    const isPaid = sale.remaining_amount <= 0;

    return (
        <div className="min-h-screen bg-background p-4 text-foreground md:p-6">
            <div className="mx-auto max-w-[1500px] space-y-6">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => router.back()}
                            className="shrink-0"
                        >
                            <ArrowLeft className="size-4" />
                            <span className="sr-only">
                                Retour
                            </span>
                        </Button>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    Paiements de la vente
                                </h1>

                                <Badge variant="secondary">
                                    {sale.reference}
                                </Badge>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Consultez et enregistrez les
                                paiements associés à cette vente.
                            </p>
                        </div>
                    </div>

                    {!isPaid ? (
                        <RegisterPaymentDialog
                            sale={sale}
                            trigger={
                                <Button size="lg">
                                    <Banknote className="mr-2 size-4" />
                                    Enregistrer un paiement
                                </Button>
                            }
                        />
                    ) : (
                        <Button
                            size="lg"
                            variant="secondary"
                            disabled
                        >
                            <CheckCircle2 className="mr-2 size-4 text-emerald-500" />
                            Vente entièrement payée
                        </Button>
                    )}
                </header>

                <Card className="overflow-hidden">
                    <div
                        className={cn(
                            "h-1",
                            isPaid
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-primary via-violet-500 to-blue-500"
                        )}
                    />

                    <CardContent className="p-5 md:p-6">
                        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <InformationItem
                                    icon={UserRound}
                                    label="Prospect"
                                    value={
                                        sale.prospects.full_name
                                    }
                                />

                                <InformationItem
                                    icon={CreditCard}
                                    label="Téléphone"
                                    value={sale.prospects.phone}
                                />

                                <InformationItem
                                    icon={Building2}
                                    label="Site"
                                    value={
                                        sale?.sites?.nom_titre ?? "Aucun site" }
                                />

                                <InformationItem
                                    icon={WalletCards}
                                    label="Modalité"
                                    value={
                                        sale.payment_schedule ===
                                        "comptant"
                                            ? "Paiement comptant"
                                            : "Paiement échelonné"
                                    }
                                />

                                <InformationItem
                                    icon={CalendarDays}
                                    label="Date de création"
                                    value={formatDate(
                                        sale.created_at
                                    )}
                                />

                                <InformationItem
                                    icon={ReceiptText}
                                    label="Référence"
                                    value={sale.reference}
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="rounded-2xl border bg-muted/30 px-6 py-4 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        Progression
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {Math.round(progress)} %
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Progress
                                value={progress}
                                className={cn(
                                    "h-2.5",
                                    isPaid &&
                                        "[&>div]:bg-emerald-500"
                                )}
                            />

                            <div className="grid gap-3 sm:grid-cols-3">
                                <AmountCard
                                    label="Montant de la vente"
                                    amount={
                                        sale.sale_amount
                                    }
                                />

                                <AmountCard
                                    label="Total payé"
                                    amount={sale.total_paid}
                                    variant="success"
                                />

                                <AmountCard
                                    label="Reste à payer"
                                    amount={
                                        sale.remaining_amount
                                    }
                                    variant={
                                        isPaid
                                            ? "success"
                                            : "warning"
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="size-5 text-primary" />
                                Historique des paiements
                            </CardTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {payments.length} paiement
                                {payments.length > 1
                                    ? "s"
                                    : ""}{" "}
                                enregistré
                                {payments.length > 1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {isLoadingPayments && (
                            <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                                <Loader2 className="size-5 animate-spin" />
                                Chargement des paiements...
                            </div>
                        )}

                        {isPaymentsError && (
                            <div className="flex min-h-48 items-center justify-center gap-3 text-destructive">
                                <AlertCircle className="size-5" />
                                Impossible de charger les
                                paiements.
                            </div>
                        )}

                        {!isLoadingPayments &&
                            !isPaymentsError &&
                            payments.length === 0 && (
                                <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                                        <Banknote className="size-6 text-primary" />
                                    </div>

                                    <h2 className="font-semibold">
                                        Aucun paiement
                                    </h2>

                                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                        Cette vente ne possède
                                        encore aucun paiement
                                        enregistré.
                                    </p>

                                    {!isPaid && (
                                        <div className="mt-5">
                                            <RegisterPaymentDialog
                                                sale={sale}
                                                
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                        {!isLoadingPayments &&
                            !isPaymentsError &&
                            payments.length > 0 && (
                                <PaymentsHistoryTable
                                    payments={payments}
                                />
                            )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SalePaymentsPage

function PaymentsHistoryTable({
    payments,
}: {
    payments: readonly Payment[];
}) {
    return (
        <div className="overflow-hidden rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Référence</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>
                            Transaction
                        </TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">
                            Montant
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {payments.map((payment) => {
                        const status =
                            getPaymentStatus(
                                payment.status
                            );

                        return (
                            <TableRow key={payment.id}>
                                <TableCell className="font-medium">
                                    {payment.reference}
                                </TableCell>

                                <TableCell>
                                    {formatDate(
                                        payment.payment_date
                                    )}
                                </TableCell>

                                <TableCell>
                                    {getPaymentMethodLabel(
                                        payment.payment_method
                                    )}
                                </TableCell>

                                <TableCell>
                                    {payment.transaction_reference ??
                                        "—"}
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            status.className
                                        }
                                    >
                                        {status.label}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right font-semibold">
                                    {formatCurrency(
                                        payment.amount
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function InformationItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof UserRound;
    label: string;
    value: string | null;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                    {label}
                </p>

                <p className="truncate text-sm font-medium">
                    {value}
                </p>
            </div>
        </div>
    );
}

function AmountCard({
    label,
    amount,
    variant = "default",
}: {
    label: string;
    amount: number;
    variant?: "default" | "success" | "warning";
}) {
    return (
        <div
            className={cn(
                "rounded-xl border p-4",
                variant === "success" &&
                    "border-emerald-500/20 bg-emerald-500/5",
                variant === "warning" &&
                    "border-orange-500/20 bg-orange-500/5"
            )}
        >
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p
                className={cn(
                    "mt-1 text-lg font-bold",
                    variant === "success" &&
                        "text-emerald-700 dark:text-emerald-400",
                    variant === "warning" &&
                        "text-orange-700 dark:text-orange-400"
                )}
            >
                {formatCurrency(amount)}
            </p>
        </div>
    );
}

function PageMessage({
    icon: Icon,
    message,
    iconClassName,
}: {
    icon: typeof Loader2;
    message: string;
    iconClassName?: string;
}) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex items-center gap-3 rounded-xl border bg-card px-6 py-5 text-muted-foreground shadow-sm">
                <Icon
                    className={cn(
                        "size-5",
                        iconClassName
                    )}
                />
                {message}
            </div>
        </div>
    );
}