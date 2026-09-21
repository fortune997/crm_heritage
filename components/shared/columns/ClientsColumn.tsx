// features/clients/components/client-columns.tsx

"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Eye,
    Mail,
    MoreHorizontal,
    Phone,
    Trash2,
    UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ClientStatus =
    | "actif"
    | "en_negociation"
    | "reservation"
    | "paiement_en_cours"
    | "finalise"
    | "inactif"
    | (string & {});

export type ClientType = "particulier" | "entreprise" | "diaspora" | (string & {});

export type Client = {
    id: string;
    prospectId?: string | null;
    reference?: string | null;
    fullName: string;
    phone?: string | null;
    email?: string | null;
    type?: ClientType | null;
    status: ClientStatus;
    property?: string | null;
    source?: string | null;
    assignedTo?: string | null;
    convertedAt?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    notes?: string | null;
};

function formatDate(value?: string | null) {
    if (!value) return "Non renseigné";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

const clientStatusLabels: Record<string, string> = {
    actif: "Actif",
    en_negociation: "En négociation",
    reservation: "Réservation",
    paiement_en_cours: "Paiement en cours",
    finalise: "Finalisé",
    inactif: "Inactif",
};

function getClientStatusLabel(status: ClientStatus) {
    return clientStatusLabels[status] ?? status.replaceAll("_", " ");
}

function getClientTypeLabel(type?: ClientType | null) {
    if (!type) return "Non défini";

    const labels: Record<string, string> = {
        particulier: "Particulier",
        entreprise: "Entreprise",
        diaspora: "Diaspora",
    };

    return labels[type] ?? type;
}

function ClientStatusBadge({ status }: { status: ClientStatus }) {
    const className: Record<string, string> = {
        actif: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        en_negociation: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        reservation: "border-purple-500/20 bg-purple-500/10 text-purple-600",
        paiement_en_cours: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        finalise: "border-green-500/20 bg-green-500/10 text-green-600",
        inactif: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge
            variant="outline"
            className={className[status] ?? "border-border bg-muted text-muted-foreground"}
        >
            {getClientStatusLabel(status)}
        </Badge>
    );
}

function ClientTypeBadge({ type }: { type?: ClientType | null }) {
    const className: Record<string, string> = {
        particulier: "border-border bg-muted text-muted-foreground",
        entreprise: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        diaspora: "border-green-500/20 bg-green-500/10 text-green-600",
    };

    return (
        <Badge
            variant="outline"
            className={
                (type && className[type]) ??
                "border-border bg-muted text-muted-foreground"
            }
        >
            {getClientTypeLabel(type)}
        </Badge>
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
                        <div className="font-medium text-foreground">{client.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                            {client.phone ?? "Téléphone non renseigné"}
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
        header: "Intérêt",
        cell: ({ row }) => (
            <div>
                <div className="font-medium">
                    {row.original.property ?? "Bien non défini"}
                </div>
                <div className="text-xs text-muted-foreground">
                    Source : {row.original.source ?? "Non renseignée"}
                </div>
            </div>
        ),
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
        accessorKey: "convertedAt",
        header: "Conversion",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.original.convertedAt ?? row.original.createdAt)}
            </span>
        ),
    },
    {
        accessorKey: "reference",
        header: "Référence",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.reference ?? "Non renseignée"}
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
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem>
                                <Link
                                    href={`/marketing/clients/${client.id}`}
                                    className="flex items-center"
                                >
                                    <Eye className="mr-2 size-4" />
                                    Voir détails
                                </Link>
                            </DropdownMenuItem>

                            {client.prospectId && (
                                <DropdownMenuItem>
                                    <Link
                                        href={`/marketing/prospects/${client.prospectId}`}
                                        className="flex items-center"
                                    >
                                        <UserRound className="mr-2 size-4" />
                                        Voir prospect
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {client.phone && (
                                <DropdownMenuItem>
                                    <a href={`tel:${client.phone}`} className="flex items-center">
                                        <Phone className="mr-2 size-4" />
                                        Appeler
                                    </a>
                                </DropdownMenuItem>
                            )}

                            {client.email && (
                                <DropdownMenuItem>
                                    <a
                                        href={`mailto:${client.email}`}
                                        className="flex items-center"
                                    >
                                        <Mail className="mr-2 size-4" />
                                        Envoyer un email
                                    </a>
                                </DropdownMenuItem>
                            )}

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
