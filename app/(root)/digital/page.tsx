"use client";

import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Download,
    Eye,
    Filter,
    Globe2,
    MessageCircle,
    MousePointerClick,
    PieChart,
    Share2,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";

import Link from "next/link";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const analyticsStats = [
    {
        title: "Leads digitaux",
        value: "428",
        variation: "+18%",
        trend: "up",
        description: "Sur les 30 derniers jours",
        icon: Users,
    },
    {
        title: "Leads qualifiés",
        value: "182",
        variation: "+11%",
        trend: "up",
        description: "42% des leads générés",
        icon: Target,
    },
    {
        title: "Conversions",
        value: "74",
        variation: "+7%",
        trend: "up",
        description: "Leads devenus prospects ou clients",
        icon: CheckCircle2,
    },
    {
        title: "Coût moyen / lead",
        value: "920 FCFA",
        variation: "-9%",
        trend: "down",
        description: "Amélioration du coût d’acquisition",
        icon: CircleDollarSign,
    },
];

const monthlyEvolution = [
    {
        month: "Jan",
        leads: 92,
        qualified: 31,
        conversions: 11,
        cost: 28000,
    },
    {
        month: "Fév",
        leads: 118,
        qualified: 46,
        conversions: 16,
        cost: 36000,
    },
    {
        month: "Mar",
        leads: 156,
        qualified: 61,
        conversions: 24,
        cost: 61000,
    },
    {
        month: "Avr",
        leads: 210,
        qualified: 88,
        conversions: 31,
        cost: 72500,
    },
    {
        month: "Mai",
        leads: 428,
        qualified: 182,
        conversions: 74,
        cost: 85000,
    },
    {
        month: "Juin",
        leads: 390,
        qualified: 160,
        conversions: 68,
        cost: 79000,
    },
];

const yearlyEvolution = [
    {
        year: "2022",
        leads: 520,
        conversions: 82,
    },
    {
        year: "2023",
        leads: 980,
        conversions: 146,
    },
    {
        year: "2024",
        leads: 1380,
        conversions: 241,
    },
    {
        year: "2025",
        leads: 2140,
        conversions: 386,
    },
    {
        year: "2026",
        leads: 2890,
        conversions: 612,
    },
];

const channelDistribution = [
    {
        name: "Facebook",
        value: 132,
    },
    {
        name: "WhatsApp",
        value: 74,
    },
    {
        name: "Site web",
        value: 56,
    },
    {
        name: "Google",
        value: 34,
    },
    {
        name: "Recommandation",
        value: 38,
    },
    {
        name: "Affiches",
        value: 42,
    },
];

const conversionByChannel = [
    {
        channel: "WhatsApp",
        conversion: 35,
    },
    {
        channel: "Site web",
        conversion: 32,
    },
    {
        channel: "Recommandation",
        conversion: 53,
    },
    {
        channel: "Facebook",
        conversion: 16,
    },
    {
        channel: "Google",
        conversion: 26,
    },
    {
        channel: "Affiches",
        conversion: 17,
    },
];

const campaignPerformance = [
    {
        name: "Terrains PK27",
        budget: 50000,
        leads: 74,
        conversions: 13,
    },
    {
        name: "Diaspora",
        budget: 35000,
        leads: 38,
        conversions: 6,
    },
    {
        name: "Logbessou",
        budget: 25000,
        leads: 20,
        conversions: 2,
    },
    {
        name: "WhatsApp relance",
        budget: 10000,
        leads: 44,
        conversions: 17,
    },
];

const funnel = [
    {
        label: "Leads générés",
        value: 428,
        rate: 100,
    },
    {
        label: "Leads contactés",
        value: 301,
        rate: 70,
    },
    {
        label: "Leads qualifiés",
        value: 182,
        rate: 42,
    },
    {
        label: "Opportunités créées",
        value: 96,
        rate: 22,
    },
    {
        label: "Conversions",
        value: 74,
        rate: 17,
    },
];

const topPages = [
    {
        page: "Page Terrains PK27",
        views: 1840,
        leads: 64,
        conversionRate: 3.5,
    },
    {
        page: "Page Contact",
        views: 1260,
        leads: 42,
        conversionRate: 3.3,
    },
    {
        page: "Page Détails Logbessou",
        views: 980,
        leads: 28,
        conversionRate: 2.8,
    },
    {
        page: "Page Accueil",
        views: 3100,
        leads: 51,
        conversionRate: 1.6,
    },
];

const channelPerformance = [
    {
        id: "whatsapp",
        name: "WhatsApp Business",
        category: "Messagerie",
        leads: 74,
        qualified: 52,
        conversions: 26,
        conversionRate: 35,
        costPerLead: "0 FCFA",
        icon: MessageCircle,
        status: "Très performant",
    },
    {
        id: "website",
        name: "Site web Heritage",
        category: "Web",
        leads: 56,
        qualified: 39,
        conversions: 18,
        conversionRate: 32,
        costPerLead: "0 FCFA",
        icon: Globe2,
        status: "Très performant",
    },
    {
        id: "referral",
        name: "Recommandation",
        category: "Relationnel",
        leads: 38,
        qualified: 30,
        conversions: 20,
        conversionRate: 53,
        costPerLead: "0 FCFA",
        icon: Users,
        status: "Excellent",
    },
    {
        id: "facebook",
        name: "Facebook",
        category: "Réseau social",
        leads: 132,
        qualified: 48,
        conversions: 21,
        conversionRate: 16,
        costPerLead: "644 FCFA",
        icon: Share2,
        status: "Moyen",
    },
    {
        id: "google",
        name: "Google Search",
        category: "Recherche",
        leads: 34,
        qualified: 20,
        conversions: 9,
        conversionRate: 26,
        costPerLead: "882 FCFA",
        icon: MousePointerClick,
        status: "Bon",
    },
];

const recommendations = [
    {
        title: "Renforcer WhatsApp Business",
        description:
            "Le canal convertit très bien. Il faut connecter les formulaires web vers WhatsApp et assigner rapidement les conversations aux commerciaux.",
        priority: "Élevée",
    },
    {
        title: "Améliorer la qualification Facebook",
        description:
            "Facebook génère beaucoup de leads, mais une partie est peu qualifiée. Ajoute des questions sur le budget, la zone recherchée et le délai d’achat.",
        priority: "Élevée",
    },
    {
        title: "Ajouter des CTA sur les pages de détails",
        description:
            "Les pages de sites doivent avoir des boutons visibles : demander une visite, discuter sur WhatsApp, être rappelé.",
        priority: "Moyenne",
    },
    {
        title: "Créer des codes de tracking offline",
        description:
            "Pour les affiches, radio et terrain, utilise QR codes, numéros dédiés ou codes campagne pour mesurer l’origine des leads.",
        priority: "Moyenne",
    },
];

function getTrendBadge(trend: string, variation: string) {
    if (trend === "up") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                {variation}
            </Badge>
        );
    }

    return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <ArrowDownRight className="mr-1 h-3 w-3" />
            {variation}
        </Badge>
    );
}

function getPerformanceBadge(status: string) {
    if (status === "Excellent" || status === "Très performant") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                {status}
            </Badge>
        );
    }

    if (status === "Bon") {
        return (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Bon
            </Badge>
        );
    }

    if (status === "Moyen") {
        return (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                Moyen
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Faible
        </Badge>
    );
}

function getPriorityBadge(priority: string) {
    if (priority === "Élevée") {
        return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Élevée
            </Badge>
        );
    }

    return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Moyenne
        </Badge>
    );
}

function formatCurrency(value: number) {
    return `${value.toLocaleString("fr-FR")} FCFA`;
}

export default function DigitalAnalyticsPage() {
    const totalLeads = analyticsStats[0].value;

    const bestChannel = channelPerformance.reduce((best, current) =>
        current.conversionRate > best.conversionRate ? current : best
    );

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <Badge variant="outline" className="rounded-full">
                        Module digital
                    </Badge>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Analytics digital
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Analysez l’évolution des leads, les conversions, les canaux
                        d’acquisition, les campagnes et la rentabilité digitale de Heritage.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        30 derniers jours
                    </Button>

                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrer
                    </Button>

                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {analyticsStats.map((stat) => {
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
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    {getTrendBadge(stat.trend, stat.variation)}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main insight */}
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                <Card className="border-emerald-200 bg-emerald-50">
                    <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <TrendingUp className="h-5 w-5" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-emerald-950">
                                    Meilleur canal : {bestChannel.name}
                                </h3>
                                <p className="mt-1 text-sm text-emerald-800">
                                    Ce canal a le meilleur taux de conversion avec{" "}
                                    {bestChannel.conversionRate}%. Il faut le renforcer dans les
                                    campagnes et le suivi commercial.
                                </p>
                            </div>
                        </div>

                        <Button variant="outline" className="bg-white">
                            <Link href={`/dashboard/digital/acquisition-channels/${bestChannel.id}`}>
                                Voir détail
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <BarChart3 className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total leads analysés
                            </p>
                            <p className="text-2xl font-bold">{totalLeads}</p>
                            <p className="text-xs text-muted-foreground">
                                Digital + campagnes + site web
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Graphes principaux */}
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution mensuelle des leads</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Leads générés, leads qualifiés et conversions par mois.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyEvolution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="leads"
                                        name="Leads"
                                        stroke="#2563eb"
                                        fill="#dbeafe"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="qualified"
                                        name="Qualifiés"
                                        stroke="#16a34a"
                                        fill="#dcfce7"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="conversions"
                                        name="Conversions"
                                        stroke="#9333ea"
                                        fill="#f3e8ff"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Répartition des leads</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Volume de leads par canal.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={channelDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={3}
                                    >
                                        {channelDistribution.map((entry) => (
                                            <Cell key={entry.name} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 grid gap-2">
                            {channelDistribution.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between rounded-xl border p-3 text-sm"
                                >
                                    <span className="text-muted-foreground">{item.name}</span>
                                    <span className="font-semibold">{item.value} leads</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Évolution annuelle + conversion par canal */}
            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution annuelle</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comparaison des leads et conversions par année.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={yearlyEvolution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="leads"
                                        name="Leads"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="conversions"
                                        name="Conversions"
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Taux de conversion par canal</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comparaison des canaux selon leur capacité à convertir.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={conversionByChannel}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="channel" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="conversion"
                                        name="Taux conversion (%)"
                                        radius={[8, 8, 0, 0]}
                                        fill="#2563eb"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Campagnes + coût */}
            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance des campagnes</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comparaison entre budget, leads et conversions.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={campaignPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => value} />
                                    <Bar
                                        dataKey="leads"
                                        name="Leads"
                                        radius={[8, 8, 0, 0]}
                                        fill="#2563eb"
                                    />
                                    <Bar
                                        dataKey="conversions"
                                        name="Conversions"
                                        radius={[8, 8, 0, 0]}
                                        fill="#16a34a"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Évolution du budget mensuel</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Budget consommé par mois pour générer les leads.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyEvolution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === "number" ? formatCurrency(value) : value
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="cost"
                                        name="Budget"
                                        stroke="#ea580c"
                                        fill="#ffedd5"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Schéma tunnel de conversion */}
            <Card>
                <CardHeader>
                    <CardTitle>Schéma du tunnel de conversion</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Visualisation du passage du lead entrant jusqu’à la conversion.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                        {funnel.map((step, index) => (
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

                                {index < funnel.length - 1 && (
                                    <div className="hidden md:block">
                                        <ArrowUpRight className="absolute -right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Schéma d’acquisition */}
            <Card>
                <CardHeader>
                    <CardTitle>Schéma global d’acquisition digitale</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Comment les canaux alimentent les leads, puis les prospects et les
                        clients.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
                        <SchemaBox
                            title="Canaux"
                            description="Facebook, WhatsApp, Google, site web, affiches"
                            icon={Share2}
                        />

                        <SchemaArrow />

                        <SchemaBox
                            title="Leads"
                            description="Demandes entrantes, formulaires, messages"
                            icon={Users}
                        />

                        <SchemaArrow />

                        <SchemaBox
                            title="Qualification"
                            description="Budget, besoin, zone, délai, intérêt réel"
                            icon={Target}
                        />

                        <SchemaArrow />

                        <SchemaBox
                            title="Conversion"
                            description="Prospect, visite, réservation ou client"
                            icon={CheckCircle2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Pages + canaux */}
            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Pages web les plus efficaces</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pages publiques Heritage qui génèrent des vues et des demandes.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {topPages.map((page) => (
                            <div key={page.page} className="rounded-2xl border p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">{page.page}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {page.views.toLocaleString()} vues · {page.leads} leads
                                        </p>
                                    </div>

                                    <Badge variant="outline">{page.conversionRate}%</Badge>
                                </div>

                                <div className="mt-4">
                                    <Progress value={page.conversionRate * 10} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance par canal</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Compare les canaux selon les leads, conversions et coût par lead.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {channelPerformance.map((channel) => {
                            const Icon = channel.icon;

                            return (
                                <div
                                    key={channel.id}
                                    className="rounded-2xl border p-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold">{channel.name}</h3>
                                                    {getPerformanceBadge(channel.status)}
                                                </div>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {channel.category}
                                                </p>
                                            </div>
                                        </div>

                                        <Button variant="outline" size="icon">
                                            <Link
                                                href={`/dashboard/digital/acquisition-channels/${channel.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
                                        <InfoMini label="Leads" value={channel.leads} />
                                        <InfoMini label="Qualifiés" value={channel.qualified} />
                                        <InfoMini label="Conversions" value={channel.conversions} />
                                        <InfoMini label="CPL" value={channel.costPerLead} />
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span>Conversion</span>
                                            <span className="font-medium">
                                                {channel.conversionRate}%
                                            </span>
                                        </div>
                                        <Progress value={channel.conversionRate} />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle>Recommandations marketing</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Actions proposées pour améliorer l’acquisition et la conversion.
                    </p>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    {recommendations.map((recommendation) => (
                        <div key={recommendation.title} className="rounded-2xl border p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">{recommendation.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {recommendation.description}
                                        </p>
                                    </div>
                                </div>

                                {getPriorityBadge(recommendation.priority)}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Bottom note */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="flex gap-3 p-5">
                    <PieChart className="mt-0.5 h-5 w-5 text-blue-700" />

                    <div>
                        <h3 className="font-semibold text-blue-950">
                            Connexions futures
                        </h3>
                        <p className="mt-1 text-sm text-blue-800">
                            Ces graphes pourront être alimentés par Supabase, Google
                            Analytics, Meta Ads, WhatsApp Business API et les formulaires du
                            site web Heritage.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function InfoMini({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}

function SchemaBox({
    title,
    description,
    icon: Icon,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-2xl border bg-muted/30 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm">
                <Icon className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

function SchemaArrow() {
    return (
        <div className="hidden items-center justify-center lg:flex">
            <ArrowUpRight className="h-7 w-7 text-muted-foreground" />
        </div>
    );
}