import { UpdateVisitReport, assignedTopographe, fetchAllVisiste, fetchCommercialVisiste, newVisite, updateVisitReport } from "@/core/services/visites/visite-service";
import { Visit } from "@/core/types/visites/type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const useNewVisite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: newVisite,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Visite ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['visites'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du Visite : " + error.message);
        }
    });
};

const useVisites = () => {
    return useQuery<Visit[], Error>({
        queryKey: ["visites"],
        queryFn: () => fetchAllVisiste(),
        placeholderData: keepPreviousData,

    });
};


const useMyVisites = (id: string) => {
    return useQuery<Visit[], Error>({
        queryKey: ["visites", id],
        queryFn: () => fetchCommercialVisiste(id)

    });
};

const useTopoId = (id: string, topo: string) => {
    return useQuery({
        queryKey: ['users_sopes', id],
        queryFn: () => assignedTopographe(id, topo),
        enabled: !!id,
    });
};


type AssignTopoParams = {
    id: string;
    topo: string;
};

const useAssignTopo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, topo }: AssignTopoParams) =>
            assignedTopographe(id, topo),

        onMutate: () => {
            const toastId = toast.loading("Attribution en cours...");
            return { toastId };
        },

        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);

            toast.success("Topographe assigné avec succès !");

            queryClient.invalidateQueries({
                queryKey: ["visites"],
            });
        },

        onError: (error: Error, _, context) => {
            toast.dismiss(context?.toastId);

            toast.error(
                "Erreur lors de l'attribution : " + error.message
            );
        },
    });
};



const useUpdateVisitReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            report,
        }: {
            id: string;
            report: UpdateVisitReport;
        }) => updateVisitReport(id, report),

        onMutate: () => {
            const toastId = toast.loading(
                "Enregistrement du rapport en cours..."
            );

            return { toastId };
        },

        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);

            toast.success("Rapport de visite enregistré avec succès.");

            queryClient.invalidateQueries({
                queryKey: ["visites"],
            });

            queryClient.invalidateQueries({
                queryKey: ["assignation"],
            });
        },

        onError: (error: Error, _, context) => {
            toast.dismiss(context?.toastId);

            toast.error(
                `Erreur lors de l'enregistrement : ${error.message}`
            );
        },
    });
};

export {
    useNewVisite,
    useVisites,
    useTopoId,
    useAssignTopo,
    useUpdateVisitReport,
    useMyVisites
}