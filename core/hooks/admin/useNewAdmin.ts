import { createCompany } from "@/core/services/admin/createCompany";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useNewCompany = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success("✅ Nouvelle activité !");
        },
        onError: (error: any) => {
            toast.error(`❌ ${error.message || "Erreur inconnue."}`);
        },
    });
};