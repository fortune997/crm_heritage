import { useQuery } from "@tanstack/react-query";
import supabase from "@/core/lib/supabase";

export const useSite = () => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sites").select("id, nom_titre, ville, quartier").order("nom_titre");
      if (error) throw error;
      return data || [];
    },
  });
};