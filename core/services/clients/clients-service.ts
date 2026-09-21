import supabase from "@/core/lib/supabase";

type MaybeArray<T> = T | T[] | null;

type MarketingClientProspect = {
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    canal_prospection: string | null;
    interest_type: string | null;
    site_interesse: string | null;
    sites: {
        nom_titre: string | null;
    } | null;
    profiles: {
        full_name: string | null;
    } | null;
};

export type MarketingClientRecord = {
    id: string;
    prospect_id: string | null;
    reference: string | null;
    status: string | null;
    converted_at: string | null;
    converted_by: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string | null;
    prospect: MarketingClientProspect | null;
};

type RawMarketingClientProspect = Omit<
    MarketingClientProspect,
    "sites" | "profiles"
> & {
    sites: MaybeArray<MarketingClientProspect["sites"]>;
    profiles: MaybeArray<MarketingClientProspect["profiles"]>;
};

type RawMarketingClientRecord = Omit<MarketingClientRecord, "prospect"> & {
    prospect: MaybeArray<RawMarketingClientProspect>;
};

function firstOrNull<T>(value: MaybeArray<T>) {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
}

export const fetchClients = async (): Promise<MarketingClientRecord[]> => {

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
                email,
                canal_prospection,
                interest_type,
                site_interesse,
                sites (
                    nom_titre
                ),
                profiles!prospects_created_by_fkey (
                    full_name
                )
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

    const rows = (data ?? []) as unknown as RawMarketingClientRecord[];

    return rows.map((row) => {
        const prospect = firstOrNull(row.prospect);

        return {
            ...row,
            prospect: prospect
                ? {
                    ...prospect,
                    sites: firstOrNull(prospect.sites),
                    profiles: firstOrNull(prospect.profiles),
                }
                : null,
        };
    });
};
