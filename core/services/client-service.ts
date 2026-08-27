import supabase from "@/core/lib/supabase";


export const searchAllClient = async (term: string) => {
  if (!term.trim()) {
    return [];
  }

  let query = supabase
    .from("clients")
    .select("*, prospects(*)")
    .ilike("prospects.telephone", `%${term}%`);

  const { data, error } = await query;
  if (error) {
    console.error("Search error:", error);
    throw new Error(error.message);
  }
  return data || [];
};
