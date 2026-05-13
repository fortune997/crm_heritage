import supabase from "@/core/lib/supabase"
import { TAnnonce } from "../types/type"

const fetchAnnonce = async () => {
    const { data, error } = await supabase.from('annonces').select('*');
    if (error) throw new Error(error.message);
    return data;
}

const addAnnonce = async (dataSite: TAnnonce) => {
    const { data, error } = await supabase.from('annonces').insert([dataSite]);
    if (error) throw new Error(error.message);
    return data;
}

const deleteAnnonce = async (id: string) => {
    const { data, error } = await supabase.from('annonces').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}


export {
    fetchAnnonce,
    addAnnonce,
    deleteAnnonce,
}