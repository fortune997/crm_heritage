import supabase from "@/core/lib/supabase"
import { TPublication } from "../types/type"

const fetchPublication = async (

) => {


    let query = supabase
        .from('publications')
        .select('*', { count: "exact" })


    const { data, error } = await query

    if (error) throw new Error(error.message);


    return data ?? []
}

const fetchPublicationById = async (id: string) => {
    const { data, error } = await supabase.from('publications').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data
}

const addPublication = async (dataPub: TPublication) => {
    const { data, error } = await supabase.from('publications').insert([dataPub]);
    if (error) throw new Error(error.message);
    return data
}

const updatePublication = async ({ id, dataPub }: { id: string, dataPub: TPublication }) => {
    const { data, error } = await supabase.from('publications').update(dataPub).eq('id', id);
    if (error) throw new Error(error.message);
    return data
}

const deletePublication = async (id: string) => {
    const { data, error } = await supabase.from('publications').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data
}


export {
    fetchPublication,
    fetchPublicationById,
    addPublication,
    updatePublication,
    deletePublication,
}