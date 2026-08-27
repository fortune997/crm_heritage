/* // app/dashboard/marketing/prospects/[id]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Download,
    Eye,
    FileText,
    History,
    MapPin,
    MessageCircle,
    Phone,
    Plus,
    RefreshCcw,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type {
    ActivityStatus,
    ProspectPriority,
    ProspectProfile,
    ProspectStatus,
    ProspectTemperature,
    VisitStatus,
} from "@/types";

const prospect: ProspectProfile = {
    id: "PR-001",
    contactId: "CT-001",

    fullName: "Jean Marc Tchinda",
    phone: "+237 699 000 111",
    email: "jeanmarc@email.com",
    address: "Bonamoussadi, Douala",
    city: "Douala",
    profession: "Entrepreneur",

    source: "Facebook",
    status: "interesse",
    priority: "haute",
    temperature: "chaud",
    leadScore: 78,

    createdAt: "2026-05-01",

    assignedCommercial: {
        id: "USR-001",
        fullName: "Commercial 1",
        phone: "+237 677 111 222",
        email: "commercial1@heritage.com",
    },

    need: {
        propertyType: "Terrain",
        locationWanted: "PK24, Japoma, Yassa",
        budgetMin: 3000000,
        budgetMax: 6000000,
        paymentMode: "Paiement en plusieurs tranches",
        expectedPurchaseDate: "2026-06-15",
        objective: "Investissement immobilier",
        description:
            "Le prospect recherche un terrain titré dans une zone accessible, avec possibilité de paiement progressif.",
        objections: [
            "Veut être rassuré sur les documents fonciers",
            "Souhaite une facilité de paiement",
            "Compare encore avec d’autres offres",
        ],
    },

    interestedProperties: [
        {
            id: "PROP-001",
            siteName: "Site PK24",
            propertyName: "Terrain 500 m²",
            location: "PK24, Douala",
            price: 4500000,
        },
        {
            id: "PROP-002",
            siteName: "Site Japoma",
            propertyName: "Terrain 400 m²",
            location: "Japoma, Douala",
            price: 6000000,
        },
    ],

    visits: [
        {
            id: "VIS-001",
            siteName: "Site PK24",
            propertyName: "Terrain 500 m²",
            location: "PK24, Douala",
            visitDate: "2026-05-06",
            visitTime: "10:00",
            status: "effectuee",
            commercialName: "Commercial 1",
            report:
                "Le prospect a visité le terrain. Il a apprécié l’accessibilité du site mais demande confirmation sur les documents fonciers.",
            prospectFeedback:
                "Intéressé, mais souhaite revoir les documents avant de confirmer.",
            nextRecommendation:
                "Envoyer le dossier foncier et relancer dans 48h.",
        },
        {
            id: "VIS-002",
            siteName: "Site Japoma",
            propertyName: "Terrain 400 m²",
            location: "Japoma, Douala",
            visitDate: "2026-05-12",
            visitTime: "15:00",
            status: "planifiee",
            commercialName: "Commercial 1",
        },
    ],

    activities: [
        {
            id: "ACT-001",
            type: "appel",
            title: "Premier appel de qualification",
            description:
                "Le prospect confirme son intérêt pour un terrain avec budget autour de 5 millions.",
            status: "terminee",
            activityDate: "2026-05-01",
            createdBy: "Commercial 1",
        },
        {
            id: "ACT-002",
            type: "whatsapp",
            title: "Envoi des premières offres",
            description:
                "Envoi des fiches des sites PK24 et Japoma via WhatsApp.",
            status: "terminee",
            activityDate: "2026-05-03",
            createdBy: "Commercial 1",
        },
        {
            id: "ACT-003",
            type: "relance",
            title: "Relancer après la visite PK24",
            description:
                "Demander son retour final après réception des documents.",
            status: "a_faire",
            activityDate: "2026-05-13",
            createdBy: "Commercial 1",
        },
    ],

    documents: [
        {
            id: "DOC-001",
            name: "Fiche de qualification",
            type: "Commercial",
            status: "disponible",
            uploadedAt: "2026-05-01",
            fileUrl: "#",
        },
        {
            id: "DOC-002",
            name: "Copie CNI",
            type: "Identité",
            status: "manquant",
        },
        {
            id: "DOC-003",
            name: "Rapport visite PK24",
            type: "Visite",
            status: "disponible",
            uploadedAt: "2026-05-06",
            fileUrl: "#",
        },
    ],

    nextAction: {
        title: "Relancer le prospect après envoi des documents fonciers",
        dueDate: "2026-05-13",
        dueTime: "09:00",
        priority: "haute",
    },

    internalNotes:
        "Prospect sérieux. Il est intéressé par PK24 mais veut être rassuré sur les documents.",
    handoverNote:
        "Si un autre commercial reprend ce dossier, commencer par lui envoyer les documents fonciers du site PK24, puis le relancer sur WhatsApp.",
};

function formatCurrency(value?: number) {
    if (!value) return "Non défini";

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value?: string) {
    if (!value) return "Non défini";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

function getDaysRemaining(date?: string) {
    if (!date) return null;

    const today = new Date();
    const targetDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diff = targetDate.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ProspectStatusBadge({ status }: { status: ProspectStatus }) {
    const labels: Record<ProspectStatus, string> = {
        nouveau: "Nouveau",
        qualifie: "Qualifié",
        interesse: "Intéressé",
        visite_planifiee: "Visite planifiée",
        negociation: "Négociation",
        converti: "Converti",
        perdu: "Perdu",
    };

    const className: Record<ProspectStatus, string> = {
        nouveau: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        qualifie: "border-purple-500/20 bg-purple-500/10 text-purple-600",
        interesse: "border-green-500/20 bg-green-500/10 text-green-600",
        visite_planifiee: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        negociation: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        converti: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
        perdu: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: ProspectPriority }) {
    const labels: Record<ProspectPriority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
        urgente: "Urgente",
    };

    const className: Record<ProspectPriority, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        moyenne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        urgente: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {labels[priority]}
        </Badge>
    );
}

function TemperatureBadge({
    temperature,
}: {
    temperature: ProspectTemperature;
}) {
    const labels: Record<ProspectTemperature, string> = {
        froid: "Froid",
        tiede: "Tiède",
        chaud: "Chaud",
        urgent: "Urgent",
    };

    const className: Record<ProspectTemperature, string> = {
        froid: "border-slate-500/20 bg-slate-500/10 text-slate-600",
        tiede: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        chaud: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        urgent: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[temperature]}>
            {labels[temperature]}
        </Badge>
    );
}

function VisitStatusBadge({ status }: { status: VisitStatus }) {
    const labels: Record<VisitStatus, string> = {
        planifiee: "Planifiée",
        effectuee: "Effectuée",
        annulee: "Annulée",
    };

    const className: Record<VisitStatus, string> = {
        planifiee: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        effectuee: "border-green-500/20 bg-green-500/10 text-green-600",
        annulee: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
    const labels: Record<ActivityStatus, string> = {
        a_faire: "À faire",
        terminee: "Terminée",
        en_retard: "En retard",
        en_cours: "En retard",
        annulee: "En retard",
    };

    const className: Record<ActivityStatus, string> = {
        a_faire: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        terminee: "border-green-500/20 bg-green-500/10 text-green-600",
        annulee: "border-green-500/20 bg-green-500/10 text-green-600",
        en_retard: "border-red-500/20 bg-red-500/10 text-red-600",
        en_cours: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

export default function ProspectProfilePage() {
    const remainingDays = getDaysRemaining(prospect.nextAction?.dueDate);

    const completedVisits = prospect.visits.filter(
        (visit) => visit.status === "effectuee"
    ).length;

    const plannedVisits = prospect.visits.filter(
        (visit) => visit.status === "planifiee"
    ).length;

    const pendingActivities = prospect.activities.filter(
        (activity) => activity.status === "a_faire"
    ).length;

    const missingDocuments = prospect.documents.filter(
        (document) => document.status === "manquant"
    ).length;

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #prospect-profile-print,
          #prospect-profile-print * {
            visibility: visible;
          }

          #prospect-profile-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div className="no-print flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" >
                        <Link href="/dashboard/marketing/prospects">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Fiche prospect
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Vue complète du besoin, des visites, des activités et du suivi
                            avant conversion.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 size-4" />
                        Télécharger
                    </Button>

                    <Button variant="outline">
                        <Plus className="mr-2 size-4" />
                        Ajouter activité
                    </Button>

                    <Button>
                        <RefreshCcw className="mr-2 size-4" />
                        Convertir en client
                    </Button>
                </div>
            </div>

            <div id="prospect-profile-print" className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <UserRound className="size-8" />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-bold">
                                            {prospect.fullName}
                                        </h2>
                                        <ProspectStatusBadge status={prospect.status} />
                                        <PriorityBadge priority={prospect.priority} />
                                        <TemperatureBadge temperature={prospect.temperature} />
                                    </div>

                                    <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Phone className="size-4" />
                                            {prospect.phone}
                                        </div>

                                        {prospect.email && <div>{prospect.email}</div>}

                                        {prospect.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-4" />
                                                {prospect.address}
                                            </div>
                                        )}

                                        <div>Source : {prospect.source ?? "Non renseignée"}</div>
                                        <div>Créé le : {formatDate(prospect.createdAt)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-muted/40 p-4 lg:min-w-[320px]">
                                <p className="text-sm text-muted-foreground">
                                    Commercial responsable
                                </p>
                                <p className="font-semibold">
                                    {prospect.assignedCommercial?.fullName ?? "Non assigné"}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {prospect.assignedCommercial?.phone ??
                                        "Téléphone non défini"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {prospect.assignedCommercial?.email ?? "Email non défini"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {prospect.nextAction && (
                    <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <CalendarClock className="size-5" />
                                Prochaine action
                            </CardTitle>
                            <CardDescription>
                                Action prioritaire à faire pour faire avancer le prospect.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-semibold">{prospect.nextAction.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    Échéance : {formatDate(prospect.nextAction.dueDate)}
                                    {prospect.nextAction.dueTime
                                        ? ` à ${prospect.nextAction.dueTime}`
                                        : ""}
                                </p>

                                {remainingDays !== null && (
                                    <p className="mt-1 text-sm">
                                        {remainingDays > 0 && (
                                            <span className="text-orange-700">
                                                Dans {remainingDays} jour(s)
                                            </span>
                                        )}

                                        {remainingDays === 0 && (
                                            <span className="font-medium text-red-600">
                                                À traiter aujourd’hui
                                            </span>
                                        )}

                                        {remainingDays < 0 && (
                                            <span className="font-medium text-red-600">
                                                En retard de {Math.abs(remainingDays)} jour(s)
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>

                            <PriorityBadge priority={prospect.nextAction.priority} />
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Score</CardDescription>
                            <CardTitle className="text-2xl">{prospect.leadScore}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={prospect.leadScore} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Visites effectuées</CardDescription>
                            <CardTitle className="text-2xl">{completedVisits}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Visites prévues</CardDescription>
                            <CardTitle className="text-2xl">{plannedVisits}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Activités à faire</CardDescription>
                            <CardTitle className="text-2xl">{pendingActivities}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Documents manquants</CardDescription>
                            <CardTitle className="text-2xl text-red-600">
                                {missingDocuments}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {missingDocuments > 0 && (
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <AlertTriangle className="size-5" />
                                Alertes du dossier
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm">
                            {missingDocuments > 0 && (
                                <p>
                                    {missingDocuments} document(s) manquant(s) dans le dossier.
                                </p>
                            )}

                            {pendingActivities > 0 && (
                                <p>{pendingActivities} activité(s) restent à traiter.</p>
                            )}

                            {prospect.need.objections?.length ? (
                                <p>
                                    Objections commerciales identifiées :{" "}
                                    {prospect.need.objections.length}
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="size-5" />
                                    Besoin du prospect
                                </CardTitle>
                                <CardDescription>
                                    Informations de qualification commerciale.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <InfoItem
                                    label="Type de bien recherché"
                                    value={prospect.need.propertyType}
                                />
                                <InfoItem
                                    label="Localisation souhaitée"
                                    value={prospect.need.locationWanted}
                                />
                                <InfoItem
                                    label="Budget minimum"
                                    value={formatCurrency(prospect.need.budgetMin)}
                                />
                                <InfoItem
                                    label="Budget maximum"
                                    value={formatCurrency(prospect.need.budgetMax)}
                                />
                                <InfoItem
                                    label="Mode de paiement"
                                    value={prospect.need.paymentMode}
                                />
                                <InfoItem
                                    label="Date d’achat souhaitée"
                                    value={formatDate(prospect.need.expectedPurchaseDate)}
                                />
                                <InfoItem
                                    label="Objectif"
                                    value={prospect.need.objective}
                                />

                                <div className="md:col-span-2">
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="mt-1 text-sm">
                                        {prospect.need.description ?? "Non renseigné"}
                                    </p>
                                </div>

                                {prospect.need.objections?.length ? (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground">
                                            Objections / points de blocage
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {prospect.need.objections.map((objection) => (
                                                <Badge key={objection} variant="outline">
                                                    {objection}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="size-5" />
                                    Sites et biens intéressés
                                </CardTitle>
                                <CardDescription>
                                    Biens proposés ou consultés par le prospect.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {prospect.interestedProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="rounded-lg border bg-background p-4"
                                    >
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="font-semibold">{property.propertyName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {property.siteName} — {property.location}
                                                </p>
                                            </div>

                                            <p className="font-medium">
                                                {formatCurrency(property.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="size-5" />
                                    Visites et rapports
                                </CardTitle>
                                <CardDescription>
                                    Historique des visites, rapports terrain et retours du
                                    prospect.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {prospect.visits.map((visit) => (
                                    <div
                                        key={visit.id}
                                        className="rounded-xl border bg-background p-4"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{visit.siteName}</p>
                                                    <VisitStatusBadge status={visit.status} />
                                                </div>

                                                <p className="text-sm text-muted-foreground">
                                                    {visit.propertyName} — {visit.location}
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Date : {formatDate(visit.visitDate)}
                                                    {visit.visitTime ? ` à ${visit.visitTime}` : ""} —
                                                    Commercial : {visit.commercialName}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="font-medium">Rapport de visite</p>
                                                <p className="text-muted-foreground">
                                                    {visit.report ?? "Aucun rapport renseigné."}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-medium">Retour du prospect</p>
                                                <p className="text-muted-foreground">
                                                    {visit.prospectFeedback ??
                                                        "Aucun retour prospect renseigné."}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-medium">Recommandation</p>
                                                <p className="text-muted-foreground">
                                                    {visit.nextRecommendation ??
                                                        "Aucune recommandation renseignée."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="size-5" />
                                    Actions rapides
                                </CardTitle>
                                <CardDescription>
                                    Actions utiles pour faire avancer le dossier.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-2">
                                <Button >
                                    <a href={`tel:${prospect.phone}`}>
                                        <Phone className="mr-2 size-4" />
                                        Appeler
                                    </a>
                                </Button>

                                <Button variant="outline" >
                                    <a
                                        href={`https://wa.me/${prospect.phone.replace(/\D/g, "")}`}
                                        target="_blank"
                                    >
                                        <MessageCircle className="mr-2 size-4" />
                                        WhatsApp
                                    </a>
                                </Button>

                                <Button variant="outline">
                                    <Plus className="mr-2 size-4" />
                                    Ajouter activité
                                </Button>

                                <Button variant="outline">
                                    <CalendarClock className="mr-2 size-4" />
                                    Planifier visite
                                </Button>

                                <Button>
                                    <RefreshCcw className="mr-2 size-4" />
                                    Convertir en client
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="size-5" />
                                    Documents
                                </CardTitle>
                                <CardDescription>
                                    Documents disponibles ou manquants.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {prospect.documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{document.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {document.type}
                                                {document.uploadedAt
                                                    ? ` — ${formatDate(document.uploadedAt)}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    document.status === "disponible"
                                                        ? "border-green-500/20 bg-green-500/10 text-green-600"
                                                        : "border-red-500/20 bg-red-500/10 text-red-600"
                                                }
                                            >
                                                {document.status === "disponible"
                                                    ? "Disponible"
                                                    : "Manquant"}
                                            </Badge>

                                            {document.fileUrl && (
                                                <Button size="icon" variant="ghost" >
                                                    <a href={document.fileUrl}>
                                                        <Eye className="size-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notes internes</CardTitle>
                                <CardDescription>
                                    Informations utiles pour comprendre le dossier.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {prospect.internalNotes ?? "Aucune note interne."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Note de passation</CardTitle>
                                <CardDescription>
                                    Résumé utile si un autre commercial reprend le prospect.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {prospect.handoverNote ?? "Aucune note de passation."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="size-5" />
                            Activités du prospect
                        </CardTitle>
                        <CardDescription>
                            Appels, relances, notes, WhatsApp, rendez-vous et actions
                            commerciales.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {prospect.activities.map((activity) => (
                            <div key={activity.id} className="flex gap-4">
                                <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <CheckCircle2 className="size-4" />
                                </div>

                                <div className="flex-1 border-b pb-4 last:border-b-0">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(activity.activityDate)} —{" "}
                                                {activity.createdBy}
                                            </p>
                                        </div>

                                        <ActivityStatusBadge status={activity.status} />
                                    </div>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {activity.description ?? "Aucune description."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || "Non renseigné"}</p>
        </div>
    );
} */

import { Customer360Page } from "@/components/shared/customer-360-page";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({
    params,
}: PageProps) {
    const { id } = await params;

    return (
        <Customer360Page />
    );
}