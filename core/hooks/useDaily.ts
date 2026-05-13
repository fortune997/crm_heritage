import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { TDaily } from "../types/type";
import { toast } from "sonner";
import { addDaily, addDailyCorporate, deleteDailyById, fetchAllDailyById, fetchDaily, fetchDailyActivities, fetchDailyActivitiesById, fetchDailyActivitiesCountById, fetchDailyById, testNumber, updateDaily } from "../services/daily-service";

const useDaily = (role: string, commercialName: string, from?: Date,
    to?: Date) => {
    return useQuery<TDaily[]>({
        queryKey: ['dailies', commercialName.trim(), from, to],
        queryFn: () => fetchDaily(role, commercialName, from, to),
        enabled: !!commercialName,

    });
};

const useFinfNumber = () => {
    return useQuery({
        queryKey: ["testNumberdailies"],
        queryFn: () => testNumber(),

    });
};

const useDailyActicitie = (role: string, commercialName: string) => {
    return useQuery({
        queryKey: ['activities', commercialName.trim()], // 👈 ajoute le nom dans la clé pour le refetch
        queryFn: () => fetchDailyActivities(role, commercialName),
        enabled: !!commercialName,
    });
};

const useDailyActicityById = (id: number) => {
    return useQuery({
        queryKey: ['activities', id],
        queryFn: () => fetchDailyActivitiesById(id),
        enabled: !!id,
    });
};

const useDailyById = (dailyId: string) => {
    return useQuery<TDaily>({
        queryKey: ['daily', dailyId],
        queryFn: () => fetchDailyById(dailyId),
        enabled: !!dailyId,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useAllDailyById = (dailyId: string) => {
    return useQuery<TDaily[]>({
        queryKey: ['dailies', dailyId],
        queryFn: () => fetchAllDailyById(dailyId),
        enabled: !!dailyId,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useAddDaily = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addDaily,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Daily ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['dailies'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du daily : " + error.message);
        }
    });
};

const useAddDailyCorporate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addDailyCorporate,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Daily ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['dailies'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du daily : " + error.message);
        }
    });
};

const useUpdateDaily = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDaily,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["dailies"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        }
    });
};

const useDeleteDaily = (dailyId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteDailyById(dailyId),
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Daily supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['dailies'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            if (error) {
                if (error.message.includes('violates foreign key constraint')) {
                    toast.warning("Impossible de supprimer ce prospect : des activités lui sont liées.");
                } else {
                    toast.warning("Erreur : " + error.message);
                }
            }
        }
    });
};

export {
    useDaily,
    useDailyById,
    useAddDaily,
    useUpdateDaily,
    useDeleteDaily,
    useAllDailyById,
    useDailyActicityById,
    useDailyActicitie,
    useAddDailyCorporate,
    useFinfNumber
};
