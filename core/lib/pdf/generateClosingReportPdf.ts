import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type {
    ClosingCase,
    ClosingStage,
} from "@/core/types/closing";


// ============================================================
// TYPES
// ============================================================

export type ClosingReportMode =
    | "download"
    | "preview";

interface ClosingReportOptions {
    closingCases: ClosingCase[];
    mode?: ClosingReportMode;
    reportTitle?: string;
}


// ============================================================
// CONFIGURATION
// ============================================================

const stageLabels: Record<
    ClosingStage,
    string
> = {
    nouveau: "Nouveau",
    a_contacter: "À contacter",
    contacte: "Contacté",
    interesse: "Intéressé",
    negociation: "Négociation",
    documents_attendus: "Documents attendus",
    reservation_attendue: "Réservation attendue",
    paiement_initial: "Paiement initial",
    a_relancer: "À relancer",
    gagne: "Gagné",
    perdu: "Perdu",
};


// ============================================================
// FORMATAGE
// ============================================================

function formatCurrency(
    amount: number
): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(
    date: string | null
): string {
    if (!date) {
        return "Non renseignée";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date invalide";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
    }).format(parsedDate);
}

function formatDateTime(
    date: string | null
): string {
    if (!date) {
        return "Non programmée";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date invalide";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(parsedDate);
}

function isActive(
    closingCase: ClosingCase
): boolean {
    return !["gagne", "perdu"].includes(
        closingCase.stage
    );
}

function isOverdue(
    closingCase: ClosingCase
): boolean {
    if (
        !closingCase.next_follow_up_at ||
        !isActive(closingCase)
    ) {
        return false;
    }

    return (
        new Date(
            closingCase.next_follow_up_at
        ).getTime() < Date.now()
    );
}


// ============================================================
// RECOMMANDATION DÉCISIONNELLE
// ============================================================

function getRecommendation(
    closingCase: ClosingCase
): string {
    if (closingCase.stage === "gagne") {
        return "Vente conclue";
    }

    if (closingCase.stage === "perdu") {
        return closingCase.loss_reason
            ? `Perdu : ${closingCase.loss_reason}`
            : "Analyser la raison de perte";
    }

    if (!closingCase.assigned_closer_id) {
        return "Affecter un responsable";
    }

    if (isOverdue(closingCase)) {
        return "Relance immédiate";
    }

    if (closingCase.priority === "urgente") {
        return "Traitement prioritaire";
    }

    if (closingCase.stage === "nouveau") {
        return "Prendre en charge";
    }

    if (
        closingCase.stage ===
        "reservation_attendue"
    ) {
        return "Sécuriser la réservation";
    }

    if (
        closingCase.stage ===
        "documents_attendus"
    ) {
        return "Récupérer les documents";
    }

    if (
        closingCase.stage ===
        "negociation"
    ) {
        return "Suivre la négociation";
    }

    if (
        !closingCase.next_follow_up_at
    ) {
        return "Programmer une relance";
    }

    return "Poursuivre le suivi";
}


// ============================================================
// STATISTIQUES DU RAPPORT
// ============================================================

function calculateReportStats(
    closingCases: ClosingCase[]
) {
    const activeCases =
        closingCases.filter(isActive);

    const wonCases =
        closingCases.filter(
            (closingCase) =>
                closingCase.stage === "gagne"
        );

    const lostCases =
        closingCases.filter(
            (closingCase) =>
                closingCase.stage === "perdu"
        );

    const completedCases =
        wonCases.length + lostCases.length;

    const conversionRate =
        completedCases > 0
            ? (wonCases.length /
                  completedCases) *
              100
            : 0;

    const pipelineAmount =
        activeCases.reduce(
            (total, closingCase) =>
                total +
                (closingCase.estimated_amount ??
                    0),
            0
        );

    return {
        total: closingCases.length,

        active: activeCases.length,

        newCases: closingCases.filter(
            (closingCase) =>
                closingCase.stage ===
                "nouveau"
        ).length,

        negotiations: closingCases.filter(
            (closingCase) =>
                closingCase.stage ===
                "negociation"
        ).length,

        won: wonCases.length,

        lost: lostCases.length,

        overdue:
            closingCases.filter(isOverdue)
                .length,

        unassigned: closingCases.filter(
            (closingCase) =>
                isActive(closingCase) &&
                !closingCase.assigned_closer_id
        ).length,

        highPriority:
            activeCases.filter(
                (closingCase) =>
                    closingCase.priority ===
                        "haute" ||
                    closingCase.priority ===
                        "urgente"
            ).length,

        conversionRate,
        pipelineAmount,
    };
}


// ============================================================
// CONSTRUCTION DU PDF
// ============================================================

function buildClosingReportPdf(
    closingCases: ClosingCase[],
    reportTitle: string
): jsPDF {
    const document = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const pageWidth =
        document.internal.pageSize.getWidth();

    const stats =
        calculateReportStats(closingCases);

    const generatedAt =
        new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
        }).format(new Date());

    // En-tête

    document.setFillColor(15, 23, 42);
    document.rect(
        0,
        0,
        pageWidth,
        28,
        "F"
    );

    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(18);
    document.text(reportTitle, 14, 13);

    document.setFont(
        "helvetica",
        "normal"
    );
    document.setFontSize(9);
    document.text(
        `Généré le ${generatedAt}`,
        14,
        21
    );

    document.text(
        "HERITAGE CRM",
        pageWidth - 14,
        13,
        {
            align: "right",
        }
    );

    // Titre de synthèse

    document.setTextColor(15, 23, 42);
    document.setFont("helvetica", "bold");
    document.setFontSize(13);
    document.text(
        "Synthèse décisionnelle",
        14,
        39
    );

    // Cartes statistiques

    const cards = [
        {
            label: "Dossiers",
            value: String(stats.total),
        },
        {
            label: "Dossiers actifs",
            value: String(stats.active),
        },
        {
            label: "Nouveaux",
            value: String(stats.newCases),
        },
        {
            label: "Relances en retard",
            value: String(stats.overdue),
        },
        {
            label: "Non affectés",
            value: String(stats.unassigned),
        },
        {
            label: "Taux de conversion",
            value: `${stats.conversionRate.toFixed(
                1
            )} %`,
        },
    ];

    const cardGap = 4;
    const margins = 28;

    const cardWidth =
        (pageWidth -
            margins -
            cardGap *
                (cards.length - 1)) /
        cards.length;

    cards.forEach((card, index) => {
        const x =
            14 +
            index *
                (cardWidth + cardGap);

        document.setFillColor(
            248,
            250,
            252
        );

        document.setDrawColor(
            226,
            232,
            240
        );

        document.roundedRect(
            x,
            45,
            cardWidth,
            20,
            2,
            2,
            "FD"
        );

        document.setFont(
            "helvetica",
            "normal"
        );
        document.setFontSize(7.5);
        document.setTextColor(
            100,
            116,
            139
        );

        document.text(
            card.label,
            x + 3,
            51
        );

        document.setFont(
            "helvetica",
            "bold"
        );
        document.setFontSize(13);
        document.setTextColor(
            15,
            23,
            42
        );

        document.text(
            card.value,
            x + 3,
            60
        );
    });

    // Indicateurs nécessitant une décision

    document.setFont("helvetica", "bold");
    document.setFontSize(11);
    document.setTextColor(15, 23, 42);

    document.text(
        "Points d’attention",
        14,
        75
    );

    document.setFont(
        "helvetica",
        "normal"
    );
    document.setFontSize(9);

    const decisionMessages = [
        `${stats.overdue} relance(s) nécessitent une action immédiate.`,

        `${stats.unassigned} dossier(s) actif(s) ne sont pas encore affectés.`,

        `${stats.highPriority} dossier(s) possèdent une priorité haute ou urgente.`,

        `${stats.negotiations} prospect(s) sont actuellement en négociation.`,

        `Valeur estimée du pipeline actif : ${formatCurrency(
            stats.pipelineAmount
        )}.`,
    ];

    decisionMessages.forEach(
        (message, index) => {
            const y = 82 + index * 5;

            document.setFillColor(
                37,
                99,
                235
            );

            document.circle(
                16,
                y - 1,
                0.8,
                "F"
            );

            document.setTextColor(
                51,
                65,
                85
            );

            document.text(
                message,
                20,
                y
            );
        }
    );

    // Tableau détaillé

    autoTable(document, {
        startY: 110,

        margin: {
            left: 10,
            right: 10,
            bottom: 15,
        },

        head: [
            [
                "#",
                "Prospect",
                "Téléphone",
                "Site",
                "Commercial",
                "Étape",
                "Priorité",
                "Relance",
                "Responsable",
                "Décision recommandée",
            ],
        ],

        body: closingCases.map(
            (closingCase, index) => [
                String(index + 1),

                closingCase.prospect
                    .full_name,

                closingCase.prospect.phone ??
                    "Non renseigné",

                closingCase.visit.site
                    ?.nom_titre ??
                    "Non renseigné",

                closingCase
                    .source_commercial
                    ?.full_name ??
                    "Non renseigné",

                stageLabels[
                    closingCase.stage
                ],

                closingCase.priority,

                formatDateTime(
                    closingCase.next_follow_up_at
                ),

                closingCase
                    .assigned_closer
                    ?.full_name ??
                    "Non affecté",

                getRecommendation(
                    closingCase
                ),
            ]
        ),

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 2,
            overflow: "linebreak",
            valign: "middle",
            lineColor: [
                226,
                232,
                240,
            ],
            lineWidth: 0.1,
        },

        headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "left",
        },

        alternateRowStyles: {
            fillColor: [
                248,
                250,
                252,
            ],
        },

        columnStyles: {
            0: {
                cellWidth: 8,
                halign: "center",
            },
            1: {
                cellWidth: 32,
            },
            2: {
                cellWidth: 24,
            },
            3: {
                cellWidth: 25,
            },
            4: {
                cellWidth: 29,
            },
            5: {
                cellWidth: 25,
            },
            6: {
                cellWidth: 18,
            },
            7: {
                cellWidth: 27,
            },
            8: {
                cellWidth: 29,
            },
            9: {
                cellWidth: 39,
            },
        },

        didDrawPage: () => {
            document.setFontSize(7);
            document.setTextColor(
                100,
                116,
                139
            );

            document.text(
                "Rapport confidentiel — HERITAGE CRM",
                10,
                document.internal.pageSize.getHeight() -
                    6
            );
        },
    });

    // Pagination

    const numberOfPages =
        document.getNumberOfPages();

    for (
        let pageNumber = 1;
        pageNumber <= numberOfPages;
        pageNumber += 1
    ) {
        document.setPage(pageNumber);

        document.setFontSize(7);
        document.setTextColor(
            100,
            116,
            139
        );

        document.text(
            `Page ${pageNumber} sur ${numberOfPages}`,
            pageWidth - 10,
            document.internal.pageSize.getHeight() -
                6,
            {
                align: "right",
            }
        );
    }

    return document;
}


// ============================================================
// EXPORT
// ============================================================



export function generateClosingReportPdf({
    closingCases,
    mode = "download",
    reportTitle = "Rapport des dossiers Closing",
}: ClosingReportOptions): void {
    if (closingCases.length === 0) {
        throw new Error(
            "Aucun dossier closing à exporter."
        );
    }

    const pdfDocument =
        buildClosingReportPdf(
            closingCases,
            reportTitle
        );

    const currentDate = new Date()
        .toISOString()
        .slice(0, 10);

    const filename =
        `rapport-closing-${currentDate}.pdf`;

    const pdfBlob =
        pdfDocument.output("blob");

    const pdfUrl =
        URL.createObjectURL(pdfBlob);

    const link =
        document.createElement("a");

    link.href = pdfUrl;

    if (mode === "download") {
        link.download = filename;
    } else {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }

    document.body.appendChild(link);

    link.click();
    link.remove();

    window.setTimeout(
        () => {
            URL.revokeObjectURL(pdfUrl);
        },
        mode === "preview"
            ? 60_000
            : 2_000
    );
}