import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProspect, updateProspect, searchProspectsByPhone, addProspect } from "../../services/prospects/prospect-service";
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
    useSearchProspects
};
