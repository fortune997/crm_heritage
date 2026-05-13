// hooks/useCategorie.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TCategorie, TUserCalineHouse } from "@/core/types/calineTypes";
import { deleteProprietaire, fetchProprietaire, fetchProprietaireById, updateProprietaire } from "../services/proprietaire-service";

export const useProprietaire = () => {
  return useQuery<TUserCalineHouse[]>({
    queryKey: ["proprietaires"],
    queryFn: fetchProprietaire,
  });
};

export const useEmployeById = (proprietaireId: string) => {
    return useQuery<TUserCalineHouse>({
        queryKey: ['users_caline_house'],
        queryFn: () => fetchProprietaireById(proprietaireId),

    });
};

export const useProprioById = (proprietaireId: string) => {
  return useQuery<TUserCalineHouse>({
      queryKey: ['users_caline_house'],
      queryFn: () => fetchProprietaireById(proprietaireId),

  });
};

export const useUpdateProprietaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUserCalineHouse }) =>
      updateProprietaire({id: id, userData: data}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proprietaires"] });
    },
  });
};

export const useDeleteProprietaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProprietaire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proprietaires"] });
    },
  });
};
