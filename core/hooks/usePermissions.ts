'use client'

import { useAuth } from "@/contexts/AuthContext";
import { TPermissionName } from "@/core/types/type";

export function usePermissions() {
    const { role, permissions, access_scope } = useAuth();

    const isSuperAdmin = role === "SUPER_ADMIN" && access_scope === "global";

    const can = (permission: TPermissionName) => {
        if (isSuperAdmin) return true;

        return permissions.includes(permission);
    };

    const canAny = (requiredPermissions: TPermissionName[]) => {
        if (isSuperAdmin) return true;

        return requiredPermissions.some((permission) =>
            permissions.includes(permission)
        );
    };

    const canAll = (requiredPermissions: TPermissionName[]) => {
        if (isSuperAdmin) return true;

        return requiredPermissions.every((permission) =>
            permissions.includes(permission)
        );
    };

    return {
        permissions,
        isSuperAdmin,
        can,
        canAny,
        canAll,
    };
}