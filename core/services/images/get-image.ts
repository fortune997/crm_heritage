import { createClient } from "@/lib/config/supabase";

const supabase = createClient()
export function getPublicImageUrl(path: string) {
    const { data } = supabase.storage
        .from("sites")
        .getPublicUrl(path);

    return data.publicUrl;
}