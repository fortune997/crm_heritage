// features/activities/components/activity-columns.tsx

"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    CalendarClock,
    CheckCircle2,
    Eye,
    MoreHorizontal,
    Pencil,
    Phone,
    Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


import { ProspectActivity } from "@/core/types/activities";
import { StatusBadge } from "./ProspectColumns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

function formatDate(value?: string | null) {
    if (!value) return "Non défini";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}
function getActivityTypeLabel(type: string) {
    const labels: Record<string, string> = {
        Appel: "Appel",
        WhatsApp: "WhatsApp",
        Visite: "Visite",
        Email: "Email",
        relance: "Relance",
        rendez_vous: "Rendez-vous",
        note: "Note",
        paiement: "Paiement",
        reservation: "Réservation",
        autre: "Autre",
    };

    return labels[type];
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        a_faire: "À faire",
        en_cours: "En cours",
        terminee: "Terminée",
        en_retard: "En retard",
        annulee: "Annulée",
    };

    return labels[status];
}



function PriorityBadge({ priority }: { priority: string }) {
    const labels: Record<string, string> = {
        faible: "Faible",
        Normale: "Normale",
        haute: "Haute",
        urgente: "Urgente",
    };

    const className: Record<string, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        Normale: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        urgente: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {labels[priority]}
        </Badge>
    );
}

export const activityColumns = (
    canViewAll: boolean
): ColumnDef<ProspectActivity>[] => [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="px-0 font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Activité
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const activity = row.original;

                return (
                    <div className="space-y-1">
                        <div className="font-medium text-foreground">{activity.titre}</div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                            {activity.description ?? "Aucune description"}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "targetName",
            header: "Client / Prospect",
            cell: ({ row }) => {
                const activity = row.original;

                return (
                    <div>
                        <div className="font-medium">{activity.prospects?.full_name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="size-3" />
                            {activity.prospects?.phone ?? "Téléphone non renseigné"}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "targetType",
            header: "Type contact",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.prospects?.interest_type === "client" ? "Client" : "Prospect"}
                </Badge>
            ),
        },
        {
            accessorKey: "canal",
            header: "Canal",
            cell: ({ row }) => (
                <Badge variant="outline">{getActivityTypeLabel(row.original.canal_relance)}</Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => <StatusBadge status={row.original.prospects?.status} />,
        },
        {
            accessorKey: "dueDate",
            header: "Échéance",
            cell: ({ row }) => {
                const activity = row.original;

                return (
                    <div className="flex items-center gap-2 text-sm">
                        <CalendarClock className="size-4 text-muted-foreground" />
                        <span>
                            {formatDate(activity.prochain_relance)}

                        </span>
                    </div>
                );
            },
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
                            original: ProspectActivity;
                        };
                    }) => {
                        const creator =
                            row.original.profiles?.full_name;
                        const creator_email =
                            row.original.profiles?.email;

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
                } satisfies ColumnDef<ProspectActivity>,
            ]
            : []),

        /*  {
             accessorKey: "assignedTo",
             header: "Commercial",
             cell: ({ row }) => (
                 <span className="text-sm text-muted-foreground">
                     {row.original.assigned_to ?? "Non assigné"}
                 </span>
             ),
         }, */
        {
            id: "actions",
            cell: ({ row }) => {
                const activity = row.original;

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                    <DropdownMenuItem>
                                        <CheckCircle2 className="mr-2 size-4" />
                                        Marquer comme terminée
                                    </DropdownMenuItem>

                                    <DropdownMenuItem >
                                        <Link href={`/marketing/prospects/${activity?.prospect_id}`}>
                                            <Eye className="mr-2 size-4" />
                                            Voir détails
                                        </Link>
                                    </DropdownMenuItem>

                                    {/* <DropdownMenuItem >
                                        <Link
                                            href={`/activites/${activity.id}/edit`}
                                        >
                                            <Pencil className="mr-2 size-4" />
                                            Modifier
                                        </Link>
                                    </DropdownMenuItem> */}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                        <Trash2 className="mr-2 size-4" />
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