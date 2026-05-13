import { TaskKPIFormValues } from "@/app/components/kpi/TaskForm";
import supabase from "../lib/supabase";
import { TKPI, TSoustache, TTask } from "../types/type";

export interface ITask {
    titre?: string,
    description?: string,
    date_fin?: string,
    status?: string
}

export const fetchTask = async (departement: string): Promise<TTask[]> => {
    let query = supabase
        .from('kpi_tache')
        .select('*, profiles(*),sous_taches(*)')
        .order('created_at', { ascending: false })

    if (departement) {
        query = query.eq('equipe', departement)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data ?? []
}

export const fetchTaskStatistics = async () => {
    const { data, error } = await supabase
        .rpc('get_task_statistics', { period_filter: 'this_week' })
    if (error) throw new Error(error.message)
    return data
}

export const addKPITask = async ({ dataKPI, equipe }: { dataKPI: TaskKPIFormValues, equipe: string }) => {
    const taskFormData = {
        ...dataKPI,
        equipe
    }
    const { data, error } = await supabase
        .from('kpi_tache')
        .insert([taskFormData]);

    if (error) throw new Error(error.message);
    return data
}

export const addSousTask = async ({
    kpi_tache_id,
    titre,
    description,
    jour_realisation,
    heure_debut,
    heure_fin,
    status
}: {
    kpi_tache_id: number,
    titre: string,
    description?: string,
    jour_realisation?: string,
    heure_debut?: string,
    heure_fin?: string,
    status: string
}) => {

    const taskFormData = {
        kpi_tache_id,
        titre,
        description,
        jour_realisation,
        heure_debut,
        heure_fin,
        status
    }

    const { data, error } = await supabase
        .from('sous_taches')
        .insert([taskFormData]);

    if (error) throw new Error(error.message);
    return data
}

export const fetchAllEmployeeTaskById = async (employeeId: string) => {

    const { data, error } = await supabase
        .from("kpi_tache")
        .select("*, profiles(nom, prenom, photo_url), sous_taches(*)")
        .eq("assigned_to", employeeId)
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message);

    return data || [];
};

export const fetchAllEmployeeJustFinishTaskById = async (employeeId: string) => {
    const { data, error } = await supabase
        .from("kpi_tache")
        .select("*, profiles(nom, prenom), sous_taches(*)")
        .eq("assigned_to", employeeId)
        .eq("status", "terminer")
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message);

    return data || [];
};

// export const fetchAllEmployeeDoingSubTaskById = async (employeeId: string) => {
//     const { data, error } = await supabase
//         .from("sous_taches")
//         .select(`
//             *,
//             kpi_tache(*)
//         `)
//         .order("created_at", { ascending: false });

//     if (error) throw new Error(error.message);

//     return data || [];
// };

export const fetchAllEmployeeDoingSubTaskById = async (employeeId: string) => {

    const { data, error } = await supabase
        .from('kpi_tache')
        .select(`
      *,
      sous_taches (*)
    `)
        .eq('assigned_to', employeeId)
        .eq('status', 'en cours')

    if (error) throw new Error(error.message)

    return data?.flatMap(kpi => kpi.sous_taches) || []
}



export const updateTask = async ({ tache_id, taskData }: { tache_id: string, taskData: ITask }) => {
    const updateTaskData = {
        titre: taskData.titre,
        description: taskData.description,
        date_fin: taskData.date_fin,
        status: taskData.status
    }
    const { data, error } = await supabase
        .from('kpi_tache')
        .update(updateTaskData)
        .eq('id', tache_id);

    if (error) throw new Error(error.message);
    return data;
}

export const updateSubTask = async ({ sous_tacheId, status, titre, description, jour_realisation, heure_debut, heure_fin }: { sous_tacheId: number, status: string, titre: string, description?: string, jour_realisation?: string, heure_debut?: string, heure_fin?: string }) => {

    const sous_tachesDataForm = {
        status,
        // kpi_tache_id: Number(taskId),
        id: sous_tacheId,
        titre,
        description,
        jour_realisation,
        heure_debut,
        heure_fin,
        updated_at: new Date().toISOString()
    }
    const { data, error } = await supabase
        .from('sous_taches')
        .update(sous_tachesDataForm)
        .eq('id', sous_tacheId);
    if (error) throw new Error(error.message);
    return data;
}



export const deleteTaskById = async (id: string) => {
    const { data, error } = await supabase.from('kpi_tache').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}


export const deleteSousTacheById = async (SousTacheId: string) => {
    const { data, error } = await supabase.from('sous_taches').delete().eq('id', SousTacheId);
    if (error) throw new Error(error.message);
    return data;
}