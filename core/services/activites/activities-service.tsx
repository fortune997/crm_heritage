import { ActivitiesFormValues } from "@/lib/validations/schema";
import supabase from "../../lib/supabase";

export interface newActivityProps {
  userId: string;
  action: string;
  entiteId: number;
  description: string;
  plateforme: string;
}

type CreateActivityInput = ActivitiesFormValues & {
  created_by: string;
};

export type UpdateActivityInput = Partial<CreateActivityInput> & {
  id: string;
};

export const fetchAcitvities = async () => {
  const { data, error } = await supabase
    .from("prospect_activities")
    .select(`*, prospects(phone, full_name, canal_prospection, status, created_by), profiles(*) `)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data;
};

export const newActivities = async (

  payload: CreateActivityInput
) => {
  const { data, error } = await supabase
    .from("prospect_activities")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  return data;
};


export const updateActivity = async (
  payload: UpdateActivityInput
) => {
  const { id, ...updates } = payload;


  const { data, error } = await supabase
    .from("prospect_activities")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);

  return data;
};

