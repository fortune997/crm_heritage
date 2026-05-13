
import supabase from "@/core/lib/supabase";
import { TDaily } from "../types/type";


// statistique creation prospects et dailies globale 
const allStatistique = async (id: string) => {
  const { data, error } = await supabase
    .from("daily_user_stats")
    .select("*")
    .eq("user_id", id)
    .order("day", { ascending: true });

  if (error) throw new Error(error.message)
  return data


}




const fetchStats = async () => {
  const { data, error } = await supabase
    .from("my_daily_activity_count")
    .select("activities_today")
    .maybeSingle();

  if (error) throw new Error(error.message)
  return data

};

// Récuperer tout les daily
// Récuperer tout les daily
const fetchDaily = async (role: string, commercialName?: string, from?: Date,
  to?: Date) => {
  let query = supabase
    .from("dailies")
    .select("*, prospects(*,interaction_prospect_caline_house(*))")
    .order("created_at", { ascending: false })


  const isCommercial = role === "Commercial" || role === "Chargée commerciale";

  if (isCommercial && commercialName) {
    query = query.eq("prospects.chargee_clientele", commercialName).not("prospects", "is", null);;
  }

  if (from) {
    query = query.gte("created_at", from.toISOString());
  }
  if (to) {

    const toEnd = new Date(to);
    toEnd.setHours(23, 59, 59, 999);
    query = query.lte("created_at", toEnd.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
};


export const testNumber = async () => {
  const { data, error } = await supabase
    .from("dailies")
    .select("*, prospects(*) ")
    .eq("prospects.telephone", "689835616")


  if (error) throw new Error(error.message)

  return data;
};

// Récuperer tout les daily
const fetchDailyActivities = async (
  pagination: any,
  role: string,
  commercialName?: string
) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  const fromRange = pagination.pageIndex * pagination.pageSize;
  const toRange = fromRange + pagination.pageSize - 1;

  let query = supabase
    .from("dailies")
    .select("*, prospects(*, interaction_prospect_caline_house(*))")
    .order("created_at", { ascending: false })
    .gte("date_rdv", startOfDay)
    .lte("date_rdv", endOfDay)
    .limit(pagination.pageSize)
    .range(fromRange, toRange);

  // Filtrer par le nom du commercial si fourni
  if (commercialName) {
    query = query.eq("prospects.chargee_clientele", commercialName);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { data, count }
};

// Récuperer tout les daily
const fetchDailyActivitiesById = async (id: number) => {
  const { data, error } = await supabase
    .from("dailies")
    .select("*, prospects(*, interaction_prospect_caline_house(*))")
    .eq("id", id)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message);

  const length = data ? data.length : 0;
  return { data: data ?? [], length };
};

const fetchDailyActivitiesCountById = async (id: number) => {
  const { count, error } = await supabase
    .from("dailies")
    .select("*", { count: "exact", head: true })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return count ?? 0;
};





const fetchDailyById = async (dailyId: string) => {
  if (!dailyId) return null;
  const { data, error } = await supabase.from('dailies').select('*, prospects:prospects(*)').eq('id', dailyId).single();
  if (error) throw new Error(error.message);
  return data;
}

const fetchAllDailyById = async (dailyId: string) => {


  const { data, error } = await supabase
    .from("dailies")
    .select("*, prospects(*)")
    .eq("prospect_id", dailyId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message);

  return data || [];
};



const addDaily = async (dailyData: TDaily) => {


  let dateRdv = dailyData.date_rdv ? new Date(dailyData.date_rdv) : undefined;
  if (dateRdv) {
    dateRdv.setDate(dateRdv.getDate() + 1);
  }
  const dataCorporate = {

    prospect_id: dailyData.prospect_id,
    date_rdv: dateRdv,
    nature_echange: dailyData.nature_echange,
    canal_echange: dailyData.canal_echange,
    statut_rdv: dailyData.statut_rdv,
    statut_appel: dailyData.statut_appel
  };

  const { data, error } = await supabase
    .from("dailies")
    .insert([dataCorporate])
    .select();

  if (error) {
    throw new Error("Erreur lors de l’ajout du daily : " + error.message);
  }



  return data;
};

const addDailyCorporate = async (dailyData: TDaily) => {
  let dateRdv = dailyData.date_rdv ? new Date(dailyData.date_rdv) : undefined;
  if (dateRdv) {
    dateRdv.setDate(dateRdv.getDate() + 1);
  }
  const dataCorporate = {

    prospect_id: dailyData.prospect_id,
    date_rdv: dateRdv,
    nature_echange: dailyData.nature_echange,
    canal_echange: dailyData.canal_echange,
    statut_rdv: dailyData.statut_rdv,
  };


  const { data, error } = await supabase
    .from("dailies")
    .insert([dataCorporate])
    .select();

  if (error) {
    throw new Error("Erreur lors de l’ajout du daily : " + error.message);
  }


  if (dailyData.date_depot) {
    const { error: updateError } = await supabase
      .from("prospects")
      .update({ date_depot: dateRdv, decharge: dailyData.decharge })
      .eq("id", dailyData.prospect_id);

    if (updateError) {
      throw new Error(
        "Daily ajouté, mais erreur lors de la mise à jour du prospect : " +
        updateError.message
      );
    }
  }

  if (dailyData.statut_rdv) {
    const { error: updateError } = await supabase
      .from("prospects")
      .update({ statut_rdv: dailyData.statut_rdv })
      .eq("id", dailyData.prospect_id);

    if (updateError) {
      throw new Error(
        "Daily ajouté, mais erreur lors de la mise à jour du prospect : " +
        updateError.message
      );
    }
  }

  if (dailyData.date_rdv) {
    const { error: updateError } = await supabase
      .from("prospects")
      .update({ date_rdv: dailyData.date_rdv })
      .eq("id", dailyData.prospect_id);

    if (updateError) {
      throw new Error(
        "Daily ajouté, mais erreur lors de la mise à jour du prospect : " +
        updateError.message
      );
    }
  }

  if (dailyData.decharge) {
    const { error: updateError } = await supabase
      .from("prospects")
      .update({ decharge: dailyData.decharge })
      .eq("id", dailyData.prospect_id);

    if (updateError) {
      throw new Error(
        "Daily ajouté, mais erreur lors de la mise à jour du prospect : " +
        updateError.message
      );
    }
  }


  return data;
};


const updateDaily = async ({ id, dailyData }: { id: string, dailyData: TDaily }) => {
  const { data, error } = await supabase.from('dailies').update(dailyData).eq('id', id);
  if (error) throw new Error(error.message);
  return data;
}

const deleteDailyById = async (id: string) => {
  const { data, error } = await supabase.from('dailies').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return data;
}

export {
  fetchDaily,
  fetchDailyById,
  addDaily,
  updateDaily,
  fetchAllDailyById,
  deleteDailyById,
  fetchDailyActivities,
  fetchDailyActivitiesById,
  fetchDailyActivitiesCountById,
  addDailyCorporate,
  fetchStats,
  allStatistique
}

