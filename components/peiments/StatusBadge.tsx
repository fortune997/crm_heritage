'use client'

import { Badge } from "@/components/ui/badge";
import { PaymentStatus, SaleStatus } from "@/core/types/ventes/type";


interface StatusBadgeProps {
    status: PaymentStatus | SaleStatus;
}

const labels: Record<
    PaymentStatus | SaleStatus,
    string
> = {
    confirme: "Confirmé",

    

    active: "Active",
    soldee: "Soldée",
    en_attente: "En attente",
    annulee: "Annulée",
};

export function StatusBadge({
    status,
}: StatusBadgeProps) {
    const label = labels[status];

    if (status === "confirme" || status === "soldee") {
        return (
            <Badge variant="default">
                {label}
            </Badge>
        );
    }

    if (
        status === "en_attente" ||
        status === "active"
    ) {
        return (
            <Badge variant="secondary">
                {label}
            </Badge>
        );
    }

    return (
        <Badge variant="destructive">
            {label}
        </Badge>
    );
}