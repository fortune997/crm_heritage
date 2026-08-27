import supabase from "@/core/lib/supabase";

const fetchTotalSocials = async (): Promise<number> => {
    const query = supabase.from("socials").select("*", { count: "exact" });
    const { count, error } = await query;
    if (error) throw new Error(error.message);
    return count ?? 0;
};

const fetchTotalCanaux = async (): Promise<number> => {
    const query = supabase.from("canaux").select("*", { count: "exact" });
    const { count, error } = await query;
    if (error) throw new Error(error.message);
    return count ?? 0;
};

const fetchTotalPublication = async (): Promise<number> => {
    const query = supabase.from("publications").select("*", { count: "exact" });
    const { count, error } = await query;
    if (error) throw new Error(error.message);
    return count ?? 0;
};



export {
    fetchTotalSocials,
    fetchTotalCanaux,
    fetchTotalPublication
}


