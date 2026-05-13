import supabase from "@/core/lib/supabase";
import { CompanyFormValues } from "@/lib/validations/schema";

export const createCompany = async ({
    newCompany,
}: {
    newCompany: CompanyFormValues;
}) => {
    const { data, error } = await supabase
        .from("companies")
        .insert(newCompany)
        .select();

    if (error) throw new Error(error.message);

    return data;
};
