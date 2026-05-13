import supabase from "../lib/supabase"
import { CreateDjanguySubscriptionType } from "../types";

export const fetchDjanguiSubscription = async (
  pagination: any,
  globalFilter: string,
  role: string,
  commercialName: string,
  from?: Date,
  to?: Date
) => {

  // Calcul de la plage pour Supabase
  const fromRange = pagination.pageIndex * pagination.pageSize;
  const toRange = fromRange + pagination.pageSize - 1;

  let query = supabase
    .from("djangui_subscriptions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(pagination.pageSize)
    .range(fromRange, toRange);


  if (globalFilter && globalFilter.trim() !== "") {
    query.or(`nom.ilike.%${globalFilter}%,telephone.ilike.%${globalFilter}%`);
  }

  // Filtre date (from)
  if (from) {
    query = query.gte("created_at", from);
  }
  /* 
    if (agence === 'yaounde') {
        query = query.eq("agence", agence)
    } */

  // Filtre date (to)
  if (to) {

    query = query.lte("created_at", to.toISOString());
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { data, count }

}

interface planForm {
  duree_mois: string,
  labels: string
}

export const createPlan = async (
  planData: planForm
) => {
  const { data, error } = await supabase
    .from("djangui_plans")
    .insert(planData)

  if (error) throw new Error(error.message)

  return data
}

export const fetchPlan = async () => {
  const { data, error } = await supabase
    .from("djangui_plans")
    .select("*")

  if (error) throw new Error(error.message)

  return data
}

export const deletePlan = async (id: number) => {
  const { data, error } = await supabase
    .from("djangui_plans")
    .delete()
    .eq("id", id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}


export const createDjanguySubscription = async (
  createSubscriptionData: CreateDjanguySubscriptionType
) => {

   const payload = {
    ...createSubscriptionData,

    debut_date: createSubscriptionData.debut_date.toISOString(),

    date_prochain_paiement:
      createSubscriptionData.date_prochain_paiement.toISOString(),
  }

  const { data, error } = await supabase
    .from("djangui_subscriptions")
    .insert(payload)
    .select()

  if (error) throw new Error(error.message)

  return data
}

export const updateDjanguySubscription = async ( {id, createSubscriptionData} :{
  id: number,
  createSubscriptionData: CreateDjanguySubscriptionType
}) => {
  const { data, error } = await supabase
    .from("djangui_subscriptions")
    .update(createSubscriptionData)
    .eq("id", id)
    .select()

  if (error) throw new Error(error.message)

  return data
}

export const fetchDjanguySubscription = async (
) => {
  const { data, error } = await supabase
    .from("djangui_subscriptions")
    .select("*, prospects(*), djangui_plans(*)")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data
}

export const fetchDjanguySubscriptionbyId = async (id: number
) => {
  const { data, error } = await supabase
    .from("djangui_subscriptions")
    .select("*, prospects(*), djangui_plans(*)")
    .eq("id", id)
    .single()


  if (error) throw new Error(error.message)

  return data
}

export const rechercheDjanguiSubscription = async (
  term: string
) => {
  if (!term.trim()) {
    return [];
  }

  let query = supabase
    .from("djangui_subscriptions")
    .select("*, prospects(id, nom, telephone)")
     .or(
      `prospects.nom.ilike.%${term}%,prospects.telephone.ilike.%${term}%`
    )


    const { data, error } = await query;
    if (error) {
      console.error("Search error:", error);
      throw new Error(error.message);}

    return data || [];

}