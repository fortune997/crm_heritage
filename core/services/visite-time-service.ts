import supabase from "@/core/lib/supabase";
import { TVisiteTime } from "@/core/types/calineTypes";

const fetchVisiteTime = async () => {
    const { data, error } = await supabase.from('visite_time')
    .select('*');
    if (error) throw new Error(error.message);
    return data
}

const createVisiteTime = async (visitTimeData: TVisiteTime) => {
    const { data, error } = await supabase.from('visite_time').insert([visitTimeData]);
    if (error) throw new Error(error.message);
    return data
}

const updateVisitTime = async ({ id, dataVisitTime }: { id: string, dataVisitTime: TVisiteTime }) => {
    const { data, error } = await supabase.from('visite_time').update(dataVisitTime).eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}

const deleteVisitTime = async (id: string) => {
    const { data, error } = await supabase.from('visite_time').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}

export {
    fetchVisiteTime,
    createVisiteTime,
    updateVisitTime,
    deleteVisitTime
}