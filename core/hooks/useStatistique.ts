import { useQuery } from "@tanstack/react-query";
import { fetchAllProspectCreated } from "../services/statistique-agent";


type Agent ={
  created_at: string;
  canal_prospection: string;
}[]

export const useStatistique = (id: string, filterType: "week" | "month" | "all" = "all") => {
  return useQuery<Agent>({
    queryKey: ["statistique", id, filterType],
    queryFn: () => fetchAllProspectCreated(id, filterType),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24h
  });
};