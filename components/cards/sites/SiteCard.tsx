'use client'

import Image from "next/image";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    Eye,
    FileText,
    ImageIcon,
    MapPin,
    MoreHorizontal,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TSites } from "@/core/types/sites";

type SiteCardProps = {
    site: TSites;

    getStatusBadge: (status: string) => React.ReactNode;
    getReliabilityBadge: (value: number) => React.ReactNode;
};

export function SiteCard({
    site,
    getStatusBadge,
    getReliabilityBadge,
}: SiteCardProps) {

    const imageUrl = site.site_medias
        ? `https://etmatyqawktbyaezzcks.supabase.co/storage/v1/object/public/sites/${site.site_medias[0]?.chemin}`
        : "/images/heritage-logo.jpg";
    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[260px_1fr]">
                {/* Image */}
                <div className="relative min-h-[240px] bg-muted">
                    <Image
                        src={imageUrl}
                        alt={site.nom_titre}
                        fill
                        className="object-cover"
                    />

                    {/*  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {getStatusBadge(site.)}
                    </div> */}

                    <div className="absolute bottom-3 left-3 rounded-xl bg-black/70 px-3 py-2 text-xs text-white backdrop-blur">
                        <div className="flex items-center gap-1">
                            <ImageIcon className="h-3.5 w-3.5" />
                            Photo principale
                        </div>
                    </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">{site.type_site}</Badge>
                                    <Badge variant="secondary">{site.statut_site}</Badge>

                                </div>

                                <CardTitle className="mt-3 text-xl">
                                    {site.nom_titre}
                                </CardTitle>

                                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {site.region}, {site.ville}
                                </p>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger >
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem >
                                        <Link href={`/dashboard/topography/sites/${site.id}`}>

                                            Voir les détails
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Documents
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Ouvrir la carte
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col justify-between space-y-5">
                        <div className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Fournisseur / propriétaire
                                </p>
                                <p className="font-medium">{site.nom_partenaire_site}</p>
                                <p className="text-xs text-muted-foreground">
                                    {site.telephone_fournisseur_site}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Statut fournisseur
                                </p>
                                <p className="font-medium">{site.statut_fournisseur_site}</p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Titre foncier
                                </p>
                                <p className="font-medium">{site.nom_titre}</p>
                                <p className="text-xs text-muted-foreground">
                                    {site.numero_titre_site}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Documents
                                </p>
                                <p className="font-medium">
                                    {'oui'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Topographe responsable
                                    </p>
                                    <p className="font-medium">{site.topographe_responsable}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                        Dernière visite
                                    </p>
                                    <p className="font-medium">{site.derniere_visite}</p>
                                </div>
                            </div>

                            {/* <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        Niveau de fiabilité
                                        {getReliabilityBadge(site.reliability)}
                                    </div>

                                    <span className="font-medium">
                                        {site.reliability}%
                                    </span>
                                </div>

                                <Progress value={site.reliability} />
                            </div> */}

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                {/* <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    {site.gpsVerified ? (
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500" />
                                    )}

                                   {/*  <span>
                                        {site.gpsVerified
                                            ? "Coordonnées GPS vérifiées"
                                            : "Coordonnées GPS à vérifier"}
                                    </span> *
                                </div>
 */}
                                <Button >
                                    <Link href={`/topographiques/sites/${site.id}`}>
                                        Voir détails
                                    </Link>
                                </Button>
                            </div>

                            <div className="rounded-xl bg-muted/40 p-3 text-sm">
                                <span className="font-medium">
                                    Prochaine action :
                                </span>{" "}
                                <span className="text-muted-foreground">
                                    {site.prochaine_action}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
}