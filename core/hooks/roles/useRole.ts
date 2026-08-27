import { fetchUsersRoleById } from "@/core/services/roles/role-service";
import { RolePermission } from "@/core/types/roles/type";
import { useQuery } from "@tanstack/react-query";


export const useRoleById = (id?: string) => {
    return useQuery({
        queryKey: ['roles', id],
        queryFn: () => fetchUsersRoleById(id),
        enabled: !!id,
    });
};