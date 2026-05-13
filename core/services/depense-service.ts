import supabase from "@/core/lib/supabase"
import { TExpense } from "../types/type"

const fetchDepenses = async () => {
    const { data, error } = await supabase.from('depenses').select('*');
    if (error) throw new Error(error.message);
    return data
}


const fetchDepensesById = async (id: string) => {
    const { data, error } = await supabase.from('depenses').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data
}

const addDepense = async (dataDepense: TExpense) => {
    const { data, error } = await supabase.from('depenses').insert([dataDepense]);
    if (error) throw new Error(error.message);
    return data
}

const updateDepense = async ({ id, statut }: { id: string; statut: string }) => {
    const { data, error } = await supabase
        .from("depenses")
        .update({ statut })
        .eq("id", id);

    if (error) throw new Error(error.message);
    return data;
};


const deleteDepenses = async (id: string) => {
    const { data, error } = await supabase.from('depenses').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data
}


export {
    fetchDepenses,
    fetchDepensesById,
    addDepense,
    updateDepense,
    deleteDepenses
}