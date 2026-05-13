// features/clients/components/client-columns.tsx

"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// features/clients/types/client.type.ts

export type ClientStatus =
    | "actif"
    | "en_negociation"
    | "reservation"
    | "paiement_en_cours"
    | "finalise"
    | "inactif";

export type ClientType = "particulier" | "entreprise" | "diaspora";

export type Client = {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    type: ClientType;
    status: ClientStatus;
    property: string;
    totalAmount?: number;
    amountPaid?: number;
    assignedTo?: string;
    lastActivityDate?: string;
    createdAt: string;
};

function formatCurrency(value?: number) {
    if (!value) return "Non défini";

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value?: string) {
    if (!value) return "Non renseigné";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getClientStatusLabel(status: ClientStatus) {
    const labels: Record<ClientStatus, string> = {
        actif: "Actif",
        en_negociation: "En négociation",
        reservation: "Réservation",
        paiement_en_cours: "Paiement en cours",
        finalise: "Finalisé",
        inactif: "Inactif",
    };

    return labels[status];
}

function getClientTypeLabel(type: ClientType) {
    const labels: Record<ClientType, string> = {
        particulier: "Particulier",
        entreprise: "Entreprise",
        diaspora: "Diaspora",
    };

    return labels[type];
}

function ClientStatusBadge({ status }: { status: ClientStatus }) {
    const className: Record<ClientStatus, string> = {
        actif: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        en_negociation: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        reservation: "border-purple-500/20 bg-purple-500/10 text-purple-600",
        paiement_en_cours: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        finalise: "border-green-500/20 bg-green-500/10 text-green-600",
        inactif: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {getClientStatusLabel(status)}
        </Badge>
    );
}

function ClientTypeBadge({ type }: { type: ClientType }) {
    const className: Record<ClientType, string> = {
        particulier: "border-border bg-muted text-muted-foreground",
        entreprise: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        diaspora: "border-green-500/20 bg-green-500/10 text-green-600",
    };

    return (
        <Badge variant="outline" className={className[type]}>
            {getClientTypeLabel(type)}
        </Badge>
    );
}

function getPaymentProgress(client: Client) {
    if (!client.totalAmount || !client.amountPaid) return 0;

    return Math.min(
        Math.round((client.amountPaid / client.totalAmount) * 100),
        100
    );
}

export const clientColumns: ColumnDef<Client>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-0 font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Client
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const client = row.original;

            return (
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserRound className="size-4" />
                    </div>

                    <div>
                        <div className="font-medium text-foreground">
                            {client.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {client.phone}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <ClientTypeBadge type={row.original.type} />,
    },
    {
        accessorKey: "property",
        header: "Bien concerné",
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.property}</div>
                <div className="text-xs text-muted-foreground">
                    Montant total : {formatCurrency(row.original.totalAmount)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "amountPaid",
        header: "Paiement",
        cell: ({ row }) => {
            const client = row.original;
            const progress = getPaymentProgress(client);

            return (
                <div className="min-w-[160px] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            {formatCurrency(client.amountPaid)}
                        </span>
                        <span className="font-medium">{progress}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-muted">
                        <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <ClientStatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "assignedTo",
        header: "Responsable",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.assignedTo ?? "Non assigné"}
            </span>
        ),
    },
    {
        accessorKey: "lastActivityDate",
        header: "Dernière activité",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.original.lastActivityDate)}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem >
                                <Link href={`/dashboard/marketing/clients/${client.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir détails
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem >
                                <Link href={`/dashboard/marketing/clients/${client.id}/edit`}>
                                    <Pencil className="mr-2 size-4" />
                                    Modifier
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 size-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];