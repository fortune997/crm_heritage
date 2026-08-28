// services/visits/export-visits-pdf.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Visit } from "@/core/types/visites/type";

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
    }).format(new Date(value));
}

function getCommercialName(
    visit: Visit
): string {
    if (!visit.profiles) {
        return "Non renseigné";
    }

    const firstName =
        visit.profiles.first_name ?? "";

    const lastName =
        visit.profiles.last_name ?? "";

    return `${firstName} ${lastName}`.trim() ||
        "Non renseigné";
}

export function exportVisitsToPdf(
    visits: Visit[]
): void {
    const document = new jsPDF({
        orientation: "landscape",
    });

    document.setFontSize(16);
    document.text(
        "Planning des visites",
        14,
        16
    );

    document.setFontSize(10);
    document.text(
        `Nombre de visites : ${visits.length}`,
        14,
        23
    );

    autoTable(document, {
        startY: 29,

        head: [[
            "Date",
            "Heure",
            "Prospect",
            "Commercial",
            "Site",
            "Type",
            "Statut",
            "Lieu",
        ]],

        body: visits.map((visit) => [
            formatDate(visit.visit_date),
            visit.start_time,
            visit.prospects?.full_name ??
            "Non renseigné",
            getCommercialName(visit),
            visit.sites?.nom_titre ??
            "Non renseigné",
            visit.visit_type,
            visit.status,
            visit.location ??
            visit.meeting_point ??
            "Non renseigné",
        ]),

        styles: {
            fontSize: 8,
            cellPadding: 3,
        },

        headStyles: {
            fillColor: [15, 23, 42],
        },
    });

    document.save(
        `visites-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
    );
}