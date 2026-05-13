// hooks/useCategorie.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tbail_locataire,  TUserCalineHouse } from "@/core/types/calineTypes";
import { deleteLocataire, fetchBailLocataire, fetchLocataire, fetchLocataireById, fetchLocataireDetailQRCode, fetchPaiementCalineHouse, updateLocataire } from "../services/locataire-service";
import { TCreatePaiementDB } from "../services/paiement-service";

export const useLocataire = () => {
  return useQuery<TUserCalineHouse[]>({
    queryKey: ["locataires"],
    queryFn: fetchLocataire,
  });
};

export const usePaiementCaline = () => {
  return useQuery<TCreatePaiementDB[]>({
    queryKey: ["paiement_caline"],
    queryFn: fetchPaiementCalineHouse,
  });
};

export const useLocataireBail = () => {
  
  return useQuery<Tbail_locataire[]>({
    queryKey: ["bail_caline_house"],
    queryFn:  fetchBailLocataire
    
  });
};

export const useLocataireBailId = (id: number) => {
  
  return useQuery<Tbail_locataire>({
    queryKey: ["bail_caline_house", id],
    queryFn: ()=> fetchLocataireById(id)
    
  });
};

export const useUpdateLocataire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUserCalineHouse }) =>
      updateLocataire({id: id, userData: data}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locataires"] });
    },
  });
};

export const useLocataireByIdQRCode = (id: string) => {

  return useQuery<TUserCalineHouse>({
    queryKey: ["locataires", id],
    queryFn: () =>  fetchLocataireDetailQRCode(id),
  });
};

export const useDeleteLocataires = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLocataire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locataires"] });
    },
  });
};
