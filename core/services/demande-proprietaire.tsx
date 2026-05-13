import supabase from "@/core/lib/supabase";
import { TUserCalineHouse } from "../types/calineTypes";

const fetchProprietaireDemande = async () => {
    const { data, error } = await supabase
        .from('proprieter_publier')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Erreur fetch : ${error.message}`);
    return data;
};

const validerDemandeProprietaireById = async (id: number, valider: boolean) => {
    const { data, error } = await supabase
        .from('proprieter_publier')
        .update({
         valider
        })
        .eq('id', id)
        .select()
        .single();
    

    if (error) throw new Error(`Erreur validate Proprietatire : ${error.message}`);
    return data;
};



const updateProprietaire = async ({id, userData}: {id: string, userData: TUserCalineHouse}) => {
    const { data, error } = await supabase
        .from('users_caline_house')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Erreur update : ${error.message}`);
    return data;
};

const getDemandeProprietaireById = async (id : number) => {

        const { data, error } = await supabase.from('proprieter_publier').select('*,  medias(*)').eq('id', id).single();
        if (error) throw new Error(error.message);
        return data
      }


const deleteProprietaire = async (id: number) => {
    const { error } = await supabase
        .from('users_caline_house')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
};



export {
  fetchProprietaireDemande,
  validerDemandeProprietaireById,
  getDemandeProprietaireById,
    updateProprietaire,
    deleteProprietaire
}