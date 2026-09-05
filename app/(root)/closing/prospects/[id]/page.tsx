"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
    AlertCircle,
    ArrowLeft,
    BriefcaseBusiness,
    CalendarClock,
    CheckCircle2,
    Clock3,
    FileText,
    Handshake,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    RefreshCcw,
    Target,
    UserRound,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import {
    ClosingReportButton,
} from "@/components/closing/ui/ClosingReportButton";

import {
    useClosingCase,
} from "@/core/hooks/closing/useClosing";

import type {
    ClosingCase,
    ClosingPriority,
    ClosingStage,
} from "@/core/types/closing";
import { ClosingCaseActionDialog } from "@/components/closing/ClosingCaseActionDialog";


// ============================================================
// CONFIGURATION
// ============================================================

const stageConfig: Record<
    ClosingStage,
    {
        label: string;
        className: string;
    }
> = {
    nouveau: {
        label: "Nouveau",
        className:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    },
    a_contacter: {
        label: "À contacter",
        className:
            "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
    },
    contacte: {
        label: "Contacté",
        className:
            "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
    },
    interesse: {
        label: "Intéressé",
        className:
            "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300",
    },
    negociation: {
        label: "En négociation",
        className:
            "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
    },
    documents_attendus: {
        label: "Documents attendus",
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    },
    reservation_attendue: {
        label: "Réservation attendue",
        className:
            "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
    },
    paiement_initial: {
        label: "Paiement initial",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    },
    a_relancer: {
        label: "À relancer",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    },
    gagne: {
        label: "Gagné",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    },
    perdu: {
        label: "Perdu",
        className:
            "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    },
};




// ============================================================
// UTILITAIRES
// ============================================================

function formatDate(
    value: string | null
): string {
    if (!value) {
        return "Non renseignée";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
    }).format(new Date(value));
}

function formatDateTime(
    value: string | null
): string {
    if (!value) {
        return "Non programmée";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatCurrency(
    amount: number | null
): string {
    if (amount === null) {
        return "Non renseigné";
    }

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatTextValue(
    value: string | null
): string {
    if (!value) {
        return "Non renseigné";
    }

    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

function getWhatsAppUrl(
    phone: string | null
): string | null {
    if (!phone) {
        return null;
    }

    let normalizedPhone =
        phone.replace(/\D/g, "");

    if (
        normalizedPhone.startsWith("6") &&
        normalizedPhone.length === 9
    ) {
        normalizedPhone =
            `237${normalizedPhone}`;
    }

    return `https://wa.me/${normalizedPhone}`;
}

function isFollowUpOverdue(
    closingCase: ClosingCase
): boolean {
    if (
        !closingCase.next_follow_up_at ||
        ["gagne", "perdu"].includes(
            closingCase.stage
        )
    ) {
        return false;
    }

    return (
        new Date(
            closingCase.next_follow_up_at
        ).getTime() < Date.now()
    );
}

function getDecisionRecommendation(
    closingCase: ClosingCase
): {
    title: string;
    description: string;
    className: string;
} {
    if (closingCase.stage === "gagne") {
        return {
            title: "Closing réussi",
            description:
                "Le prospect a été converti. Vérifiez la création de la vente et le suivi des paiements.",
            className:
                "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
        };
    }

    if (closingCase.stage === "perdu") {
        return {
            title: "Dossier perdu",
            description:
                closingCase.loss_reason ??
                "Documentez la raison de perte afin d’améliorer le processus commercial.",
            className:
                "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
        };
    }

    if (!closingCase.assigned_closer_id) {
        return {
            title: "Affectation nécessaire",
            description:
                "Ce dossier ne possède pas encore de responsable Closing.",
            className:
                "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
        };
    }

    if (isFollowUpOverdue(closingCase)) {
        return {
            title: "Relance immédiate recommandée",
            description:
                "La date de relance est dépassée. Contactez le prospect et programmez la prochaine action.",
            className:
                "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
        };
    }

    if (closingCase.stage === "nouveau") {
        return {
            title: "Premier contact à effectuer",
            description:
                "Consultez le rapport de visite, identifiez les objections puis contactez le prospect.",
            className:
                "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
        };
    }

    if (
        closingCase.stage ===
        "negociation"
    ) {
        return {
            title: "Négociation à sécuriser",
            description:
                "Clarifiez les conditions commerciales, le budget et la prochaine étape de décision.",
            className:
                "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
        };
    }

    return {
        title: "Poursuivre le suivi",
        description:
            "Vérifiez la prochaine relance et mettez à jour l’évolution du prospect après chaque contact.",
        className:
            "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    };
}


// ============================================================
// LIGNE D’INFORMATION
// ============================================================

interface InformationRowProps {
    label: string;
    value: string;
}

function InformationRow({
    label,
    value,
}: InformationRowProps) {
    return (
        <div
            className="
                flex flex-col gap-1 py-3
                sm:flex-row
                sm:items-start
                sm:justify-between
                sm:gap-6
            "
        >
            <span
                className="
                    text-sm text-slate-500
                    dark:text-slate-400
                "
            >
                {label}
            </span>

            <span
                className="
                    text-sm font-medium
                    text-slate-950
                    dark:text-slate-100
                    sm:max-w-[60%]
                    sm:text-right
                "
            >
                {value}
            </span>
        </div>
    );
}


// ============================================================
// PAGE
// ============================================================

export default function ClosingProspectDetailsPage() {
    const params = useParams<{
        id: string;
    }>();

    const closingCaseId = params.id;
    

    const {
        data: closingCase,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useClosingCase(closingCaseId);

    if (isLoading) {
        return (
            <div
                className="
                    flex min-h-[70vh]
                    items-center justify-center
                "
            >
                <Loader2
                    className="
                        size-8 animate-spin
                        text-blue-600
                    "
                />
            </div>
        );
    }

    if (
        isError ||
        !closingCase
    ) {
        return (
            <main className="p-4 sm:p-6 lg:p-8">
                <div
                    className="
                        mx-auto max-w-2xl
                        rounded-xl border
                        border-red-200
                        bg-red-50 p-6
                        text-red-700
                        dark:border-red-900
                        dark:bg-red-950/50
                        dark:text-red-300
                    "
                >
                    <AlertCircle className="size-6" />

                    <h1 className="mt-3 font-semibold">
                        Dossier Closing introuvable
                    </h1>

                    <p className="mt-1 text-sm">
                        {error?.message ??
                            "Impossible de récupérer ce dossier."}
                    </p>

                    <Button
                        
                        variant="outline"
                        className="mt-4"
                    >
                        <Link href="/closing/prospects">
                            <ArrowLeft className="size-4" />
                            Retour aux prospects
                        </Link>
                    </Button>
                </div>
            </main>
        );
    }

    const stage = stageConfig[closingCase.stage];

   

    const recommendation =
        getDecisionRecommendation(
            closingCase
        );

    const whatsappUrl =
        getWhatsAppUrl(
            closingCase.prospect.phone
        );

    const visitReport =
        closingCase.visit.report ??
        closingCase.visit.notes;

    return (
        <main
            className="
                min-h-screen bg-slate-50/60
                dark:bg-slate-950
            "
        >
            <div
                className="
                    mx-auto flex max-w-7xl
                    flex-col gap-6
                    p-4 sm:p-6 lg:p-8
                "
            >
                {/* EN-TÊTE */}

                <header
                    className="
                        flex flex-col gap-4
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                    "
                >
                    <div>
                        <Button
                            
                            variant="ghost"
                            size="sm"
                            className="-ml-3 mb-3"
                        >
                            <Link href="/closing/prospects">
                                <ArrowLeft className="size-4" />
                                Retour aux prospects
                            </Link>
                        </Button>

                        <div
                            className="
                                flex items-start gap-3
                            "
                        >
                            <div
                                className="
                                    flex size-12 shrink-0
                                    items-center justify-center
                                    rounded-xl bg-blue-600
                                    text-white shadow-sm
                                "
                            >
                                <UserRound className="size-6" />
                            </div>

                            <div>
                                <div
                                    className="
                                        flex flex-wrap
                                        items-center gap-2
                                    "
                                >
                                    <h1
                                        className="
                                            text-2xl font-bold
                                            tracking-tight
                                            text-slate-950
                                            dark:text-white
                                        "
                                    >
                                        {
                                            closingCase
                                                .prospect
                                                .full_name
                                        }
                                    </h1>

                                    <Badge
                                        variant="outline"
                                        className={
                                            stage.className
                                        }
                                    >
                                        {stage.label}
                                    </Badge>

                                   
                                </div>

                                <p
                                    className="
                                        mt-1 text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Dossier Closing créé le{" "}
                                    {formatDate(
                                        closingCase.created_at
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <ClosingReportButton
                            closingCases={[
                                closingCase,
                            ]}
                        />

                        <Button
                            variant="outline"
                            disabled={isFetching}
                            onClick={() => {
                                void refetch();
                            }}
                        >
                            {isFetching ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="size-4" />
                            )}

                            Actualiser
                        </Button>
                    </div>
                </header>

                {/* AIDE À LA DÉCISION */}

                <div
                    className={`
                        flex items-start gap-3
                        rounded-xl border p-4
                        ${recommendation.className}
                    `}
                >
                    <Target className="mt-0.5 size-5 shrink-0" />

                    <div>
                        <p className="font-semibold">
                            {recommendation.title}
                        </p>

                        <p className="" id="wp-conditional-658">
                            {
                                recommendation.description
                            }
                        </p>
                    </div>
                </div>

                {/* ACTIONS RAPIDES */}

                <Card>
                    <CardContent
                        className="
                            flex flex-wrap gap-3 p-4
                        "
                    >
                       

                       <ClosingCaseActionDialog
    closingCase={closingCase}
/>

                        {/* <Button variant="outline">
                            <Handshake className="size-4" />
                            Traiter le dossier
                        </Button> */}
                    </CardContent>
                </Card>

                <div
                    className="
                        grid gap-6
                        lg:grid-cols-3
                    "
                >
                    {/* COLONNE PRINCIPALE */}

                    <div
                        className="
                            space-y-6
                            lg:col-span-2
                        "
                    >
                        {/* RAPPORT DE VISITE */}

                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="
                                        flex items-center
                                        gap-2
                                    "
                                >
                                    <FileText className="size-5 text-blue-600" />
                                    Rapport de visite
                                </CardTitle>

                                <CardDescription>
                                    Informations relevées après
                                    la visite du prospect.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {visitReport ? (
                                    <div
                                        className="
                                            whitespace-pre-wrap
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50 p-4
                                            text-sm leading-7
                                            text-slate-700
                                            dark:border-slate-800
                                            dark:bg-slate-900
                                            dark:text-slate-300
                                        "
                                    >
                                        {visitReport}
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            rounded-xl border
                                            border-dashed
                                            border-slate-200
                                            p-8 text-center
                                            dark:border-slate-800
                                        "
                                    >
                                        <FileText
                                            className="
                                                mx-auto size-8
                                                text-slate-300
                                            "
                                        />

                                        <p
                                            className="
                                                mt-3 text-sm
                                                text-slate-500
                                            "
                                        >
                                            Aucun rapport de visite
                                            disponible.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* ANALYSE COMMERCIALE */}

                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="
                                        flex items-center
                                        gap-2
                                    "
                                >
                                    <BriefcaseBusiness className="size-5 text-orange-600" />
                                    Analyse commerciale
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <InformationRow
                                    label="Niveau d’intérêt"
                                    value={formatTextValue(
                                        closingCase.visit
                                            .interest_level
                                    )}
                                />

                                <Separator />

                                <InformationRow
                                    label="Montant potentiel"
                                    value={formatCurrency(
                                        closingCase
                                            .estimated_amount
                                    )}
                                />

                                <Separator />

                                <InformationRow
                                    label="Objections identifiées"
                                    value={
                                        closingCase.objections ??
                                        "Aucune objection renseignée"
                                    }
                                />

                                <Separator />

                                <InformationRow
                                    label="Résultat du closing"
                                    value={
                                        closingCase.outcome ??
                                        "Aucun résultat renseigné"
                                    }
                                />

                                {closingCase.stage ===
                                    "perdu" && (
                                    <>
                                        <Separator />

                                        <InformationRow
                                            label="Raison de perte"
                                            value={
                                                closingCase.loss_reason ??
                                                "Non renseignée"
                                            }
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* NOTES */}

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Notes du Closing
                                </CardTitle>

                                <CardDescription>
                                    Synthèse des échanges et
                                    informations importantes.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div
                                    className="
                                        min-h-32 whitespace-pre-wrap
                                        rounded-xl border
                                        border-slate-200
                                        bg-slate-50 p-4
                                        text-sm leading-7
                                        dark:border-slate-800
                                        dark:bg-slate-900
                                    "
                                >
                                    {closingCase.closing_notes ??
                                        "Aucune note de closing enregistrée."}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* COLONNE LATÉRALE */}

                    <div className="space-y-6">
                        {/* PROSPECT */}

                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="
                                        flex items-center
                                        gap-2 text-base
                                    "
                                >
                                    <UserRound className="size-5" />
                                    Prospect
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <InformationRow
                                    label="Nom"
                                    value={
                                        closingCase.prospect
                                            .full_name
                                    }
                                />

                                <Separator />

                                <InformationRow
                                    label="Téléphone"
                                    value={
                                        closingCase.prospect
                                            .phone ??
                                        "Non renseigné"
                                    }
                                />

                                <Separator />

                                <InformationRow
                                    label="Email"
                                    value={
                                        closingCase.prospect
                                            .email ??
                                        "Non renseigné"
                                    }
                                />

                                <Separator />

                                <InformationRow
                                    label="Statut CRM"
                                    value={
                                        closingCase.prospect
                                            .status ??
                                        "Non renseigné"
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* VISITE */}

                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="
                                        flex items-center
                                        gap-2 text-base
                                    "
                                >
                                    <MapPin className="size-5" />
                                    Visite effectuée
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <InformationRow
                                    label="Date"
                                    value={formatDate(
                                        closingCase.visit
                                            .visit_date
                                    )}
                                />

                                <Separator />

                                <InformationRow
                                    label="Site"
                                    value={
                                        closingCase.visit.site
                                            ?.nom_titre ??
                                        "Non renseigné"
                                    }
                                />

                                <Separator />

                                <InformationRow
                                    label="Localisation"
                                    value={[
                                        closingCase.visit.site
                                            ?.quartier,
                                        closingCase.visit.site
                                            ?.ville,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") ||
                                        "Non renseignée"}
                                />

                                <Separator />

                                <InformationRow
                                    label="Présence confirmée"
                                    value={
                                        closingCase.visit
                                            .venue_rdv
                                            ? "Oui"
                                            : "Non"
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* RESPONSABLES */}

                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="
                                        flex items-center
                                        gap-2 text-base
                                    "
                                >
                                    <Users className="size-5" />
                                    Responsables
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <InformationRow
                                    label="Commercial d’origine"
                                    value={
                                        closingCase
                                            .source_commercial
                                            ?.full_name ??
                                        "Non renseigné"
                                    }
                                />

                                <Separator />

                                <InformationRow
                                    label="Responsable Closing"
                                    value={
                                        closingCase
                                            .assigned_closer
                                            ?.full_name ??
                                        "Non affecté"
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* SUIVI */}

                        <Card>
                            <CardHeader>
                                <CardTitle
                                    className="
                                        flex items-center
                                        gap-2 text-base
                                    "
                                >
                                    <Clock3 className="size-5" />
                                    Suivi
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <InformationRow
                                    label="Dernier contact"
                                    value={formatDateTime(
                                        closingCase
                                            .last_contact_at
                                    )}
                                />

                                <Separator />

                                <InformationRow
                                    label="Prochaine relance"
                                    value={formatDateTime(
                                        closingCase
                                            .next_follow_up_at
                                    )}
                                />

                                <Separator />

                                <InformationRow
                                    label="Dernière modification"
                                    value={formatDateTime(
                                        closingCase.updated_at
                                    )}
                                />

                                {isFollowUpOverdue(
                                    closingCase
                                ) && (
                                    <div
                                        className="
                                            mt-4 flex
                                            items-start gap-2
                                            rounded-lg
                                            bg-red-50 p-3
                                            text-sm text-red-700
                                            dark:bg-red-950/50
                                            dark:text-red-300
                                        "
                                    >
                                        <AlertCircle className="mt-0.5 size-4 shrink-0" />

                                        Cette relance est en
                                        retard.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {closingCase.stage ===
                            "gagne" && (
                            <div
                                className="
                                    flex items-start gap-3
                                    rounded-xl border
                                    border-emerald-200
                                    bg-emerald-50 p-4
                                    text-emerald-700
                                    dark:border-emerald-900
                                    dark:bg-emerald-950/50
                                    dark:text-emerald-300
                                "
                            >
                                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />

                                <div>
                                    <p className="font-medium">
                                        Vente conclue
                                    </p>

                                    <p className="mt-1 text-sm">
                                        {formatDate(
                                            closingCase.won_at
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}