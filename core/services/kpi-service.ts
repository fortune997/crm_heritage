import supabase from "@/core/lib/supabase"
import { TKPI, TObjectif, TProfile } from "../types/type"
import { KpiFormValues } from "@/app/components/kpi/kpi-form";
import { objectifglobalFormValues } from "@/app/components/kpi/ObjectifForm";

const fetchKPI = async (): Promise<TKPI[]> => {
    const { data, error } = await supabase.from('kpi').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
}

const fetchEmployeeByDepartement = async (departement: string): Promise<TProfile[]> => {

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('departement', departement)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    return data ?? [];
}

const fetchKPIByDepartement = async (equipe: string): Promise<TKPI[]> => {
    const { data, error } = await supabase
        .from('kpi')
        .select('*, kpi_tache(*)')
        .eq('equipe', equipe)

    if (error) throw new Error(error.message);

    return data ?? [];
}

const fetchKPIByUser = async (user_id?: string) => {
    const { data, error } = await supabase.from('kpi').select('*').eq('user_id', user_id);
    if (error) throw new Error(error.message);
    return data || []
}

const fetchKPIById = async (id: string) => {
    const { data, error } = await supabase.from('kpi').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data || []
}

const addKPI = async (dataKPI: KpiFormValues) => {
    const { data, error } = await supabase.from('kpi').insert([dataKPI]);
    if (error) throw new Error(error.message);
    return data
}

const addGlobalObjectifKPI = async (dataKPI: objectifglobalFormValues) => {
    const { data, error } = await supabase.from('objectifglobal').insert([dataKPI]);
    if (error) throw new Error(error.message);
    return data
}

const fetchObjectif = async (): Promise<TObjectif[]> => {
    const { data, error } = await supabase.from('objectifglobal').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
}

const updateKPI = async ({ id, statut }: { id: string; statut: string }) => {
    const { data, error } = await supabase
        .from("kpi")
        .update({ statut })
        .eq("id", id);

    if (error) throw new Error(error.message);
    return data;
};
const updateObectif = async ({ id, updateData }: { id: string; updateData: objectifglobalFormValues }) => {
    const { data, error } = await supabase
        .from("kpi")
        .update([updateData])
        .eq("id", id);

    if (error) throw new Error(error.message);
    return data;
};

const updateKPIById = async ({ id, kpiData }: { id: string, kpiData: KpiFormValues }) => {
    const { data, error } = await supabase
        .from('kpi')
        .update(kpiData)
        .eq('id', id);

    if (error) throw new Error(error.message);
    return data;
}


const deleteKPI = async (id: string) => {
    const { data, error } = await supabase.from('kpi').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data
}


export {
    fetchKPI,
    fetchKPIById,
    addKPI,
    updateKPI,
    deleteKPI,
    fetchKPIByUser,
    fetchEmployeeByDepartement,
    fetchKPIByDepartement,
    updateKPIById,
    addGlobalObjectifKPI,
    fetchObjectif,
    updateObectif
}