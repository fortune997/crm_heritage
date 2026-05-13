import supabase from "../lib/supabase";


type TitreFoncier = {
  titre_foncier: string;
  statut: boolean;
  created_at?: string;
}

//  Fonction de récupération des titres fonciers
export const fetchTitreFoncier = async () => {
  const  { data, error   } = await supabase
    .from("titre_foncier")
    .select("*");

  if (error) throw new Error(error.message);
  return data as TitreFoncier[];
};
