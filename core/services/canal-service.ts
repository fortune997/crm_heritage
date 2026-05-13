
import supabase from "@/core/lib/supabase";
import { TCanal } from "../types/type";

// Récuperer tout les daily
export const fetchCanal = async () => {
    const { data, error } = await supabase.from('canaux').select('*');
    if (error) throw new Error(error.message);
    return data;
}


export const fetchCanalById = async (canalId: string) => {
    if (!canalId) return null;
    const { data, error } = await supabase.from('canaux').select('*').eq('id', canalId).single();
    if (error) throw new Error(error.message);
    return data;
}

export const addCanal = async (canalData: TCanal) => {
    const { data, error } = await supabase.from('canaux').insert([canalData]);
    if (error) throw new Error(error.message);
    return data;
}

export const updateCanal = async ({ id, canalData }: { id: string, canalData: TCanal }) => {
    const { data, error } = await supabase.from('canaux').update(canalData).eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}

export const deleteCanalById = async (id: string) => {
    const { data, error } = await supabase.from('canaux').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}




