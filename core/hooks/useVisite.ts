import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { IVisit } from "../types/type";
import { toast } from "sonner";
import { addVisite, deleteVisite, fetchTotalVisites, fetchVisite, fetchVisiteById, fetchVisiteProspectById, fetchVisitesAnnulee, fetchVisitesEnCours, fetchVisitesManquer, fetchVisitesProgrammee, fetchVisitesTerminer, statutVisiteLandService, updateVisite, updateVisiteRapport } from "../services/visite-service";

const useVisite = (from?: string, to?: string) => {
  return useQuery<IVisit[]>({
    queryKey: ["visites", from ?? "all", to ?? "all"],
    queryFn: () => fetchVisite(from, to),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,

  });
};


 const useProspectVisite = (id: number) => {
  return useQuery<IVisit[]>({
    queryKey: ["visites", id],
    queryFn:   () =>  fetchVisiteProspectById(id),
    staleTime: 1000 * 60 * 5, // 5 min avant refetch
    refetchOnWindowFocus: false, // évite refetch inutile
  });
};


const useTotalVisites = () => {
    return useQuery<number>({
        queryKey: ['total-visites'],
        queryFn: fetchTotalVisites,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};


const useVisiteById = (visiteId: string) => {
    return useQuery<IVisit>({
        queryKey: ['visite', visiteId],
        queryFn: () => fetchVisiteById(visiteId),
        enabled: !!visiteId,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useAddVisite = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: addVisite,
      onSuccess: () => {
        toast.success("✅ Visite ajoutée avec succès");
        queryClient.invalidateQueries({ queryKey: ['visites'] });
      },
      onError: (error) => {
        toast.error("❌ Erreur lors de l'ajout ");
        alert("Erreur lors de l'enregistrement : " + error.message);
      },
    });
  };
  

const useUpdateVisite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVisite,
        onMutate: () => {
            const toastId = toast.loading("modification de la visite en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Visite modifié !");
            queryClient.invalidateQueries({ queryKey: ["visites"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la modification : " + error.message);
        }
    });
};

const useUpdateRapportVisite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVisiteRapport,
        onMutate: () => {
            const toastId = toast.loading("Rapport en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Rapport envoyé !");
            queryClient.invalidateQueries({ queryKey: ["visites"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la Rapport : " + error.message);
        }
    });
};

const useUpdateVenuRamassageVisiteLand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: statutVisiteLandService,
        onMutate: () => {
            const toastId = toast.loading("modification de la visite en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Visite modifié !");
            queryClient.invalidateQueries({ queryKey: ["visites"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la modification : " + error.message);
        }
    });
};

const useDeleteVisite = ( visiteId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (visiteId: string) => deleteVisite(visiteId),
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Visite supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['visites'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la suppression de la visite : " + error.message);
        }
    });
};

export const useVisitesProgrammee = () =>
    useQuery<IVisit[]>({
        queryKey: ['visites', 'programmé'],
        queryFn: fetchVisitesProgrammee,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });

export const useVisitesEnCours = () =>
    useQuery<IVisit[]>({
        queryKey: ['visites', 'en cours'],
        queryFn: fetchVisitesEnCours,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });

export const useVisitesTerminer = () =>
    useQuery<IVisit[]>({
        queryKey: ['visites', 'terminer'],
        queryFn: fetchVisitesTerminer,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });

export const useVisitesAnnulee = () =>
    useQuery<IVisit[]>({
        queryKey: ['visites', 'annulé'],
        queryFn: fetchVisitesAnnulee,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });

export const useVisitesManquer = () =>
    useQuery<IVisit[]>({
        queryKey: ['visites', 'manquer'],
        queryFn: fetchVisitesManquer,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });

export {
    useVisite,
    useVisiteById,
    useAddVisite,
    useUpdateVisite,
    useTotalVisites,
    useDeleteVisite,
    useUpdateVenuRamassageVisiteLand,
    useUpdateRapportVisite,
    useProspectVisite
};
