import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import type { Visit } from "@/core/types/visites/type";

export type VisitsReportPdfOptions = {
    companyName?: string;
    title?: string;
    periodLabel: string;
    filters?: string[];
    fileName?: string;
    logoDataUrl?: string;
};

type AutoTableDocument = jsPDF & {
    lastAutoTable?: {
        finalY: number;
    };
};

type SiteGroup = {
    name: string;
    visits: Visit[];
};

type CommercialGroup = {
    name: string;
    visitsCount: number;
    sites: Map<string, SiteGroup>;
};

const PAGE_MARGIN_X = 14;
const CONTENT_TOP = 30;
const CONTENT_BOTTOM = 18;

const STATUS_LABELS: Record<string, string> = {
    planned: "Planifiée",
    confirmed: "Confirmée",
    completed: "Complétée",
    cancelled: "Annulée",
    postponed: "Reportée",
};

function safeText(value: unknown, fallback = "Non renseigné") {
    const text = String(value ?? "").trim();
    return text || fallback;
}

function parseLocalDate(value: string) {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
        const [, year, month, day] = match;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatVisitDate(value: string) {
    const date = parseLocalDate(value);

    if (!date) return safeText(value, "-");

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatGeneratedAt(date: Date) {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(date);
}

function formatCurrency(value: unknown) {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) return "-";

    return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

function visitReportDetails(visit: Visit) {
    const lines = [
        `Statut : ${STATUS_LABELS[visit.status] ?? safeText(visit.status)}`,
        visit.report ? `Rapport : ${visit.report}` : null,
        visit.observation ? `Observation : ${visit.observation}` : null,
        visit.objections ? `Objections : ${visit.objections}` : null,
        visit.next_action ? `Prochaine action : ${visit.next_action}` : null,
    ].filter((line): line is string => Boolean(line));

    return lines.join("\n") || "Aucun rapport renseigné";
}

function groupVisits(visits: Visit[]) {
    const groups = new Map<string, CommercialGroup>();

    const sortedVisits = [...visits].sort((left, right) => {
        const commercialComparison = safeText(left.profiles?.full_name).localeCompare(
            safeText(right.profiles?.full_name),
            "fr"
        );

        if (commercialComparison !== 0) return commercialComparison;

        const siteComparison = safeText(left.sites?.nom_titre).localeCompare(
            safeText(right.sites?.nom_titre),
            "fr"
        );

        if (siteComparison !== 0) return siteComparison;

        return `${left.visit_date} ${left.start_time}`.localeCompare(
            `${right.visit_date} ${right.start_time}`
        );
    });

    for (const visit of sortedVisits) {
        const commercialName = safeText(
            visit.profiles?.full_name,
            "Commercial non attribué"
        );
        const commercialKey = visit.commercial_id || commercialName;
        const siteName = safeText(visit.sites?.nom_titre, "Site non attribué");
        const siteKey = visit.site_id || siteName;

        let commercialGroup = groups.get(commercialKey);

        if (!commercialGroup) {
            commercialGroup = {
                name: commercialName,
                visitsCount: 0,
                sites: new Map<string, SiteGroup>(),
            };
            groups.set(commercialKey, commercialGroup);
        }

        commercialGroup.visitsCount += 1;

        let siteGroup = commercialGroup.sites.get(siteKey);

        if (!siteGroup) {
            siteGroup = {
                name: siteName,
                visits: [],
            };
            commercialGroup.sites.set(siteKey, siteGroup);
        }

        siteGroup.visits.push(visit);
    }

    return groups;
}

function sanitizeFilePart(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function ensureSpace(doc: jsPDF, currentY: number, requiredHeight: number) {
    const pageHeight = doc.internal.pageSize.getHeight();

    if (currentY + requiredHeight <= pageHeight - CONTENT_BOTTOM) {
        return currentY;
    }

    doc.addPage();
    return CONTENT_TOP;
}

function drawCommercialHeading(
    doc: jsPDF,
    y: number,
    commercial: CommercialGroup
) {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(
        PAGE_MARGIN_X,
        y,
        pageWidth - PAGE_MARGIN_X * 2,
        10,
        2,
        2,
        "F"
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(
        `Commercial : ${commercial.name} (${commercial.visitsCount} visite(s))`,
        PAGE_MARGIN_X + 4,
        y + 6.5
    );

    return y + 14;
}

function drawSiteHeading(doc: jsPDF, y: number, site: SiteGroup) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 64, 175);
    doc.text(
        `Site : ${site.name} - ${site.visits.length} visite(s)`,
        PAGE_MARGIN_X,
        y
    );

    return y + 3;
}

function drawPageChrome(
    doc: jsPDF,
    options: Required<Pick<VisitsReportPdfOptions, "companyName" | "title">> &
        VisitsReportPdfOptions,
    generatedAt: Date
) {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        doc.setPage(pageNumber);

        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 22, "F");

        let textX = PAGE_MARGIN_X;

        if (options.logoDataUrl) {
            const imageFormat = options.logoDataUrl.startsWith("data:image/jpeg")
                ? "JPEG"
                : "PNG";
            doc.addImage(options.logoDataUrl, imageFormat, PAGE_MARGIN_X, 4, 14, 14);
            textX += 18;
        }

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(options.companyName, textX, 9);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`${options.title} - ${options.periodLabel}`, textX, 15);

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7.5);
        doc.text(
            `Généré le ${formatGeneratedAt(generatedAt)}`,
            PAGE_MARGIN_X,
            pageHeight - 7
        );
        doc.text(
            `Page ${pageNumber}/${pageCount}`,
            pageWidth - PAGE_MARGIN_X,
            pageHeight - 7,
            { align: "right" }
        );
    }
}

export function generateVisitsReportPdf(
    visits: Visit[],
    options: VisitsReportPdfOptions
) {
    if (visits.length === 0) {
        throw new Error("Aucune visite ne correspond aux filtres sélectionnés.");
    }

    const resolvedOptions = {
        ...options,
        companyName: options.companyName ?? "HERITAGE CRM",
        title: options.title ?? "Rapport des visites",
    };
    const generatedAt = new Date();
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const commercialGroups = groupVisits(visits);
    const uniqueSites = new Set(
        visits.map((visit) => visit.site_id || safeText(visit.sites?.nom_titre))
    ).size;

    let currentY = CONTENT_TOP;

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Synthèse", PAGE_MARGIN_X, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
        `${visits.length} visite(s) | ${commercialGroups.size} commercial(aux) | ${uniqueSites} site(s)`,
        PAGE_MARGIN_X,
        currentY
    );
    currentY += 5;

    const filterText = resolvedOptions.filters?.length
        ? `Filtres : ${resolvedOptions.filters.join(" | ")}`
        : "Filtres : aucun filtre additionnel";
    const filterLines = doc.splitTextToSize(
        filterText,
        pageWidth - PAGE_MARGIN_X * 2
    );
    doc.setTextColor(71, 85, 105);
    doc.text(filterLines, PAGE_MARGIN_X, currentY);
    currentY += filterLines.length * 4 + 7;

    for (const commercial of commercialGroups.values()) {
        currentY = ensureSpace(doc, currentY, 50);
        currentY = drawCommercialHeading(doc, currentY, commercial);

        for (const site of commercial.sites.values()) {
            currentY = ensureSpace(doc, currentY, 32);
            currentY = drawSiteHeading(doc, currentY, site);

            autoTable(doc, {
                startY: currentY,
                margin: {
                    top: CONTENT_TOP,
                    right: PAGE_MARGIN_X,
                    bottom: CONTENT_BOTTOM,
                    left: PAGE_MARGIN_X,
                },
                theme: "grid",
                showHead: "everyPage",
                rowPageBreak: "avoid",
                head: [
                    [
                        "Date / heure",
                        "Client",
                        "Téléphone",
                        "Topographe",
                        "Surface",
                        "Intérêt",
                        "Prix souhaité",
                        "Rapport et suivi",
                    ],
                ],
                body: site.visits.map((visit) => [
                    `${formatVisitDate(visit.visit_date)}\n${safeText(
                        visit.start_time,
                        "-"
                    )}`,
                    safeText(visit.prospects?.full_name),
                    safeText(visit.prospects?.phone, "-"),
                    safeText(visit.topographe, "Non attribué"),
                    visit.interested_area
                        ? `${visit.interested_area} m²`
                        : "-",
                    safeText(visit.interest_level, "-"),
                    formatCurrency(visit.desired_price),
                    visitReportDetails(visit),
                ]),
                styles: {
                    font: "helvetica",
                    fontSize: 7.2,
                    cellPadding: 1.7,
                    overflow: "linebreak",
                    valign: "top",
                    lineColor: [203, 213, 225],
                    lineWidth: 0.15,
                    textColor: [30, 41, 59],
                },
                headStyles: {
                    fillColor: [30, 64, 175],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    fontSize: 7.3,
                    valign: "middle",
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 31 },
                    2: { cellWidth: 23 },
                    3: { cellWidth: 27 },
                    4: { cellWidth: 18 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 24 },
                    7: { cellWidth: 99 },
                },
            });

            currentY =
                ((doc as AutoTableDocument).lastAutoTable?.finalY ?? currentY) + 7;
        }

        currentY += 2;
    }

    drawPageChrome(doc, resolvedOptions, generatedAt);

    const datePart = generatedAt.toISOString().slice(0, 10);
    const defaultFileName = `rapport-visites-${sanitizeFilePart(
        resolvedOptions.periodLabel
    )}-${datePart}.pdf`;

    doc.save(resolvedOptions.fileName ?? defaultFileName);
}
