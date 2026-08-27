import supabase from "@/core/lib/supabase";

export const fetchClients = async () => {


    const { data, error } = await supabase
        .from("clients")
        .select(`
            id,
            prospect_id,
            reference,
            status,
            converted_at,
            converted_by,
            notes,
            created_at,
            updated_at,

            prospect:prospects (
                id,
                full_name,
                phone,
                email
            )
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            `Erreur lors de la récupération des clients : ${error.message}`
        );
    }

    return (data ?? []);
}