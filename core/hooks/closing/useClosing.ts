"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
    assignClosingCase,
    calculateClosingStats,
    createClosingCase,
    deleteClosingCase,
    fetchClosingCaseById,
    fetchClosingCases,
    registerClosingContact,
    takeClosingCase,
    updateClosingCase,
    updateClosingStage,
} from "@/core/services/closing/closing-service";

import {
    AssignClosingCaseInput,
    ClosingCase,
    CreateClosingCaseInput,
    UpdateClosingCasePayload,
    UpdateClosingStageInput,
} from "@/core/types/closing";


// ============================================================
// CLÉS TANSTACK QUERY
// ============================================================

export const closingKeys = {
    all: ["closing"] as const,

    lists: () =>
        [...closingKeys.all, "list"] as const,

    detail: (closingCaseId: string) =>
        [
            ...closingKeys.all,
            "detail",
            closingCaseId,
        ] as const,
};


// ============================================================
// TYPES INTERNES DES MUTATIONS
// ============================================================

export interface TakeClosingCaseInput {
    closingCaseId: string;
    closerId: string;
}

export interface RegisterClosingContactInput {
    closingCaseId: string;
    nextFollowUpAt?: string | null;
}


// ============================================================
// RÉCUPÉRER TOUS LES DOSSIERS
// ============================================================

export function useClosingCases() {
    return useQuery({
        queryKey: closingKeys.lists(),

        queryFn: fetchClosingCases,

        staleTime: 30_000,

        refetchOnWindowFocus: true,
    });
}


// ============================================================
// RÉCUPÉRER UN DOSSIER
// ============================================================

export function useClosingCase(
    closingCaseId: string | null | undefined
) {
    return useQuery({
        queryKey: closingKeys.detail(
            closingCaseId ?? ""
        ),

        queryFn: () => {
            if (!closingCaseId) {
                throw new Error(
                    "L’identifiant du dossier closing est obligatoire."
                );
            }

            return fetchClosingCaseById(
                closingCaseId
            );
        },

        enabled: Boolean(closingCaseId),

        staleTime: 30_000,
    });
}


// ============================================================
// STATISTIQUES CLOSING
// ============================================================

export function useClosingStats() {
    return useQuery({
        queryKey: closingKeys.lists(),

        queryFn: fetchClosingCases,

        select: calculateClosingStats,

        staleTime: 30_000,

        refetchOnWindowFocus: true,
    });
}


// ============================================================
// CRÉER UN DOSSIER
// ============================================================

export function useCreateClosingCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            input: CreateClosingCaseInput
        ) => createClosingCase(input),

        onSuccess: async (closingCase) => {
            queryClient.setQueryData<ClosingCase>(
                closingKeys.detail(closingCase.id),
                closingCase
            );

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            toast.success(
                "Dossier closing créé avec succès."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// MODIFIER UN DOSSIER
// ============================================================

export function useUpdateClosingCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            payload: UpdateClosingCasePayload
        ) => updateClosingCase(payload),

        onSuccess: async (closingCase) => {
            queryClient.setQueryData<ClosingCase>(
                closingKeys.detail(closingCase.id),
                closingCase
            );

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            toast.success(
                "Dossier closing mis à jour."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// AFFECTER UN RESPONSABLE CLOSING
// ============================================================

export function useAssignClosingCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            input: AssignClosingCaseInput
        ) => assignClosingCase(input),

        onSuccess: async (closingCase) => {
            queryClient.setQueryData<ClosingCase>(
                closingKeys.detail(closingCase.id),
                closingCase
            );

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            toast.success(
                closingCase.assigned_closer
                    ? `Dossier affecté à ${closingCase.assigned_closer.full_name}.`
                    : "Affectation du dossier retirée."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// PRENDRE EN CHARGE UN DOSSIER
// ============================================================

export function useTakeClosingCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            closingCaseId,
            closerId,
        }: TakeClosingCaseInput) =>
            takeClosingCase(
                closingCaseId,
                closerId
            ),

        onSuccess: async (closingCase) => {
            queryClient.setQueryData<ClosingCase>(
                closingKeys.detail(closingCase.id),
                closingCase
            );

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            toast.success(
                "Le dossier vous a été affecté."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// CHANGER L’ÉTAPE DU DOSSIER
// ============================================================

export function useUpdateClosingStage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            input: UpdateClosingStageInput
        ) => updateClosingStage(input),

        onSuccess: async (closingCase) => {
            queryClient.setQueryData<ClosingCase>(
                closingKeys.detail(closingCase.id),
                closingCase
            );

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            const messages = {
                gagne:
                    "Le dossier a été marqué comme gagné.",
                perdu:
                    "Le dossier a été marqué comme perdu.",
                a_relancer:
                    "La prochaine relance a été programmée.",
            } as const;

            const message =
                closingCase.stage in messages
                    ? messages[
                          closingCase.stage as keyof typeof messages
                      ]
                    : "Étape du closing mise à jour.";

            toast.success(message);
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// ENREGISTRER UN CONTACT
// ============================================================

export function useRegisterClosingContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            closingCaseId,
            nextFollowUpAt,
        }: RegisterClosingContactInput) =>
            registerClosingContact(
                closingCaseId,
                nextFollowUpAt
            ),

        onSuccess: async (closingCase) => {
            queryClient.setQueryData<ClosingCase>(
                closingKeys.detail(closingCase.id),
                closingCase
            );

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            toast.success(
                "Le contact avec le prospect a été enregistré."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// SUPPRIMER UN DOSSIER
// ============================================================

export function useDeleteClosingCase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            closingCaseId: string
        ) => deleteClosingCase(closingCaseId),

        onSuccess: async (
            _data,
            closingCaseId
        ) => {
            queryClient.removeQueries({
                queryKey:
                    closingKeys.detail(
                        closingCaseId
                    ),
            });

            await queryClient.invalidateQueries({
                queryKey: closingKeys.lists(),
            });

            toast.success(
                "Dossier closing supprimé."
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// ACTUALISER MANUELLEMENT LE MODULE
// ============================================================

export function useRefreshClosing() {
    const queryClient = useQueryClient();

    return async (): Promise<void> => {
        await queryClient.invalidateQueries({
            queryKey: closingKeys.all,
        });
    };
}