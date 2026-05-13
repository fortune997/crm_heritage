"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    AlertTriangle,
    ArrowUpDown,
    Banknote,
    Building2,
    CalendarClock,
    CheckCircle2,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Target,
    TrendingUp,
    UsersRound,
    Wallet,
} from "lucide-react";



import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/forms/table/DataTable";

type CorporateOpportunityStatus =
    | "nouvelle"
    | "qualification"
    | "contact_etabli"
    | "presentation_faite"
    | "proposition_envoyee"
    | "negociation"
    | "validation_interne"
    | "gagnee"
    | "perdue"
    | "en_pause";

type CorporateOpportunityType =
    | "achat_terrain"
    | "achat_groupe"
    | "programme_employes"
    | "partenariat_financement"
    | "partenariat_commercial"
    | "apport_affaires"
    | "investissement"
    | "programme_diaspora"
    | "vente_institutionnelle"
    | "autre";

type CorporatePriority = "faible" | "moyenne" | "haute" | "strategique";

type CorporateOpportunity = {
    id: string;
    title: string;

    corporateAccountId: string;
    corporateAccountName: string;
    accountType: "entreprise" | "institution" | "banque" | "association" | "investisseur" | "autre";

    type: CorporateOpportunityType;
    status: CorporateOpportunityStatus;
    priority: CorporatePriority;

    estimatedValue: number;
    probability: number;
    weightedValue: number;

    expectedDecisionDate?: string;
    nextAction?: string;
    nextActionDate?: string;

    decisionMakerName?: string;
    mainContactName?: string;

    assignedTo: string;

    description?: string;
    blockingPoints?: string[];

    createdAt: string;
};

const opportunities: CorporateOpportunity[] = [
    {
        id: "OPP-001",
        title: "Programme d’acquisition de terrains pour employés",
        corporateAccountId: "CORP-001",
        corporateAccountName: "Alpha Construction SARL",
        accountType: "entreprise",
        type: "programme_employes",
        status: "proposition_envoyee",
        priority: "strategique",
        estimatedValue: 150_000_000,
        probability: 45,
        weightedValue: 67_500_000,
        expectedDecisionDate: "2026-06-30",
        nextAction: "Relancer le DG pour validation de la proposition",
        nextActionDate: "2026-05-20",
        decisionMakerName: "Directeur Général",
        mainContactName: "Mme Nadia Fotso",
        assignedTo: "Commercial Corporate",
        description:
            "Convention permettant aux employés d’acheter des terrains Heritage avec paiement progressif.",
        blockingPoints: [
            "Validation de la direction générale",
            "Relecture de la convention par le service juridique",
        ],
        createdAt: "2026-05-01",
    },
    {
        id: "OPP-002",
        title: "Partenariat financement clients Heritage",
        corporateAccountId: "CORP-002",
        corporateAccountName: "Banque Horizon",
        accountType: "banque",
        type: "partenariat_financement",
        status: "qualification",
        priority: "strategique",
        estimatedValue: 250_000_000,
        probability: 25,
        weightedValue: 62_500_000,
        expectedDecisionDate: "2026-07-15",
        nextAction: "Identifier un contact introducteur à la direction commerciale",
        nextActionDate: "2026-05-18",
        decisionMakerName: "Direction commerciale",
        mainContactName: "Non identifié",
        assignedTo: "Responsable Partenariats",
        description:
            "Partenariat avec une banque pour financer les clients Heritage qui achètent des terrains.",
        blockingPoints: ["Aucun contact interne fiable identifié"],
        createdAt: "2026-05-05",
    },
    {
        id: "OPP-003",
        title: "Achat groupé diaspora",
        corporateAccountId: "CORP-003",
        corporateAccountName: "Diaspora Invest Network",
        accountType: "association",
        type: "programme_diaspora",
        status: "negociation",
        priority: "haute",
        estimatedValue: 120_000_000,
        probability: 60,
        weightedValue: 72_000_000,
        expectedDecisionDate: "2026-06-10",
        nextAction: "Envoyer les modalités de paiement diaspora",
        nextActionDate: "2026-05-16",
        decisionMakerName: "Bureau exécutif",
        mainContactName: "M. Patrick Mvondo",
        assignedTo: "Commercial Corporate",
        description:
            "Programme d’achat groupé de terrains pour les membres de la diaspora.",
        blockingPoints: ["Besoin de rassurer sur les documents fonciers"],
        createdAt: "2026-05-07",
    },
    {
        id: "OPP-004",
        title: "Apport d’affaires clients investisseurs",
        corporateAccountId: "CORP-004",
        corporateAccountName: "Cabinet Juris & Partners",
        accountType: "entreprise",
        type: "apport_affaires",
        status: "presentation_faite",
        priority: "moyenne",
        estimatedValue: 30_000_000,
        probability: 35,
        weightedValue: 10_500_000,
        expectedDecisionDate: "2026-06-05",
        nextAction: "Envoyer un projet d’accord d’apport d’affaires",
        nextActionDate: "2026-05-22",
        decisionMakerName: "Me Grâce Nguefack",
        mainContactName: "Me Grâce Nguefack",
        assignedTo: "Commercial Corporate",
        description:
            "Collaboration avec un cabinet juridique pouvant recommander des clients investisseurs.",
        blockingPoints: [],
        createdAt: "2026-05-10",
    },
    {
        id: "OPP-005",
        title: "Achat institutionnel pour projet de logements",
        corporateAccountId: "CORP-005",
        corporateAccountName: "Fondation Habitat Plus",
        accountType: "institution",
        type: "vente_institutionnelle",
        status: "validation_interne",
        priority: "haute",
        estimatedValue: 90_000_000,
        probability: 70,
        weightedValue: 63_000_000,
        expectedDecisionDate: "2026-05-28",
        nextAction: "Préparer les documents juridiques complémentaires",
        nextActionDate: "2026-05-17",
        decisionMakerName: "Comité de validation",
        mainContactName: "M. Alain T.",
        assignedTo: "Direction commerciale",
        description:
            "Acquisition d’un terrain pour un projet de logements sociaux.",
        blockingPoints: ["Demande de documents techniques supplémentaires"],
        createdAt: "2026-05-11",
    },
    {
        id: "OPP-006",
        title: "Investissement immobilier groupé",
        corporateAccountId: "CORP-006",
        corporateAccountName: "Capital Invest Group",
        accountType: "investisseur",
        type: "investissement",
        status: "gagnee",
        priority: "strategique",
        estimatedValue: 200_000_000,
        probability: 100,
        weightedValue: 200_000_000,
        expectedDecisionDate: "2026-05-12",
        nextAction: "Créer les dossiers clients associés",
        nextActionDate: "2026-05-15",
        decisionMakerName: "Comité investisseur",
        mainContactName: "M. Boris Ekani",
        assignedTo: "Direction commerciale",
        description:
            "Investissement groupé validé pour l’acquisition de plusieurs lots.",
        blockingPoints: [],
        createdAt: "2026-04-20",
    },
];

function formatCurrency(value?: number) {
    if (!value) return "0 FCFA";

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
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getDaysRemaining(date?: string) {
    if (!date) return null;

    const today = new Date();
    const target = new Date(date);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusLabel(status: CorporateOpportunityStatus) {
    const labels: Record<CorporateOpportunityStatus, string> = {
        nouvelle: "Nouvelle",
        qualification: "Qualification",
        contact_etabli: "Contact établi",
        presentation_faite: "Présentation faite",
        proposition_envoyee: "Proposition envoyée",
        negociation: "Négociation",
        validation_interne: "Validation interne",
        gagnee: "Gagnée",
        perdue: "Perdue",
        en_pause: "En pause",
    };

    return labels[status];
}

function getTypeLabel(type: CorporateOpportunityType) {
    const labels: Record<CorporateOpportunityType, string> = {
        achat_terrain: "Achat terrain",
        achat_groupe: "Achat groupé",
        programme_employes: "Programme employés",
        partenariat_financement: "Partenariat financement",
        partenariat_commercial: "Partenariat commercial",
        apport_affaires: "Apport d’affaires",
        investissement: "Investissement",
        programme_diaspora: "Programme diaspora",
        vente_institutionnelle: "Vente institutionnelle",
        autre: "Autre",
    };

    return labels[type];
}

function StatusBadge({ status }: { status: CorporateOpportunityStatus }) {
    const className: Record<CorporateOpportunityStatus, string> = {
        nouvelle: "border-slate-500/20 bg-slate-500/10 text-slate-600",
        qualification: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        contact_etabli: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600",
        presentation_faite: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600",
        proposition_envoyee: "border-purple-500/20 bg-purple-500/10 text-purple-600",
        negociation: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        validation_interne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        gagnee: "border-green-500/20 bg-green-500/10 text-green-600",
        perdue: "border-red-500/20 bg-red-500/10 text-red-600",
        en_pause: "border-muted bg-muted text-muted-foreground",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {getStatusLabel(status)}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: CorporatePriority }) {
    const labels: Record<CorporatePriority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
        strategique: "Stratégique",
    };

    const className: Record<CorporatePriority, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        moyenne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        strategique: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {labels[priority]}
        </Badge>
    );
}

const pipelineStatuses: CorporateOpportunityStatus[] = [
    "qualification",
    "presentation_faite",
    "proposition_envoyee",
    "negociation",
    "validation_interne",
];

const columns: ColumnDef<CorporateOpportunity>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-0 font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Opportunité
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div>
                    <Link
                        href={`/dashboard/corporate/opportunities/${item.id}`}
                        className="font-medium text-foreground hover:underline"
                    >
                        {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {getTypeLabel(item.type)}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "corporateAccountName",
        header: "Compte corporate",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="size-4" />
                </div>
                <div>
                    <p className="font-medium">{row.original.corporateAccountName}</p>
                    <p className="text-xs text-muted-foreground">
                        {row.original.mainContactName ?? "Contact non défini"}
                    </p>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "estimatedValue",
        header: "Valeur",
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div>
                    <p className="font-medium">{formatCurrency(item.estimatedValue)}</p>
                    <p className="text-xs text-muted-foreground">
                        Pondéré : {formatCurrency(item.weightedValue)}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "probability",
        header: "Probabilité",
        cell: ({ row }) => {
            const probability = row.original.probability;

            return (
                <div className="min-w-[120px] space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Chance</span>
                        <span className="font-medium">{probability}%</span>
                    </div>
                    <Progress value={probability} />
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "priority",
        header: "Priorité",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
        accessorKey: "expectedDecisionDate",
        header: "Décision",
        cell: ({ row }) => {
            const days = getDaysRemaining(row.original.expectedDecisionDate);

            return (
                <div>
                    <p className="font-medium">
                        {formatDate(row.original.expectedDecisionDate)}
                    </p>
                    {days !== null && (
                        <p className="text-xs text-muted-foreground">
                            {days > 0
                                ? `Dans ${days} jour(s)`
                                : days === 0
                                    ? "Aujourd’hui"
                                    : `${Math.abs(days)} jour(s) de retard`}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "assignedTo",
        header: "Responsable",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.assignedTo}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem >
                                <Link href={`/dashboard/corporate/opportunities/${item.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir opportunité
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <CalendarClock className="mr-2 size-4" />
                                Planifier relance
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 size-4" />
                                Marquer gagnée
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-600">
                                <AlertTriangle className="mr-2 size-4" />
                                Marquer perdue
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export default function CorporateOpportunitiesPage() {
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [typeFilter, setTypeFilter] = React.useState<string>("all");
    const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
    const [search, setSearch] = React.useState("");

    const filteredOpportunities = opportunities.filter((item) => {
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesPriority =
            priorityFilter === "all" || item.priority === priorityFilter;

        const normalizedSearch = search.toLowerCase().trim();

        const matchesSearch =
            !normalizedSearch ||
            item.title.toLowerCase().includes(normalizedSearch) ||
            item.corporateAccountName.toLowerCase().includes(normalizedSearch) ||
            item.assignedTo.toLowerCase().includes(normalizedSearch);

        return matchesStatus && matchesType && matchesPriority && matchesSearch;
    });

    const totalOpportunities = opportunities.length;

    const totalEstimatedValue = opportunities.reduce((total, item) => {
        return total + item.estimatedValue;
    }, 0);

    const totalWeightedValue = opportunities.reduce((total, item) => {
        return total + item.weightedValue;
    }, 0);

    const wonValue = opportunities
        .filter((item) => item.status === "gagnee")
        .reduce((total, item) => total + item.estimatedValue, 0);

    const activeOpportunities = opportunities.filter(
        (item) => !["gagnee", "perdue", "en_pause"].includes(item.status)
    );

    const strategicOpportunities = opportunities.filter(
        (item) => item.priority === "strategique"
    ).length;

    const opportunitiesWithoutNextAction = opportunities.filter(
        (item) => !item.nextAction || !item.nextActionDate
    );

    const decisionsSoon = opportunities.filter((item) => {
        const days = getDaysRemaining(item.expectedDecisionDate);
        return days !== null && days >= 0 && days <= 10;
    });

    const blockedOpportunities = opportunities.filter(
        (item) => item.blockingPoints && item.blockingPoints.length > 0
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Opportunités corporate
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Suivi des affaires potentielles avec les entreprises, institutions,
                        investisseurs, banques, associations et partenaires stratégiques.
                    </p>
                </div>

                <Button >
                    <Link href="/dashboard/corporate/opportunities/create">
                        <Plus className="mr-2 size-4" />
                        Nouvelle opportunité
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <KpiCard
                    title="Opportunités"
                    value={totalOpportunities}
                    description="Total pipeline corporate"
                    icon={Target}
                />

                <KpiCard
                    title="Valeur estimée"
                    value={formatCurrency(totalEstimatedValue)}
                    description="Montant total non pondéré"
                    icon={Wallet}
                />

                <KpiCard
                    title="Valeur pondérée"
                    value={formatCurrency(totalWeightedValue)}
                    description="Valeur × probabilité"
                    icon={TrendingUp}
                />

                <KpiCard
                    title="Gagnées"
                    value={formatCurrency(wonValue)}
                    description="Valeur déjà gagnée"
                    icon={CheckCircle2}
                />

                <KpiCard
                    title="Stratégiques"
                    value={strategicOpportunities}
                    description="Priorité élevée"
                    icon={Banknote}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline des opportunités</CardTitle>
                        <CardDescription>
                            Vue par étape commerciale pour suivre l’avancement des deals.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 lg:grid-cols-5">
                            {pipelineStatuses.map((status) => {
                                const statusOpportunities = opportunities.filter(
                                    (item) => item.status === status
                                );

                                const statusValue = statusOpportunities.reduce((total, item) => {
                                    return total + item.estimatedValue;
                                }, 0);

                                return (
                                    <div key={status} className="rounded-xl border bg-muted/30 p-3">
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="text-sm font-semibold">
                                                    {getStatusLabel(status)}
                                                </h3>
                                                <Badge variant="secondary">
                                                    {statusOpportunities.length}
                                                </Badge>
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {formatCurrency(statusValue)}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {statusOpportunities.length ? (
                                                statusOpportunities.map((item) => (
                                                    <OpportunityPipelineCard key={item.id} item={item} />
                                                ))
                                            ) : (
                                                <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
                                                    Aucune opportunité
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alertes opportunités</CardTitle>
                        <CardDescription>
                            Points à corriger pour éviter les blocages commerciaux.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <AlertItem
                            title="Décisions proches"
                            value={decisionsSoon.length}
                            description="Décision attendue dans les 10 prochains jours."
                        />

                        <AlertItem
                            title="Opportunités bloquées"
                            value={blockedOpportunities.length}
                            description="Des points de blocage sont enregistrés."
                        />

                        <AlertItem
                            title="Sans prochaine action"
                            value={opportunitiesWithoutNextAction.length}
                            description="Aucune relance ou prochaine étape définie."
                        />

                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-sm font-medium">Actions recommandées</p>
                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                <li>Identifier les décideurs non renseignés.</li>
                                <li>Créer une prochaine action pour chaque opportunité active.</li>
                                <li>Traiter les opportunités stratégiques en priorité.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des opportunités</CardTitle>
                    <CardDescription>
                        Vue détaillée avec filtres par statut, type, priorité et recherche.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Rechercher opportunité, compte..."
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    if (!value) return;
                                    setStatusFilter(value);
                                }}
                            >
                                <SelectTrigger>
                                    <Filter className="mr-2 size-4" />
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="nouvelle">Nouvelle</SelectItem>
                                    <SelectItem value="qualification">Qualification</SelectItem>
                                    <SelectItem value="contact_etabli">Contact établi</SelectItem>
                                    <SelectItem value="presentation_faite">
                                        Présentation faite
                                    </SelectItem>
                                    <SelectItem value="proposition_envoyee">
                                        Proposition envoyée
                                    </SelectItem>
                                    <SelectItem value="negociation">Négociation</SelectItem>
                                    <SelectItem value="validation_interne">
                                        Validation interne
                                    </SelectItem>
                                    <SelectItem value="gagnee">Gagnée</SelectItem>
                                    <SelectItem value="perdue">Perdue</SelectItem>
                                    <SelectItem value="en_pause">En pause</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={typeFilter}
                                onValueChange={(value) => {
                                    if (!value) return;
                                    setTypeFilter(value);
                                }}
                            >
                                <SelectTrigger>
                                    <Target className="mr-2 size-4" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les types</SelectItem>
                                    <SelectItem value="achat_terrain">Achat terrain</SelectItem>
                                    <SelectItem value="achat_groupe">Achat groupé</SelectItem>
                                    <SelectItem value="programme_employes">
                                        Programme employés
                                    </SelectItem>
                                    <SelectItem value="partenariat_financement">
                                        Partenariat financement
                                    </SelectItem>
                                    <SelectItem value="partenariat_commercial">
                                        Partenariat commercial
                                    </SelectItem>
                                    <SelectItem value="apport_affaires">
                                        Apport d’affaires
                                    </SelectItem>
                                    <SelectItem value="investissement">Investissement</SelectItem>
                                    <SelectItem value="programme_diaspora">
                                        Programme diaspora
                                    </SelectItem>
                                    <SelectItem value="vente_institutionnelle">
                                        Vente institutionnelle
                                    </SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={priorityFilter}
                                onValueChange={(value) => {
                                    if (!value) return;
                                    setPriorityFilter(value);
                                }}
                            >
                                <SelectTrigger>
                                    <UsersRound className="mr-2 size-4" />
                                    <SelectValue placeholder="Priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les priorités</SelectItem>
                                    <SelectItem value="faible">Faible</SelectItem>
                                    <SelectItem value="moyenne">Moyenne</SelectItem>
                                    <SelectItem value="haute">Haute</SelectItem>
                                    <SelectItem value="strategique">Stratégique</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {filteredOpportunities.length} résultat(s)
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredOpportunities}
                        searchKey="title"
                        searchPlaceholder="Rechercher une opportunité..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function KpiCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{title}</CardDescription>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
                <CardTitle className="text-xl">{value}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function AlertItem({
    title,
    value,
    description,
}: {
    title: string;
    value: number;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border p-3">
            <div
                className={[
                    "flex size-9 items-center justify-center rounded-lg",
                    value > 0
                        ? "bg-red-500/10 text-red-600"
                        : "bg-green-500/10 text-green-600",
                ].join(" ")}
            >
                {value > 0 ? (
                    <AlertTriangle className="size-4" />
                ) : (
                    <CheckCircle2 className="size-4" />
                )}
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <p className="font-medium">{title}</p>
                    <Badge variant="secondary">{value}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function OpportunityPipelineCard({ item }: { item: CorporateOpportunity }) {
    const days = getDaysRemaining(item.expectedDecisionDate);

    return (
        <Link
            href={`/dashboard/corporate/opportunities/${item.id}`}
            className="block rounded-lg border bg-background p-3 transition hover:bg-muted/50"
        >
            <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                <PriorityBadge priority={item.priority} />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
                {item.corporateAccountName}
            </p>

            <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Probabilité</span>
                    <span className="font-medium">{item.probability}%</span>
                </div>
                <Progress value={item.probability} />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-medium">{formatCurrency(item.estimatedValue)}</span>
                <span className="text-muted-foreground">
                    {days === null
                        ? "Décision non définie"
                        : days > 0
                            ? `${days}j`
                            : days === 0
                                ? "Aujourd’hui"
                                : `-${Math.abs(days)}j`}
                </span>
            </div>
        </Link>
    );
}