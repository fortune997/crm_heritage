import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient, deleteClientById, fetchClient, fetchClientById, fetchTotalClient, searchAllClient, ToutClients, updateClient } from "../services/client-service";
import { TClient } from "../types/type";
import { toast } from "sonner";

// Récupérer tous les clients
const useClient = (role?: string, commercialName?: string) => {
    return useQuery({
        queryKey: ['clients', role, commercialName],
        queryFn: () => fetchClient(role, commercialName)
    });
};

// Récupérer un client par ID
const useClientById = (id: string) => {
    return useQuery<TClient>({
        queryKey: ['clientS', id],
        queryFn: () => fetchClientById(id),
        enabled: !!id
    });
};

// Récupérer tout client
const useToutClient = () => {
    return useQuery<TClient[]>({
        queryKey: ['clientS'],
        queryFn: () => ToutClients(),

    });
};

// Ajouter un client
const useAddClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addClient,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement du client en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: (error, _, context) => {
            // Cas où l'ajout échoue complètement (erreur réseau, etc.)
            toast.dismiss(context?.toastId);
            toast.error("Erreur technique : " + (error as Error).message);
        }
    });
};

// Mettre à jour un client
const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateClient,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
            console.error("Erreur :", error);
        },
    });
};

// Supprimer un client
const useDeleteClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (clientId: string) => {
            const res = await deleteClientById(clientId);
            return res;
        },
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (response, _, context) => {
            toast.dismiss(context?.toastId);

            if (!response.success) {
                // Erreur connue (ex : contrainte de clé étrangère)
                toast.error(response.message);
                return;
            }

            // Succès
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: (error, _, context) => {
            // Cas très rare si `deleteClientById` crash complètement (réseau, etc.)
            toast.dismiss(context?.toastId);
            toast.error("Erreur technique : " + (error as Error).message);
        }
    });
};

const useTotalClient = (role: string, commercialName?: string) => {
    return useQuery<number>({
        queryKey: ['clients', role, commercialName],
        queryFn: () => fetchTotalClient(role, commercialName),
        staleTime: 1000 * 60 * 5,
    });
};

const useSearchClient = (term: string) => {
    return useQuery({
        queryKey: ['clients', term],
        queryFn: () => searchAllClient(term),
        enabled: !!term && term.trim().length > 0,
    });
};


export {
    useClient,
    useClientById,
    useAddClient,
    useUpdateClient,
    useDeleteClient,
    useTotalClient,
    useSearchClient,
    useToutClient
};
