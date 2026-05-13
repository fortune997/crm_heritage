import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  TOnePaiementRecouvrement, TRecouvrement, TVente, TVentes } from "../types/type";
import { toast } from "sonner";
import { addVente, deleteVenteById, fetchById, fetchClientVenteTotal, fetchpaiement, fetchpaiementAll, fetchVenteById, fetchVentes, updateDocument, updateVente } from "../services/vente-service";

const useVente = () => {
    return useQuery<TVente[]>({
        queryKey: ['ventes'],
        queryFn: fetchVentes,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useVenteClient = (id: number) => {
    return useQuery<TVente[]>({
        queryKey: ['ventes',id],
        queryFn: () => fetchClientVenteTotal(id),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

export const useVePaiement = () => {
    return useQuery({
        queryKey: ['paiement'],
        queryFn: fetchpaiementAll,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const usePaiementLieVent = (id: number) => {
    return useQuery<TOnePaiementRecouvrement[]>({
        queryKey: ['paiement', id],
        queryFn:() => fetchpaiement(id),
        enabled: !!id,
    });
};


const useVenteById = (venteID: number) => {
    return useQuery<TVente>({
        queryKey: ['ventes', venteID],
        queryFn: () => fetchVenteById(venteID),
        enabled: !!venteID,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useVenteId = (id: number) => {
    return useQuery<TVentes>({
            queryKey: ["ventes", id],
            queryFn: () =>  fetchById(id),
        enabled: !!id,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

 const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
    },
  });
};


const useAddVente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addVente,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement de la vente en cours...");
            return { toastId };
        },
        onSuccess: (response, _, context) => {
            toast.dismiss(context?.toastId);

            if (!response.success) {
                // Afficher une erreur spécifique si le client existe déjà
                toast.warning(response.message);
                return;
            }

            // Afficher le succès une seule fois
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['ventes'] });
        },
        onError: (error, _, context) => {
            // Cas où l'ajout échoue complètement (erreur réseau, etc.)
            toast.dismiss(context?.toastId);
            toast.error("Erreur technique : " + (error as Error).message);
        }
    });
};


const useUpdateVente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVente,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["ventes"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        }
    });
};

const useDeleteVente = (recouvrementId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteVenteById(recouvrementId),
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Recouvrement supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['ventes'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la suppression du recouvrement : " + error.message);
        }
    });
};

export {
    useVente,
    useVenteById,
    useAddVente,
    useUpdateVente,
    useDeleteVente,
    useVenteId,
    usePaiementLieVent,
    useUpdateDocument,
    useVenteClient
};
