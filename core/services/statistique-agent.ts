import supabase from "../lib/supabase"



export type Agent = {
  created_at: string;
  canal_prospection: string;
}[];

/**
 * @param id - identifiant de l'agent (created_by)
 * @param filterType - "week" | "month" | "all"
 */
export const fetchAllProspectCreated = async (id: string, filterType: "week" | "month" | "all" = "all") => {
  // Calcul des bornes temporelles selon le filtre
  const now = new Date();
  let startDate: string | null = null;

  if (filterType === "week") {
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay()); // début semaine (dimanche)
    startDate = firstDayOfWeek.toISOString();
  } else if (filterType === "month") {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate = firstDayOfMonth.toISOString();
  }

  // Requête Supabase
  let query = supabase
    .from("prospects")
    .select("created_at, canal_prospection")
    .eq("created_by", id);

  // Si un filtre temporel est actif, on le limite
  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};

