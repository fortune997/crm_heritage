import { toast } from "sonner";
import supabase from "../lib/supabase";
import { TLeadNumber } from "../types/type";

export const fetchLeads = async (

  role: string,
  commercialName: string,
  from?: Date,
  to?: Date
) => {

  const isCommercial =
    role === "Chargée commerciale" ||
    role === "Commercial" ||
    role === "Responsable Commerciale" ||
    role === "Responsable commerciale" ||
    role === "Customer Experience Manager";
  const isCallCenter = role === "Call Center";
  const isCommunicatrice = role === "Communicatrice";



  let query = supabase
    .from("prospects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })


  // Si commercial  filtrer seulement les prospects L5, L6
  if (isCommercial) {
    query = query
      .eq("chargee_clientele", commercialName)
      .in("statut_appel", ["L6", "L7", "L8"]);
  }
  // Si call center  filtrer seulement les niveaux L0, L1, L2, L3, L4
  else if (isCallCenter) {
    query = query.in("statut_appel", ["L0", "L1", "L2", "L3", "L4", "L5"]);
  }
  else if (isCommunicatrice) {
    query = query
      .eq("leads", true)

  }




  // Filtre date (from)
  if (from) {
    query = query.gte("created_at", from);
  }
  /* 
    if (agence === 'yaounde') {
        query = query.eq("agence", agence)
    } */

  // Filtre date (to)
  if (to) {

    query = query.lte("created_at", to.toISOString());
  }



  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data ?? []
};

export const fetchInteractionById = async (id: number) => {
  const { data, error } = await supabase
    .from('interaction_prospect_caline_house')
    .select('*')
    .eq('prospect_land_id', id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message)

  return data

}


export const addLead = async (prospectData: TLeadNumber) => {
  try {

    const { data: existingProspects, error: checkError } = await supabase
      .from('prospects')
      .select('id, nom, telephone, chargee_clientele') // Ajouter chargee_clientele ici
      .eq('telephone', prospectData.telephone);

    if (checkError) {
      toast.error(`Erreur lors de la vérification : ${checkError.message}`);
      return null;
    }


    if (existingProspects && existingProspects.length > 0) {
      const existingProspect = existingProspects[0]; // Take the first one


      let chargeeInfo = 'non attribué';
      if (existingProspect.chargee_clientele) {

        chargeeInfo = existingProspect.chargee_clientele;
      }

      toast.warning(`Le numéro "${prospectData.telephone}" existe déjà (${existingProspect.nom || 'sans nom'}) et est suivi par ${chargeeInfo}.`);
      return null;
    }

    // 2. Insertion
    const { data, error } = await supabase
      .from('prospects')
      .insert([prospectData])
      .select();

    if (error) {
      toast.error(`Erreur lors de l'ajout : ${error.message}`);
      return null;
    }

    toast.success('Prospect ajouté avec succès !');
    return data;
  } catch (err) {
    toast.error(`Une erreur est survenue : ${err}`);
    return null;
  }
};

export const assignerNumero = async (id: number, chargee_clientele: string) => {
  const { data, error } = await supabase
    .from('prospects')
    .update({ chargee_clientele })
    .eq('id', id)

  if (error) throw new Error(error.message);
  return data;
}

// Nombre de Leads par mois
export const fetchLeadsCountMonth = async (year: number) => {
  const { data, error } = await supabase.from('monthly_leads_stats').select('*').eq('year', year)
  if (error) throw new Error(error.message);
  return data;
}