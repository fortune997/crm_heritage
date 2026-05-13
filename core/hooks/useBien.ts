import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBien, suppressionProprieteAvecMedia, createBien, fetchBienById, addMediaToBien, updateProperty, fetchBiensVisiteLocataireCountMonth } from "@/core/services/bien-service";
import { TBiens } from "@/core/types/calineTypes";
import { toast } from "sonner";

type MonthlyStats = {
  year: number;
  month_num: number;
  month: string;
  visite_caline_house: number;
  bail_locataire: number;
  biens: number;
  total: number;
};


export const useBien = () => {
  return useQuery<TBiens[]>({
    queryKey: ["biens"],
    queryFn: fetchBien,
  });
};

export const useBiensVisites  = (year: number) => {
  return useQuery<MonthlyStats[]>({
    queryKey: ["count_chart", year],
    queryFn: () => fetchBiensVisiteLocataireCountMonth(year),
  });
};

export const useBienById = (id: string) => {
  return useQuery<TBiens>({
    queryKey: ["biens", id],
    queryFn: () => fetchBienById(id),
  });
};

export const useCreateBien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBien,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      toast.success("✅ Liste des biens mise à jour !");
    },
    onError: (error: any) => {
      toast.error(`❌ ${error.message || "Erreur inconnue lors de la création."}`);
    },
  });
};

export const useUpdateBien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      toast.success("✅ Propriété mise à jour !");
    },
    onError: (error: any) => {
      toast.error(`❌ ${error.message || "Erreur inconnue lors de la mise a jour."}`);
    },
  });
};


export const useAddVirtualGalerie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMediaToBien,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      toast.success("✅ Galerie mise à jour !");
    },
    onError: (error: any) => {
      toast.error(`❌ ${error.message || "Erreur lors de l'ajout de la galerie."}`);
    },
  });
};


export const useDeleteBien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => suppressionProprieteAvecMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
};
