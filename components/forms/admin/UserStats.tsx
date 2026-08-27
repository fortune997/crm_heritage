"use client";

import {
    Users,
    UserCheck,
    UserX,
    ShieldCheck,
} from "lucide-react";
import { HeritageUser } from "./CreateUserDialog";
import { UserScopes } from "@/core/services/admin/users-service";



type Props = {
    users: UserScopes[];
};

export function UserStats({ users }: Props) {
    console.log('USERS', users)
    const total = users.length;

    const active = users.filter(
        (user) => user.profiles.status === "active"
    ).length;

    const inactive = users.filter(
        (user) =>
            user.profiles.status === "inactive"
    ).length;

    /*  const admins = users.filter(
         (user) =>
             user.roles.role === "dsi" ||
             user.role === "pdg"
     ).length; */

    const stats = [
        {
            label: "Utilisateurs",
            value: total,
            description: "Comptes enregistrés",
            icon: Users,
        },
        {
            label: "Actifs",
            value: active,
            description: "Comptes actifs",
            icon: UserCheck,
        },
        {
            label: "Inactifs",
            value: inactive,
            description: "Comptes désactivés",
            icon: UserX,
        },
        {
            label: "Administrateurs",
            value: 3,
            description: "Accès administration",
            icon: ShieldCheck,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-2xl border bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-bold">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}