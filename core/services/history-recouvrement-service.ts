import supabase from "@/core/lib/supabase";

const fetchHistoriqueRecouvrement = async () => {
    const { data, error } = await supabase.from('historique_recouvrement').select('*, clients(*, dailies(*, prospects(*)))');
    if (error) throw new Error(error.message);
    return data;
}

const fetchHistoriqueRecouvrementById = async (id: number) => {
    const { data, error } = await supabase.from('historique_recouvrement')
    .select('*, clients(*, dailies(*, prospects(*)))')
    .eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
}

export {
    fetchHistoriqueRecouvrement,
    fetchHistoriqueRecouvrementById
}

