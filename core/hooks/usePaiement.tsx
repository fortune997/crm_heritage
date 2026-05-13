import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TPaiements } from "../types/calineTypes";
import { AjoutPaiementEnEspece, paiementInfos } from "../services/paiement-service";
import { toast } from "sonner";


export const usePaiement = (id: number) => {
  return useQuery<TPaiements>({
      queryKey: ['logement_payer', id],
      queryFn: () => paiementInfos(id),

  });
};

export const useAllPaiementByBail= (bail_id: number) => {
  return useQuery<TPaiements>({
      queryKey: ['paiement_bail', bail_id],
      queryFn: () => paiementInfos(bail_id),

  });
};




export const useAjoutPaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AjoutPaiementEnEspece,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ajout_logement_payer"] });
      toast.success("✅ Paiement réalisé avec succès !");
    },
    onError: (error: any) => {
      toast.error(`❌ ${error.message || "Erreur inconnue lors de la création."}`);
    },
  });
};