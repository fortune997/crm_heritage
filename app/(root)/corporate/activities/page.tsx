"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
    AlertTriangle,
    ArrowUpDown,
    Building2,
    CalendarClock,
    CheckCircle2,
    Clock,
    Eye,
    FileText,
    Filter,
    Mail,
    MessageCircle,
    MoreHorizontal,
    Phone,
    Plus,
    Presentation,
    Search,
    Send,
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

type CorporateActivityType =
    | "appel"
    | "whatsapp"
    | "email"
    | "lettre_officielle"
    | "rendez_vous"
    | "presentation"
    | "relance"
    | "document"
    | "note"
    | "negociation";

type CorporateActivityStatus =
    | "a_faire"
    | "en_cours"
    | "terminee"
    | "en_retard"
    | "annulee";

type CorporateActivityPriority =
    | "faible"
    | "moyenne"
    | "haute"
    | "urgente"
    | "strategique";

type CorporateActivity = {
    id: string;

    title: string;
    description?: string;

    type: CorporateActivityType;
    status: CorporateActivityStatus;
    priority: CorporateActivityPriority;

    corporateAccountId: string;
    corporateAccountName: string;

    opportunityId?: string;
    opportunityTitle?: string;

    contactName?: string;
    contactRole?: string;
    contactPhone?: string;
    contactEmail?: string;

    assignedTo: string;
    createdBy: string;

    activityDate: string;
    dueTime?: string;

    completedAt?: string;
    result?: string;
    nextAction?: string;
    nextActionDate?: string;

    createdAt: string;
};

const corporateActivities: CorporateActivity[] = [
    {
        id: "ACT-CORP-001",
        title: "Relancer le DG pour validation de la proposition",
        description:
            "Relancer le Directeur Général pour obtenir un retour sur la proposition du programme employés.",
        type: "relance",
        status: "a_faire",
        priority: "strategique",
        corporateAccountId: "CORP-001",
        corporateAccountName: "Alpha Construction SARL",
        opportunityId: "OPP-001",
        opportunityTitle: "Programme d’acquisition de terrains pour employés",
        contactName: "Mme Nadia Fotso",
        contactRole: "Responsable administratif",
        contactPhone: "+237 675 222 333",
        contactEmail: "nadia@alpha.cm",
        assignedTo: "Commercial Corporate",
        createdBy: "Responsable Commercial",
        activityDate: "2026-05-20",
        dueTime: "10:00",
        nextAction: "Obtenir une date de réunion avec le DG",
        nextActionDate: "2026-05-22",
        createdAt: "2026-05-15",
    },
    {
        id: "ACT-CORP-002",
        title: "Envoyer la lettre officielle de partenariat",
        description:
            "Préparer et envoyer une lettre officielle à la direction commerciale de Banque Horizon.",
        type: "lettre_officielle",
        status: "en_retard",
        priority: "urgente",
        corporateAccountId: "CORP-002",
        corporateAccountName: "Banque Horizon",
        opportunityId: "OPP-002",
        opportunityTitle: "Partenariat financement clients Heritage",
        contactName: "Direction commerciale",
        contactRole: "Décideur à confirmer",
        assignedTo: "Responsable Partenariats",
        createdBy: "Direction Commerciale",
        activityDate: "2026-05-10",
        dueTime: "15:00",
        nextAction: "Déposer la lettre et demander un rendez-vous",
        nextActionDate: "2026-05-18",
        createdAt: "2026-05-08",
    },
    {
        id: "ACT-CORP-003",
        title: "Réunion de présentation programme diaspora",
        description:
            "Présenter les modalités d’acquisition de terrains aux membres du bureau exécutif.",
        type: "presentation",
        status: "terminee",
        priority: "haute",
        corporateAccountId: "CORP-003",
        corporateAccountName: "Diaspora Invest Network",
        opportunityId: "OPP-003",
        opportunityTitle: "Achat groupé diaspora",
        contactName: "M. Patrick Mvondo",
        contactRole: "Président",
        contactPhone: "+237 690 444 555",
        contactEmail: "contact@diasporainvest.org",
        assignedTo: "Commercial Corporate",
        createdBy: "Commercial Corporate",
        activityDate: "2026-05-12",
        dueTime: "14:00",
        completedAt: "2026-05-12",
        result:
            "Présentation bien reçue. Le bureau demande plus de détails sur les documents fonciers.",
        nextAction: "Envoyer les documents fonciers et les modalités de paiement",
        nextActionDate: "2026-05-16",
        createdAt: "2026-05-09",
    },
    {
        id: "ACT-CORP-004",
        title: "Appel de cadrage apport d’affaires",
        description:
            "Échanger avec le cabinet juridique sur les conditions d’apport d’affaires.",
        type: "appel",
        status: "a_faire",
        priority: "moyenne",
        corporateAccountId: "CORP-004",
        corporateAccountName: "Cabinet Juris & Partners",
        opportunityId: "OPP-004",
        opportunityTitle: "Apport d’affaires clients investisseurs",
        contactName: "Me Grâce Nguefack",
        contactRole: "Associée",
        contactPhone: "+237 677 888 999",
        contactEmail: "grace@jurispartners.cm",
        assignedTo: "Commercial Corporate",
        createdBy: "Commercial Corporate",
        activityDate: "2026-05-22",
        dueTime: "11:30",
        nextAction: "Envoyer un projet d’accord d’apport d’affaires",
        nextActionDate: "2026-05-25",
        createdAt: "2026-05-16",
    },
    {
        id: "ACT-CORP-005",
        title: "Envoyer documents juridiques complémentaires",
        description:
            "Transmettre les pièces juridiques demandées par Fondation Habitat Plus.",
        type: "document",
        status: "en_cours",
        priority: "haute",
        corporateAccountId: "CORP-005",
        corporateAccountName: "Fondation Habitat Plus",
        opportunityId: "OPP-005",
        opportunityTitle: "Achat institutionnel pour projet de logements",
        contactName: "M. Alain T.",
        contactRole: "Coordinateur programme",
        contactPhone: "+237 699 111 222",
        contactEmail: "contact@habitatplus.org",
        assignedTo: "Direction commerciale",
        createdBy: "Juridique",
        activityDate: "2026-05-17",
        dueTime: "09:00",
        nextAction: "Confirmer la réception et demander date de validation",
        nextActionDate: "2026-05-19",
        createdAt: "2026-05-13",
    },
    {
        id: "ACT-CORP-006",
        title: "Note interne sur stratégie Banque Horizon",
        description:
            "Identifier une personne pouvant introduire Heritage auprès de la direction commerciale.",
        type: "note",
        status: "a_faire",
        priority: "haute",
        corporateAccountId: "CORP-002",
        corporateAccountName: "Banque Horizon",
        opportunityId: "OPP-002",
        opportunityTitle: "Partenariat financement clients Heritage",
        assignedTo: "Responsable Partenariats",
        createdBy: "Direction Commerciale",
        activityDate: "2026-05-18",
        createdAt: "2026-05-14",
    },
];

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

function getTypeLabel(type: CorporateActivityType) {
    const labels: Record<CorporateActivityType, string> = {
        appel: "Appel",
        whatsapp: "WhatsApp",
        email: "Email",
        lettre_officielle: "Lettre officielle",
        rendez_vous: "Rendez-vous",
        presentation: "Présentation",
        relance: "Relance",
        document: "Document",
        note: "Note",
        negociation: "Négociation",
    };

    return labels[type];
}

function getStatusLabel(status: CorporateActivityStatus) {
    const labels: Record<CorporateActivityStatus, string> = {
        a_faire: "À faire",
        en_cours: "En cours",
        terminee: "Terminée",
        en_retard: "En retard",
        annulee: "Annulée",
    };

    return labels[status];
}

function getPriorityLabel(priority: CorporateActivityPriority) {
    const labels: Record<CorporateActivityPriority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
        urgente: "Urgente",
        strategique: "Stratégique",
    };

    return labels[priority];
}

function getActivityIcon(type: CorporateActivityType) {
    const icons: Record<CorporateActivityType, React.ElementType> = {
        appel: Phone,
        whatsapp: MessageCircle,
        email: Mail,
        lettre_officielle: FileText,
        rendez_vous: CalendarClock,
        presentation: Presentation,
        relance: Clock,
        document: Send,
        note: FileText,
        negociation: Target,
    };

    return icons[type];
}

function TypeBadge({ type }: { type: CorporateActivityType }) {
    const Icon = getActivityIcon(type);

    return (
        <Badge variant="outline" className="gap-1">
            <Icon className="size-3" />
            {getTypeLabel(type)}
        </Badge>
    );
}

function StatusBadge({ status }: { status: CorporateActivityStatus }) {
    const className: Record<CorporateActivityStatus, string> = {
        a_faire: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        en_cours: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        terminee: "border-green-500/20 bg-green-500/10 text-green-600",
        en_retard: "border-red-500/20 bg-red-500/10 text-red-600",
        annulee: "border-muted bg-muted text-muted-foreground",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {getStatusLabel(status)}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: CorporateActivityPriority }) {
    const className: Record<CorporateActivityPriority, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        moyenne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        urgente: "border-red-500/20 bg-red-500/10 text-red-600",
        strategique: "border-purple-500/20 bg-purple-500/10 text-purple-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {getPriorityLabel(priority)}
        </Badge>
    );
}

const columns: ColumnDef<CorporateActivity>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-0 font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Activité
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const activity = row.original;
            const Icon = getActivityIcon(activity.type);

            return (
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                    </div>

                    <div>
                        <Link
                            href={`/dashboard/corporate/activities/${activity.id}`}
                            className="font-medium text-foreground hover:underline"
                        >
                            {activity.title}
                        </Link>

                        <p className="line-clamp-2 text-xs text-muted-foreground">
                            {activity.description ?? "Aucune description."}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "corporateAccountName",
        header: "Compte corporate",
        cell: ({ row }) => {
            const activity = row.original;

            return (
                <div>
                    <Link
                        href={`/dashboard/corporate/accounts/${activity.corporateAccountId}`}
                        className="font-medium hover:underline"
                    >
                        {activity.corporateAccountName}
                    </Link>

                    {activity.opportunityTitle && (
                        <p className="text-xs text-muted-foreground">
                            Opportunité : {activity.opportunityTitle}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "contactName",
        header: "Interlocuteur",
        cell: ({ row }) => {
            const activity = row.original;

            return (
                <div>
                    <p className="font-medium">
                        {activity.contactName ?? "Non renseigné"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {activity.contactRole ?? "Rôle non défini"}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <TypeBadge type={row.original.type} />,
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
        accessorKey: "activityDate",
        header: "Échéance",
        cell: ({ row }) => {
            const activity = row.original;
            const days = getDaysRemaining(activity.activityDate);

            return (
                <div>
                    <p className="font-medium">
                        {formatDate(activity.activityDate)}
                        {activity.dueTime ? ` à ${activity.dueTime}` : ""}
                    </p>

                    {days !== null && (
                        <p className="text-xs text-muted-foreground">
                            {days > 0
                                ? `Dans ${days} jour(s)`
                                : days === 0
                                    ? "Aujourd’hui"
                                    : `En retard de ${Math.abs(days)} jour(s)`}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "assignedTo",
        header: "Assigné à",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.assignedTo}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const activity = row.original;

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
                                <Link href={`/dashboard/corporate/activities/${activity.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    Voir activité
                                </Link>
                            </DropdownMenuItem>

                            {activity.contactPhone && (
                                <DropdownMenuItem >
                                    <a href={`tel:${activity.contactPhone}`}>
                                        <Phone className="mr-2 size-4" />
                                        Appeler
                                    </a>
                                </DropdownMenuItem>
                            )}

                            {activity.contactEmail && (
                                <DropdownMenuItem >
                                    <a href={`mailto:${activity.contactEmail}`}>
                                        <Mail className="mr-2 size-4" />
                                        Envoyer email
                                    </a>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 size-4" />
                                Marquer terminée
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <CalendarClock className="mr-2 size-4" />
                                Replanifier
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export default function CorporateActivitiesPage() {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [typeFilter, setTypeFilter] = React.useState<string>("all");
    const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

    const filteredActivities = corporateActivities.filter((activity) => {
        const normalizedSearch = search.toLowerCase().trim();

        const matchSearch =
            !normalizedSearch ||
            activity.title.toLowerCase().includes(normalizedSearch) ||
            activity.corporateAccountName.toLowerCase().includes(normalizedSearch) ||
            activity.opportunityTitle?.toLowerCase().includes(normalizedSearch) ||
            activity.contactName?.toLowerCase().includes(normalizedSearch) ||
            activity.assignedTo.toLowerCase().includes(normalizedSearch);

        const matchStatus =
            statusFilter === "all" || activity.status === statusFilter;

        const matchType = typeFilter === "all" || activity.type === typeFilter;

        const matchPriority =
            priorityFilter === "all" || activity.priority === priorityFilter;

        return matchSearch && matchStatus && matchType && matchPriority;
    });

    const todayActivities = corporateActivities.filter((activity) => {
        const days = getDaysRemaining(activity.activityDate);
        return days === 0;
    }).length;

    const overdueActivities = corporateActivities.filter(
        (activity) => activity.status === "en_retard"
    ).length;

    const todoActivities = corporateActivities.filter(
        (activity) => activity.status === "a_faire"
    ).length;

    const strategicActivities = corporateActivities.filter(
        (activity) =>
            activity.priority === "strategique" || activity.priority === "urgente"
    ).length;

    const completedActivities = corporateActivities.filter(
        (activity) => activity.status === "terminee"
    ).length;

    const urgentActivities = corporateActivities.filter((activity) => {
        const days = getDaysRemaining(activity.activityDate);

        return (
            activity.status === "en_retard" ||
            activity.priority === "urgente" ||
            activity.priority === "strategique" ||
            (days !== null && days <= 3 && activity.status !== "terminee")
        );
    });

    const nextMeetings = corporateActivities.filter(
        (activity) =>
            ["rendez_vous", "presentation", "negociation"].includes(activity.type) &&
            activity.status !== "terminee" &&
            activity.status !== "annulee"
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Activités corporate
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Suivez les appels, emails, lettres officielles, rendez-vous,
                        présentations, relances et actions stratégiques liées aux comptes
                        corporate.
                    </p>
                </div>

                <Button >
                    <Link href="/dashboard/corporate/activities/create">
                        <Plus className="mr-2 size-4" />
                        Nouvelle activité
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <KpiCard
                    title="Aujourd’hui"
                    value={todayActivities}
                    description="Activités prévues ce jour"
                    icon={CalendarClock}
                />

                <KpiCard
                    title="À faire"
                    value={todoActivities}
                    description="Actions non traitées"
                    icon={Clock}
                />

                <KpiCard
                    title="En retard"
                    value={overdueActivities}
                    description="Actions dépassées"
                    icon={AlertTriangle}
                />

                <KpiCard
                    title="Stratégiques"
                    value={strategicActivities}
                    description="Priorité urgente ou stratégique"
                    icon={Target}
                />

                <KpiCard
                    title="Terminées"
                    value={completedActivities}
                    description="Actions déjà réalisées"
                    icon={CheckCircle2}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Actions prioritaires à traiter</CardTitle>
                        <CardDescription>
                            Activités urgentes, stratégiques, proches ou en retard.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {urgentActivities.length ? (
                            urgentActivities.slice(0, 5).map((activity) => {
                                const Icon = getActivityIcon(activity.type);
                                const days = getDaysRemaining(activity.activityDate);

                                return (
                                    <div
                                        key={activity.id}
                                        className="flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="size-5" />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{activity.title}</p>
                                                    <PriorityBadge priority={activity.priority} />
                                                    <StatusBadge status={activity.status} />
                                                </div>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {activity.corporateAccountName}
                                                    {activity.opportunityTitle
                                                        ? ` • ${activity.opportunityTitle}`
                                                        : ""}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatDate(activity.activityDate)}
                                                    {activity.dueTime ? ` à ${activity.dueTime}` : ""}
                                                    {days !== null
                                                        ? days > 0
                                                            ? ` — dans ${days} jour(s)`
                                                            : days === 0
                                                                ? " — aujourd’hui"
                                                                : ` — en retard de ${Math.abs(days)} jour(s)`
                                                        : ""}{" "}
                                                    • Assigné à : {activity.assignedTo}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {activity.contactPhone && (
                                                <Button size="sm" variant="outline" >
                                                    <a href={`tel:${activity.contactPhone}`}>
                                                        <Phone className="mr-2 size-4" />
                                                        Appeler
                                                    </a>
                                                </Button>
                                            )}

                                            <Button size="sm" >
                                                <Link
                                                    href={`/dashboard/corporate/activities/${activity.id}`}
                                                >
                                                    Traiter
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                Aucune activité prioritaire pour le moment.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rendez-vous & présentations</CardTitle>
                        <CardDescription>
                            Activités importantes qui nécessitent une préparation.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {nextMeetings.length ? (
                            nextMeetings.map((activity) => (
                                <div key={activity.id} className="rounded-lg border p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.corporateAccountName}
                                            </p>
                                        </div>

                                        <TypeBadge type={activity.type} />
                                    </div>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {formatDate(activity.activityDate)}
                                        {activity.dueTime ? ` à ${activity.dueTime}` : ""} •{" "}
                                        {activity.assignedTo}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                Aucun rendez-vous ou présentation à venir.
                            </div>
                        )}

                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-sm font-medium">À préparer avant un RDV</p>
                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                <li>Dossier de présentation Heritage.</li>
                                <li>Liste des biens ou sites adaptés.</li>
                                <li>Documents juridiques utiles.</li>
                                <li>Proposition claire et prochaine étape.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des activités corporate</CardTitle>
                    <CardDescription>
                        Filtrez les activités par statut, type, priorité, compte,
                        opportunité ou responsable.
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
                                    placeholder="Rechercher activité, compte..."
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
                                    <SelectItem value="a_faire">À faire</SelectItem>
                                    <SelectItem value="en_cours">En cours</SelectItem>
                                    <SelectItem value="terminee">Terminée</SelectItem>
                                    <SelectItem value="en_retard">En retard</SelectItem>
                                    <SelectItem value="annulee">Annulée</SelectItem>
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
                                    <SelectItem value="appel">Appel</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="lettre_officielle">
                                        Lettre officielle
                                    </SelectItem>
                                    <SelectItem value="rendez_vous">Rendez-vous</SelectItem>
                                    <SelectItem value="presentation">Présentation</SelectItem>
                                    <SelectItem value="relance">Relance</SelectItem>
                                    <SelectItem value="document">Document</SelectItem>
                                    <SelectItem value="note">Note</SelectItem>
                                    <SelectItem value="negociation">Négociation</SelectItem>
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
                                    <SelectItem value="urgente">Urgente</SelectItem>
                                    <SelectItem value="strategique">Stratégique</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {filteredActivities.length} résultat(s)
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredActivities}
                        searchKey="title"
                        searchPlaceholder="Rechercher une activité..."
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
                <CardTitle className="text-2xl">{value}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}