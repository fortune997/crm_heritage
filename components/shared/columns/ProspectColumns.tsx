
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Edit,
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
import { ProspectForm } from "@/components/forms/ProspectForm";
import ProspectActions from "@/components/dialog/ProspectActions";
import { QualificationStatus } from "@/components/status/QualificationStatus";


// ============================================================
// TYPES
// ============================================================

export type ProspectStatus =
    | "Nouveau"
    | "À contacter"
    | "Contacté"
    | "Visite programmée"
    | "Visite effectuée"
    | "Intéressé"
    | "Client"
    | "Perdu";

export type ProspectPriority =
    | "faible"
    | "moyenne"
    | "haute";

const statusConfig: Record<
    ProspectStatus,
    {
        label: string;
        className: string;
    }
> = {
    Nouveau: {
        label: "Nouveau",
        className:
            "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },

   "À contacter": {
    label: "À contacter",
    className:
        "border-red-500 bg-red-100 text-red-700 shadow-sm shadow-red-500/30 motion-safe:animate-pulse dark:border-red-500 dark:bg-red-950/50 dark:text-red-400",
},

    Contacté: {
        label: "Contacté",
        className:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    },

    "Visite programmée": {
        label: "Visite programmée",
        className:
            "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    },

    "Visite effectuée": {
        label: "Visite effectuée",
        className:
            "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
    },

    Intéressé: {
        label: "Intéressé",
        className:
            "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400",
    },

    Client: {
        label: "Client",
        className:
            "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
    },

    Perdu: {
        label: "Perdu",
        className:
            "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
    },
};

export function StatusBadge({
    status,
}: {
    status: ProspectStatus;
}) {
    const config = statusConfig[status];

    return (
        <Badge
            variant="outline"
            className={config?.className}
        >
            {config?.label}
        </Badge>
    );
}

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

        {
  accessorKey: "qualification",
  header: "Qualification",
  cell: ({ row }) => (
    <QualificationStatus
      qualificationStatus={row.original.qualification}
    />
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
  cell: ({ row }) => {
    const value = row.original.created_at;
    const date = value ? new Date(value) : null;

    return (
      <span className="whitespace-nowrap text-sm">
        {date && !Number.isNaN(date.getTime())
          ? date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Non défini"}
      </span>
    );
  },
},

        {
            accessorKey: "action",
            header: "Activités",
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
        header: () => (
            <div className="text-right">
                Actions
            </div>
        ),
        cell: ({ row }) => {
            const prospect = row.original;

            return (
                <ProspectActions
                    prospect={prospect}
                />
            );
        },
       
    },
    ];
    
