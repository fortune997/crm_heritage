'use client'

import { useAuth } from "@/contexts/AuthContext";
import { TPermissions } from "../types/permissions";


export function usePermissions() {
    const { role, permissions, access_scope } = useAuth();
    const isSuperAdmin = role?.name === "SUPER_ADMIN";

    const can = (permission: TPermissions) => {
        if (isSuperAdmin) return true;

        return permissions.includes(permission);
    };

    const canAny = (requiredPermissions: TPermissions[]) => {
        if (isSuperAdmin) return true;

        return requiredPermissions.some((permission) =>
            permissions.includes(permission)
        );
    };

    const canAll = (requiredPermissions: TPermissions[]) => {
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