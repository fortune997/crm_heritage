// features/prospects/components/prospect-columns.tsx

"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

// features/prospects/types/prospect.type.ts

export type ProspectStatus =
    | "nouveau"
    | "contacte"
    | "interesse"
    | "visite_planifiee"
    | "converti"
    | "perdu";

export type ProspectPriority = "faible" | "moyenne" | "haute";

export type Prospect = {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    status: ProspectStatus;
    priority: ProspectPriority;
    source: string;
    interestedProperty: string;
    budget?: number;
    assignedTo?: string;
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

function StatusBadge({ status }: { status: ProspectStatus }) {
    const labels: Record<ProspectStatus, string> = {
        nouveau: "Nouveau",
        contacte: "Contacté",
        interesse: "Intéressé",
        visite_planifiee: "Visite planifiée",
        converti: "Converti",
        perdu: "Perdu",
    };

    const className: Record<ProspectStatus, string> = {
        nouveau: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        contacte: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        interesse: "border-purple-500/20 bg-purple-500/10 text-purple-600",
        visite_planifiee: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        converti: "border-green-500/20 bg-green-500/10 text-green-600",
        perdu: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: ProspectPriority }) {
    const labels: Record<ProspectPriority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
    };

    const className: Record<ProspectPriority, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        moyenne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {labels[priority]}
        </Badge>
    );
}

export const prospectColumns: ColumnDef<Prospect>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-0 font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                        {prospect.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {prospect.phone}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "interestedProperty",
        header: "Bien recherché",
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.interestedProperty}</div>
                <div className="text-xs text-muted-foreground">
                    Budget : {formatCurrency(row.original.budget)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.source}</Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "priority",
        header: "Priorité",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
        accessorKey: "assignedTo",
        header: "Assigné à",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.assignedTo ?? "Non assigné"}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const prospect = row.original;

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem >
                                <Link href={`/dashboard/marketing/prospects/${prospect.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem >
                                <Link href={`/dashboard/marketing/prospects/${prospect.id}/edit`}>
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