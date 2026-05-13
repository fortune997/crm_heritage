
import supabase from "../lib/supabase"
import { TFormSchemaAddInteractionCalineHouseProspect, TFormSchemaAddInteractionLandProspect, TFormSchemaProspectCaline } from "../types/zod/zodSchema"



// export const getAllPropectCalineHouse = async () => {
//   const {data, error } = await supabase
//     .from('prospect_caline_house')
//     .select('*, interaction_prospect_caline_house(*)')
//     .order("created_at", { ascending: false })

//     if(error) throw Error(error.message)

//      return data
// } 


export const getAllPropectCalineHouse = async (page: number = 1) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from("prospect_caline_house")
    .select("*, interaction_prospect_caline_house(*)", { count: "exact" }) 
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return { data, count };
};





export const createCalineHouseClent = async(formData: TFormSchemaProspectCaline) => {
  const { data, error }= await supabase
    .from('prospect_caline_house')
    .insert([formData])
    .select();
    
   if (error) throw Error(error.message)
    
    return data
}

export const updateCalineHouseClient = async ({id, formData}:{ id: string, formData: TFormSchemaProspectCaline}) => {
  const { data, error } = await supabase
    .from('prospect_caline_house')
    .update(formData)  
    .eq('id', id) 
    .select();
    
  if (error) throw new Error(error.message);
  
  return data;
};

export const createIneractionCalineHouseClent = async(formData: TFormSchemaAddInteractionCalineHouseProspect) => {
  const { data, error }= await supabase
    .from('interaction_prospect_caline_house')
    .insert([formData])
    .select();
    
   if (error) throw Error(error.message)
    
    return data
}

export const createIneractionLandClent = async(formData: TFormSchemaAddInteractionLandProspect) => {
  const { data, error }= await supabase
    .from('interaction_prospect_caline_house')
    .insert([formData])
    .select();
    
   if (error) throw Error(error.message)
    
    return data
}

export const getProspectCalineHouse = async(prospect_caline_house_id : number) => {
  const { data, error } = await supabase
    .from('interaction_prospect_caline_house')
    .select('*')
    .eq('prospect_caline_house_id ', prospect_caline_house_id )
    .single()

    if(error) throw Error(error.message)
 
    return data|| []
}

export const getProspectCalineHous = async () => {

  const { data, error } = await  supabase
    .from("prospect_caline_house")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 5000);

;

  if (error) throw new Error(error.message);

  return data || [];
};


export const deleteCalineHouseClient = async (id: number) => {
  const { error } = await supabase
      .from('prospect_caline_house')
      .delete()
      .eq('id', id);

  if (error) throw new Error(`Erreur suppression : ${error.message}`);
};


export const deleteCalineHouseClientInteraction = async (id: number) => {
  const { error } = await supabase
      .from('interaction_prospect_caline_house')
      .delete()
      .eq('id', id);

  if (error) throw new Error(`Erreur suppression : ${error.message}`);
};


export const getProspectDetailCalineHouse = async(id : number) => {
  const { data, error } = await supabase
    .from('prospect_caline_house')
    .select('*, interaction_prospect_caline_house(*)')
    .eq('id', id )
    .single()

    if(error) throw Error(error.message)
      console.log("Données prospect :", data);
    return data
}