import { fetchUsersScopeById, getTopographeUsers, getUsers, getUsersScope } from "@/core/services/admin/users-service";
import { HeritageUser } from "@/core/types/profiles";
import { useQuery } from "@tanstack/react-query";


export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
}

export function useUsersScope() {
    return useQuery({
        queryKey: ["users_sopes"],
        queryFn: getUsersScope,
    });
}

export function useUsersTopographique() {
    return useQuery<HeritageUser[]>({
        queryKey: ["topographes"],
        queryFn: getTopographeUsers,
    });
}

export const useUserScopeById = (id?: string) => {
    return useQuery({
        queryKey: ['users_sopes', id],
        queryFn: () => fetchUsersScopeById(id),
        enabled: !!id,
    });
};