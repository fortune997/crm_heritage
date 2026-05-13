import supabase from "../lib/supabase";


export const fetchContact = async () => {
  const { data, error } = await supabase
    .from("contact_utilisateur")
    .select("*")
    .order("created_at", { ascending: false })


  if (error) throw new Error(error.message);
  return data;
};

export const deleteContact= async (id: number) =>{
  const {data, error } = await supabase
    .from('contact_utilisateur')
    .delete()
    .eq("id", id);

  if(error) throw new Error(error.message)
    return data
}
