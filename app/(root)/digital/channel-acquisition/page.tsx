"use client"


import {
    ArrowUpRight,
    BarChart3,
    Building2,
    CheckCircle2,
    DollarSign,
    Eye,
    Filter,
    Globe2,

    Mail,

    MapPin,

    Megaphone,
    MessageCircle,
    MessageSquare,
    MoreHorizontal,
    MousePointerClick,
    Phone,
    Plus,
    Radio,
    Search,
    Share2,
    Smartphone,
    TrendingUp,
    Users,
    XCircle,

} from "lucide-react";



import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanal } from "@/core/hooks/canal/useCanal";
import AcquisitionChannelsSkeleton from "@/components/skeleton/AcquisitionChannelsSkeleton";


const acquisitionStats = [
    {
        title: "Canaux actifs",
        value: "12",
        description: "Sources actuellement utilisées",
        icon: Share2,
    },
    {
        title: "Leads générés",
        value: "428",
        description: "Sur les 30 derniers jours",
        icon: Users,
    },
    {
        title: "Conversions",
        value: "74",
        description: "Leads devenus prospects qualifiés",
        icon: CheckCircle2,
    },
    {
        title: "Coût moyen / lead",
        value: "920 FCFA",
        description: "Campagnes sponsorisées incluses",
        icon: DollarSign,
    },
];



function getStatusBadge(status: string) {
    if (status === "Actif") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Actif
            </Badge>
        );
    }

    if (status === "En test") {
        return (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                En test
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Inactif
        </Badge>
    );
}

function getCategoryBadge(category: string) {
    const map: Record<string, React.ReactNode> = {
        Digital: (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Digital
            </Badge>
        ),
        Terrain: (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Terrain
            </Badge>
        ),
        Offline: (
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                Offline
            </Badge>
        ),
        Relationnel: (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                Relationnel
            </Badge>
        ),
    };

    return map[category] ?? <Badge variant="outline">{category}</Badge>;
}

function getPerformanceBadge(rate: number) {
    if (rate >= 30) {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Très performant
            </Badge>
        );
    }

    if (rate >= 15) {
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
const getCanalIcon = (type: string) => {
    switch (type) {
        case "email":
            return Mail;

        case "sms":
            return MessageSquare;

        case "whatsapp":
            return MessageCircle;

        case "telephone":
            return Phone;

        case "visite":
            return MapPin;

        default:
            return Share2;
    }
};
const AcquisitionChannelsPage = () => {
    const { data: canals = [], isLoading } = useCanal()

    if (isLoading) {
        return <AcquisitionChannelsSkeleton />;
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <Badge variant="outline" className="rounded-full">
                        Module digital
                    </Badge>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Canaux d’acquisition
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Suivez les sources qui génèrent les leads Heritage : réseaux
                        sociaux, site web, WhatsApp, Google, recommandations, affiches,
                        terrain et médias traditionnels.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <Link href="/dashboard/digital/analytics">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Voir analytics
                        </Link>
                    </Button>

                    <Button>
                        <Link href="/digital/channel-acquisition/new">
                            <Plus className="mr-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {acquisitionStats.map((stat) => {
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
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Insight
            <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                            <TrendingUp className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-emerald-950">
                                Meilleur canal actuellement : {bestChannel.name}
                            </h3>
                            <p className="mt-1 text-sm text-emerald-800">
                                Ce canal a le meilleur taux de conversion avec{" "}
                                {bestChannel.conversionRate}% de conversion. Il doit être
                                priorisé dans les actions commerciales et les relances.
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" className="bg-white">
                        <Link href={`/dashboard/digital/acquisition-channels/${bestChannel.id}`}>
                            Voir le détail
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card> */}

            {/* Search / Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un canal : Facebook, WhatsApp, site web, recommandation..."
                                className="pl-9"
                            />
                        </div>

                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Catégorie
                        </Button>

                        <Button variant="outline">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Statut
                        </Button>

                        <Button variant="outline">
                            <Building2 className="mr-2 h-4 w-4" />
                            Responsable
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Channels Grid */}
            <div className="grid gap-6 xl:grid-cols-3">
                {canals?.map((channel) => {
                    const Icon = getCanalIcon(channel.type);

                    return (
                        <Card key={channel.id} className="overflow-hidden">
                            <CardHeader className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <CardTitle className="text-lg">{channel.nom}</CardTitle>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {channel.type}
                                            </p>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/digital/channel-acquisition/${channel.id}`}
                                                    className="flex items-center"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Voir détail
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem>
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                Voir performance
                                            </DropdownMenuItem>

                                            <DropdownMenuItem>
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Désactiver
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {/* {getStatusBadge(channel.statut)}
                                      {getCategoryBadge(channel.category)}
                                    {getPerformanceBadge(channel.conversionRate)} */}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {channel.description}
                                </p>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-2xl border p-3">
                                        <p className="text-xs text-muted-foreground">Leads</p>
                                        <p className="mt-1 text-lg font-bold">7</p>
                                    </div>

                                    <div className="rounded-2xl border p-3">
                                        <p className="text-xs text-muted-foreground">Qualifiés</p>
                                        <p className="mt-1 text-lg font-bold">
                                            8
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Conversions
                                        </p>
                                        <p className="mt-1 text-lg font-bold">
                                            16
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span>Taux de conversion</span>
                                        <span className="font-medium">
                                            78%
                                        </span>
                                    </div>

                                    <Progress value={56} />
                                </div>

                                <div className="grid gap-3 rounded-2xl bg-muted/40 p-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Budget / coût</span>
                                        <span className="font-medium">456</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Coût par lead
                                        </span>
                                        <span className="font-medium">765</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Responsable</span>
                                        <span className="font-medium text-right">
                                            45678
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Dernière activité
                                        </span>
                                        <span className="font-medium">34567</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-full">
                                        <Link href={`/digital/leads?channel=${channel.id}`}>
                                            Voir leads
                                        </Link>
                                    </Button>

                                    {/*  <Button className="w-full">
                                        <Link
                                            href={`/digital/acquisition-channels/${channel.id}`}
                                        >
                                            Détail
                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button> */}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Bottom recommendations 
            <div className="grid gap-6 xl:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Canaux à renforcer</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <RecommendationItem
                            title="WhatsApp Business"
                            description="Très bon taux de conversion. À connecter directement aux commerciaux."
                        />

                        <RecommendationItem
                            title="Site web Heritage"
                            description="Les leads sont plus qualifiés. Ajouter plus de formulaires contextuels."
                        />

                        <RecommendationItem
                            title="Recommandation"
                            description="Canal très rentable. Mettre en place un programme de parrainage."
                        />
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader>
                        <CardTitle>Canaux à surveiller</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <RecommendationItem
                            title="Radio"
                            description="Coût élevé et tracking faible. Utiliser un numéro ou code dédié."
                        />

                        <RecommendationItem
                            title="Affiches publicitaires"
                            description="Bonne visibilité mais attribution difficile. Ajouter QR code ou numéro dédié."
                        />

                        <RecommendationItem
                            title="YouTube"
                            description="Encore en phase test. Mesurer les leads venant des vidéos."
                        />
                    </CardContent>
                </Card> 

                {/*  <Card>
                    <CardHeader>
                        <CardTitle>Bonnes pratiques</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <RecommendationItem
                            title="Toujours identifier la source"
                            description="Chaque lead doit avoir un canal d’origine obligatoire."
                        />

                        <RecommendationItem
                            title="Utiliser les UTM"
                            description="Les liens sponsorisés doivent contenir campaign, source et medium."
                        />

                        <RecommendationItem
                            title="Relier canal et campagne"
                            description="Un canal peut générer plusieurs campagnes, puis plusieurs leads."
                        />
                    </CardContent>
                </Card> *
            </div>*/}
        </div>
    );
}

export default AcquisitionChannelsPage

function RecommendationItem({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border p-4">
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}