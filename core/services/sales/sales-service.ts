import { Sale } from "@/core/types/ventes/type";
import supabase from "@/core/lib/supabase";
import { CreateSaleFormValues } from "@/core/lib/validations/sales/Sales";

export async function fetchSales(): Promise<Sale[]> {


    const { data, error } = await supabase
        .from("sales")
        .select(`*, prospects(*), sites(*)
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            `Erreur lors de la récupération des ventes : ${error.message}`
        );
    }

    return data;
}

export const createSale = async (sales:CreateSaleFormValues ) => {
    const { data, error } = await supabase.from('sales').insert([sales]);
    if (error) throw new Error(error.message);
    return data;
}