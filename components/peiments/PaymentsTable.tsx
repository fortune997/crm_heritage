"use client";

import {
    MoreHorizontal,
    Eye,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Payment } from "@/core/types/ventes/type";
import { StatusBadge } from "./StatusBadge";



interface PaymentsTableProps {
    payments: Payment[];
    onView: (payment: Payment) => void;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
    }).format(new Date(value));
}

const paymentMethodLabels: Record<
    Payment["payment_method"],
    string
> = {
    especes: "Espèces",
    virement: "Virement",
    mobile_money: "Mobile Money",
    cheque: "Chèque",
    carte: "Carte",
    autre: "Autre",
};

export function PaymentsTable({
    payments,
    onView,
}: PaymentsTableProps) {
    if (payments.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border">
                <div className="text-center">
                    <p className="font-medium">
                        Aucun paiement trouvé
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Les paiements enregistrés apparaîtront ici.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Terrain / Site</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                                {payment.reference}
                            </TableCell>

                            <TableCell>
                                <div>
                                    <p className="font-medium">
                                        {payment.sale.prospect.full_name}
                                    </p>

                                    {payment.sale.prospect.phone && (
                                        <p className="text-xs text-muted-foreground">
                                            {payment.sale.prospect.phone}
                                        </p>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                {payment.sale.site?.nom_titre ?? "—"}
                            </TableCell>

                            <TableCell>
                                {formatDate(payment.payment_date)}
                            </TableCell>

                            <TableCell>
                                {
                                    paymentMethodLabels[
                                    payment.payment_method
                                    ]
                                }
                            </TableCell>

                            <TableCell className="font-semibold">
                                {formatCurrency(payment.amount)}
                            </TableCell>

                            <TableCell>
                                <StatusBadge
                                    status={payment.status}
                                />
                            </TableCell>

                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onView(payment)
                                            }
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir le paiement
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}