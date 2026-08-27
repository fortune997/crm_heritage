
import supabase from "@/core/lib/supabase";
import { AcquisitionChannelFormValues } from "@/core/lib/validations/canals";
import { TCanal } from "@/core/types/digital/type";


// Récuperer tout les point de contact avec prospect
export const getCanal = async (): Promise<TCanal[]> => {
    const { data, error } = await supabase.from('canals').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
}


export const fetchCanalById = async (canalId: string) => {
    if (!canalId) return null;
    const { data, error } = await supabase.from('canals').select('*').eq('id', canalId).single();
    if (error) throw new Error(error.message);
    return data;
}

export const addCanal = async (canalData: AcquisitionChannelFormValues) => {
    const { data, error } = await supabase.from('canals').insert([canalData]);
    if (error) throw new Error(error.message);
    return data;
}

export const updateCanal = async ({ id, canalData }: { id: string, canalData: TCanal }) => {
    const { data, error } = await supabase.from('canals').update(canalData).eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}

export const deleteCanalById = async (id: string) => {
    const { data, error } = await supabase.from('canals').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}




