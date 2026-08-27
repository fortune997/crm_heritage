import { createUserCount } from "@/core/services/admin/users-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserCount,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-account"] });
            toast.success("Utilisateur créé avec succès");
        },

        onError: (error) => {
            toast.error("Erreur création utilisateur", {
                description: error.message,
            });
        },
    });
}