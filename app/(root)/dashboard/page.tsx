"use client";

import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Building2,
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    Eye,
    Flag,
    Globe2,
    Handshake,
    LandPlot,
    Megaphone,
    Target,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";

import Link from "next/link";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const executiveStats = [
    {
        title: "CA estimé",
        value: "86,5M FCFA",
        description: "Potentiel signé ou fortement probable",
        trend: "+18%",
        trendType: "up",
        icon: Wallet,
    },
    {
        title: "Pipeline commercial",
        value: "214M FCFA",
        description: "Opportunités en cours",
        trend: "+24%",
        trendType: "up",
        icon: CircleDollarSign,
    },
    {
        title: "Clients convertis",
        value: "18",
        description: "Ce mois-ci",
        trend: "+7%",
        trendType: "up",
        icon: Handshake,
    },
    {
        title: "Relances en retard",
        value: "31",
        description: "Actions commerciales critiques",
        trend: "+12%",
        trendType: "down",
        icon: AlertTriangle,
    },
];

const revenueEvolution = [
    {
        month: "Jan",
        estimated: 32000000,
        won: 18000000,
    },
    {
        month: "Fév",
        estimated: 46000000,
        won: 22000000,
    },
    {
        month: "Mar",
        estimated: 58000000,
        won: 31000000,
    },
    {
        month: "Avr",
        estimated: 72000000,
        won: 44000000,
    },
    {
        month: "Mai",
        estimated: 86500000,
        won: 53000000,
    },
    {
        month: "Juin",
        estimated: 94000000,
        won: 61000000,
    },
];

const pipelineByStatus = [
    {
        status: "Nouveau",
        value: 42,
    },
    {
        status: "Qualifié",
        value: 31,
    },
    {
        status: "Négociation",
        value: 19,
    },
    {
        status: "Réservation",
        value: 11,
    },
    {
        status: "Gagné",
        value: 18,
    },
    {
        status: "Perdu",
        value: 9,
    },
];

const acquisitionChannels = [
    {
        name: "WhatsApp",
        leads: 74,
        conversions: 26,
    },
    {
        name: "Site web",
        leads: 56,
        conversions: 18,
    },
    {
        name: "Facebook",
        leads: 132,
        conversions: 21,
    },
    {
        name: "Recommandation",
        leads: 38,
        conversions: 20,
    },
    {
        name: "Google",
        leads: 34,
        conversions: 9,
    },
];

const commercialPerformance = [
    {
        name: "Sandra",
        prospects: 42,
        conversions: 12,
        objective: 80,
    },
    {
        name: "Michel",
        prospects: 37,
        conversions: 9,
        objective: 70,
    },
    {
        name: "Patrick",
        prospects: 28,
        conversions: 6,
        objective: 52,
    },
    {
        name: "Nadine",
        prospects: 31,
        conversions: 8,
        objective: 64,
    },
];

const conversionFunnel = [
    {
        label: "Leads",
        value: 428,
        rate: 100,
    },
    {
        label: "Prospects qualifiés",
        value: 182,
        rate: 42,
    },
    {
        label: "Opportunités",
        value: 96,
        rate: 22,
    },
    {
        label: "Réservations",
        value: 41,
        rate: 10,
    },
    {
        label: "Clients",
        value: 18,
        rate: 4,
    },
];

const sitesPerformance = [
    {
        id: "SITE-001",
        name: "Domaine Heritage — PK27",
        location: "Douala, PK27",
        status: "Disponible",
        requests: 64,
        visits: 18,
        reservations: 7,
        estimatedRevenue: "48M FCFA",
        risk: "Faible",
    },
    {
        id: "SITE-002",
        name: "Site résidentiel Logbessou",
        location: "Douala, Logbessou",
        status: "En vérification",
        requests: 41,
        visits: 9,
        reservations: 2,
        estimatedRevenue: "22M FCFA",
        risk: "Moyen",
    },
    {
        id: "SITE-003",
        name: "Terrain Yassa Extension",
        location: "Douala, Yassa",
        status: "Bloqué",
        requests: 29,
        visits: 4,
        reservations: 0,
        estimatedRevenue: "0 FCFA",
        risk: "Élevé",
    },
];

const alerts = [
    {
        title: "31 relances commerciales en retard",
        description:
            "Des prospects qualifiés n’ont pas été relancés dans les délais. Risque de perte commerciale.",
        priority: "Critique",
        module: "Commercial",
    },
    {
        title: "2 sites avec documents incomplets",
        description:
            "Les sites en vérification ne doivent pas être publiés tant que les documents fonciers ne sont pas validés.",
        priority: "Élevée",
        module: "Topographie",
    },
    {
        title: "Facebook génère beaucoup de leads peu qualifiés",
        description:
            "Le volume est élevé, mais le taux de conversion reste inférieur aux canaux WhatsApp et Recommandation.",
        priority: "Moyenne",
        module: "Digital",
    },
    {
        title: "Yassa Extension est bloqué fournisseur",
        description:
            "Le site attire des demandes, mais aucun revenu n’est possible tant que le blocage fournisseur n’est pas levé.",
        priority: "Élevée",
        module: "Sites",
    },
];

const decisions = [
    {
        title: "Prioriser WhatsApp et Recommandation",
        description:
            "Ces canaux convertissent mieux que Facebook. Il faut renforcer les relances et le suivi commercial sur ces sources.",
        impact: "Impact élevé",
    },
    {
        title: "Débloquer les sites à fort potentiel",
        description:
            "Les sites avec beaucoup de demandes mais documents incomplets doivent être traités en priorité par la topographie.",
        impact: "Impact élevé",
    },
    {
        title: "Réduire les campagnes peu qualifiées",
        description:
            "Les campagnes Facebook doivent intégrer des questions de qualification : budget, zone, délai d’achat.",
        impact: "Impact moyen",
    },
    {
        title: "Mettre un objectif hebdomadaire par commercial",
        description:
            "La performance commerciale doit être pilotée avec des objectifs de relance, visite et conversion.",
        impact: "Impact élevé",
    },
];

function formatCurrency(value: number) {
    return `${value.toLocaleString("fr-FR")} FCFA`;
}

function getTrendBadge(type: string, value: string) {
    if (type === "up") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                {value}
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">
            <ArrowDownRight className="mr-1 h-3 w-3" />
            {value}
        </Badge>
    );
}

function getPriorityBadge(priority: string) {
    if (priority === "Critique") {
        return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">
                Critique
            </Badge>
        );
    }

    if (priority === "Élevée") {
        return (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300">
                Élevée
            </Badge>
        );
    }

    return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300">
            Moyenne
        </Badge>
    );
}

function getRiskBadge(risk: string) {
    if (risk === "Faible") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
                Faible
            </Badge>
        );
    }

    if (risk === "Moyen") {
        return (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300">
                Moyen
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">
            Élevé
        </Badge>
    );
}

export default function ExecutiveDashboardPage() {
    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <Badge variant="outline" className="rounded-full">
                        Tableau de bord général
                    </Badge>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Vue Direction Générale
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Synthèse décisionnelle du CRM Heritage : performance commerciale,
                        acquisition, pipeline, sites stratégiques, risques et actions
                        prioritaires.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <CalendarClock className="mr-2 h-4 w-4" />
                        Ce mois
                    </Button>

                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Rapport
                    </Button>
                </div>
            </div>

            {/* Executive KPI */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {executiveStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>

                                <div className="rounded-xl bg-muted p-2">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    {getTrendBadge(stat.trendType, stat.trend)}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Decision insight */}
            <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40">
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                            <TrendingUp className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-emerald-950 dark:text-emerald-100">
                                Décision prioritaire recommandée
                            </h3>
                            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                                Renforcer WhatsApp, Recommandation et Site web, car ces canaux
                                convertissent mieux que les campagnes à fort volume mais peu
                                qualifiées.
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" className="bg-background">
                        <Link href="/dashboard/digital/analytics">
                            Voir analytics digital
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Revenue + Pipeline */}
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution du chiffre d’affaires</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comparaison entre le chiffre d’affaires potentiel et le chiffre
                            d’affaires gagné.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueEvolution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === "number" ? formatCurrency(value) : value
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="estimated"
                                        name="CA estimé"
                                        stroke="var(--chart-1)"
                                        fill="var(--chart-1)"
                                        fillOpacity={0.15}
                                        strokeWidth={3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="won"
                                        name="CA gagné"
                                        stroke="var(--chart-2)"
                                        fill="var(--chart-2)"
                                        fillOpacity={0.12}
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pipeline par statut</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Répartition des prospects et opportunités.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pipelineByStatus}
                                        dataKey="value"
                                        nameKey="status"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={3}
                                    >
                                        {pipelineByStatus.map((item) => (
                                            <Cell key={item.status} fill="var(--chart-1)" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 grid gap-2">
                            {pipelineByStatus.map((item) => (
                                <div
                                    key={item.status}
                                    className="flex items-center justify-between rounded-xl border p-3 text-sm"
                                >
                                    <span className="text-muted-foreground">{item.status}</span>
                                    <span className="font-semibold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Acquisition + Commercial performance */}
            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance par canal d’acquisition</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comparaison des leads et conversions par source.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={acquisitionChannels}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="leads"
                                        name="Leads"
                                        fill="var(--chart-1)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="conversions"
                                        name="Conversions"
                                        fill="var(--chart-2)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance commerciale</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comparaison des prospects traités, conversions et objectifs.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={commercialPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="prospects"
                                        name="Prospects"
                                        fill="var(--chart-1)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="conversions"
                                        name="Conversions"
                                        fill="var(--chart-2)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 grid gap-3">
                            {commercialPerformance.map((item) => (
                                <div key={item.name}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span>{item.name}</span>
                                        <span className="font-medium">
                                            Objectif atteint : {item.objective}%
                                        </span>
                                    </div>
                                    <Progress value={item.objective} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle>Tunnel de conversion global</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Visualisation du parcours depuis le lead jusqu’au client.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                        {conversionFunnel.map((step, index) => (
                            <div key={step.label} className="relative">
                                <div className="rounded-2xl border bg-muted/30 p-5 text-center">
                                    <p className="text-sm text-muted-foreground">{step.label}</p>
                                    <p className="mt-2 text-3xl font-bold">{step.value}</p>

                                    <div className="mt-4">
                                        <Progress value={step.rate} />
                                    </div>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {step.rate}% du volume initial
                                    </p>
                                </div>

                                {index < conversionFunnel.length - 1 && (
                                    <div className="hidden md:block">
                                        <ArrowUpRight className="absolute -right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Strategic sites + alerts */}
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Sites stratégiques</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Sites qui influencent directement le chiffre d’affaires.
                            </p>
                        </div>

                        <Button variant="outline">
                            <Link href="/dashboard/topography/sites">
                                Voir sites
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {sitesPerformance.map((site) => (
                            <div key={site.id} className="rounded-2xl border p-4">
                                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">{site.name}</h3>
                                            {getRiskBadge(site.risk)}
                                        </div>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {site.location} · {site.status}
                                        </p>
                                    </div>

                                    <Badge variant="outline">{site.estimatedRevenue}</Badge>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <MiniInfo label="Demandes" value={site.requests} />
                                    <MiniInfo label="Visites" value={site.visits} />
                                    <MiniInfo label="Réservations" value={site.reservations} />
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button variant="outline" size="sm">
                                        <Link href={`/dashboard/topography/sites/${site.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Détail
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alertes critiques</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Points qui nécessitent une décision ou une action rapide.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.title} className="rounded-2xl border p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">{alert.title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {alert.description}
                                            </p>
                                        </div>
                                    </div>

                                    {getPriorityBadge(alert.priority)}
                                </div>

                                <Badge variant="outline" className="mt-3">
                                    {alert.module}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Decisions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recommandations de décision</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Actions prioritaires proposées à la direction.
                    </p>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    {decisions.map((decision) => (
                        <div key={decision.title} className="rounded-2xl border p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                    <Flag className="h-5 w-5" />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold">{decision.title}</h3>
                                        <Badge variant="outline">{decision.impact}</Badge>
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {decision.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Bottom navigation */}
            <div className="grid gap-4 md:grid-cols-4">
                <QuickAccess
                    title="Commercial"
                    description="Prospects, clients et opportunités"
                    href="/marketing"
                    icon={Users}
                />

                <QuickAccess
                    title="Digital"
                    description="Canaux, campagnes et analytics"
                    href="/digital"
                    icon={Megaphone}
                />

                <QuickAccess
                    title="Topographie"
                    description="Sites, fournisseurs et disponibilité"
                    href="/topographiques/sites"
                    icon={LandPlot}
                />

                <QuickAccess
                    title="Corporate"
                    description="Comptes et opportunités grands clients"
                    href="/corporate"
                    icon={Building2}
                />
            </div>
        </div>
    );
}

function MiniInfo({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}

function QuickAccess({
    title,
    description,
    href,
    icon: Icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}) {
    return (
        <Link href={href}>
            <Card className="h-full transition hover:bg-muted/40">
                <CardContent className="flex gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}