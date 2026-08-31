// components/sales/SaleCard.tsx

"use client";

import {
    Banknote,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Eye,
    MoreHorizontal,
    Pencil,
    ReceiptText,
    UserRound,
    WalletCards,
    XCircle,
} from "lucide-react";
    import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Sale } from "@/core/types/ventes/type";



type SaleCardProps = {
    sale: Sale;

    onView?: (sale: Sale) => void;
    onEdit?: (sale: Sale) => void;
};

type StatusPresentation = {
    label: string;
    icon: typeof Clock3;
    className: string;
};

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
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getPaymentProgress(sale: Sale): number {
    if (sale.sale_amount <= 0) {
        return 0;
    }

    const percentage =
        (sale.total_paid / sale.sale_amount) * 100;

    return Math.min(Math.max(percentage, 0), 100);
}

function getStatusPresentation(
    status: Sale["status"]
): StatusPresentation {
    switch (String(status)) {
        case "paid":
        case "completed":
        case "sold":
            return {
                label: "Soldée",
                icon: CheckCircle2,
                className:
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            };

        case "partially_paid":
        case "partial":
            return {
                label: "Partiellement payée",
                icon: Clock3,
                className:
                    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
            };

        case "cancelled":
        case "canceled":
            return {
                label: "Annulée",
                icon: XCircle,
                className:
                    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
            };

        case "pending":
        default:
            return {
                label: "En attente",
                icon: Clock3,
                className:
                    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
            };
    }
}

function getPaymentScheduleLabel(
    schedule: Sale["payment_schedule"]
): string {
    switch (String(schedule)) {
        case "full":
        case "total":
            return "Paiement total";

        case "installments":
        case "installment":
        case "echelonne":
            return "Paiement échelonné";

        default:
            return String(schedule);
    }
}

export function SaleCard({
    sale,
    onView,
    onEdit,
}: SaleCardProps) {


const router = useRouter();
    const progress = getPaymentProgress(sale);
    const status = getStatusPresentation(sale.status);
    const StatusIcon = status.icon;

    const isPaid = sale.remaining_amount <= 0;
    const isCancelled = [
        "cancelled",
        "canceled",
    ].includes(String(sale.status));

    const canReceivePayment =
        !isPaid && !isCancelled;

    return (
        <Card
            className={cn(
                "group relative overflow-hidden border-border/70",
                "bg-card text-card-foreground shadow-sm",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg",
                "dark:bg-card/70 dark:backdrop-blur-xl"
            )}
        >
            <div
                className={cn(
                    "absolute inset-x-0 top-0 h-1",
                    isPaid
                        ? "bg-emerald-500"
                        : isCancelled
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-primary via-violet-500 to-blue-500"
                )}
            />

            <CardHeader className="space-y-4 pb-4 pt-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ReceiptText className="size-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Référence vente
                                </p>

                                <h3 className="truncate text-base font-bold">
                                    {sale.reference}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0"
                            >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">
                                    Actions
                                </span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-48"
                        >
                            {onView && (
                                <DropdownMenuItem
                                    onClick={() => onView(sale)}
                                >
                                    <Eye className="mr-2 size-4" />
                                    Voir les détails
                                </DropdownMenuItem>
                            )}

                            {onEdit && (
                                <DropdownMenuItem
                                    onClick={() => onEdit(sale)}
                                    disabled={
                                        sale.total_paid > 0 ||
                                        isCancelled
                                    }
                                >
                                    <Pencil className="mr-2 size-4" />
                                    Modifier la vente
                                </DropdownMenuItem>
                            )}

                            {(onView || onEdit) && (
                                <DropdownMenuSeparator />
                            )}

                            <DropdownMenuItem disabled>
                                <CalendarDays className="mr-2 size-4" />
                                Créée le{" "}
                                {formatDate(sale.created_at)}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 rounded-full px-2.5 py-1",
                            status.className
                        )}
                    >
                        <StatusIcon className="size-3.5" />
                        {status.label}
                    </Badge>

                    <Badge
                        variant="secondary"
                        className="gap-1.5 rounded-full px-2.5 py-1"
                    >
                        <WalletCards className="size-3.5" />
                        {getPaymentScheduleLabel(
                            sale.payment_schedule
                        )}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid gap-3 rounded-xl border bg-muted/30 p-4">
                    <InformationRow
                        icon={UserRound}
                        label="Prospect"
                        value={sale?.prospects?.full_name}
                    />

                    <InformationRow
                        icon={CreditCard}
                        label="Téléphone"
                        value={sale?.prospects?.phone}
                    />

                    <InformationRow
                        icon={Building2}
                        label="Site"
                        value={sale?.sites?.nom_titre}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Progression du paiement
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {Math.round(progress)} %
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                                Montant de la vente
                            </p>

                            <p className="mt-1 text-sm font-bold">
                                {formatCurrency(
                                    sale.sale_amount
                                )}
                            </p>
                        </div>
                    </div>

                    <Progress
                        value={progress}
                        className={cn(
                            "h-2.5",
                            isPaid &&
                                "[&>div]:bg-emerald-500",
                            isCancelled &&
                                "[&>div]:bg-red-500"
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <AmountBox
                        label="Total payé"
                        value={sale.total_paid}
                        variant="success"
                    />

                    <AmountBox
                        label="Reste à payer"
                        value={sale.remaining_amount}
                        variant={
                            isPaid ? "success" : "warning"
                        }
                    />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {formatDate(sale.created_at)}
                    </span>

                    {isPaid && (
                        <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            Paiement terminé
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="gap-2 border-t bg-muted/20 px-6 py-4">
                {(
                    <Button
    type="button"
    variant="outline"
    onClick={() =>
        router.push(
            `/comptabilite/ventes/${sale.id}`
        )
    }
>
    <ReceiptText className="mr-2 size-4" />
    Voir les paiements
</Button>
                )}

               {/*  {canReceivePayment ? (
                    <RegisterPaymentDialog
                        sale={sale}
                        prospectLabel={prospectName}
                        prospectPhone={prospectPhone}
                        siteLabel={siteName}
                        trigger={
                            <Button
                                type="button"
                                className="flex-1"
                            >
                                <Banknote className="mr-2 size-4" />
                                Ajouter un paiement
                            </Button>
                        }
                    />
                ) : (
                    <Button
                        type="button"
                        className="flex-1"
                        variant={
                            isPaid
                                ? "secondary"
                                : "destructive"
                        }
                        disabled
                    >
                        {isPaid ? (
                            <>
                                <CheckCircle2 className="mr-2 size-4" />
                                Vente soldée
                            </>
                        ) : (
                            <>
                                <XCircle className="mr-2 size-4" />
                                Vente annulée
                            </>
                        )}
                    </Button>
                )} */}
            </CardFooter>
        </Card>
    );
}

type InformationRowProps = {
    icon: typeof UserRound;
    label: string;
    value: string | undefined | null;
};

function InformationRow({
    icon: Icon,
    label,
    value,
}: InformationRowProps) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
                <Icon className="size-4" />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                    {label}
                </p>

                <p className="truncate text-sm font-medium">
                    {value || "Non renseigné"}
                </p>
            </div>
        </div>
    );
}

type AmountBoxProps = {
    label: string;
    value: number;
    variant: "success" | "warning";
};

function AmountBox({
    label,
    value,
    variant,
}: AmountBoxProps) {
    return (
        <div
            className={cn(
                "rounded-xl border p-3",
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
                    "mt-1 truncate text-sm font-bold",
                    variant === "success" &&
                        "text-emerald-700 dark:text-emerald-400",
                    variant === "warning" &&
                        "text-orange-700 dark:text-orange-400"
                )}
            >
                {formatCurrency(value)}
            </p>
        </div>
    );
}