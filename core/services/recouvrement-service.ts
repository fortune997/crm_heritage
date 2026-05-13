import supabase from "@/core/lib/supabase";
import { IOnePaiement, TOnePaiementRecouvrement, TRecouvrement } from "../types/type";
import { toast } from "sonner";
import dayjs from "dayjs";



// Récuperer tout les recouvrements
const fetchRecouvrement = async () => {
    const { data, error } = await supabase.from('recouvrements').select('*, clients(*, prospects(*)), vente_land(total_a_payer) ');
    if (error) throw new Error(error.message);
    return data;
}




//  Récupérer un recouvrement grâce à son id
const fetchRecouvrementById = async (recouvrementId: number) => {
    const { data, error } = await supabase.from('recouvrements').select('*, clients(*)').eq('id', recouvrementId).single()
    if (error) throw new Error(error.message);
    return data;
}

//  Ajouter un recouvrement
const addRecouvrement = async (recouvrementData: TRecouvrement) => {
    // const { data, error } = await supabase.from('recouvrements').insert([recouvrementData]);
    // if (error) throw new Error(error.message);
    // return data;

    


        // Ajouter le recouvrement si l'ID n'existe pas
        const { error } = await supabase.from('recouvrements').insert([recouvrementData]);

        if (error) {
            toast.error('Erreur lors de l\'ajout du recouvrement.');
            throw new Error(error.message);
        }

        // Retourner la réponse sous forme d'objet avec success et message
        return { success: true, message: 'Recouvrement ajouté avec succès !' };
  
}

// Modifier un recouvrement
const updateRecouvrement = async ({ id, recouvrementData }: { id: string, recouvrementData: TRecouvrement }) => {
    const { data, error } = await supabase.from('recouvrements').update(recouvrementData).eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}

// Supprimer un recouvrement grâce à son id
const deleteRecouvrementById = async (recouvrementId: string) => {
    const { data, error } = await supabase.from('recouvrements').delete().eq('id', recouvrementId);
    if (error) throw new Error(error.message);
    return data;
}

// Ajouter un Paiement d'un recouvrement

const addPaiementRecouvrement = async (dataPaiement: IOnePaiement) => {
    console.log( 'dataPaiement', dataPaiement)

    const { data, error } = await supabase
    .from('paiement_recouvrement')
    .insert([dataPaiement]);

    if (error) throw new Error(error.message);

    return data;
}   



// Récuperer tout les paiements d'un recouvrement
const fetchPaiementRecouvrement = async (paiementId: string) => {
    const { data, error } = await supabase
        .from('paiement_recouvrement')
        .select('*, recouvrements(*)')
        .eq('recouvrement_id', paiementId);

    if (error) throw new Error(error.message);

    return data;
};

const fetchPaiementRecouvrementById = async (paiementId: string) => {
    const { data, error } = await supabase
        .from('paiement_recouvrement')
        .select('*, recouvrements(*, clients(*, dailies(*, prospects(*))))')
        .eq('id', paiementId)
        .single();

    if (error) throw new Error(error.message);

    return data;
};



export async function generateNumeroFacture() {
  const now = dayjs();
  const mois = now.format("MM-YYYY");

  // Début et fin du mois
  const startOfMonth = now.startOf("month").toISOString();
  const endOfMonth = now.endOf("month").toISOString();

  // Compter les factures du mois
  const { count, error } = await supabase
    .from("paiement_recouvrement")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth);

  if (error) {
    throw new Error("Erreur génération numéro facture");
  }

  const numeroMois = String((count ?? 0) + 1).padStart(3, "0");

  return `FACTURE-BT|${mois}|${numeroMois}`;
}



export {
    fetchRecouvrement,
    fetchRecouvrementById,
    addRecouvrement,
    updateRecouvrement,
    deleteRecouvrementById,
    addPaiementRecouvrement,
    fetchPaiementRecouvrement,
    fetchPaiementRecouvrementById
}