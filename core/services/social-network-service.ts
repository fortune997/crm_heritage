import supabase from "@/core/lib/supabase";
import { TSocialNetwork } from "../types/type"

const fetchSocialNetwork = async () => {
    const {data, error} = await supabase.from('socials').select('*');
    if (error) throw new Error(error.message);
    return data;
}

const fetchSocialNetworkById = async (id: string) => {
    const {data, error} = await supabase.from('socials').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
}

const addSocialNetwork = async (dataSocial: TSocialNetwork) => {
    const {data, error} = await supabase.from('socials').insert([dataSocial])
    if (error) throw new Error(error.message);
    return data;
}

const updateSocialNetwork = async ({id, dataSocial} : { id: string, dataSocial: TSocialNetwork}) => {
    const {data, error} = await supabase.from('socials').update(dataSocial).eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}

const deleteSocialNetwork = async (id: string) => {
    const {data, error} = await supabase.from('socials').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}


export {
    fetchSocialNetwork,
    fetchSocialNetworkById,
    addSocialNetwork,
    updateSocialNetwork,
    deleteSocialNetwork,
}