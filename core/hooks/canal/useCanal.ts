import { addCanal, getCanal } from "@/core/services/digital/canal-service";
import { TCanal } from "@/core/types/digital/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const useCanal = () => {
    return useQuery<TCanal[]>({
        queryKey: ['canals'],
        queryFn: () => getCanal(),

    });
};

const useAddCanal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCanal,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Canal ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['canals'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du canal : " + error.message);
        }
    });
};

export {
    useCanal,
    useAddCanal
}