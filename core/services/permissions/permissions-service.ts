import supabase from "@/core/lib/supabase";


type Permission = {
    name: string;
};

type RolePermission = {
    permissions: Permission | null;
};

type Role = {
    role_permissions: RolePermission[] | null;
};

type UserRole = {
    roles: Role | null;
};

export const hasPermission = async (
    userId: string,
    permissionName: string
): Promise<boolean> => {
    const { data, error } = await supabase
        .from("user_roles")
        .select(`
            roles (
                role_permissions (
                    permissions (
                        name
                    )
                )
            )
        `)
        .eq("user_id", userId)
        .returns<UserRole[]>();

    if (error) {
        console.error(
            "Erreur lors de la vérification de permission :",
            error
        );

        return false;
    }

    return (
        data?.some((userRole) =>
            userRole.roles?.role_permissions?.some(
                (rolePermission) =>
                    rolePermission.permissions?.name === permissionName
            )
        ) ?? false
    );
};