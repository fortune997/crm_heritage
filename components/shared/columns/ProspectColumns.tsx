
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TProspects } from "@/core/types/prospects";

import { ActivityCreateDialog } from "@/components/dialog/ActivitiesCreateDialog";
import { formatDate } from "@/core/types/time-formatting";


// ============================================================
// TYPES
// ============================================================

export type ProspectStatus =
    | "Nouveau"
    | "contacte"
    | "interesse"
    | "visite_planifiee"
    | "converti"
    | "Perdu";

export type ProspectPriority =
    | "faible"
    | "moyenne"
    | "haute";


// ============================================================
// HELPERS
// ============================================================

function formatCurrency(value?: number) {
    if (!value) return "Non défini";

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}


// ============================================================
// STATUS BADGE
// ============================================================

export function StatusBadge({
    status,
}: {
    status: ProspectStatus;
}) {
    const labels: Record<ProspectStatus, string> = {
        Nouveau: "Nouveau",
        contacte: "Contacté",
        interesse: "Intéressé",
        visite_planifiee: "Visite planifiée",
        converti: "Converti",
        Perdu: "Perdu",
    };

    const className: Record<ProspectStatus, string> = {
        Nouveau:
            "border-blue-500/20 bg-blue-500/10 text-blue-600",

        contacte:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",

        interesse:
            "border-purple-500/20 bg-purple-500/10 text-purple-600",

        visite_planifiee:
            "border-orange-500/20 bg-orange-500/10 text-orange-600",

        converti:
            "border-green-500/20 bg-green-500/10 text-green-600",

        Perdu:
            "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge
            variant="outline"
            className={className[status]}
        >
            {labels[status]}
        </Badge>
    );
}


// ============================================================
// PRIORITY BADGE
// ============================================================

function PriorityBadge({
    priority,
}: {
    priority: ProspectPriority;
}) {
    const labels: Record<ProspectPriority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
    };

    const className: Record<ProspectPriority, string> = {
        faible:
            "border-border bg-muted text-muted-foreground",

        moyenne:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",

        haute:
            "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge
            variant="outline"
            className={className[priority]}
        >
            {labels[priority]}
        </Badge>
    );
}


// ============================================================
// PROSPECT COLUMNS
// ============================================================

export const getProspectColumns = (
    canViewAll: boolean
): ColumnDef<TProspects>[] => [
        {
            accessorKey: "full_name",

            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="px-0 font-semibold"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Prospect

                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),

            cell: ({ row }) => {
                const prospect = row.original;

                return (
                    <div>
                        <div className="font-medium text-foreground">
                            {prospect.full_name}
                        </div>

                        <div className="text-xs text-muted-foreground">
                            {prospect.phone}
                        </div>
                    </div>
                );
            },
        },


        // ----------------------------------------------------------
        // SITE
        // ----------------------------------------------------------

        {
            accessorKey: "site",

            header: "Site",

            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.sites?.nom_titre ?? "Non défini"}
                </Badge>
            ),
        },


        // ----------------------------------------------------------
        // SOURCE
        // ----------------------------------------------------------

        {
            accessorKey: "canal_prospection",

            header: "Source",

            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.canal_prospection ?? "Non défini"}
                </Badge>
            ),
        },


        // ----------------------------------------------------------
        // STATUT
        // ----------------------------------------------------------

        {
            accessorKey: "status",

            header: "Statut",

            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.status}
                />
            ),
        },


        // ----------------------------------------------------------
        // CRÉÉ PAR
        // Affiché uniquement si l'utilisateur possède
        // prospect.read.all
        // ----------------------------------------------------------


        {
            accessorKey: "created_at",

            header: "Créé le",

            cell: ({ row }) => (
                <span className="text-sm">
                    {formatDate(new Date(row.original.created_at))}
                </span>
            ),
        },

        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <ActivityCreateDialog
                    prospectId={row.original.id}
                />
            ),
        },
        ...(canViewAll
            ? [
                {
                    id: "created_by",

                    header: "Créé par",

                    cell: ({
                        row,
                    }: {
                        row: {
                            original: TProspects;
                        };
                    }) => {
                        const creator =
                            row.original.profiles.full_name;
                        const creator_email =
                            row.original.profiles.mail_professionnel;

                        if (!creator) {
                            return (
                                <span className="text-sm text-muted-foreground">
                                    Inconnu
                                </span>
                            );
                        }



                        return (
                            <div>
                                <div className="text-sm font-medium">
                                    {creator || "Utilisateur inconnu"}
                                </div>

                                {creator_email && (
                                    <div className="text-xs text-muted-foreground">
                                        {creator_email}
                                    </div>
                                )}
                            </div>
                        );
                    },
                } satisfies ColumnDef<TProspects>,
            ]
            : []),
        {
            id: "actions",

            cell: ({ row }) => {
                const prospect = row.original;

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                >
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>


                                    <Link
                                        href={`/marketing/prospects/${prospect.id}`}
                                    >

                                        Voir
                                    </Link>


                                    <DropdownMenuItem >
                                        <Link
                                            href={`/dashboard/marketing/prospects/${prospect.id}/edit`}
                                        >

                                            Modifier
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">

                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
