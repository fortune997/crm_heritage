"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
    AlertCircle,
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Handshake,
    Loader2,
    PhoneCall,
    RefreshCcw,
    UserRoundPlus,
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

import {
    ClosingStatsCards,
} from "@/components/closing/cards/ClosingStatsCards";

import {
    useClosingCases,
} from "@/core/hooks/closing/useClosing";

import {
    calculateClosingStats,
} from "@/core/services/closing/closing-service";

import type {
    ClosingCase,
    ClosingPriority,
} from "@/core/types/closing";


// ============================================================
// CONFIGURATION
// ============================================================

const priorityConfig: Record<
    ClosingPriority,
    {
        label: string;
        className: string;
    }
> = {
    basse: {
        label: "Basse",
        className: `
            border-slate-200 bg-slate-50
            text-slate-600
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
        `,
    },

    normale: {
        label: "Normale",
        className: `
            border-blue-200 bg-blue-50
            text-blue-700
            dark:border-blue-900
            dark:bg-blue-950
            dark:text-blue-300
        `,
    },

    haute: {
        label: "Haute",
        className: `
            border-orange-200 bg-orange-50
            text-orange-700
            dark:border-orange-900
            dark:bg-orange-950
            dark:text-orange-300
        `,
    },

    urgente: {
        label: "Urgente",
        className: `
            border-red-200 bg-red-50
            text-red-700
            dark:border-red-900
            dark:bg-red-950
            dark:text-red-300
        `,
    },
};


// ============================================================
// UTILITAIRES
// ============================================================

function formatDateTime(
    date: string | null
): string {
    if (!date) {
        return "Non programmée";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}



/*
 * Utilise cette version si tu copies le code :
 */
function isActive(
    closingCase: ClosingCase
): boolean {
    return !["gagne", "perdu"].includes(
        closingCase.stage
    );
}

function getProspectInitials(
    fullName: string
): string {
    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase();
}


// ============================================================
// ÉTAT VIDE
// ============================================================

interface EmptyStateProps {
    title: string;
    description: string;
    icon: typeof Handshake;
}

function EmptyState({
    title,
    description,
    icon: Icon,
}: EmptyStateProps) {
    return (
        <div
            className="
                flex min-h-64 flex-col
                items-center justify-center
                rounded-xl border border-dashed
                border-slate-200 px-6 py-10
                text-center
                dark:border-slate-800
            "
        >
            <div
                className="
                    flex size-12 items-center
                    justify-center rounded-full
                    bg-slate-100
                    dark:bg-slate-900
                "
            >
                <Icon
                    className="
                        size-6 text-slate-500
                        dark:text-slate-400
                    "
                />
            </div>

            <h3
                className="
                    mt-4 text-sm font-semibold
                    text-slate-900
                    dark:text-slate-100
                "
            >
                {title}
            </h3>

            <p
                className="
                    mt-1 max-w-sm text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {description}
            </p>
        </div>
    );
}


// ============================================================
// CARTE PROSPECT
// ============================================================

interface ClosingCaseItemProps {
    closingCase: ClosingCase;
    displayFollowUp?: boolean;
}

function ClosingCaseItem({
    closingCase,
    displayFollowUp = false,
}: ClosingCaseItemProps) {
    const priority =
        priorityConfig[closingCase.priority];

    return (
        <div
            className="
                group flex flex-col gap-4
                rounded-xl border
                border-slate-200 bg-white p-4
                transition-colors
                hover:border-slate-300
                dark:border-slate-800
                dark:bg-slate-950
                dark:hover:border-slate-700
                sm:flex-row sm:items-center
                sm:justify-between
            "
        >
            <div
                className="
                    flex min-w-0 items-start gap-3
                "
            >
                <div
                    className="
                        flex size-10 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-slate-900 text-sm
                        font-semibold text-white
                        dark:bg-slate-100
                        dark:text-slate-950
                    "
                >
                    {getProspectInitials(
                        closingCase.prospect.full_name
                    )}
                </div>

                <div className="min-w-0">
                    <div
                        className="
                            flex flex-wrap
                            items-center gap-2
                        "
                    >
                        <p
                            className="
                                truncate font-medium
                                text-slate-950
                                dark:text-white
                            "
                        >
                            {
                                closingCase.prospect
                                    .full_name
                            }
                        </p>

                       
                    </div>

                    <div
                        className="
                            mt-1 flex flex-wrap
                            items-center gap-x-4
                            gap-y-1 text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center gap-1
                            "
                        >
                            <PhoneCall className="size-3.5" />

                            {closingCase.prospect.phone ??
                                "Aucun téléphone"}
                        </span>

                        <span>
                            Site :{" "}
                            {closingCase.visit.site
                                ?.nom_titre ??
                                "Non renseigné"}
                        </span>

                        <span>
                            Commercial :{" "}
                            {closingCase
                                .source_commercial
                                ?.full_name ??
                                "Non renseigné"}
                        </span>
                    </div>

                    {displayFollowUp && (
                        <p
                            className="
                                mt-2 inline-flex
                                items-center gap-1.5
                                text-xs font-medium
                                text-orange-600
                                dark:text-orange-400
                            "
                        >
                            <CalendarClock className="size-3.5" />

                            {formatDateTime(
                                closingCase.next_follow_up_at
                            )}
                        </p>
                    )}
                </div>
            </div>

            <Button
                
                variant="ghost"
                size="sm"
                className="shrink-0"
            >
                <Link
                    href={`/closing/prospects/${closingCase.id}`}
                >
                    Ouvrir

                    <ArrowRight className="size-4" />
                </Link>
            </Button>
        </div>
    );
}


// ============================================================
// PAGE PRINCIPALE
// ============================================================

export default function ClosingPage() {
    const {
        data: closingCases = [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useClosingCases();

    const stats = useMemo(
        () =>
            calculateClosingStats(
                closingCases
            ),
        [closingCases]
    );

    const newCases = useMemo(
        () =>
            closingCases
               
                .filter(
                    (closingCase) =>
                        closingCase.stage ===
                        "nouveau"
                )
                .sort(
                    (firstCase, secondCase) =>
                        new Date(
                            secondCase.created_at
                        ).getTime() -
                        new Date(
                            firstCase.created_at
                        ).getTime()
                )
                .slice(0, 5),
        [closingCases]
    );

    const urgentFollowUps = useMemo(() => {
        const endOfToday = new Date();

        endOfToday.setHours(
            23,
            59,
            59,
            999
        );

        return closingCases
            .filter((closingCase) => {
                if (
                    !isActive(closingCase) ||
                    !closingCase.next_follow_up_at
                ) {
                    return false;
                }

                return (
                    new Date(
                        closingCase.next_follow_up_at
                    ) <= endOfToday
                );
            })
            .sort(
                (firstCase, secondCase) =>
                    new Date(
                        firstCase.next_follow_up_at ??
                            0
                    ).getTime() -
                    new Date(
                        secondCase.next_follow_up_at ??
                            0
                    ).getTime()
            )
            .slice(0, 5);
    }, [closingCases]);

    const recentWins = useMemo(
        () =>
            closingCases
                .filter(
                    (closingCase) =>
                        closingCase.stage ===
                        "gagne"
                )
                .sort(
                    (firstCase, secondCase) =>
                        new Date(
                            secondCase.won_at ??
                                secondCase.updated_at
                        ).getTime() -
                        new Date(
                            firstCase.won_at ??
                                firstCase.updated_at
                        ).getTime()
                )
                .slice(0, 5),
        [closingCases]
    );

    return (
        <main
            className="
                min-h-screen bg-slate-50/60
                dark:bg-slate-950
            "
        >
            <div
                className="
                    mx-auto flex w-full
                    max-w-400 flex-col gap-6
                    p-4 sm:p-6 lg:p-8
                "
            >
                {/* En-tête */}

                <header
                    className="
                        flex flex-col gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div>
                        <div
                            className="
                                flex items-center gap-2
                            "
                        >
                            <div
                                className="
                                    flex size-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-600
                                    text-white shadow-sm
                                "
                            >
                                <Handshake className="size-5" />
                            </div>

                            <div>
                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-slate-950
                                        dark:text-white
                                    "
                                >
                                    Closing
                                </h1>

                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Suivi et conversion
                                    des prospects après
                                    leur visite
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            flex flex-wrap gap-2
                        "
                    >
                        <Button
                            variant="outline"
                            onClick={() => {
                                void refetch();
                            }}
                            disabled={isFetching}
                        >
                            {isFetching ? (
                                <Loader2
                                    className="
                                        size-4
                                        animate-spin
                                    "
                                />
                            ) : (
                                <RefreshCcw className="size-4" />
                            )}

                            Actualiser
                        </Button>

                        <Button >
                            <Link href="/closing/prospects">
                                Voir les prospects

                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* Erreur */}

                {isError && (
                    <div
                        role="alert"
                        className="
                            flex items-start gap-3
                            rounded-xl border
                            border-red-200
                            bg-red-50 p-4
                            text-red-700
                            dark:border-red-900
                            dark:bg-red-950/50
                            dark:text-red-300
                        "
                    >
                        <AlertCircle
                            className="
                                mt-0.5 size-5
                                shrink-0
                            "
                        />

                        <div>
                            <p className="font-medium">
                                Impossible de charger
                                les dossiers closing
                            </p>

                            <p className="mt-1 text-sm">
                                {error.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Statistiques */}

                <ClosingStatsCards
                    stats={stats}
                    isLoading={isLoading}
                />

                {/* Contenu principal */}

                <div
                    className="
                        grid gap-6
                        xl:grid-cols-2
                    "
                >
                    {/* Nouveaux dossiers */}

                    <Card
                        className="
                            border-slate-200
                            bg-white
                            dark:border-slate-800
                            dark:bg-slate-950
                        "
                    >
                        <CardHeader
                            className="
                                flex flex-row
                                items-start
                                justify-between
                                gap-4
                            "
                        >
                            <div>
                                <CardTitle
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <UserRoundPlus
                                        className="
                                            size-5
                                            text-blue-600
                                        "
                                    />

                                    Nouveaux dossiers
                                </CardTitle>

                                <CardDescription>
                                    Prospects ayant
                                    effectué une visite
                                    et attendant une prise
                                    en charge.
                                </CardDescription>
                            </div>

                            <Badge variant="secondary">
                                {newCases.length}
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <div
                                    className="
                                        flex min-h-64
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Loader2
                                        className="
                                            size-6
                                            animate-spin
                                            text-slate-400
                                        "
                                    />
                                </div>
                            ) : newCases.length >
                              0 ? (
                                <>
                                    {newCases.map(
                                        (
                                            closingCase
                                        ) => (
                                            <ClosingCaseItem
                                                key={
                                                    closingCase.id
                                                }
                                                closingCase={
                                                    closingCase
                                                }
                                            />
                                        )
                                    )}

                                    <Button
                                        
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link href="/closing/prospects?stage=nouveau">
                                            Voir tous les
                                            nouveaux dossiers
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <EmptyState
                                    icon={
                                        CheckCircle2
                                    }
                                    title="Aucun nouveau dossier"
                                    description="Toutes les visites effectuées ont déjà été prises en charge."
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Relances urgentes */}

                    <Card
                        className="
                            border-slate-200
                            bg-white
                            dark:border-slate-800
                            dark:bg-slate-950
                        "
                    >
                        <CardHeader
                            className="
                                flex flex-row
                                items-start
                                justify-between
                                gap-4
                            "
                        >
                            <div>
                                <CardTitle
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <Clock3
                                        className="
                                            size-5
                                            text-orange-600
                                        "
                                    />

                                    Relances urgentes
                                </CardTitle>

                                <CardDescription>
                                    Relances en retard ou
                                    prévues pour
                                    aujourd’hui.
                                </CardDescription>
                            </div>

                            <Badge
                                variant="outline"
                                className="
                                    border-orange-200
                                    bg-orange-50
                                    text-orange-700
                                    dark:border-orange-900
                                    dark:bg-orange-950
                                    dark:text-orange-300
                                "
                            >
                                {
                                    urgentFollowUps.length
                                }
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <div
                                    className="
                                        flex min-h-64
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Loader2
                                        className="
                                            size-6
                                            animate-spin
                                            text-slate-400
                                        "
                                    />
                                </div>
                            ) : urgentFollowUps.length >
                              0 ? (
                                <>
                                    {urgentFollowUps.map(
                                        (
                                            closingCase
                                        ) => (
                                            <ClosingCaseItem
                                                key={
                                                    closingCase.id
                                                }
                                                closingCase={
                                                    closingCase
                                                }
                                                displayFollowUp
                                            />
                                        )
                                    )}

                                    <Button
                                        
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link href="/closing/follow-ups">
                                            Voir toutes les
                                            relances
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <EmptyState
                                    icon={
                                        CalendarClock
                                    }
                                    title="Aucune relance urgente"
                                    description="Aucune relance en retard ou programmée aujourd’hui."
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Dernières conversions */}

                <Card
                    className="
                        border-slate-200 bg-white
                        dark:border-slate-800
                        dark:bg-slate-950
                    "
                >
                    <CardHeader
                        className="
                            flex flex-row
                            items-start
                            justify-between
                            gap-4
                        "
                    >
                        <div>
                            <CardTitle
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <CheckCircle2
                                    className="
                                        size-5
                                        text-emerald-600
                                    "
                                />

                                Dernières conversions
                            </CardTitle>

                            <CardDescription>
                                Les derniers prospects
                                transformés en clients.
                            </CardDescription>
                        </div>

                        <Badge
                            variant="outline"
                            className="
                                border-emerald-200
                                bg-emerald-50
                                text-emerald-700
                                dark:border-emerald-900
                                dark:bg-emerald-950
                                dark:text-emerald-300
                            "
                        >
                            {stats.wonCases}
                        </Badge>
                    </CardHeader>

                    <CardContent>
                        {isLoading ? (
                            <div
                                className="
                                    flex min-h-40
                                    items-center
                                    justify-center
                                "
                            >
                                <Loader2
                                    className="
                                        size-6
                                        animate-spin
                                        text-slate-400
                                    "
                                />
                            </div>
                        ) : recentWins.length > 0 ? (
                            <div
                                className="
                                    grid gap-3
                                    lg:grid-cols-2
                                "
                            >
                                {recentWins.map(
                                    (closingCase) => (
                                        <ClosingCaseItem
                                            key={
                                                closingCase.id
                                            }
                                            closingCase={
                                                closingCase
                                            }
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Handshake}
                                title="Aucune conversion"
                                description="Les dossiers gagnés apparaîtront dans cette section."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}