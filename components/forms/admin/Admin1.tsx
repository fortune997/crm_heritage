"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { departmentLabels, statusColors, statusLabels } from "./CreateUserDialog";
import { UserRowActions } from "./UserRowActions";
import { UserRoleBadge } from "./UserRoleBadge";
import { HeritageUser } from "@/core/types/profiles";



type Props = {
    users: HeritageUser[];

    onView: (
        user: HeritageUser
    ) => void;

    onEdit: (
        user: HeritageUser
    ) => void;
};

function getInitials(
    name: string
) {
    return name
        .split(" ")
        .map(
            (part) =>
                part[0]
        )
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function UsersTable({
    users,
    onView,
    onEdit,
}: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b bg-muted/40">
                        <tr>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Utilisateur
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Rôle
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Département
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Statut
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Dernière activité
                            </th>

                            <th className="px-5 py-4 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {users.map(
                            (user) => (
                                <tr
                                    key={
                                        user.id
                                    }
                                    className="transition hover:bg-muted/20"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        user.avatar_url ?? undefined
                                                    }
                                                />

                                                <AvatarFallback>
                                                    {getInitials(
                                                        user.full_name
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <p className="font-medium">
                                                    {
                                                        user.full_name
                                                    }
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        user.professional_email
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <UserRoleBadge
                                            role={
                                                user.department
                                            }
                                        />
                                    </td>

                                    <td className="px-5 py-4 text-sm">
                                        {
                                            departmentLabels[
                                            user.department
                                            ]
                                        }
                                    </td>

                                    <td className="px-5 py-4">
                                        <Badge
                                            variant="outline"
                                            className={
                                                statusColors[
                                                user.status
                                                ]
                                            }
                                        >
                                            {
                                                statusLabels[
                                                user.status
                                                ]
                                            }
                                        </Badge>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-muted-foreground">
                                        {user.last_login_at ??
                                            "Jamais"}
                                    </td>

                                    {/*  <td className="px-5 py-4 text-right">
                                        <UserRowActions
                                            user={
                                                user
                                            }
                                            onView={
                                                onView
                                            }
                                            onEdit={
                                                onEdit
                                            }
                                        />
                                    </td> */}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="p-12 text-center">
                    <p className="font-medium">
                        Aucun utilisateur trouvé
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Essayez de modifier vos filtres.
                    </p>
                </div>
            )}
        </div>
    );
}