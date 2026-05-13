"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Building2,
    CalendarClock,
    CheckCircle2,
    Eye,
    Filter,
    Landmark,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Star,
    Target,
    UsersRound,
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

type CorporateAccountStatus =
    | "identifie"
    | "a_contacter"
    | "contacte"
    | "rendez_vous_obtenu"
    | "presentation_faite"
    | "negociation"
    | "opportunite_active"
    | "converti"
    | "perdu"
    | "a_nourrir";

type CorporateAccountType =
    | "entreprise"
    | "institution"
    | "ong"
    | "banque"
    | "assurance"
    | "association"
    | "investisseur"
    | "promoteur"
    | "personnalite"
    | "autre";

type CorporatePriority = "faible" | "moyenne" | "haute" | "strategique";

type CorporateAccount = {
    id: string;

    organizationName: string;
    type: CorporateAccountType;
    sector?: string;
    city?: string;
    address?: string;
    website?: string;

    status: CorporateAccountStatus;
    priority: CorporatePriority;
    score: number;

    source?: string;
    introducedBy?: string;

    mainContactName?: string;
    mainContactRole?: string;
    mainContactPhone?: string;
    mainContactEmail?: string;

    decisionMakerName?: string;
    decisionMakerRole?: string;
    decisionMakerIdentified: boolean;

    opportunityCount: number;
    activeOpportunityCount: number;
    estimatedPipelineValue: number;

    preferredChannel?: string;
    nextAction?: string;
    nextActionDate?: string;

    assignedTo?: string;
    createdAt: string;
};

const corporateAccounts: CorporateAccount[] = [
    {
        id: "CORP-001",
        organizationName: "Alpha Construction SARL",
        type: "entreprise",
        sector: "BTP",
        city: "Douala",
        address: "Bonabéri, Douala",
        website: "https://alpha-construction.cm",
        status: "rendez_vous_obtenu",
        priority: "strategique",
        score: 86,
        source: "Recommandation",
        introducedBy: "M. Kamga",
        mainContactName: "Mme Nadia Fotso",
        mainContactRole: "Responsable administratif",
        mainContactPhone: "+237 675 222 333",
        mainContactEmail: "nadia@alpha.cm",
        decisionMakerName: "Directeur Général",
        decisionMakerRole: "DG",
        decisionMakerIdentified: true,
        opportunityCount: 2,
        activeOpportunityCount: 1,
        estimatedPipelineValue: 150_000_000,
        preferredChannel: "Rendez-vous physique",
        nextAction: "Préparer le dossier de présentation corporate",
        nextActionDate: "2026-05-20",
        assignedTo: "Commercial Corporate",
        createdAt: "2026-05-01",
    },
    {
        id: "CORP-002",
        organizationName: "Banque Horizon",
        type: "banque",
        sector: "Finance",
        city: "Douala",
        address: "Akwa, Douala",
        status: "a_contacter",
        priority: "strategique",
        score: 68,
        source: "Liste corporate",
        introducedBy: "Non défini",
        mainContactName: "Non identifié",
        mainContactRole: "Non défini",
        decisionMakerName: "Direction commerciale",
        decisionMakerRole: "Direction",
        decisionMakerIdentified: false,
        opportunityCount: 1,
        activeOpportunityCount: 1,
        estimatedPipelineValue: 250_000_000,
        preferredChannel: "Lettre officielle",
        nextAction: "Identifier un contact introducteur",
        nextActionDate: "2026-05-18",
        assignedTo: "Responsable Partenariats",
        createdAt: "2026-05-05",
    },
    {
        id: "CORP-003",
        organizationName: "Diaspora Invest Network",
        type: "association",
        sector: "Diaspora / Investissement",
        city: "Yaoundé",
        website: "https://diasporainvest.org",
        status: "presentation_faite",
        priority: "haute",
        score: 74,
        source: "LinkedIn",
        introducedBy: "Campagne digitale",
        mainContactName: "M. Patrick Mvondo",
        mainContactRole: "Président",
        mainContactPhone: "+237 690 444 555",
        mainContactEmail: "contact@diasporainvest.org",
        decisionMakerName: "Bureau exécutif",
        decisionMakerRole: "Comité",
        decisionMakerIdentified: true,
        opportunityCount: 1,
        activeOpportunityCount: 1,
        estimatedPipelineValue: 120_000_000,
        preferredChannel: "Email + WhatsApp",
        nextAction: "Envoyer la proposition de partenariat",
        nextActionDate: "2026-05-22",
        assignedTo: "Commercial Corporate",
        createdAt: "2026-05-07",
    },
    {
        id: "CORP-004",
        organizationName: "Cabinet Juris & Partners",
        type: "entreprise",
        sector: "Juridique",
        city: "Douala",
        status: "contacte",
        priority: "moyenne",
        score: 52,
        source: "Réseau professionnel",
        introducedBy: "Contact interne",
        mainContactName: "Me Grâce Nguefack",
        mainContactRole: "Associée",
        mainContactPhone: "+237 677 888 999",
        mainContactEmail: "grace@jurispartners.cm",
        decisionMakerName: "Me Grâce Nguefack",
        decisionMakerRole: "Associée principale",
        decisionMakerIdentified: true,
        opportunityCount: 1,
        activeOpportunityCount: 1,
        estimatedPipelineValue: 30_000_000,
        preferredChannel: "WhatsApp",
        nextAction: "Planifier un échange de cadrage",
        nextActionDate: "2026-05-25",
        assignedTo: "Commercial Corporate",
        createdAt: "2026-05-10",
    },
    {
        id: "CORP-005",
        organizationName: "Fondation Habitat Plus",
        type: "institution",
        sector: "Habitat social",
        city: "Yaoundé",
        status: "opportunite_active",
        priority: "haute",
        score: 79,
        source: "Partenariat institutionnel",
        mainContactName: "M. Alain T.",
        mainContactRole: "Coordinateur programme",
        mainContactPhone: "+237 699 111 222",
        mainContactEmail: "contact@habitatplus.org",
        decisionMakerName: "Comité de validation",
        decisionMakerRole: "Comité",
        decisionMakerIdentified: true,
        opportunityCount: 1,
        activeOpportunityCount: 1,
        estimatedPipelineValue: 90_000_000,
        preferredChannel: "Email officiel",
        nextAction: "Envoyer les documents juridiques complémentaires",
        nextActionDate: "2026-05-17",
        assignedTo: "Direction commerciale",
        createdAt: "2026-05-11",
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

function getTypeLabel(type: CorporateAccountType) {
    const labels: Record<CorporateAccountType, string> = {
        entreprise: "Entreprise",
        institution: "Institution",
        ong: "ONG",
        banque: "Banque",
        assurance: "Assurance",
        association: "Association",
        investisseur: "Investisseur",
        promoteur: "Promoteur",
        personnalite: "Personnalité",
        autre: "Autre",
    };

    return labels[type];
}

function getStatusLabel(status: CorporateAccountStatus) {
    const labels: Record<CorporateAccountStatus, string> = {
        identifie: "Identifié",
        a_contacter: "À contacter",
        contacte: "Contacté",
        rendez_vous_obtenu: "RDV obtenu",
        presentation_faite: "Présentation faite",
        negociation: "Négociation",
        opportunite_active: "Opportunité active",
        converti: "Converti",
        perdu: "Perdu",
        a_nourrir: "À nourrir",
    };

    return labels[status];
}

function StatusBadge({ status }: { status: CorporateAccountStatus }) {
    const className: Record<CorporateAccountStatus, string> = {
        identifie: "border-slate-500/20 bg-slate-500/10 text-slate-600",
        a_contacter: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        contacte: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        rendez_vous_obtenu:
            "border-purple-500/20 bg-purple-500/10 text-purple-600",
        presentation_faite:
            "border-indigo-500/20 bg-indigo-500/10 text-indigo-600",
        negociation: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        opportunite_active:
            "border-green-500/20 bg-green-500/10 text-green-600",
        converti: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
        perdu: "border-red-500/20 bg-red-500/10 text-red-600",
        a_nourrir: "border-muted bg-muted text-muted-foreground",
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

const columns: ColumnDef<CorporateAccount>[] = [
    {
        accessorKey: "organizationName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-0 font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Compte corporate
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const account = row.original;

            return (
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-5" />
                    </div>

                    <div>
                        <Link
                            href={`/dashboard/corporate/accounts/${account.id}`}
                            className="font-medium text-foreground hover:underline"
                        >
                            {account.organizationName}
                        </Link>

                        <p className="text-xs text-muted-foreground">
                            {getTypeLabel(account.type)} —{" "}
                            {account.sector ?? "Secteur non défini"}
                        </p>

                        {account.city && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="size-3" />
                                {account.city}
                            </p>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "mainContactName",
        header: "Interlocuteur",
        cell: ({ row }) => {
            const account = row.original;

            return (
                <div>
                    <p className="font-medium">
                        {account.mainContactName ?? "Non identifié"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {account.mainContactRole ?? "Rôle non défini"}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "decisionMakerName",
        header: "Décideur",
        cell: ({ row }) => {
            const account = row.original;

            return (
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                            {account.decisionMakerName ?? "Non identifié"}
                        </p>

                        {account.decisionMakerIdentified ? (
                            <Badge
                                variant="outline"
                                className="border-green-500/20 bg-green-500/10 text-green-600"
                            >
                                identifié
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="border-red-500/20 bg-red-500/10 text-red-600"
                            >
                                à trouver
                            </Badge>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {account.decisionMakerRole ?? "Rôle non défini"}
                    </p>
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
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => {
            const score = row.original.score;

            return (
                <div className="min-w-[120px] space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Potentiel</span>
                        <span className="font-medium">{score}%</span>
                    </div>
                    <Progress value={score} />
                </div>
            );
        },
    },
    {
        accessorKey: "estimatedPipelineValue",
        header: "Pipeline",
        cell: ({ row }) => {
            const account = row.original;

            return (
                <div>
                    <p className="font-medium">
                        {formatCurrency(account.estimatedPipelineValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {account.activeOpportunityCount} active(s) /{" "}
                        {account.opportunityCount} total
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "nextActionDate",
        header: "Prochaine action",
        cell: ({ row }) => {
            const account = row.original;
            const days = getDaysRemaining(account.nextActionDate);

            return (
                <div className="min-w-[190px]">
                    <p className="font-medium">{account.nextAction ?? "Aucune action"}</p>

                    <p className="text-xs text-muted-foreground">
                        {formatDate(account.nextActionDate)}
                        {days !== null
                            ? days > 0
                                ? ` — dans ${days} j`
                                : days === 0
                                    ? " — aujourd’hui"
                                    : ` — retard ${Math.abs(days)} j`
                            : ""}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "assignedTo",
        header: "Assigné à",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.assignedTo ?? "Non assigné"}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const account = row.original;

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
                                <Link href={`/dashboard/corporate/accounts/${account.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir fiche
                                </Link>
                            </DropdownMenuItem>

                            {account.mainContactPhone && (
                                <DropdownMenuItem >
                                    <a href={`tel:${account.mainContactPhone}`}>
                                        <Phone className="mr-2 size-4" />
                                        Appeler
                                    </a>
                                </DropdownMenuItem>
                            )}

                            {account.mainContactEmail && (
                                <DropdownMenuItem >
                                    <a href={`mailto:${account.mainContactEmail}`}>
                                        <Mail className="mr-2 size-4" />
                                        Envoyer email
                                    </a>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <CalendarClock className="mr-2 size-4" />
                                Planifier relance
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Target className="mr-2 size-4" />
                                Créer opportunité
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export default function CorporateAccountsPage() {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [typeFilter, setTypeFilter] = React.useState<string>("all");
    const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

    const filteredAccounts = corporateAccounts.filter((account) => {
        const normalizedSearch = search.toLowerCase().trim();

        const matchSearch =
            !normalizedSearch ||
            account.organizationName.toLowerCase().includes(normalizedSearch) ||
            account.sector?.toLowerCase().includes(normalizedSearch) ||
            account.city?.toLowerCase().includes(normalizedSearch) ||
            account.mainContactName?.toLowerCase().includes(normalizedSearch) ||
            account.decisionMakerName?.toLowerCase().includes(normalizedSearch);

        const matchStatus =
            statusFilter === "all" || account.status === statusFilter;

        const matchType = typeFilter === "all" || account.type === typeFilter;

        const matchPriority =
            priorityFilter === "all" || account.priority === priorityFilter;

        return matchSearch && matchStatus && matchType && matchPriority;
    });

    const totalAccounts = corporateAccounts.length;

    const strategicAccounts = corporateAccounts.filter(
        (account) => account.priority === "strategique"
    ).length;

    const activeAccounts = corporateAccounts.filter((account) =>
        [
            "rendez_vous_obtenu",
            "presentation_faite",
            "negociation",
            "opportunite_active",
        ].includes(account.status)
    ).length;

    const accountsToContact = corporateAccounts.filter(
        (account) => account.status === "a_contacter"
    ).length;

    const accountsWithoutDecisionMaker = corporateAccounts.filter(
        (account) => !account.decisionMakerIdentified
    ).length;

    const totalPipelineValue = corporateAccounts.reduce((total, account) => {
        return total + account.estimatedPipelineValue;
    }, 0);

    const urgentAccounts = corporateAccounts.filter((account) => {
        const days = getDaysRemaining(account.nextActionDate);

        return (
            account.priority === "strategique" ||
            account.status === "a_contacter" ||
            (days !== null && days <= 3)
        );
    });

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Comptes corporate
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gérez les entreprises, institutions, banques, investisseurs,
                        partenaires, associations et personnalités importantes.
                    </p>
                </div>

                <Button >
                    <Link href="/dashboard/corporate/accounts/create">
                        <Plus className="mr-2 size-4" />
                        Nouveau compte
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <KpiCard
                    title="Comptes"
                    value={totalAccounts}
                    description="Total comptes corporate"
                    icon={Building2}
                />

                <KpiCard
                    title="Stratégiques"
                    value={strategicAccounts}
                    description="Comptes à forte priorité"
                    icon={Star}
                />

                <KpiCard
                    title="Actifs"
                    value={activeAccounts}
                    description="Avec suivi ou opportunité"
                    icon={Target}
                />

                <KpiCard
                    title="À contacter"
                    value={accountsToContact}
                    description="Premier contact à faire"
                    icon={Phone}
                />

                <KpiCard
                    title="Pipeline"
                    value={formatCurrency(totalPipelineValue)}
                    description="Valeur estimée totale"
                    icon={Landmark}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Comptes prioritaires à traiter</CardTitle>
                        <CardDescription>
                            Comptes stratégiques, comptes à contacter ou actions proches.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {urgentAccounts.slice(0, 5).map((account) => {
                            const days = getDaysRemaining(account.nextActionDate);

                            return (
                                <div
                                    key={account.id}
                                    className="flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Building2 className="size-5" />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold">
                                                    {account.organizationName}
                                                </p>
                                                <PriorityBadge priority={account.priority} />
                                                <StatusBadge status={account.status} />
                                            </div>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {account.nextAction ?? "Aucune prochaine action."}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {formatDate(account.nextActionDate)}
                                                {days !== null
                                                    ? days > 0
                                                        ? ` — dans ${days} jour(s)`
                                                        : days === 0
                                                            ? " — aujourd’hui"
                                                            : ` — en retard de ${Math.abs(days)} jour(s)`
                                                    : ""}{" "}
                                                • Assigné à : {account.assignedTo ?? "Non assigné"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {account.mainContactPhone && (
                                            <Button size="sm" variant="outline" >
                                                <a href={`tel:${account.mainContactPhone}`}>
                                                    <Phone className="mr-2 size-4" />
                                                    Appeler
                                                </a>
                                            </Button>
                                        )}

                                        <Button size="sm" >
                                            <Link href={`/dashboard/corporate/accounts/${account.id}`}>
                                                Traiter
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alertes comptes</CardTitle>
                        <CardDescription>
                            Points à corriger pour améliorer le suivi corporate.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <AlertItem
                            title="Décideur non identifié"
                            value={accountsWithoutDecisionMaker}
                            description="Comptes sans vrai décideur confirmé."
                        />

                        <AlertItem
                            title="À contacter"
                            value={accountsToContact}
                            description="Comptes créés mais pas encore approchés."
                        />

                        <AlertItem
                            title="Stratégiques"
                            value={strategicAccounts}
                            description="Comptes à suivre avec priorité élevée."
                        />

                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-sm font-medium">Méthode recommandée</p>
                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                <li>Identifier l’interlocuteur principal.</li>
                                <li>Identifier le vrai décideur.</li>
                                <li>Créer une opportunité claire.</li>
                                <li>Planifier une prochaine action datée.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des comptes corporate</CardTitle>
                    <CardDescription>
                        Filtrez et suivez les comptes selon leur statut, type, priorité,
                        score, décideur et prochaine action.
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
                                    placeholder="Rechercher compte, secteur, ville..."
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
                                    <SelectItem value="identifie">Identifié</SelectItem>
                                    <SelectItem value="a_contacter">À contacter</SelectItem>
                                    <SelectItem value="contacte">Contacté</SelectItem>
                                    <SelectItem value="rendez_vous_obtenu">
                                        RDV obtenu
                                    </SelectItem>
                                    <SelectItem value="presentation_faite">
                                        Présentation faite
                                    </SelectItem>
                                    <SelectItem value="negociation">Négociation</SelectItem>
                                    <SelectItem value="opportunite_active">
                                        Opportunité active
                                    </SelectItem>
                                    <SelectItem value="converti">Converti</SelectItem>
                                    <SelectItem value="a_nourrir">À nourrir</SelectItem>
                                    <SelectItem value="perdu">Perdu</SelectItem>
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
                                    <Building2 className="mr-2 size-4" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">Tous les types</SelectItem>
                                    <SelectItem value="entreprise">Entreprise</SelectItem>
                                    <SelectItem value="institution">Institution</SelectItem>
                                    <SelectItem value="ong">ONG</SelectItem>
                                    <SelectItem value="banque">Banque</SelectItem>
                                    <SelectItem value="assurance">Assurance</SelectItem>
                                    <SelectItem value="association">Association</SelectItem>
                                    <SelectItem value="investisseur">Investisseur</SelectItem>
                                    <SelectItem value="promoteur">Promoteur</SelectItem>
                                    <SelectItem value="personnalite">Personnalité</SelectItem>
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
                                    <Star className="mr-2 size-4" />
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
                            {filteredAccounts.length} résultat(s)
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredAccounts}
                        searchKey="organizationName"
                        searchPlaceholder="Rechercher une organisation..."
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
                    <UsersRound className="size-4" />
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