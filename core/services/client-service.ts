import supabase from "@/core/lib/supabase";
import { TClient } from "../types/type";
import { toast } from "sonner";


// Récuperer tout les daily
export const fetchClient = async (role?: string, commercialName?: string) => {

  let query = supabase
    .from("clients")
    .select("*,prospects(*), vente_land(*) ", { count: "exact" })
    .order("created_at", { ascending: false })


  const isCommercial = role === "Commercial" || role === "Chargée commerciale";

  // Ajout d'un filtre si c’est un commercial
  if (isCommercial && commercialName) {
    query = query.contains(
      "dailies.prospects.chargee_clientele",
      commercialName
    );
  }


  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? []
};

export const fetchClientById = async (clientId: string) => {
  if (!clientId) return null;
  const { data, error } = await supabase
    .from("clients")
    .select("*, prospects(*)")
    .eq("id", clientId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const addClient = async (clientData: TClient) => {
  try {
    // Vérifier si le client existe déjà par son ID
    const { data: existingClient, error: findError } = await supabase
      .from("clients")
      .select("*")
      .eq("prospect_id", clientData.prospect_id)
      .limit(1); // Limiter la requête à 1 client pour éviter de retourner plusieurs clients

    if (findError) {
      toast.error("Erreur lors de la vérification de l'existence du client.");
      throw new Error(findError.message);
    }

    if (existingClient && existingClient.length > 0) {
      return { success: false, message: "Ce client existe déjà." };
    }

    // Ajouter le client si l'ID n'existe pas
    const { data: clientReturn, error } = await supabase
      .from("clients")
      .insert([clientData])
      .select()
      .single();

    if (error) {
      toast.error("Erreur lors de l'ajout du client.");
      throw new Error(error.message);
    }


    toast.success("Client ajouté avec succès !");

    // Retourner la réponse sous forme d'objet avec success et message
    return { clientReturn, message: "Client ajouté avec succès !" };
  } catch (err) {
    console.error(err);
    toast.error("Une erreur est survenue lors de l'ajout du client.");
    return { success: false, message: "Erreur technique" };
  }
};

export const updateClient = async ({
  id,
  clientData,
}: {
  id: string;
  clientData: TClient;
}) => {
  const { data, error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export const deleteClientById = async (id: string) => {
  const { data, error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    if (error.message.includes("violates foreign key constraint")) {
      // Cas spécifique : Client lié à des recouvrements
      return {
        success: false,
        message:
          "Impossible de supprimer ce client car il est lié à des recouvrements.",
      };
    }

    // Cas général pour d'autres erreurs
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la suppression du client : " +
        error.message,
    };
  }

  return {
    success: true,
    data,
    message: "Client supprimé avec succès.",
  };
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

export const fetchTotalClient = async (
  role: string,
  commercialName?: string
): Promise<number> => {
  let query = supabase
    .from("clients")
    .select("*", { count: "exact" });

  if (isCommercialRole(role) && commercialName) {
    query = query.eq("dailies.prospects.chargee_clientele", commercialName);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
};

// all cclient 
export const ToutClients = async () => {
  const { data, error } = await supabase
    .from("clients")
    .select("*, prospects(*)");


  if (error) throw new Error(error.message);
  return data;
};



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
