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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
    Activity,
    ActivityPriority,
    ActivityStatus,
    ActivityType,
} from "@/types";

function formatDate(value?: string) {
    if (!value) return "Non défini";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getActivityTypeLabel(type: ActivityType) {
    const labels: Record<ActivityType, string> = {
        appel: "Appel",
        whatsapp: "WhatsApp",
        email: "Email",
        visite: "Visite",
        relance: "Relance",
        rendez_vous: "Rendez-vous",
        note: "Note",
        paiement: "Paiement",
        reservation: "Réservation",
        autre: "Autre",
    };

    return labels[type];
}

function getStatusLabel(status: ActivityStatus) {
    const labels: Record<ActivityStatus, string> = {
        a_faire: "À faire",
        en_cours: "En cours",
        terminee: "Terminée",
        en_retard: "En retard",
        annulee: "Annulée",
    };

    return labels[status];
}

function StatusBadge({ status }: { status: ActivityStatus }) {
    const className: Record<ActivityStatus, string> = {
        a_faire: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        en_cours: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        terminee: "border-green-500/20 bg-green-500/10 text-green-600",
        en_retard: "border-red-500/20 bg-red-500/10 text-red-600",
        annulee: "border-muted bg-muted text-muted-foreground",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {getStatusLabel(status)}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: ActivityPriority }) {
    const labels: Record<ActivityPriority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
        urgente: "Urgente",
    };

    const className: Record<ActivityPriority, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        moyenne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        urgente: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {labels[priority]}
        </Badge>
    );
}

export const activityColumns: ColumnDef<Activity>[] = [
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
                    <div className="font-medium text-foreground">{activity.title}</div>
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
                    <div className="font-medium">{activity.targetName}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        {activity.targetPhone ?? "Téléphone non renseigné"}
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
                {row.original.targetType === "client" ? "Client" : "Prospect"}
            </Badge>
        ),
    },
    {
        accessorKey: "type",
        header: "Canal",
        cell: ({ row }) => (
            <Badge variant="outline">{getActivityTypeLabel(row.original.type)}</Badge>
        ),
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
                        {formatDate(activity.dueDate)}
                        {activity.dueTime ? ` à ${activity.dueTime}` : ""}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priorité",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "assignedTo",
        header: "Commercial",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.assignedTo ?? "Non assigné"}
            </span>
        ),
    },
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 size-4" />
                                Marquer comme terminée
                            </DropdownMenuItem>

                            <DropdownMenuItem >
                                <Link href={`/activites/${activity.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir détails
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem >
                                <Link
                                    href={`/activites/${activity.id}/edit`}
                                >
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