
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addLead, assignerNumero, fetchInteractionById, fetchLeads, fetchLeadsCountMonth } from "../services/lead-sevice";
import { TInteraction } from "../types/type";
import { MonthlyStatsLead } from "../services/pointages/admin.service";


const useLeadsData = (

  role: string, commercialName: string,
  from?: Date,
  to?: Date
) => {
  return useQuery({
    queryKey: ["prospects", commercialName, role, from?.toISOString(), to?.toISOString()],
    queryFn: () => fetchLeads(role, commercialName!, from, to),
    enabled: !from && !to,
    placeholderData: keepPreviousData,
  });
};



export const useFetchLeadInteractionById = (id: number) => {
  return useQuery<TInteraction[]>({
    queryKey: ["interaction", id],
    queryFn: () => fetchInteractionById(id),
  });
};

const useAddLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLead,
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
      toast.error("Erreur lors de l'enregistrement du lead : " + error.message);
    }
  });
};

const useAttribuerLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, chargee_clientele }: { id: number; chargee_clientele: string }) =>
      assignerNumero(id, chargee_clientele),
    onMutate: () => {
      const toastId = toast.loading("Enregistrement en cours...");
      return { toastId };
    },
    onSuccess: (_, variables, context) => {
      toast.dismiss(context?.toastId);
      toast.success("Lead attribué avec succès!");
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
    onError: (error, variables, context) => {
      toast.dismiss(context?.toastId);
      toast.error("Erreur lors de l'enregistrement du lead : " + error.message);
    }
  });
};

const useLeadsStats = (year: number) => {
  return useQuery<MonthlyStatsLead[]>({
    queryKey: ["count_chart", year],
    queryFn: () => fetchLeadsCountMonth(year),
  });
};



export { useAddLead, useLeadsData, useAttribuerLead, useLeadsStats }