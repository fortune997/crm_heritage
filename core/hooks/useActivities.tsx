import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAcitvities, newActivities } from "../services/activities-service";
import { TActivities } from "../types/type";
import { toast } from "sonner";

export const useAcitivities = () => {
  return useQuery<TActivities[]>({
      queryKey: ['activites'],
      queryFn: () => fetchAcitvities(),
     
  });
};

export const useNewAcitivities = () => {

    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: newActivities,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activites"] });
        toast.success("✅ Nouvelle activité !");
      },
      onError: (error: any) => {
        toast.error(`❌ ${error.message || "Erreur inconnue."}`);
      },
    });
  };