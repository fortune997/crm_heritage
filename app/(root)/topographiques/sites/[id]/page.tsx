"use client"

import {
    AlertTriangle,
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarClock,
    Camera,
    CheckCircle2,
    CircleDollarSign,
    ClipboardList,
    Download,
    Edit,
    Eye,
    FileCheck2,
    FileText,
    Globe2,
    ImageIcon,
    LandPlot,
    Map,
    MapPin,
    MoreHorizontal,
    Phone,
    Plus,
    Ruler,
    ShieldAlert,
    ShieldCheck,
    Upload,
    User,
    Waves,
    Zap,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";



import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { useSiteById } from "@/core/hooks/sites/useSite";
import { useParams } from "next/navigation";
import { getPublicImageUrl } from "@/core/services/images/get-image";
import { TMedia } from "@/core/types/sites";



const documents = [
    {
        id: "DOC-001",
        name: "Copie du titre foncier",
        type: "Titre foncier",
        status: "Validé",
        visibility: "Interne",
        uploadedAt: "05 mai 2026",
    },
    {
        id: "DOC-002",
        name: "Plan de lotissement",
        type: "Plan",
        status: "Validé",
        visibility: "Public possible",
        uploadedAt: "07 mai 2026",
    },
    {
        id: "DOC-003",
        name: "Contrat fournisseur",
        type: "Contrat",
        status: "Validé",
        visibility: "Interne",
        uploadedAt: "08 mai 2026",
    },
    {
        id: "DOC-004",
        name: "Rapport de visite terrain",
        type: "Rapport",
        status: "À compléter",
        visibility: "Interne",
        uploadedAt: "12 mai 2026",
    },
];

const visitHistory = [
    {
        id: "VIS-001",
        date: "12 mai 2026",
        author: "Jean Mballa",
        type: "Visite technique",
        summary:
            "Vérification de l’accès, confirmation des coordonnées GPS et prise de photos terrain.",
    },
    {
        id: "VIS-002",
        date: "05 mai 2026",
        author: "Jean Mballa",
        type: "Contrôle documentaire",
        summary:
            "Contrôle du titre foncier et rapprochement avec les informations du fournisseur.",
    },
    {
        id: "VIS-003",
        date: "20 avril 2026",
        author: "Jean Mballa",
        type: "Prospection initiale",
        summary:
            "Première visite du site, identification de la zone et collecte des informations de base.",
    },
];

/* const publicWebsitePreview = [
    {
        label: "Nom du site",
        value: site.name,
    },
    {
        label: "Localisation publique",
        value: `${site.city}, ${site.area}`,
    },
    {
        label: "Prix affiché",
        value: `À partir de ${site.minPrice}`,
    },
    {
        label: "Lots disponibles",
        value: `${site.availableLots} lots disponibles`,
    },
    {
        label: "Statut public",
        value: site.status,
    },
]; */

function getStatusBadge(status?: string) {
    const statusMap: Record<string, React.ReactNode> = {
        Disponible: (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Disponible
            </Badge>
        ),
        Indisponible: (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Indisponible
            </Badge>
        ),
        "En cours d’acquisition": (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                En cours d’acquisition
            </Badge>
        ),
        "En vérification": (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                En vérification
            </Badge>
        ),
        Réservé: (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                Réservé
            </Badge>
        ),
        Vendu: (
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                Vendu
            </Badge>
        ),
        Suspendu: (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Suspendu
            </Badge>
        ),
        Rejeté: (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Rejeté
            </Badge>
        ),
    };

    if (!status) {
        return <Badge variant="outline">Inconnu</Badge>;
    }

    return statusMap[status] ?? (
        <Badge variant="outline">{status}</Badge>
    );
}

function getDocumentStatusBadge(status: string) {
    if (status === "Validé") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Validé
            </Badge>
        );
    }

    return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            À compléter
        </Badge>
    );
}

function getReliabilityBadge(value: number) {
    if (value >= 80) {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Très fiable
            </Badge>
        );
    }

    if (value >= 60) {
        return (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                À surveiller
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Risqué
        </Badge>
    );
}


export default function SiteDetailsPage() {
    const params = useParams();

    const id = params.id as string;

    const { data: site } = useSiteById(id);

    const imageUrl = site?.site_medias
        ? `https://etmatyqawktbyaezzcks.supabase.co/storage/v1/object/public/sites/${site.site_medias[0].chemin}`
        : "/images/heritage-logo.jpg";




    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="space-y-3">
                    <Button variant="ghost" size="sm" className="px-0">
                        <Link href="/topographiques/sites">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                        </Link>
                    </Button>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Module topographie</Badge>
                        <Badge variant="secondary">{site?.statut_document_site}</Badge>

                        {getStatusBadge(site?.statut_site)}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            {site?.nom_titre}
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                            {site?.description_detaille}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {site?.region}, {site?.ville}, {site?.quartier}
                        </span>

                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Topographe : {site?.topographe_responsable}
                        </span>

                        <span className="flex items-center gap-1">
                            <CalendarClock className="h-4 w-4" />
                            Dernière visite : {site?.derniere_visite}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Ajouter média
                    </Button>

                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Ajouter document
                    </Button>

                    <Button>
                        <Link href={`/topographiques/sites/${site?.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Hero details */}
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <Card className="overflow-hidden">
                    <div className="relative h-[420px] bg-muted">
                        <Image
                            src={imageUrl}
                            alt={site?.nom_titre ?? "Image du site"}
                            fill
                            className="object-cover"
                            priority
                        />

                        {/*  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                            {getStatusBadge(site.status)}

                            {site.publicVisible ? (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                    Publié sur le web
                                </Badge>
                            ) : (
                                <Badge variant="secondary">Non publié</Badge>
                            )}

                            {site.featured && (
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                                    Mis en avant
                                </Badge>
                            )}
                        </div> */}

                        <div className="absolute bottom-4 left-4 rounded-2xl bg-black/70 px-4 py-3 text-white backdrop-blur">
                            <div className="flex items-center gap-2 text-sm">
                                <Camera className="h-4 w-4" />
                                Photo principale du site
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Résumé commercial</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Prix à partir de
                                </p>
                                <p className="mt-1 text-2xl font-bold">{site?.prix_fournisseur_site}</p>
                                <p className="text-sm text-muted-foreground">
                                    Jusqu’à {site?.prix_metre_carre}
                                </p>
                            </div>

                            <Separator />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">Prix / m²</p>
                                    <p className="font-semibold">{site?.prix_metre_carre}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Surface</p>
                                    <p className="font-semibold">{site?.lots}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Lots disponibles
                                    </p>
                                    <p className="font-semibold">
                                        {site?.lots_disponible}/{site?.lots}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Zone disponible
                                    </p>
                                    <p className="font-semibold">{site?.lots}</p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span>Disponibilité des lots</span>
                                    {/* <span className="font-medium">{availabilityRate}%</span> */}
                                </div>
                                {/* <Progress value={availabilityRate} /> */}
                            </div>

                            <div className="rounded-2xl bg-muted/40 p-4 text-sm">
                                <p className="font-medium">Modalités de paiement</p>
                                <p className="mt-1 text-muted-foreground">
                                    {/* {site.paymentTerms} */}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fiabilité du site</CardTitle>
                        </CardHeader>

                        {/*   <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                {getReliabilityBadge(site.reliability)}
                                <span className="text-sm font-semibold">
                                    {site.reliability}%
                                </span>
                            </div>

                            <Progress value={site.reliability} />

                            <p className="text-sm text-muted-foreground">
                                Score basé sur la vérification GPS, les documents, le fournisseur,
                                le statut foncier et les risques terrain.
                            </p>
                        </CardContent> */}
                    </Card>
                </div>
            </div>

            {/* KPI */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Lots disponibles</p>
                            <p className="text-xl font-bold">{site?.lots_disponible}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
                            <BadgeCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Lots réservés</p>
                            <p className="text-xl font-bold">{site?.lots_reserve}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                            <LandPlot className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Lots vendus</p>
                            <p className="text-xl font-bold">{site?.lots_vendus}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                            <Globe2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Visibilité web</p>
                            <p className="text-xl font-bold">
                                {site.publicVisible ? "Publié" : "Privé"}
                            </p>
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-6">
                    <TabsTrigger value="overview">Vue générale</TabsTrigger>
                    <TabsTrigger value="location">Localisation</TabsTrigger>
                    <TabsTrigger value="legal">Foncier</TabsTrigger>
                    <TabsTrigger value="media">Médias</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-3">
                        <Card className="xl:col-span-2">
                            <CardHeader>
                                <CardTitle>Description du site</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm leading-7 text-muted-foreground">
                                    {site?.description_site}
                                </p>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl border p-4">
                                        <Ruler className="mb-3 h-5 w-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Superficie totale
                                        </p>
                                        <p className="font-semibold">{site?.superficie_total}</p>
                                    </div>

                                    <div className="rounded-2xl border p-4">
                                        <CircleDollarSign className="mb-3 h-5 w-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Prix / m²</p>
                                        <p className="font-semibold">{site?.prix_metre_carre}</p>
                                    </div>

                                    <div className="rounded-2xl border p-4">
                                        <LandPlot className="mb-3 h-5 w-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Lots</p>
                                        <p className="font-semibold">
                                            {site?.lots_disponible} disponibles sur {site?.lots}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Publication web</CardTitle>
                            </CardHeader>

                            {/*  <CardContent className="space-y-4">
                                {publicWebsitePreview.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                                    >
                                        <p className="text-sm text-muted-foreground">
                                            {item.label}
                                        </p>
                                        <p className="text-right text-sm font-medium">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}

                                <Separator />

                                <div className="rounded-2xl bg-muted/40 p-4 text-sm">
                                    <p className="font-medium">Données publiques</p>
                                    <p className="mt-1 text-muted-foreground">
                                        Ces informations sont celles qui pourront être affichées sur
                                        le site web public Heritage.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-full">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Prévisualiser
                                    </Button>

                                    <Button className="w-full">
                                        <Globe2 className="mr-2 h-4 w-4" />
                                        Publier
                                    </Button>
                                </div>
                            </CardContent> */}
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Caractéristiques techniques terrain</CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {/*  <div className="rounded-2xl border p-4">
                                <Map className="mb-3 h-5 w-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Accès route</p>
                                <p className="font-semibold">{site.roadAccess}</p>
                            </div> */}

                            <div className="rounded-2xl border p-4">
                                <Zap className="mb-3 h-5 w-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Électricité</p>
                                <p className="font-semibold">{site?.electricite_site}</p>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <Waves className="mb-3 h-5 w-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Eau</p>
                                <p className="font-semibold">{site?.eau_true}</p>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <LandPlot className="mb-3 h-5 w-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Type de sol</p>
                                <p className="font-semibold">{site?.type_sol}</p>
                            </div>


                            {/* 
                            <div className="rounded-2xl border p-4">
                                <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" />
                                <p className="text-sm text-muted-foreground">GPS</p>
                                <p className="font-semibold">
                                    {site.gpsVerified ? "Vérifié" : "À vérifier"}
                                </p>
                            </div> */}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Location */}
                <TabsContent value="location" className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
                        {/*   <Card>
                            <CardHeader>
                                <CardTitle>Carte et coordonnées GPS</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex h-[420px] items-center justify-center rounded-2xl border bg-muted">
                                    <div className="text-center">
                                        <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                                        <h3 className="mt-3 font-semibold">Carte du site</h3>
                                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                            Ici tu pourras intégrer Google Maps, Mapbox ou Leaflet avec
                                            la latitude et la longitude du site.
                                        </p>

                                        <Button className="mt-4" variant="outline">
                                            <a
                                                href={site.googleMapsUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Ouvrir dans Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> */}

                        <Card>
                            <CardHeader>
                                <CardTitle>Détails de localisation</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <InfoRow label="Région" value={site?.region ?? "Non renseignée"} />
                                <InfoRow label="Ville" value={site?.ville ?? "Non renseignée"} />
                                <InfoRow
                                    label="Quartier / zone"
                                    value={site?.quartier ?? "Non renseigné"}
                                />
                                <InfoRow
                                    label="Localisation précise"
                                    value={site?.localisation_precise ?? "Non renseignée"}
                                />
                                <InfoRow
                                    label="Repère connu"
                                    value={site?.repere_connu ?? "Non renseigné"}
                                />
                                <InfoRow
                                    label="Latitude"
                                    value={site?.latitude ?? "Non renseignée"}
                                />
                                <InfoRow
                                    label="Longitude"
                                    value={site?.longitude ?? "Non renseignée"}
                                />

                                <Separator />

                                <div className="rounded-2xl bg-muted/40 p-4">
                                    {/* <div className="flex items-start gap-3">
                                        {site.gpsVerified ? (
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                                        )}

                                        {/*  <div>
                                            <p className="font-medium">
                                                {site.gpsVerified
                                                    ? "Coordonnées GPS vérifiées"
                                                    : "Coordonnées GPS à vérifier"}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Les coordonnées GPS doivent être validées avant
                                                publication publique.
                                            </p>
                                        </div> *
                                    </div> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Legal */}
                <TabsContent value="legal" className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations foncières</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <InfoRow label="Statut du titre foncier" value={site?.statut_site} />
                                <InfoRow label="Numéro du titre foncier" value={site?.numero_titre_site} />
                                <InfoRow label="Statut des documents" value={site?.statut_document_site} />
                                <InfoRow label="Procédure d’acquisition" value={site?.procedure_acquisition_site} />

                                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                                    <div className="flex gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5" />
                                        <div>
                                            <p className="font-semibold">Statut favorable</p>
                                            <p className="mt-1">
                                                Le site dispose d’un titre foncier et de documents
                                                majoritairement complets. Une dernière vérification
                                                interne reste recommandée avant publication massive.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Fournisseur / propriétaire</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <InfoRow label="Nom du fournisseur" value={site?.nom_partenaire_site} />
                                <InfoRow label="Téléphone" value={site?.telephone_fournisseur_site} />
                                <InfoRow label="Email" value={site?.email_fournisseur_site || 'partenariat@heritage.com'} />
                                <InfoRow label="Type fournisseur" value={site?.type_fournisseur_site} />
                                <InfoRow label="Statut fournisseur" value={site?.statut_fournisseur_site} />

                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-full">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Appeler
                                    </Button>

                                    <Button variant="outline" className="w-full">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Contrat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes internes</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-2xl border bg-muted/30 p-5">
                                <p className="text-sm leading-7 text-muted-foreground">
                                    {site?.note_comportement_fournisseur_site}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Galerie du site</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Photos terrain, photos drone, vues d’accès et images destinées
                                    au site web.
                                </p>
                            </div>

                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter une photo
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {site?.site_medias?.length ? (site.site_medias.map((media: TMedia) => (
                                    <div
                                        key={media.id}
                                        className="group relative overflow-hidden rounded-2xl border bg-muted"
                                    >
                                        <div className="relative h-56">
                                            <Image
                                                src={getPublicImageUrl(media.chemin)}
                                                alt={media.nom}
                                                fill
                                                className="object-cover transition group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="absolute left-3 top-3">
                                            {media.ordre === 1 ? (
                                                <Badge>Photo principale</Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Photo {media.ordre}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="absolute bottom-3 right-3">
                                            <Button size="icon" variant="secondary">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                                ) : (
                                    <p>Aucune photo</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Documents */}
                <TabsContent value="documents" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Documents du site</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Titre foncier, plan de lotissement, contrat fournisseur,
                                    rapports terrain et pièces justificatives.
                                </p>
                            </div>

                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Importer
                            </Button>
                        </CardHeader>

                        {/* <CardContent className="space-y-4">
                            {documents.map((document) => (
                                <div
                                    key={document.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border p-4 md:flex-row md:items-center"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                                            <FileCheck2 className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold">{document.name}</h3>
                                                {getDocumentStatusBadge(document.status)}
                                                <Badge variant="outline">{document.visibility}</Badge>
                                            </div>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {document.type} · Ajouté le {document.uploadedAt}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir
                                        </Button>

                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Télécharger
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent> */}
                    </Card>

                    {/* <Card>
                        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                                <AlertTriangle className="h-5 w-5" />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Attention aux documents sensibles
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Les titres fonciers, contrats fournisseurs et documents
                                    juridiques ne doivent pas être exposés publiquement sur le site
                                    web sans validation.
                                </p>
                            </div>
                        </CardContent>
                    </Card> */}
                </TabsContent>

                {/* History */}
                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Historique terrain</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Suivi des visites, contrôles, vérifications et actions des
                                    topographes.
                                </p>
                            </div>

                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter une visite
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {visitHistory.map((visit, index) => (
                                <div key={visit.id} className="relative flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            <ClipboardList className="h-5 w-5" />
                                        </div>

                                        {index < visitHistory.length - 1 && (
                                            <div className="h-full w-px bg-border" />
                                        )}
                                    </div>

                                    <div className="flex-1 pb-6">
                                        <div className="rounded-2xl border p-4">
                                            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                                                <div>
                                                    <h3 className="font-semibold">{visit.type}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {visit.date} · {visit.author}
                                                    </p>
                                                </div>

                                                <Badge variant="outline">{visit.id}</Badge>
                                            </div>

                                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                                {visit.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Prochaine action</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-2xl bg-muted/40 p-5">
                                <div className="flex gap-3">
                                    <CalendarClock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{site?.prochaine_action}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Action recommandée pour maintenir le site à jour avant sa
                                            publication ou sa commercialisation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="max-w-[60%] text-right text-sm font-medium">
                {value ?? "Non renseigné"}
            </p>
        </div>
    );
}