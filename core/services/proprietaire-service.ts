import supabase from "@/core/lib/supabase";
import { TUserCalineHouse } from "../types/calineTypes";

const fetchProprietaire = async () => {
    const { data, error } = await supabase
        .from('users_caline_house')
        .select('*, biens(*)')
        .eq('type_user', 'owner')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Erreur fetch : ${error.message}`);
    return data;
};

const fetchProprietaireById = async (id: string) => {
    const { data, error } = await supabase
        .from('users_caline_house')
        .select('*, biens(*, medias(*))')
        .eq('type_user', 'proprietaire')
        .eq('id', id)
        .single();

    if (error) throw new Error(`Erreur fetch locataire ID : ${error.message}`);
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

const deleteProprietaire = async (id: number) => {
    const { error } = await supabase
        .from('users_caline_house')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
};



export {
    fetchProprietaire,
    fetchProprietaireById,
    updateProprietaire,
    deleteProprietaire
}