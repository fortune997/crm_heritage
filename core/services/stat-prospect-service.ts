import supabase from "@/core/lib/supabase";

export const countProspectsByCanal = async (role: string, commercialName: string, canal: string) => {
    const isCommercial = role === "Chargée commerciale" || role === "Commercial";
    const query = supabase
        .from("prospects")
        .select("id", { count: "exact" }) // Utilise un champ unique, ici "id", pour compter
        .eq("canal_prospection", canal);

    const { count, error } = isCommercial
        ? await query.eq("chargee_clientele", commercialName)
        : await query;

    if (error) throw new Error(error.message);
    return count ?? 0;
};
