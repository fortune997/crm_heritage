"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    CheckCircle2,
    Eye,
    Mail,
    MoreHorizontal,
    Pencil,
    Phone,
    Shield,
    Trash2,
    User,
    XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { HeritageUser } from "@/components/forms/admin/CreateUserDialog";
import { UserScopes } from "@/core/services/admin/users-service";

function formatDate(value?: string) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getRoleLabel(role: string) {
    const labels: Record<string, string> = {
        super_admin: "Super Admin",
        admin: "Administrateur",
        directeur: "Directeur",
        brand_manager: "Brand Manager",
        commercial: "Commercial",
        marketing: "Marketing",
        juridique: "Juridique",
        finance: "Finance",
        rh: "RH",
        support: "Support",
    };
    return labels[role] ?? role;
}

function getDepartmentLabel(department: string) {
    const labels: Record<string, string> = {
        direction: "Direction",
        commercial: "Commercial",
        marketing: "Marketing",
        juridique: "Juridique",
        finance: "Finance",
        rh: "Ressources Humaines",
        technique: "Technique",
        support: "Support",
    };
    return labels[department] ?? department;
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        active: "Actif",
        inactive: "Inactif",
        suspended: "Suspendu",
        pending: "En attente",
    };
    return labels[status] ?? status;
}

function StatusBadge({ status }: { status: string }) {
    const className: Record<string, string> = {
        active: "border-green-500/20 bg-green-500/10 text-green-600",
        inactive: "border-muted bg-muted text-muted-foreground",
        suspended: "border-red-500/20 bg-red-500/10 text-red-600",
        pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
    };
    return (
        <Badge variant="outline" className={className[status] ?? "border-muted"}>
            {getStatusLabel(status)}
        </Badge>
    );
}

export const userAccountColumns: ColumnDef<UserScopes>[] = [
    {
        accessorKey: "full_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-0 font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Utilisateur
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                        <AvatarImage src={user?.profiles?.avatar_url || ""} />
                        <AvatarFallback>
                            {user?.profiles?.full_name}

                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="font-medium">
                            {user?.profiles?.full_name || "Utilisateur"}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            {user?.profiles?.professional_email || "Email non disponible"}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                {row.original.profiles?.phone ?? "-"}
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => (
            <Badge variant="secondary">
                <Shield className="mr-1 size-3" />
                {getRoleLabel(row.original?.roles?.name ?? "-")}
            </Badge>
        ),
    },
    {
        accessorKey: "department",
        header: "Département",
        cell: ({ row }) => (
            <Badge variant="outline">
                {getDepartmentLabel(row.original?.profiles?.department)}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original?.profiles?.status} />,
    },
    {
        accessorKey: "lastActivity",
        header: "Dernière activité",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original?.profiles?.last_login_at
                    ? formatDate(row.original.profiles.last_login_at)
                    : "Jamais connecté"
                }
            </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Créé le",
        cell: ({ row }) => <span className="text-sm">{formatDate(row.original?.created_at)}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Link href={`/users/${user.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir le profil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={`/users/${user.id}/edit`}>
                                    <Pencil className="mr-2 size-4" />
                                    Modifier
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.profiles.status === "active" ? (
                                <DropdownMenuItem>
                                    <XCircle className="mr-2 size-4" />
                                    Désactiver
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem>
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Activer
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