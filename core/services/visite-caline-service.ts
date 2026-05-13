import { toast } from "sonner";
import supabase from "../lib/supabase";
import { TVisite } from "../types/calineTypes";
import { TFormSchemaCreateVisit } from "@/core/types/zod/zodSchema";


const fetchVisite = async () => {
    const { data, error } = await supabase.from('visite_caline_house')
    .select('*, biens(titre, localisation(*), categorie_bien(*), charge_commercial(*) ), users_caline_house(*)')
    .order("created_at", { ascending: false }) 
    if (error) throw new Error(error.message);
    return data
};

import { parse } from "date-fns";

const fetchVisitesForCalendar = async (startDate: string, endDate: string) => {
  // Récupération brute sans filtre côté SQL (car date_visite est string)
  const { data, error } = await supabase
    .from("visite_caline_house")
    .select(`
      *,
      biens(titre, localisation(*), categorie_bien(*), charge_commercial(*)),
      users_caline_house(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Filtrage JS côté client avec conversion date_visite string -> Date
  const filtered = data?.filter((item) => {
    if (!item.date_visite) return false;

    // parse la date_visite au format dd/MM/yyyy
    const parsedDate = parse(item.date_visite, "dd/MM/yyyy", new Date());

    // Retourne true si la date_visite est entre start et end inclus
    return parsedDate >= start && parsedDate <= end;
  });

  return filtered;
};

  

const statutVisiteCalinHouse = async ({
  visitId,
  newStatus,
}: {
  newStatus: string
  visitId: number,
  avisiter? : boolean
}) => {
  const { error } = await supabase
    .from("visite_caline_house")
    .update({ status_visite: newStatus })
    .eq("id", visitId)

  if (error) {
    toast.error(
      `Impossible de ${newStatus === "confirmé" ? "confirmer" : "annuler"} la visite.`
    )
  } else {
    toast.success(
      `Visite ${newStatus === "confirmé" ? "confirmée" : "annulée"} avec succès.`
    )
  }
};

 const rapportFinVisiteCalinHouse = async ({
  visitId,
  data,
}: {
  data: { rapport_visite: string; note: string };
  visitId: number;
}) => {
  const { error } = await supabase
    .from("visite_caline_house")
    .update({ ...data }) 
    .eq("id", visitId);

  if (error) {
    throw new Error("Erreur Supabase : " + error.message);
  }
};



const createVisiteCalineHouse = async (formData: TFormSchemaCreateVisit) => {
    const { data, error } = await supabase.from('visite_caline_house').insert(formData).select();
    if (error) throw new Error(error.message);
    return data
}

export {
    fetchVisite,
    createVisiteCalineHouse,
    statutVisiteCalinHouse,
    fetchVisitesForCalendar,
    rapportFinVisiteCalinHouse
}