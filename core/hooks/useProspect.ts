import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProspect, deleteProspectById, fetchProspect, fetchProspectById, fetchTotalProspect, updateProspect, fetchTotalProspectsByStatus, fetchProspectCountMonth, fetchCorporate, fetchProspectByNom, addCorporate, updateStatutProspect, updateDescriptionProspect, fetchProspectL7, fetchProspectL8, fetchProspectVisite, addPetitProspect, updateCorporate, searchProspects, searchProspectsForClient, fetchProspectNdjangui, fetchStreetMarketingProspects, testNumber } from "../services/prospect-service";
import { TLeadsDeatail, TProspect, TProspectChart } from "../types/type";
import { toast } from "sonner";



export type PropectProps = {
    data: TProspect,
    count: number
}

const useProspect = (
    role: string, commercialName: string, from?: Date,
    to?: Date
) => {
    return useQuery<TProspect[]>({
        queryKey: ["prospects", commercialName.trim(), from, to],
        queryFn: () => fetchProspect(role, commercialName, from, to),
        enabled: from && !to,
        placeholderData: keepPreviousData,

    });
};

const useStreetMarketing = () => {
    return useQuery({
        queryKey: ["street_marketing"],
        queryFn: () => fetchStreetMarketingProspects(),

    });
};

const useFinfNumber = () => {
    return useQuery({
        queryKey: ["testNumber"],
        queryFn: () => testNumber(),

    });
};

const useProspectNdjangui = (

    from?: Date,
    to?: Date
) => {
    return useQuery({
        queryKey: ["prospects_ndjangui", from?.toISOString(), to?.toISOString()],
        queryFn: () => fetchProspectNdjangui(from, to),
        enabled: from && !to,
        placeholderData: keepPreviousData,

    });
};

const useProspectForClient = () => {
    return useQuery<TProspect[]>({
        queryKey: ["prospects"],
        queryFn: () => fetchProspectL7(),
        initialData: [],
    });
};

const useProspectVisite = () => {
    return useQuery<TProspect[]>({
        queryKey: ["prospects"],
        queryFn: () => fetchProspectVisite(),
        initialData: [],
    });
};

const useProspectForClientL8 = () => {
    return useQuery<TProspect[]>({
        queryKey: ["prospects"],
        queryFn: () => fetchProspectL8(),
        initialData: [],
    });
};






const useCorporate = (
    role: string,
    commercialName: string,
    type: string,
    from?: Date,
    to?: Date

) => {
    return useQuery({
        queryKey: ["corporate", role, commercialName.trim(), from?.toISOString(), to?.toISOString()],
        queryFn: () => fetchCorporate(role, commercialName!, type, from, to),
        enabled: !from && !to,
        placeholderData: keepPreviousData,
    });
};

const useProspectByNom = (
    role: string,
    commercialName: string,


) => {
    return useQuery<TProspect[]>({
        queryKey: ["prospects", commercialName.trim()],
        queryFn: () => fetchProspectByNom(role, commercialName!),
        enabled: !!commercialName,
        initialData: [],
    });
};

const useProspectCountMonth = () => {
    return useQuery<TProspectChart[]>({
        queryKey: ['prospects'],
        queryFn: fetchProspectCountMonth,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

const useProspectById = (prospectId: string) => {
    return useQuery<TLeadsDeatail>({
        queryKey: ['prospect', prospectId],
        queryFn: () => fetchProspectById(prospectId),
        enabled: !!prospectId,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};
import { useState, useMemo } from "react";
import debounce from "lodash.debounce";
import supabase from "../lib/supabase";



const useCheckPhoneExists = () => {
    const [exists, setExists] = useState(false);
    const [loading, setLoading] = useState(false);

    const check = async (phone: string) => {
        if (!phone) return;

        setLoading(true);
        const { data } = await supabase
            .from("prospects")
            .select("id")
            .eq("phone", phone)
            .maybeSingle();

        setExists(!!data);
        setLoading(false);
    };

    return { exists, loading, check };
}





export function useCheckPhoneExistsDebounced() {
    const [exists, setExists] = useState(false);
    const [loading, setLoading] = useState(false);

    // fonction réelle pour checker dans la DB
    const checkPhone = async (phone: string) => {
        if (!phone) return;

        setLoading(true);

        const { data } = await supabase
            .from("prospects")
            .select("id")
            .eq("telephone", phone)
            .maybeSingle();

        setExists(!!data);
        setLoading(false);
    };

    // debounce avec useMemo (important pour éviter recréation)
    const debouncedCheck = useMemo(
        () => debounce(checkPhone, 500),
        []
    );

    return { exists, loading, check: debouncedCheck };
}





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
            queryClient.invalidateQueries({ queryKey: ['prospects'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du prospect : " + error.message);
        }
    });
};

const useAddCorporate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCorporate,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            queryClient.invalidateQueries({ queryKey: ['corporate'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du prospect : " + error.message);
        }
    });
};

const useAddPCorporate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addPetitProspect,
        onMutate: () => {
            const toastId = toast.loading("Enregistrement en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            queryClient.invalidateQueries({ queryKey: ['corporate'] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de l'enregistrement du prospect : " + error.message);
        }
    });
};

const useUpdateProspect = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProspect,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["prospects"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        }
    });
};

const useUpdateCorporate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCorporate,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["prospects"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour : " + error.message);
        }
    });
};


const useUpdateStatutProspect = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStatutProspect,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour du statut en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Données mises à jour !");
            queryClient.invalidateQueries({ queryKey: ["prospect"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour du statut : " + error.message);
        }
    });
};

const useUpdatedescriptionProspect = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDescriptionProspect,
        onMutate: () => {
            const toastId = toast.loading("Mise à jour du description en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Description mise à jour !");
            queryClient.invalidateQueries({ queryKey: ["prospect"] });
        },
        onError: (error, _, context) => {
            toast.dismiss(context?.toastId);
            toast.error("Erreur lors de la mise à jour du description : " + error.message);
        }
    });
};

const useDeleteProspect = (prospectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteProspectById(prospectId),
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Prospect supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['prospects'] });
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

const useDeleteCorporate = (prospectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteProspectById(prospectId),
        onMutate: () => {
            const toastId = toast.loading("Suppression en cours...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            toast.dismiss(context?.toastId);
            toast.success("Corporate supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ['corporate'] });
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

const useTotalProspect = (role: string, commercialName?: string) => {
    return useQuery<number>({
        queryKey: ['prospects', role, commercialName],
        queryFn: () => fetchTotalProspect(role, commercialName),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

export const useTotalProspectByStatus = (
    role: string,
    status: string,
    commercialName?: string
) => {
    return useQuery<number>({
        queryKey: ['prospects', status, role, commercialName],
        queryFn: () => fetchTotalProspectsByStatus(role, status, commercialName),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};


// ✅ Hooks spécifiques pour chaque statut
const useTotalNonContactedProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "L2", commercialName);

const useTotalUnavailableProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "indisponible", commercialName);

const useTotalUninterestedProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "prospect inintéressé", commercialName);

const useTotalBusyProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "occupé", commercialName);

const useTotalWantMoreInfoProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "en savoir plus", commercialName);

const useTotalInterestedProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "Intéressé", commercialName);

const useTotalNetworkIssuesProspects = (role: string, commercialName?: string) =>
    useTotalProspectByStatus(role, "réseau perturbé", commercialName);

// Hook pour rechercher des prospects par query (téléphone ou nom)
const useSearchProspect = (term: string) => {
    return useQuery<TProspect[]>({
        queryKey: ['prospects', term],
        queryFn: () => searchProspects(term),
        enabled: !!term && term.trim().length > 0,

    });
};

// Hook pour rechercher des prospects pour clients par query (téléphone ou nom)
const useSearchProspectPourClient = (term: string) => {
    return useQuery({
        queryKey: ['prospects', term],
        queryFn: () => searchProspectsForClient(term),
        enabled: !!term && term.trim().length > 0,

    });
};


export {
    useProspect,
    useProspectById,
    useTotalProspect,
    useTotalNonContactedProspects,
    useTotalUnavailableProspects,
    useTotalUninterestedProspects,
    useTotalBusyProspects,
    useTotalWantMoreInfoProspects,
    useTotalInterestedProspects,
    useAddCorporate,
    useDeleteCorporate,
    useTotalNetworkIssuesProspects,
    useAddProspect,
    useDeleteProspect,
    useCorporate,
    useUpdateProspect,
    useProspectCountMonth,
    useProspectByNom,
    useUpdatedescriptionProspect,
    useUpdateStatutProspect,
    useProspectForClient,
    useProspectForClientL8,
    useSearchProspectPourClient,
    useProspectVisite,
    useAddPCorporate,
    useUpdateCorporate,
    useCheckPhoneExists,
    useSearchProspect,
    useProspectNdjangui,
    useStreetMarketing,
    useFinfNumber
};
