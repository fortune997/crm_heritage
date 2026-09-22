import supabase from "@/core/lib/supabase";
import { UpdateVisitReport, UpdateVisitStatusPayload, assignedTopographe, fetchAllVisiste, fetchAllVisisteByID, fetchCommercialVisiste, fetchConfirmedVisits, newVisite, updateVisitAttendance, updateVisitReport, updateVisitStatus } from "@/core/services/visites/visite-service";
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

const useConfirmedVisits = () => {
    return useQuery({
        queryKey: ["visites", "confirmed"],
        queryFn: fetchConfirmedVisits,
    });
}


const useMyVisites = (id: string) => {
    return useQuery<Visit[], Error>({
        queryKey: ["visites", id],
        queryFn: () => fetchCommercialVisiste(id)

    });
};

const useVisitesByID = (id: string) => {
    return useQuery<Visit[], Error>({
        queryKey: ["visites", id],
        queryFn: () => fetchAllVisisteByID(id)

    });
};

const useTopoId = (id: string, topo: string) => {
    return useQuery({
        queryKey: ['visites', id],
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

           
        },

        onError: (error: Error, _, context) => {
            toast.dismiss(context?.toastId);

            toast.error(
                `Erreur lors de l'enregistrement : ${error.message}`
            );
        },
    });
};




interface ConfirmVisitInput {
    id: string;
}

/* export function useConfirmVisit() {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: async ({ id }: ConfirmVisitInput) => {
            const { data, error } = await supabase
                .from("visits")
                .update({
                    status: "confirmed",
                })
                .eq("id", id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["visites"],
            });
        },
    });
}
 */
const useConfirmVisit = () =>{
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: updateVisitAttendance,
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["visites"] });
            toast.success(
                variables.isPresent
                    ? "Le prospect a été marqué présent."
                    : "Le prospect a été marqué absent."
            );
            
        },
        onError: (error: Error) => {
            toast.error(`Impossible de modifier la présence : ${error.message}`);
        },
    });
}


const useUpdateVisitStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateVisitStatusPayload) =>
            updateVisitStatus(payload),

        onSuccess: (_, variables) => {
            toast.success(
                variables.status === "confirmed"
                    ? "La visite a été confirmée"
                    : "La visite a été reportée"
            );

            queryClient.invalidateQueries({
                queryKey: ["visites"],
            });
        },

        onError: (error) => {
            console.error(error);

            toast.error(
                "Une erreur est survenue pendant la mise à jour"
            );
        },
    });
}

export {
    useNewVisite,
    useVisites,
    useTopoId,
    useAssignTopo,
    useUpdateVisitReport,
    useMyVisites,
    useUpdateVisitStatus,
    useConfirmedVisits,
    useConfirmVisit,
    useVisitesByID
}