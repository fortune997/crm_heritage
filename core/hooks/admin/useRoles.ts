import { createRole, createRolePermission, fetchAllBrand, fetchAllPermissions, fetchRole, getRoleById, getRolePermissionById, updateRolePermissions } from "@/core/services/admin/users-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export type TPermission = {
    id: string,
    name: string,
    label: string,
    module: string,
    created_at: string
}

export type RolePermission = {
    id: string;
    role_id: string;
    created_at: string;
    permission_id: string;
};

const useRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: fetchRole,
    });
}

const useBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: fetchAllBrand,
    });
}


const usePermissions = () => {
    return useQuery<TPermission[]>({
        queryKey: ["permissions"],
        queryFn: fetchAllPermissions,
    });
}

const useNewRole = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success("✅ Nouvelle activité !");
        },
        onError: (error: any) => {
            toast.error(`❌ ${error.message || "Erreur inconnue."}`);
        },
    });
};



const useRoleById = (roleId: string) => {
    return useQuery({
        queryKey: ["brands", roleId],
        queryFn: () => getRoleById(roleId),
    });
}

const useRolePermissionById = (roleId: string) => {
    return useQuery({
        queryKey: ["permissions", roleId],
        queryFn: () => getRolePermissionById(roleId),
    });
}


const useNewRolePermission = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRolePermission,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["permissions"]
            });

            toast.success("✅ Permissions attribuées !");
        },

        onError: (error: any) => {

            toast.error(
                `❌ ${error.message || "Erreur inconnue"}`
            );

        },
    });
};

const useUpdateRolePermissions = () => {


    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: updateRolePermissions,


        onSuccess: () => {


            queryClient.invalidateQueries({
                queryKey: ["role-permissions"]
            });


            toast.success(
                "Permissions mises à jour"
            );


        },


        onError: (error: any) => {

            toast.error(
                error.message
            );

        }

    });

};

export {
    useRoles,
    useBrands,
    useNewRole,
    useRoleById,
    usePermissions,
    useRolePermissionById,
    useNewRolePermission,
    useUpdateRolePermissions
}