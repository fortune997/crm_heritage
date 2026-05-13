import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSite, ajoutSite, deleteSite, fetchMedia, fetchSite, fetchSiteById, fetchTotalSite, updateSite } from "../services/site-service";
import { TSites, TSite } from "../types/type";
import { toast } from "sonner";
import { TMedia } from "../types/calineTypes";

const useSite = () => {
    return useQuery<TSites[]>({
        queryKey: ['sites'],
        queryFn: fetchSite,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useMedia = () => {
    return useQuery<TMedia[]>({
        queryKey: ['medias'],
        queryFn: fetchMedia,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useTotalsite = () => {
    return useQuery<number>({
        queryKey: ['total-sites'],
        queryFn: fetchTotalSite,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useSiteById = (siteId: string) => {
    return useQuery<TSite>({
        queryKey: ['site', siteId],
        queryFn: () => fetchSiteById(siteId),
        enabled: !!siteId,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useAddSite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addSite,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Site ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['sites'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du site : " + error.message);
        }
    });
};

const useNewSite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ajoutSite,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Site ajouté avec succès !");
            queryClient.invalidateQueries({ queryKey: ['sites'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du site : " + error.message);
        }
    });
};

const useUpdateSite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSite,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["sites"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        }
    });
};



const useDeleteSite = (siteId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteSite(siteId),
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Site supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['sites'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la suppression du site : " + error.message);
        }
    });
};

export {
    useSite,
    useSiteById,
    useAddSite,
    useUpdateSite,
    useTotalsite,
    useDeleteSite,
    useNewSite,
    useMedia
};
