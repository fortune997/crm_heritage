import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProspect, updateProspect, searchProspectsByPhone, addProspect, deleteProspect } from "../../services/prospects/prospect-service";
import { toast } from "sonner";
import { TProspects } from "@/core/types/prospects";


const useAddProspect = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addProspect,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Prospect ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['prospects'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du prospects : " + error.message);
        }
    });
};

const useUpdateProspect = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProspect,
        onMutate: () => {
            const toastId = toast.loading("Modification en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Prospect modifié avec succès !");
            queryClient.invalidateQueries({ queryKey: ['prospects'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'Modification du prospects : " + error.message);
        }
    });
};
const  useDeleteProspect=() =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProspect,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["prospects"],
            });

            toast.success(
                "Prospect supprimé avec succès."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export type PropectProps = {
    data: TProspects,
    count: number
}

const useProspect = () => {
    return useQuery<TProspects[]>({
        queryKey: ["prospects"],
        queryFn: () => getAllProspect(),
        placeholderData: keepPreviousData,

    });
};

const useSearchProspects = (phone: string) => {

    return useQuery({
        queryKey: ["prospects-search", phone],

        queryFn: () => searchProspectsByPhone(phone),

        enabled: phone.length >= 5,

        staleTime: 1000 * 60,
    });
}


export {
    useProspect,
    useAddProspect,
    useSearchProspects,
    useUpdateProspect,
    useDeleteProspect
};
