// core/hooks/permissions/usePermission.ts

"use client";

import supabase from "@/core/lib/supabase";
import { useQuery } from "@tanstack/react-query";


export const usePermission = (
    permissionName: string
) => {
    return useQuery<boolean>({
        queryKey: ["permission", permissionName],

        queryFn: async () => {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                return false;
            }

            const { data, error } = await supabase.rpc(
                "has_permission",
                {
                    p_user_id: user.id,
                    p_permission_name: permissionName,
                }
            );

            if (error) {
                console.error(
                    "Erreur permission :",
                    error
                );

                return false;
            }

            return data ?? false;
        },
    });
};