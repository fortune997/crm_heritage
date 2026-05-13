import supabase from "@/core/lib/supabase"
import { VisitFormValues } from "../lib/schema";
import { RapportVisitFormValues } from "../types/zod/zodSchema";

/* const fetchVisite = async () => {
    const { data, error } = await supabase.from('visites').select('*, prospects(*)').order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
} */

//  Fonction de récupération avec filtres
const fetchVisite = async (from?: string, to?: string) => {
  let query = supabase
    .from("visites")
    .select("*, prospects(*)")
    .order("date", { ascending: false });

  if (from) {
    query = query.gte("date", from);
  }

  if (to) {
    // best practice : < jour suivant
    const nextDay = new Date(to);
    nextDay.setDate(nextDay.getDate() + 1);

    query = query.lt("date", nextDay.toISOString().slice(0, 10));
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data;
};



// Tableau de visite effectuer par un prospect
const fetchVisiteProspectById = async (id: number) => {
  const { data, error } = await supabase
    .from("visites")
    .select("*, prospects(*, interaction_prospect_caline_house(*))")
    .eq("prospect", id);

  if (error) throw new Error(error.message);

  return data
};

const fetchVisiteById = async (id: string) => {
  const { data, error } = await supabase.from('visites').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

const statutVisiteLandService = async ({
  visitId,
  avisiter,
}: {

  visitId: number,
  avisiter: boolean
}) => {
  const { data, error } = await supabase
    .from("visites")
    .update({ avisiter: avisiter })
    .eq("id", visitId)

  if (error) throw new Error(error.message);
  return data;
  /*  if (error) {
     toast.error(
       `Impossible de ${newStatus === "confirmé" ? "confirmer" : "annuler"} la visite.`
     )
   } else {
     toast.success(
       `Visite ${newStatus === "confirmé" ? "confirmée" : "annulée"} avec succès.`
     )
   } */
};

const addVisite = async (dataVisite: VisitFormValues) => {
  const { data, error } = await supabase.from('visites').insert([
    {
      title: dataVisite.title,
      date: dataVisite.date,
      startTime: dataVisite.startTime,
      status: 'programmé',
      prospect: dataVisite.prospect_id,
      tarifTransport: dataVisite.tarifTransport,
      numberVisitor: dataVisite.numberVisitor,
      transportType: dataVisite.transportType,
      point_rencontre: dataVisite.point_rencontre
    }
  ]);
  if (error) throw new Error(error.message);
  return data;
}

const updateVisite = async ({ id, dataVisit }: { id: number, dataVisit: VisitFormValues }) => {
  const { data, error } = await supabase
    .from('visites')
    .update(dataVisit)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return data;
}

const updateVisiteRapport = async ({ id, dataRapportVisit }: { id: number, dataRapportVisit: RapportVisitFormValues }) => {
  const { data, error } = await supabase
    .from('visites')
    .update(dataRapportVisit)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

const fetchTotalVisites = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('visites')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count ?? 0; // On garantit que ça retourne toujours un nombre
};

// Récuperer le nombre de visites par leurs status
const fetchVisitesByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('visites')
    .select('*')
    .eq('status', status);

  if (error) throw new Error(error.message);
  return data;
};

const fetchVisitesProgrammee = () => fetchVisitesByStatus('programmé');
const fetchVisitesEnCours = () => fetchVisitesByStatus('en cours');
const fetchVisitesTerminer = () => fetchVisitesByStatus('terminer');
const fetchVisitesAnnulee = () => fetchVisitesByStatus('annulé');
const fetchVisitesManquer = () => fetchVisitesByStatus('manquer');


const deleteVisite = async (id: string) => {
  const { data, error } = await supabase.from('visites').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return data;
}


export {
  fetchVisite,
  fetchVisiteById,
  addVisite,
  updateVisite,
  fetchVisitesProgrammee,
  fetchVisitesEnCours,
  fetchVisitesTerminer,
  fetchVisitesAnnulee,
  statutVisiteLandService,
  fetchVisitesManquer,
  fetchTotalVisites,
  deleteVisite,
  updateVisiteRapport,
  fetchVisiteProspectById
}