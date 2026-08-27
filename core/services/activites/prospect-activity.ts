import { createClient } from "@/lib/config/supabase";
import { ActivitiesFormValues } from '@/lib/validations/schema'

const supabase = createClient()

export const prospectActivityService = async (
    payload: ActivitiesFormValues
) => {
    const { data, error } = await supabase
        .from("prospect_activities")
        .insert([payload])
        .select()
        .single();


    if (error) {
        throw new Error(error.message);
    }


    return data;
}