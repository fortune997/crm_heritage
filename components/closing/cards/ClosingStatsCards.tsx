"use client";

import {
    AlertTriangle,
    BadgeCheck,
    BriefcaseBusiness,
    Clock3,
    DollarSign,
    PhoneCall,
    Target,
    UserRoundPlus,
    type LucideIcon,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import type {
    ClosingStats,
} from "@/core/types/closing";


// ============================================================
// PROPS
// ============================================================

interface ClosingStatsCardsProps {
    stats?: ClosingStats;
    isLoading?: boolean;
}


// ============================================================
// TYPES INTERNES
// ============================================================

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    iconClassName: string;
}


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

function formatPercentage(
    percentage: number
): string {
    return `${percentage.toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        }
    )} %`;
}


// ============================================================
// CARTE STATISTIQUE
// ============================================================

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}: StatCardProps) {
    return (
        <Card
            className="
                relative overflow-hidden
                border-slate-200 bg-white
                shadow-sm transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-md
                dark:border-slate-800 dark:bg-slate-950
            "
        >
            <div
                className={`
                    absolute inset-x-0 top-0 h-1
                    ${iconClassName}
                `}
            />

            <CardHeader
                className="
                    flex flex-row items-start
                    justify-between gap-4
                    space-y-0 pb-2
                "
            >
                <div className="min-w-0">
                    <CardTitle
                        className="
                            truncate text-sm font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {title}
                    </CardTitle>
                </div>

                <div
                    className={`
                        flex size-10 shrink-0
                        items-center justify-center
                        rounded-xl text-white
                        shadow-sm
                        ${iconClassName}
                    `}
                >
                    <Icon
                        className="size-5"
                        aria-hidden="true"
                    />
                </div>
            </CardHeader>

            <CardContent>
                <p
                    className="
                        text-2xl font-bold tracking-tight
                        text-slate-950
                        dark:text-white
                    "
                >
                    {value}
                </p>

                <p
                    className="
                        mt-1 line-clamp-1
                        text-xs text-slate-500
                        dark:text-slate-400
                    "
                >
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}


// ============================================================
// SKELETON
// ============================================================

export function ClosingStatsCardsSkeleton() {
    return (
        <div
            className="
                grid gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >
            {Array.from({
                length: 8,
            }).map((_, index) => (
                <Card
                    key={index}
                    className="
                        border-slate-200
                        dark:border-slate-800
                    "
                >
                    <CardHeader
                        className="
                            flex flex-row items-start
                            justify-between
                            space-y-0 pb-2
                        "
                    >
                        <Skeleton className="h-4 w-28" />

                        <Skeleton
                            className="
                                size-10 rounded-xl
                            "
                        />
                    </CardHeader>

                    <CardContent>
                        <Skeleton className="h-8 w-20" />

                        <Skeleton
                            className="
                                mt-2 h-3 w-36
                            "
                        />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function ClosingStatsCards({
    stats,
    isLoading = false,
}: ClosingStatsCardsProps) {
    if (isLoading || !stats) {
        return (
            <ClosingStatsCardsSkeleton />
        );
    }

    const cards: StatCardProps[] = [
        {
            title: "Total des dossiers",
            value: stats.totalCases,
            description:
                "Tous les prospects transmis au closing",
            icon: BriefcaseBusiness,
            iconClassName:
                "bg-slate-700 dark:bg-slate-600",
        },
        {
            title: "Nouveaux dossiers",
            value: stats.newCases,
            description:
                "Visites effectuées à prendre en charge",
            icon: UserRoundPlus,
            iconClassName:
                "bg-blue-600 dark:bg-blue-500",
        },
        {
            title: "À contacter",
            value: stats.toContact,
            description:
                "Prospects en attente du premier contact",
            icon: PhoneCall,
            iconClassName:
                "bg-violet-600 dark:bg-violet-500",
        },
        {
            title: "Relances aujourd’hui",
            value: stats.followUpsToday,
            description:
                "Actions commerciales prévues aujourd’hui",
            icon: Clock3,
            iconClassName:
                "bg-amber-500 dark:bg-amber-500",
        },
        {
            title: "Relances en retard",
            value: stats.overdueFollowUps,
            description:
                "Relances nécessitant une action immédiate",
            icon: AlertTriangle,
            iconClassName:
                "bg-red-600 dark:bg-red-500",
        },
        {
            title: "En négociation",
            value: stats.negotiating,
            description:
                `${stats.interested} prospect(s) intéressé(s)`,
            icon: Target,
            iconClassName:
                "bg-orange-600 dark:bg-orange-500",
        },
        {
            title: "Ventes conclues",
            value: stats.wonCases,
            description:
                `Taux de conversion : ${formatPercentage(
                    stats.conversionRate
                )}`,
            icon: BadgeCheck,
            iconClassName:
                "bg-emerald-600 dark:bg-emerald-500",
        },
        {
            title: "Pipeline potentiel",
            value: formatCurrency(
                stats.estimatedPipelineAmount
            ),
            description:
                `${formatCurrency(
                    stats.convertedAmount
                )} déjà convertis`,
            icon: DollarSign,
            iconClassName:
                "bg-cyan-600 dark:bg-cyan-500",
        },
    ];

    return (
        <section
            aria-label="Statistiques du closing"
            className="
                grid gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >
            {cards.map((card) => (
                <StatCard
                    key={card.title}
                    {...card}
                />
            ))}
        </section>
    );
}