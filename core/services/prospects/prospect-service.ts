"use client"



import supabase from "@/core/lib/supabase";
import { ProspectFormValues } from "@/lib/validations/schema";
import { TProspects } from "@/core/types/prospects";
import { hasPermission } from "../permissions/permissions-service";
import { HeritageUser } from "@/core/types/profiles";

export type ExistingProspect = {
  id: string;
  phone: string;
  full_name: string | null;
};

/* // Récuperer tout les prospects
const getAllProspect = async (): Promise<TProspects[]> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Utilisateur non authentifié");
  }

  // Vérifie la permission
  const canViewAll = await hasPermission(
    user.id,
    "prospect.read.all"
  );

  let query = supabase
    .from("prospects")
    .select(`
      *,
      sites (
        nom_titre
      ),
      profiles!prospects_created_by_fkey (
        full_name,
        professional_email
      )
    `)
    .order("created_at", { ascending: false });

  // Si l'utilisateur n'a pas la permission,
  // il ne récupère que ses prospects.
  if (!canViewAll) {
    query = query.eq("created_by", user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}; */


const getAllProspect = async (): Promise<TProspects[]> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Utilisateur non authentifié");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("type_commercial")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const canViewAll = await hasPermission(
    user.id,
    "prospect.read.all"
  );

  let query = supabase
    .from("prospects")
    .select(`
      *,
      sites (
        nom_titre
      ),
      profiles!prospects_created_by_fkey (
        full_name,
        professional_email
      )
    `)
    .order("created_at", { ascending: false });

  // Qualification selon le type de commercial connecté.
  switch (profile.type_commercial) {
    case "call_center":
      query = query.in("qualification", ["H1", "H2", "H3"]);
      break;

    case "closing_visite":
      query = query.in("qualification", ["H4", "H5"]);
      break;

    // Autres profils : aucun filtre de qualification.
    default:
      break;
  }

  if (!canViewAll) {
    query = query.eq("created_by", user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

// Creer un prospect

const normalizePhone = (phone: string) => {
  return phone.replace(/\s+/g, "").trim();
};



const checkProspectPhone = async (
  phone: string,
  excludeId?: string
): Promise<ExistingProspect | null> => {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return null;
  }

  let query = supabase
    .from("prospects")
    .select("id, phone, full_name")
    .eq("phone", normalizedPhone);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Erreur vérification téléphone :", error);
    throw error;
  }

  return data;
};

const addProspect = async (
  prospectData: ProspectFormValues
) => {
  const normalizedPhone = normalizePhone(prospectData.phone);

  const existingProspect = await checkProspectPhone(normalizedPhone);

  if (existingProspect) {
    throw new Error(
      `Ce numéro existe déjà pour le prospect ${existingProspect.full_name ?? ""
      }.`
    );
  }

  const payload = {
    ...prospectData,
    phone: normalizedPhone,
  };

  const { data: prospect, error } = await supabase
    .from("prospects")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création du prospect :", error);
    throw error;
  }

  return prospect;
};


export async function searchProspectsByPhone(
  phone: string
): Promise<TProspects[]> {

  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .ilike("phone", `%${phone}%`)
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}


// prospect du street marketing de AOUT jusqua AUJOURDHUI
/* 
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
    }


   Filtre date (from)
  if (from) {
    query = query.gte("created_at", from);
  }
  /* 
    if (agence === 'yaounde') {
        query = query.eq("agence", agence)
    }

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
 */
//  Ajouter un prospect




// ajouter un corporate

/* const addCorporate = async (prospectData: TProspect) => {
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
}; */

// Modifier un corporate
const updateProspect = async ({
  id,
  prospectData,
}: {
  id: string;
  prospectData: ProspectFormValues;
}) => {
  const { data, error } = await supabase
    .from("prospects")
    .update(prospectData)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export async function deleteProspect(
    prospectId: string
): Promise<void> {
    const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", prospectId);

    if (error) {
        throw new Error(
            `Erreur lors de la suppression du prospect : ${error.message}`
        );
    }
}

/* const updateCorporate = async ({
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
}; */

//earch
/* 
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
}; */


export {
  getAllProspect,
  checkProspectPhone,
  addProspect,
  updateProspect,

}
