"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


import {
    useNewRolePermission,
    usePermissions,
    useRoleById,
    useRolePermissionById,
    useUpdateRolePermissions,

} from "@/core/hooks/admin/useRoles";

type Permission = {
    id: string;
    name: string;
    label: string;
    module: string;
};

type RolePermission = {
    role_id: string;
    permission_id: string;
};

type Role = {
    id: string;
    name: string;
    // autres propriétés du rôle...
};

export default function RolePermissionsPage() {
    const params = useParams();
    const roleId = params.id as string;


    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    const { data: roleData, isLoading: roleLoading } =
        useRoleById(roleId);

    const { data: rolePermissions, isLoading: rolePermissionsLoading } =
        useRolePermissionById(roleId);

    const { data: permissions, isLoading: permissionsLoading } =
        usePermissions();
    const {
        mutate: createPermissions

    } = useNewRolePermission();
    const {
        mutate: updatePermissions,
        isPending
    } = useUpdateRolePermissions();




    /**
     * Extraire le nom du rôle de manière sécurisée
     */
    const roleName = useMemo(() => {
        if (!roleData) return "Rôle";

        // Si roleData est un objet avec une propriété name
        if (typeof roleData === 'object' && 'name' in roleData) {
            return (roleData as Role).name;
        }

        // Si roleData est déjà une chaîne de caractères
        if (typeof roleData === 'string') {
            return roleData;
        }

        return "Rôle";
    }, [roleData]);

    /**
     * Initialiser les permissions sélectionnées
     * avec les permissions déjà attribuées au rôle.
     */
    useEffect(() => {
        if (!rolePermissions) return;

        const permissionIds = rolePermissions.map(
            (item) => item.permission_id   // ✅ no annotation needed
        );

        setSelectedPermissions(permissionIds);
    }, [rolePermissions]);

    /**
     * Grouper les permissions par module
     */
    const groupedPermissions = useMemo(() => {
        if (!permissions) return {};

        return permissions.reduce(
            (acc, item: Permission) => {
                if (!acc[item.module]) {
                    acc[item.module] = [];
                }

                acc[item.module].push(item);

                return acc;
            },
            {} as Record<string, Permission[]>
        );
    }, [permissions]);

    /**
     * Sélectionner / désélectionner une permission
     */
    function togglePermission(permissionId: string) {
        setSelectedPermissions((prev) => {
            if (prev.includes(permissionId)) {
                return prev.filter(
                    (id) => id !== permissionId
                );
            }

            return [
                ...prev,
                permissionId,
            ];
        });
    }

    /**
     * Sauvegarder les permissions du rôle
     */
    async function savePermissions() {
        if (!roleId) return;
        updatePermissions({

            roleId,

            permissions: selectedPermissions

        });



    }

    const loading =
        roleLoading ||
        rolePermissionsLoading ||
        permissionsLoading;

    if (loading) {
        return (
            <div className="p-6">
                Chargement des permissions...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Permissions du rôle
                </h1>

                <p className="text-muted-foreground">
                    {roleName}
                </p>
            </div>

            {/* Permissions */}
            <div className="grid gap-6">

                {Object.entries(groupedPermissions).map(
                    ([module, items]) => (
                        <Card key={module}>

                            <CardHeader>
                                <CardTitle className="capitalize">
                                    {module}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">

                                {items.map((permission) => (

                                    <div
                                        key={permission.id}
                                        className="flex items-center gap-3"
                                    >

                                        <Checkbox
                                            checked={selectedPermissions.includes(
                                                permission.id
                                            )}
                                            onCheckedChange={() =>
                                                togglePermission(
                                                    permission.id
                                                )
                                            }
                                        />

                                        <div>
                                            <p className="font-medium">
                                                {permission.label}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {permission.name}
                                            </p>
                                        </div>

                                    </div>

                                ))}

                            </CardContent>

                        </Card>
                    )
                )}

            </div>

            {/* Save */}
            <Button
                onClick={savePermissions}
                disabled={isPending}
            >
                {isPending
                    ? "Enregistrement..."
                    : "Enregistrer"}
            </Button>

        </div>
    );
}