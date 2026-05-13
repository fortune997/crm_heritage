import supabase from "@/core/lib/supabase";
import { TUserCalineHouse } from "../types/calineTypes";

const fetchLocataire = async () => {
    const { data, error } = await supabase
        .from('users_caline_house')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Erreur fetch : ${error.message}`);
    return data;
};

const fetchBailLocataire = async () => {
    const { data, error } = await supabase
    .from('bail_locataire')
    .select('*, visite_caline_house(*,biens(*),users_caline_house(*))')

  
    if (error) throw new Error(`Erreur fetch : ${error.message}`);
   const filteredData = (data ?? []).filter(bail =>
        bail.visite_caline_house?.users_caline_house?.type_user === 'locataire'
       );

      return filteredData;
};

const fetchPaiementCalineHouse = async () => {
    const { data, error } = await supabase
    .from('paiement_caline_house')
    .select('*')



    if (error) throw new Error(`Erreur fetch : ${error.message}`);
    return data;
};

const fetchLocataireById = async (id: number) => {
    const { data, error } = await supabase
      .from('bail_locataire')
      .select('*, visite_caline_house(*,users_caline_house(*), biens(*,categorie(*), localisation(*) ))')
      .eq('id',id)
      .single()
  
    if (error) throw new Error(`Erreur fetch locataire ID : ${error.message}`);
    return data;
  };


  const activateLocataireAndFetch = async (id: number) => {

    const { data, error } = await supabase
      .from('bail_locataire')
      .update({ statut: 'actif' })
      .eq('id', id)
      .single();
  
    if (error) throw new Error(`Erreur activation locataire : ${error.message}`);
    return data;
  };


  const fetchLocataireDetailQRCode = async (id: string) => {
    const { data, error } = await supabase
        .from('users_caline_house')
        .select('*')
        .eq('id', id)
        .eq('type_user', 'locataire')

      .single()

    if (error) throw new Error(`Erreur fetch : ${error.message}`);
    return data;
};



const updateLocataire = async ({ id, userData }: { id: string, userData: TUserCalineHouse }) => {
    const { data, error } = await supabase
        .from('users_caline_house')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Erreur update : ${error.message}`);
    return data;
};

const deleteLocataire = async (id: number) => {
    const { error } = await supabase
        .from('users_caline_house')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
};



export {
    fetchLocataire,
    fetchLocataireById,
    updateLocataire,
    deleteLocataire,
    fetchBailLocataire,
    fetchLocataireDetailQRCode,
    fetchPaiementCalineHouse
}