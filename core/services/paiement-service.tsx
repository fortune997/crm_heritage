
import { toast } from "sonner"
import supabase from "../lib/supabase"
import { ZFormEspecePaiement } from "../types/zod/zodSchema"
import { z } from "zod"

export type TCreatePaiementDB  ={
  date_debut_bail: Date;
  date_fin_bail: Date;
  description: string;
  methode_paiement: string;
  status: string;
  reference: string;
  nb_jours?: number;
  type_paiement: string;
  amount: number;
  propriete_id: number;
  user_id: string;
  telephone: string,
  created_at? : string
};


export const paiementInfos = async (bail_id: number) => {
  const {data, error} =  await supabase
    .from('paiement_caline_house')
    .select('*' )
    .eq('bail_id', bail_id)
    .single()

    if (error) throw new Error(error.message)
     
      return data
}

export const paiementEffectuer = async () => {
  const {data, error} =  await supabase
    .from('paiement_caline_house')
    .select('*')


    if (error) throw new Error(error.message)
     
      return data
}

export const paiementAbyBail = async (bail_id: number) => {
  const {data, error} =  await supabase
    .from('paiement_caline_house')
    .select('*')
    .eq('bail_id',bail_id)
    .order('created_at', {ascending: false} )

    if (error) throw new Error(error.message)
     
      return data
}

export const paiementPlusRecent = async (bail_id: number) => {
  const { data, error } = await supabase
    .from('paiement_caline_house')
    .select('*')
    .eq('bail_id', bail_id)
    .order('created_at', { ascending: false }) 
    .limit(1); 

  if (error) throw new Error(error.message);

  return data?.[0] || null; 
};


export const AjoutPaiementEnEspece = async (formData: TCreatePaiementDB) => {
  const {data, error} =  await supabase
    .from('paiement_caline_house')
    .insert([formData])

    if (error) throw new Error(error.message)

      toast.success("🎉 Paiement ajouté avec succès !");
     
      return data
}