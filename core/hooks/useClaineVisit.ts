import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  TCategorie, VisitHourCaline } from "../types/calineTypes";
import { createVisiteCalineHouse, fetchVisite, fetchVisitesForCalendar, rapportFinVisiteCalinHouse } from "../services/visite-caline-service";
import { toast } from "sonner";
import { TFormSchemaCreateVisit } from "../types/zod/zodSchema";




export const useVisiteCaline = () => {
    return useQuery<VisitHourCaline[]>({
        queryKey: ['visites'],
        queryFn: fetchVisite,
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

export const useRapportVisiteCaline = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: rapportFinVisiteCalinHouse,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["visites_rapport"] });
        toast.success("✅ Rapport envoyé");
      },
      onError: (error: any) => {
        toast.error(`❌ ${error.message || "Erreur inconnue lors de l'envoi."}`);
      },
    });
  };
  


export const useVisiteCalineForCalendar = (startDate: string, endDate: string) => {
    return useQuery<VisitHourCaline[]>({
        queryKey: ['visites', startDate, endDate],
        queryFn: () => fetchVisitesForCalendar(startDate,endDate ),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // gcTime: 1000 * 60 * 60 * 24,
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // retry: 1,
    });
};

export const useCreateVisitCaline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TFormSchemaCreateVisit) => createVisiteCalineHouse(data),
    onSuccess: () => {
      toast.success('Visite créer avec succes')
      queryClient.invalidateQueries({ queryKey: ["visites"] });
    },

    onError: (error) => {
      toast.error(`❌ ${error.message || "Erreur inconnue lors de la création."}`);
      
    },
  });
};



