import { Visit } from "@/core/types/visites/type";


export function exportVisitsCSV(
    visits: Visit[]
) {
    const headers = [
        "Date",
        "Heure début",
        "Heure fin",
        "Type",
        "Client",
        "Téléphone",
        "Commercial",
        "Terrain",
        "Localisation",
        "Surface",
        "Statut",
        "Résultat",
    ];

    const rows = visits.map((visit) => [
        visit.date,
        visit.startTime,
        visit.endTime,
        visit.type,
        visit.prospects.full_name,
        visit.prospects.phone,
        visit.profiles.full_name,
        visit.sites?.nom_titre || "",
        visit.sites?.quartier || "",
        visit.sites?.superficie_total || "",
        visit.status,
        visit.result || "",
    ]);

    const csv = [
        headers,
        ...rows,
    ]
        .map((row) =>
            row
                .map((value) =>
                    `"${String(value).replace(
                        /"/g,
                        '""'
                    )}"`
                )
                .join(";")
        )
        .join("\n");

    const blob = new Blob(
        ["\ufeff" + csv],
        {
            type: "text/csv;charset=utf-8;",
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `visites-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(url);
}

export function printVisits() {
    window.print();
}