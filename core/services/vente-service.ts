
import supabase from "@/core/lib/supabase";
import { TVente } from "../types/type";
import { toast } from "sonner";

// Récuperer toutes les ventes
const fetchVentes = async () => {
  const { data, error } = await supabase
    .from("vente_land")
    .select("*, clients(*, prospects(*))");
  if (error) throw new Error(error.message);
  return data;
};

// //

export const fetchPaiementTotal = async (venteId: number) => {
  const { data, error } = await supabase
    .from("paiement_recouvrement")
    .select("montant_recu")
    .eq("source_id", venteId);

  if (error) throw new Error(error.message);

  return data

};

// client associe a la vente

export const fetchClientVenteTotal = async (client_id: number) => {
  const { data, error } = await supabase
    .from("vente_land")
    .select("*")
    .eq("client_id", client_id);

  if (error) throw new Error(error.message);

  return data

};

export const fetchpaiementAll = async () => {
  const { data, error } = await supabase
    .from("paiement_recouvrement")
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

//Toute les paiement d'une vente
const fetchpaiement = async (id: number) => {

  const { data, error } = await supabase
    .from("paiement_recouvrement")
    .select("*")
    .eq("source_id", id)


  if (error) throw new Error(error.message);
  return data ?? [];
};

//  Récupérer un recouvrement grâce à son id
const fetchVenteById = async (venteID: number) => {
  const { data, error } = await supabase
    .from("vente_land")
    .select("*, clients(*, prospects(*) )")
    .eq("id", venteID)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

//  Récupérer un vente grâce à son id
const fetchById = async (id: number) => {
  const { data, error } = await supabase
    .from("vente_land")
    .select("*, clients(*, prospects(*, terrain(ville, titre) ))")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data ?? [];
};

//  Récupérer

export const updateDocument = async (
  {
    id,
    field,
    value,
  }: {
    id: number;
    field: string;
    value: boolean;
  }
) => {
  console.log(id, field, value)

  const { data, error } = await supabase
    .from("vente_land")
    .update({ [field]: value })
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
};


//  Ajouter un recouvrement
const addVente = async (venteData: TVente) => {
  try {
    // Vérification des champs obligatoires
    if (
      !venteData.client_id ||
      !venteData.lot ||
      !venteData.prix_m2 ||
      !venteData.superficie ||
      !venteData.statut_paiement
    ) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    // Calcul des dates
    const today = new Date();
    const dateEcheance = new Date(today);
    dateEcheance.setDate(dateEcheance.getDate() + 5);



    // Insertion dans la table "vente_land"
    const insertData = {
      client_id: venteData.client_id,
      lot: venteData.lot,
      prix_m2: venteData.prix_m2,
      total_a_payer: venteData.total_a_payer,
      dossier_tech: venteData.dossier_tech,
      statut_paiement: "En cours",
      superficie: venteData.superficie,
      bloc: venteData.bloc,
      titre_foncier: venteData.titre_foncier,
      categorie: venteData.categorie,

      date_echeance_bornage: dateEcheance
    };
  

    const { data: venteResult, error } = await supabase
      .from("vente_land")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      toast.error("Erreur lors de l'ajout de la vente.");
      throw new Error(error.message);
    }

    return { success: true, message: "Vente ajoutée avec succès.", data: venteResult };

  } catch (err) {
    console.error(err);
    toast.error("Une erreur est survenue lors de l'ajout de la vente.");
    return { success: false, message: "Erreur technique." };
  }
};




// Modifier un recouvrement
const updateVente = async ({
  id,
  venteData,
}: {
  id: number;
  venteData: TVente;
}) => {
  const { data, error } = await supabase
    .from("vente_land")
    .update(venteData)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

// Supprimer un recouvrement grâce à son id
const deleteVenteById = async (venteId: string) => {
  const { data, error } = await supabase
    .from("vente_land")
    .delete()
    .eq("id", venteId);
  if (error) throw new Error(error.message);
  return data;
};

export { fetchVentes, fetchVenteById, addVente, updateVente, deleteVenteById, fetchById, fetchpaiement };
