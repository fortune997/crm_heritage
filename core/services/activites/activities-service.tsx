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
    .limit(100);

  if (error) throw new Error(error.message);
  return data;
};

export const newActivities = async (
  payload: CreateActivityInput
) => {
  const activitiesDATA = {
    prospect_id: payload.prospect_id,
    titre: payload.titre,
    description: payload.description,
    canal_relance: payload.canal_relance,
    statut_activite: payload.statut_activite,
    prochain_relance: payload.prochain_relance,
    created_by: payload.created_by,
  };

  const { data, error } = await supabase
    .from("prospect_activities")
    .insert(activitiesDATA)
    .select();

  if (error) {
    throw new Error(`Prospect : ${error.message}`);
  }

  // Conserver la qualification actuelle si aucune n'est fournie.
  if (payload.qualification != null) {
    const { error: errorProspect } = await supabase
      .from("prospects")
      .update({
        qualification: payload.qualification,
      })
      .eq("id", payload.prospect_id)
      .select("id")
      .single();

    if (errorProspect) {
      throw new Error(
        `L’activité a été créée, mais la qualification n’a pas pu être mise à jour : ${errorProspect.message}`
      );
    }
  }

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


export type FollowUpState =
    | "overdue"
    | "today"
    | "upcoming"
    | "completed"
    | "no_date";

export type ActivityFollowUp = {
    id: string;
    prospect_id: string;
    titre: string;
    description: string | null;
    statut_activite: string;
    priorite: string | null;
    prochain_relance: string | null;
    completed_at: string | null;
    created_at: string;
    created_by: string | null;

    prospect_name: string | null;
    prospect_phone: string | null;
    prospect_status: string | null;
    created_by_name: string | null;

    follow_up_state: FollowUpState;
};

export async function fetchActivityFollowUps() {
    const { data, error } = await supabase
        .from("activity_follow_up_view")
        .select("*")
        .neq("follow_up_state", "completed")
        .order("prochain_relance", {
            ascending: true,
            nullsFirst: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}

export const fetchAcitvitiesByID = async (id: string ) => {
  const { data, error } = await supabase
    .from("prospect_activities")
    .select(`*, prospects(phone, full_name, canal_prospection, status, created_by), profiles(*) `)
    .eq('prospect_id', id)
    .order("created_at", { ascending: false })
    

  if (error) throw new Error(error.message);
  return data;
};