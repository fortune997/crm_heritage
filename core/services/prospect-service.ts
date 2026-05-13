import { toast } from "sonner";
import { TPCorporate, TProspect } from "../types/type";
import supabase from "@/core/lib/supabase";


// Récuperer tout les prospects
// Récupérer les prospects avec filtre optionnel sur date
const fetchProspect = async (
  role: string,
  commercialName?: string,
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

  // Vérifier si c'est Obama (insensible à la casse)
  const isObama = commercialName?.toLowerCase() === "obama";

  let query = supabase
    .from("prospects")
    .select("*, interaction_prospect_caline_house(*), sites(*), clients(*)", { count: "exact" })
    .order("created_at", { ascending: false })

  // Si c'est un commercial MAIS PAS Obama, filtrer seulement ses prospects
  if (isCommercial && !isObama) {
    query = query.eq("chargee_clientele", commercialName)
  }
  // Si c'est Obama (responsable commercial avec droits spéciaux), PAS de filtre sur chargee_clientele

  // Si call center, filtrer seulement les niveaux L0, L1, L2, L3, L4
  else if (isCallCenter) {
    query = query.in("statut_appel", ["L0", "L1", "L2", "L3", "L4", "L5"]);
  }

  // Filtre date (from)
  if (from) {
    query = query.gte("created_at", from);
  }

  // Filtre date (to)
  if (to) {
    query = query.lte("created_at", to.toISOString());
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data ?? [];
};


// prospect du street marketing de AOUT jusqua AUJOURDHUI

export const fetchStreetMarketingProspects = async (

) => {


  // 📆 Dates : Août → Aujourd’hui
  const startOfAugust = new Date(new Date().getFullYear(), 12, 1); // mois 7 = Août
  const today = new Date(new Date().getFullYear(), 12, 31)


  let query = supabase
    .from("prospects")
    .select('*', { count: "exact" })
    .eq("created_by", "cead11b7-2ee8-49b2-a882-6fb5fd02cdb8")
  //.eq("canal_prospection", "Street marketing")
  // .eq("statut_appel", "L8" ) 
  //.gte("created_at", startOfAugust.toISOString())
  //.lte("created_at", today.toISOString())







  const { data, error, count } = await query;

  if (error) {
    console.error("Erreur Street Marketing:", error.message);
    throw new Error(error.message);
  }

  return {
    data,
    count,
  };
};


// prospects ndjangui Land

const fetchProspectNdjangui = async (
  from?: Date,
  to?: Date
) => {


  let query = supabase
    .from("prospects")
    .select("*, sites(*), clients(*)", { count: "exact" })
    .eq("services", "ndjangui land")
    .order("created_at", { ascending: false })


  // Filtre date (from)
  if (from) {
    query = query.gte("created_at", from);
  }

  // Filtre date (to)
  if (to) {

    query = query.lte("created_at", to.toISOString());
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data ?? []
};



// verifier si un numero existe 

const checkPhone = async (number: string) => {
  const { data, error } = await supabase
    .from("prospects")
    .select("id")
    .eq("telephone", number)
    .maybeSingle();

  if (error) throw new Error(error.message)

  return !!data;

};

export const testNumber = async () => {
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("telephone", "690343570")


  if (error) throw new Error(error.message)

  return data;
};


//Récupérer les prospects des visites
const fetchProspectVisite = async () => {

  const { data, error } = await supabase
    .from("prospects")
    .select("*, interaction_prospect_caline_house(*), sites(*)")
    .in("statut_appel", ["L0", "L1", "L2", "L3", "L4", "L5", "L6"])
    .order("created_at", { ascending: false })
    .range(0, 5000);
  if (error) throw new Error(error.message);
  return data || [];
};



//Récupérer les prospects L7 valide pour etres clients
const fetchProspectL7 = async () => {

  const { data, error } = await supabase
    .from("prospects")
    .select("*, interaction_prospect_caline_house(*), sites(*)")
    .eq("statut_appel", "L8")
    .order("created_at", { ascending: false })
    .range(0, 5000);
  if (error) throw new Error(error.message);
  return data || [];
};

//Récupérer les prospects L8 valide pour etres clients
const fetchProspectL8 = async () => {
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("statut_appel", "L8")
    .order("created_at", { ascending: false })
    .range(0, 5000);
  if (error) throw new Error(error.message);
  return data || [];
};


const fetchCorporate = async (
  role: string,
  commercialName: string,
  type: string,
  from?: Date,
  to?: Date,

) => {
  // Calcul de la plage pour Supabase

  let query = supabase
    .from("prospects")
    .select("*, sites(*) ", { count: "exact" })
    .eq("corporate", true)
    .eq("categorie_corporate", type)
    .order("created_at", { ascending: false })


  // Filtrage selon le rôle
  if (role === "Responsable Commerciale" || role === "Chargée commerciale") {
    query = query.eq("chargee_clientele", commercialName);
  } else if (role === "Responsable Commerciale" || role === "Chargée commerciale") {
    // Le responsable voit tout le monde, mais tu peux aussi filtrer par équipe si besoin
    query = query.not("chargee_clientele", "is", null);
  }


  /*   if (globalFilter && globalFilter.trim() !== "") {
      query.or(`nom.ilike.%${globalFilter}%,telephone.ilike.%${globalFilter}%`);
    } */


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

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);
  return data ?? []
};



const fetchProspectByNom = async (role: string, commercialName: string) => {
  const isCommercial =
    role === "Chargée commerciale" ||
    role === "Commercial" ||
    "Responsable Commerciale";
  const isCallCenter = role === "Call Center";

  let query = supabase
    .from("prospects")
    .select("*, interaction_prospect_caline_house(*)")
    .not("sexe", "is", null)
    .order("created_at", { ascending: false })
    .range(0, 5000);

  // Si commercial ou chargé commercial → seulement les prospects qu'ils ont créés

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
};

//  Récupérer un prospect grâce à son id
const fetchProspectById = async (prospectId: string) => {
  if (!prospectId) return null;
  const { data, error } = await supabase
    .from("prospects")
    .select("*, sites(*), clients(*) ")
    .eq("id", prospectId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

//  Récupérer un prospect grâce à son id
const fetchProspectByIdL7L8 = async (prospectId: string) => {
  if (!prospectId) return null;
  const { data, error } = await supabase
    .from("prospects")
    .select("*, clients(*) ")
    .eq("id", prospectId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const isCommercialRole = (role: string) => {
  const commercialRoles = [
    "Commerciale",
    "Chargée Commerciale",
    "Responsable Commerciale",
    "Responsable Produit",
  ];
  return commercialRoles.includes(role);
};

const fetchTotalProspect = async (
  role: string,
  commercialName?: string
): Promise<number> => {
  let query = supabase.from("prospects").select("*", { count: "exact" });

  if (isCommercialRole(role) && commercialName) {
    query = query.eq("chargee_clientele", commercialName);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
};

const fetchTotalInterestProspect = async (
  role: string,
  commercialName?: string
): Promise<number> => {
  let query = supabase
    .from("dailies")
    .select("*", { count: "exact" })
    .eq("statut_appel", "intéréssé");

  if (isCommercialRole(role) && commercialName) {
    query = query.eq("chargee_clientele", commercialName);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
};

const fetchTotalProspectsByStatus = async (
  role: string,
  status: string,
  commercialName?: string
): Promise<number> => {
  let query = supabase
    .from("dailies")
    .select("*", { count: "exact" })
    .eq("statut_appel", status);

  if (isCommercialRole(role) && commercialName) {
    query = query.eq("chargee_clientele", commercialName);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
};

// ✅ Alias avec rôles
const fetchTotalNonContactedProspects = (
  role: string,
  commercialName?: string
) =>
  fetchTotalProspectsByStatus(role, "prospects non contacter", commercialName);

const fetchTotalUnavailableProspects = (
  role: string,
  commercialName?: string
) => fetchTotalProspectsByStatus(role, "indisponible", commercialName);

const fetchTotalUninterestedProspects = (
  role: string,
  commercialName?: string
) => fetchTotalProspectsByStatus(role, "prospect inintéressé", commercialName);

const fetchTotalBusyProspects = (role: string, commercialName?: string) =>
  fetchTotalProspectsByStatus(role, "occupé", commercialName);

const fetchTotalWantMoreInfoProspects = (
  role: string,
  commercialName?: string
) => fetchTotalProspectsByStatus(role, "en savoir plus", commercialName);

const fetchTotalInterestedProspects = (role: string, commercialName?: string) =>
  fetchTotalProspectsByStatus(role, "intéréssé", commercialName);

const fetchTotalNetworkIssuesProspects = (
  role: string,
  commercialName?: string
) => fetchTotalProspectsByStatus(role, "réseau perturbé", commercialName);

//  Ajouter un prospect

const addProspect = async (prospectData: TProspect) => {
  try {
    // 1. Vérification si le numéro existe déjà
    const { data: existingProspect, error: checkError } = await supabase
      .from("prospects")
      .select("id")
      .eq("telephone", prospectData.telephone) // Vérifie le numéro exact
      .limit(1)
      .maybeSingle();

    if (checkError) {
      toast.error(`Erreur lors de la vérification : ${checkError.message}`);
      return null;
    }

    if (existingProspect) {
      toast.warning(
        `Le numéro "${prospectData.telephone}" est déjà enregistré.`
      );
      return null;
    }

    // 2. Insertion si pas de doublon
    const { data, error } = await supabase
      .from("prospects")
      .insert([prospectData]);

    if (error) {
      toast.error(`Erreur lors de l'ajout : ${error.message}`);
      return null;
    }

    toast.success("Prospect ajouté avec succès !");
    return data;
  } catch (err) {
    toast.error(`Une erreur est survenue : ${err}`);
    return null;
  }
};

const addPetitProspect = async (corporateData: TPCorporate) => {
  try {
    // 1. Vérification si le numéro existe déjà
    const { data: existingProspect, error: checkError } = await supabase
      .from("prospects")
      .select("id")
      .eq("telephone", corporateData.telephone) // Vérifie le numéro exact
      .limit(1)
      .maybeSingle();

    if (checkError) {
      toast.error(`Erreur lors de la vérification : ${checkError.message}`);
      return null;
    }

    if (existingProspect) {
      toast.warning(
        `Le numéro "${corporateData.telephone}" est déjà enregistré.`
      );
      return null;
    }

    // 2. Insertion si pas de doublon
    const { data, error } = await supabase
      .from("prospects")
      .insert([corporateData])
      .select("*")
      .single()

    if (error) {
      toast.error(`Erreur lors de l'ajout : ${error.message}`);
      return null;
    }

    toast.success("Corporate ajouté avec succès !");
    return data;
  } catch (err) {
    toast.error(`Une erreur est survenue : ${err}`);
    return null;
  }
};

// ajouter un corporate

const addCorporate = async (prospectData: TProspect) => {
  try {
    // 1. Vérification si le numéro existe déjà
    const { data: existingProspect, error: checkError } = await supabase
      .from("prospects")
      .select("id")
      .eq("telephone", prospectData.telephone) // Vérifie le numéro exact
      .limit(1)
      .maybeSingle();

    if (checkError) {
      toast.error(`Erreur lors de la vérification : ${checkError.message}`);
      return null;
    }

    if (existingProspect) {
      toast.warning(
        `Le numéro "${prospectData.telephone}" est déjà enregistré.`
      );
      return null;
    }

    // 2. Insertion si pas de doublon
    const { data, error } = await supabase
      .from("prospects")
      .insert([prospectData]);

    if (error) {
      toast.error(`Erreur lors de l'ajout : ${error.message}`);
      return null;
    }

    toast.success("Prospect ajouté avec succès !");
    return data;
  } catch (err) {
    toast.error(`Une erreur est survenue : ${err}`);
    return null;
  }
};

// Modifier un corporate
const updateProspect = async ({
  id,
  prospectData,
}: {
  id: string;
  prospectData: TProspect;
}) => {
  const { data, error } = await supabase
    .from("prospects")
    .update(prospectData)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

const updateCorporate = async ({
  id,
  corporateData,
}: {
  id: number;
  corporateData: TPCorporate;
}) => {
  const { data, error } = await supabase
    .from("prospects")
    .update(corporateData)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

const updateStatutProspect = async ({
  id,
  statut_appel,
}: {
  id: number;
  statut_appel: string;
}) => {
  const { data, error } = await supabase
    .from("prospects")
    .update({ statut_appel })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

const updateDescriptionProspect = async ({
  id,
  description,
}: {
  id: string;
  description: string;
}) => {
  const { data, error } = await supabase
    .from("prospects")
    .update({ description })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

// Supprimer un prospect grâce à son id
const deleteProspectById = async (prospectId: string) => {
  const { data, error } = await supabase
    .from("prospects")
    .delete()
    .eq("id", prospectId);
  if (error) throw new Error(error.message);
  return data;
};

// Nombre de prospect par mois
const fetchProspectCountMonth = async () => {
  const { data, error } = await supabase
    .from("prospects_per_month")
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

//earch

interface SearchProspectParams {
  name?: string;
  phone?: string;
}

const searchProspects = async (term: string) => {
  let query = supabase.from("prospects").select("*")

  if (term) {
    query = query.ilike("telephone", `%${term}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};


const searchProspectsForClient = async (term: string) => {
  let query = supabase.from("prospects").select("*").in("statut_appel", ["L5", "L6", "L7", "L8"]);

  if (term) {
    query = query.ilike("telephone", `%${term}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};


export {
  fetchProspect,
  fetchProspectById,
  fetchTotalProspect,
  fetchTotalProspectsByStatus,
  fetchTotalInterestProspect,
  fetchTotalNonContactedProspects,
  fetchTotalUnavailableProspects,
  fetchTotalUninterestedProspects,
  fetchCorporate,
  fetchProspectByNom,
  fetchTotalBusyProspects,
  fetchTotalWantMoreInfoProspects,
  fetchTotalInterestedProspects,
  fetchTotalNetworkIssuesProspects,
  addProspect,
  updateProspect,
  deleteProspectById,
  fetchProspectCountMonth,
  addCorporate,
  updateDescriptionProspect,
  updateStatutProspect,
  fetchProspectL7,
  fetchProspectL8,
  fetchProspectVisite,
  addPetitProspect,
  updateCorporate,
  searchProspects,
  checkPhone,
  searchProspectsForClient,
  fetchProspectNdjangui
}
