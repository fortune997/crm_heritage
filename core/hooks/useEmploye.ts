import supabase from '@/core/lib/supabase';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TProfile } from "../types/type";
import { toast } from "sonner";
import type { TCurrentUser } from "@/core/types/type";
import { addEmployee, deleteEmployeById, fetchAllCallCenter, fetchAllCommerciaux, fetchEmploye, fetchEmployeById, fetchEmployeByNom, fetchEmployeByPoste, fetchProspectsCountByEmploye, fetchResponsableDepartement, fetchSalaireTotal, fetchTotalEmployes, getProfilesCountByDepartment, updateEmploye, updatePassord } from "../services/employe-service";

const useEmploye = () => {
    return useQuery<TProfile[]>({
        queryKey: ['employes'],
        queryFn: fetchEmploye,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useEmployeResponsableDepartement = () => {
    return useQuery<TProfile[]>({
        queryKey: ['employes'],
        queryFn: fetchResponsableDepartement,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useEmployeCommerciaux = () => {
    return useQuery<TProfile[]>({
        queryKey: ['commerciaux'],
        queryFn: fetchAllCommerciaux,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useEmployeCallCenter = () => {
    return useQuery<TProfile[]>({
        queryKey: ['call center'],
        queryFn: fetchAllCallCenter,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};


const useEmployeByNom = (EmployeNom: string) => {
    return useQuery<TProfile>({
        queryKey: ['employe', EmployeNom],
        queryFn: () => fetchEmployeByNom(EmployeNom),
        enabled: !!EmployeNom,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useEmployeById = (id: string) => {
    return useQuery<TProfile>({
        queryKey: ['employe', id],
        queryFn: () => fetchEmployeById(id),
        enabled: !!id,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};



export function useAllEmployees() {
    return useQuery<TProfile[]>({
        queryKey: ["employees"],
        queryFn: fetchEmploye,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

const useAddEmploye = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employes'] });
        },
        onError: (error) => {
            // Optionnel ici car le service affiche déjà les erreurs
            console.log("Erreur lors de l'ajout de l'employé:", error.message);
        },
    });
};

const useUpdateEmploye = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateEmploye,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["employes"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        }
    });
};

export type PasswordPayload = {
    email: string;
    currentPassword: string;
    newPassword: string;
};

const usePassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PasswordPayload) => updatePassord(payload),
        onMutate: () => {
            const toastId = toast.loading("Modification du mot de passe...");
            return { toastId };
        },

        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Mot de passe mis à jour !");
            queryClient.invalidateQueries({ queryKey: ["employes"] });
        },

        onError: (error: Error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error(error.message);
        },
    });
};

const useDeleteEmploye = (dailyId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteEmployeById(dailyId),
        onMutate: () => {
            const toastId = toast.loading("Suppression / désactivation en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Employe supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['employes'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la suppression de l'employe : " + error.message);
        }
    });
};

const useTotalEmployes = () => {
    return useQuery<number>({
        queryKey: ["total-employes"],
        queryFn: fetchTotalEmployes,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useTotalEmployesByDepartment = (departement: string) => {
    return useQuery<number>({
        queryKey: ["total-employes", departement],
        queryFn: () => getProfilesCountByDepartment(departement),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};


const useSalaireTotal = () => {
    return useQuery<number>({
        queryKey: ["salaire-total"],
        queryFn: fetchSalaireTotal,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useProspectsCount = () => {
    return useQuery<{ commercial_id: string; count: number }[]>({
        queryKey: ["prospects-count"],
        queryFn: fetchProspectsCountByEmploye,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useEmployeByPoste = (poste: string) => {
    return useQuery<TProfile[]>({
        queryKey: ['employesPoste'],
        queryFn: () => fetchEmployeByPoste(poste),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};




export function useUserProfile(userId: string | null) {
    return useQuery({
        queryKey: ["profile", userId],
        enabled: !!userId,

        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error || !data) {
                throw new Error(error?.message || "Profil introuvable.");
            }
            return data
        },
    });
}

export {
    useEmploye,
    useEmployeByNom,
    useAddEmploye,
    useUpdateEmploye,
    usePassword,
    useDeleteEmploye,
    useEmployeCommerciaux,
    useTotalEmployes,
    useSalaireTotal,
    useTotalEmployesByDepartment,
    useProspectsCount,
    useEmployeByPoste,
    useEmployeById,
    useEmployeCallCenter,
    useEmployeResponsableDepartement
};
