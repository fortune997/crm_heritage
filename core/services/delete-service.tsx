import supabase from "@/core/lib/supabase";

export const deleteFileFromSupabase = async (
    path: string,
    bucket: string
) => {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        throw new Error(error.message);
    }
};