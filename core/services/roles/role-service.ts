import supabase from "@/core/lib/supabase";


export const fetchUsersRoleById = async (id?: string) => {
    if (!id) return null;
    const { data, error } = await supabase
        .from("role_permissions")
        .select("*, permissions(*)")
        .eq('role_id', id)

    if (error) throw new Error(error.message);
    return data;
}