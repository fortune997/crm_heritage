import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAcitvities, fetchAcitvitiesByID, fetchAcitvitiesProgramme, fetchActivityFollowUps, newActivities, updateActivity, updateActivityStatus } from "../services/activites/activities-service";
import { toast } from "sonner";

export type UpdateActivityStatusInput = {
    id: string;
    statut_activite: string,
    description: string
};

export const ACTIVITIES_QUERY_KEY = ["prospect_activities"] as const;

export const useAcitivities = () => {
  return useQuery({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: () => fetchAcitvities(),

  });
};


 const useAcitivitiesFollowUp = (id: string, type_commercial: string) => {
  return useQuery({
    queryKey: [
    "prospect-activities",
    id,
    type_commercial,
  ],
  queryFn: () => fetchAcitvitiesProgramme(type_commercial),
  

  });
};


const useCreateProspectActivity = () => {

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newActivities,
    onSuccess: (payload) => {
      toast.success(
        "Activité créée avec succès",
        {
          description:
            "L'activité a été ajoutée au suivi du prospect.",
        }
      );
      queryClient.invalidateQueries({
        queryKey: ACTIVITIES_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: ACTIVITIES_QUERY_KEY,
      });

    },
    onError: (error) => {

      toast.error(
        "Erreur lors de la création",
        {
          description:
            error.message,
        }
      );
      console.error(
        "Erreur création activité :",
        error
      );
    },

  });
}


const useUpdateProspectActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      toast.success(
        "Activité mise à jour avec succès",
        {
          description:
            "Le traitement de l'activité a été enregistré.",
        }
      );
      queryClient.invalidateQueries({
        queryKey: ACTIVITIES_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error(
        "Erreur lors de la mise à jour",
        {
          description:
            error.message,
        }
      );
      console.error(
        "Erreur mise à jour activité :",
        error
      );
    },
  });
};

 const useUpdateProspectActivityStatus = (
  
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateActivityStatusInput) =>
      updateActivityStatus(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "prospect-activities"
        ],
      });

      toast.success("Activité mise à jour avec succès", {
        description: "Le traitement de l’activité a été enregistré.",
      });
    },

    onError: (error: Error) => {
  toast.error("Erreur lors de la mise à jour", {
    description: error.message,
  });

  console.error("Erreur mise à jour activité :", error);
},
  });
};

const  useActivityFollowUps=() =>{
    return useQuery({
        queryKey: ["activity-follow-ups"],
        queryFn: fetchActivityFollowUps,
        staleTime: 30_000,
        refetchInterval: 60_000,
        refetchOnWindowFocus: true,
    });
}

const useProspectActivitiesByID = (id: string) => {
    return useQuery({
        queryKey: ["prospect_activities", id],
        queryFn: () => fetchAcitvitiesByID(id),
        placeholderData: keepPreviousData,

    });
};

export {
  useCreateProspectActivity,
  useUpdateProspectActivity,
  useActivityFollowUps,
  useProspectActivitiesByID,
  useAcitivitiesFollowUp,
  useUpdateProspectActivityStatus
}