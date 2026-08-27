import { Sale } from "@/core/types/ventes/type";
import supabase from "@/core/lib/supabase";

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