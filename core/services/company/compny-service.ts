import supabase from "@/core/lib/supabase";
import { TCompanies } from "@/core/types/company/type";


export const fetchCompanies = async (): Promise<TCompanies[]> => {
    const { data, error } = await supabase
        .from("companies")
        .select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
};
