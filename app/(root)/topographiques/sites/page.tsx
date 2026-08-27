'use client'


import {
    Building2,
    CalendarClock,
    CheckCircle2,
    FileText,
    Filter,
    LandPlot,
    MapPin,
    Search,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSite, useSiteStatistics } from "@/core/hooks/sites/useSite";
import { SiteCardSkeleton } from "@/components/skeleton/site/SiteCardSkeleton";
import { SiteCard } from "@/components/cards/sites/SiteCard";
import { getReliabilityBadge, getStatusBadge } from "@/components/status/StatusBadge";


export default function TopographySitesPage() {
    const { data: sites = [], isLoading } = useSite()
    const { data: stats, isLoading: isLoadingStatistique } = useSiteStatistics();

    const siteStats = [
        {
            title: "Total sites",
            value: stats?.total_sites ?? 0,
            description: "Tous les sites enregistrés",
            icon: LandPlot,
        },
        {
            title: "Disponibles",
            value: stats?.available_sites ?? 0,
            description: "Prêts à être publiés",
            icon: CheckCircle2,
        },
        {
            title: "En acquisition",
            value: stats?.acquisition_sites ?? 0,
            description: "En cours d'acquisition",
            icon: CalendarClock,
        },
        {
            title: "Vendus",
            value: stats?.sales_sites ?? 0,
            description: "Sites vendus",
            icon: ShieldCheck,
        },
    ];
    return (
        <div className="space-y-4 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <Badge variant="outline" className="rounded-full">
                        Module topographie
                    </Badge>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Sites
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Gérez les sites prospectés par les topographes : disponibilité,
                        statut fournisseur, localisation GPS, prix, documents, photos et
                        visibilité sur le site web public Heritage.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Exporter
                    </Button>

                    <Button>
                        <Link href="/topographiques/sites/new">
                            Ajouter un site
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {siteStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>

                                <div className="rounded-xl bg-muted p-1">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="mt- text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Search and filters */}
            <Card>
                <CardContent className="">
                    <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un site par nom, code, ville, quartier..."
                                className="pl-9"
                            />
                        </div>

                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Statut
                        </Button>

                        <Button variant="outline">
                            <MapPin className="mr-2 h-4 w-4" />
                            Localisation
                        </Button>

                        <Button variant="outline">
                            <Building2 className="mr-2 h-4 w-4" />
                            Type de site
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Sites grid */}
            <div className="grid gap-4 ">
                {isLoading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <SiteCardSkeleton key={i} />
                    ))
                    : sites.map((site) => (
                        <SiteCard
                            key={site.id}
                            site={site}
                            getStatusBadge={getStatusBadge}
                            getReliabilityBadge={getReliabilityBadge}
                        />
                    ))}
            </div>

        </div>
    );
}