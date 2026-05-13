import supabase from "../lib/supabase";

export interface newActivityProps {
  userId: string;
  action: string;
  entiteId: number;
  description: string;
  plateforme: string;
}

export const fetchAcitvities = async () => {
  const { data, error } = await supabase
    .from("activites")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data;
};

export const newActivities = async ({
  newActivity,
}: {
  newActivity: newActivityProps;
}) => {
  const { data, error } = await supabase
    .from("activites")
    .insert( newActivity )
    .select();

  if (error) throw new Error(error.message);

  return data;
};
