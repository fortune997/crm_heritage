import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    Building2,
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    Eye,
    FileText,
    Handshake,
    Mail,
    MoreHorizontal,
    Phone,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const corporateStats = [
    {
        title: "Comptes corporate",
        value: "42",
        description: "+8 nouveaux ce mois",
        icon: Building2,
    },
    {
        title: "Opportunités ouvertes",
        value: "18",
        description: "En cours de négociation",
        icon: Handshake,
    },
    {
        title: "CA potentiel",
        value: "86.5M FCFA",
        description: "Pipeline commercial estimé",
        icon: CircleDollarSign,
    },
    {
        title: "Taux de conversion",
        value: "34%",
        description: "+6% par rapport au mois dernier",
        icon: TrendingUp,
    },
];

const pipelineStages = [
    {
        label: "Nouveau contact",
        count: 9,
        value: 18,
    },
    {
        label: "Qualification",
        count: 7,
        value: 32,
    },
    {
        label: "Rendez-vous",
        count: 5,
        value: 45,
    },
    {
        label: "Proposition envoyée",
        count: 4,
        value: 61,
    },
    {
        label: "Négociation",
        count: 3,
        value: 76,
    },
    {
        label: "Gagné",
        count: 6,
        value: 100,
    },
];

const importantAccounts = [
    {
        id: "1",
        name: "Orange Cameroun",
        sector: "Télécommunications",
        priority: "Très élevé",
        owner: "Marcel Kouam",
        status: "En négociation",
        lastInteraction: "Appel il y a 2 jours",
    },
    {
        id: "2",
        name: "Groupe SABC",
        sector: "Industrie",
        priority: "Élevé",
        owner: "Sandra Ngono",
        status: "Proposition envoyée",
        lastInteraction: "Email il y a 4 jours",
    },
    {
        id: "3",
        name: "Université Catholique",
        sector: "Éducation",
        priority: "Moyen",
        owner: "Michel Dylane",
        status: "Qualification",
        lastInteraction: "Rendez-vous prévu",
    },
    {
        id: "4",
        name: "Afriland First Bank",
        sector: "Banque",
        priority: "Très élevé",
        owner: "Marcel Kouam",
        status: "Rendez-vous",
        lastInteraction: "Réunion hier",
    },
];

const recentOpportunities = [
    {
        id: "OPP-001",
        title: "Programme logements cadres",
        account: "Orange Cameroun",
        amount: "25M FCFA",
        stage: "Négociation",
        probability: 70,
        closingDate: "28 juin 2026",
    },
    {
        id: "OPP-002",
        title: "Acquisition terrains employés",
        account: "Groupe SABC",
        amount: "18M FCFA",
        stage: "Proposition envoyée",
        probability: 55,
        closingDate: "10 juillet 2026",
    },
    {
        id: "OPP-003",
        title: "Partenariat logement enseignants",
        account: "Université Catholique",
        amount: "9M FCFA",
        stage: "Qualification",
        probability: 35,
        closingDate: "15 juillet 2026",
    },
];

const recentActivities = [
    {
        type: "Appel",
        title: "Appel de qualification avec Orange Cameroun",
        account: "Orange Cameroun",
        time: "Il y a 2 heures",
        icon: Phone,
    },
    {
        type: "Email",
        title: "Envoi de la proposition commerciale",
        account: "Groupe SABC",
        time: "Il y a 5 heures",
        icon: Mail,
    },
    {
        type: "Rendez-vous",
        title: "Réunion de présentation du projet immobilier",
        account: "Afriland First Bank",
        time: "Hier",
        icon: CalendarClock,
    },
    {
        type: "Note",
        title: "Ajout d’une note interne sur le besoin client",
        account: "Université Catholique",
        time: "Il y a 2 jours",
        icon: FileText,
    },
];

const alerts = [
    {
        title: "3 opportunités sans relance",
        description: "Aucune activité depuis plus de 7 jours.",
        icon: AlertTriangle,
    },
    {
        title: "2 propositions en attente",
        description: "Une réponse client est attendue cette semaine.",
        icon: Clock,
    },
    {
        title: "1 rendez-vous important demain",
        description: "Afriland First Bank — présentation du programme corporate.",
        icon: CalendarClock,
    },
];

function getPriorityBadge(priority: string) {
    if (priority === "Très élevé") {
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Très élevé</Badge>;
    }

    if (priority === "Élevé") {
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Élevé</Badge>;
    }

    return <Badge variant="secondary">Moyen</Badge>;
}

function getStatusBadge(status: string) {
    const statusMap: Record<string, React.ReactNode> = {
        "En négociation": (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                En négociation
            </Badge>
        ),
        "Proposition envoyée": (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Proposition envoyée
            </Badge>
        ),
        Qualification: (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                Qualification
            </Badge>
        ),
        "Rendez-vous": (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Rendez-vous
            </Badge>
        ),
    };

    return statusMap[status] ?? <Badge variant="outline">{status}</Badge>;
}

export default function CorporateOverviewPage() {
    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full">
                            Module corporate
                        </Badge>
                    </div>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Vue d’ensemble Corporate
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Suivez les grands comptes, les opportunités B2B, les interactions
                        commerciales et le pipeline corporate de Heritage.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <Link href="/dashboard/marketing/corporate/activities">
                            {/* <Activity className="mr-2 h-4 w-4" /> */}
                            Ajouter une activité
                        </Link>
                    </Button>

                    <Button>
                        <Link href="/dashboard/marketing/corporate/accounts/new">
                            {/* <Building2 className="mr-2 h-4 w-4" /> */}
                            Nouveau compte
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {corporateStats.map((stat) => {
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

            {/* Main Grid */}
            <div className="grid gap-6 xl:grid-cols-3">
                {/* Pipeline */}
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pipeline corporate</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Répartition des opportunités par étape commerciale.
                            </p>
                        </div>

                        <Button variant="outline" size="sm">
                            <Link href="/dashboard/marketing/corporate/opportunities">
                                Voir tout
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        {pipelineStages.map((stage) => (
                            <div key={stage.label} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-medium">{stage.label}</div>
                                    <div className="text-muted-foreground">
                                        {stage.count} opportunité{stage.count > 1 ? "s" : ""}
                                    </div>
                                </div>

                                <Progress value={stage.value} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alertes commerciales</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Points à traiter rapidement.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {alerts.map((alert) => {
                            const Icon = alert.icon;

                            return (
                                <div
                                    key={alert.title}
                                    className="rounded-2xl border bg-muted/30 p-4"
                                >
                                    <div className="flex gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background">
                                            <Icon className="h-4 w-4 text-orange-500" />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold">{alert.title}</h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {alert.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Accounts Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Comptes corporate importants</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Les entreprises et institutions à fort potentiel commercial.
                        </p>
                    </div>

                    <Button variant="outline" size="sm">
                        <Link href="/dashboard/marketing/corporate/accounts">
                            Voir les comptes
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="rounded-2xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Compte</TableHead>
                                    <TableHead>Secteur</TableHead>
                                    <TableHead>Priorité</TableHead>
                                    <TableHead>Responsable</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Dernière interaction</TableHead>
                                    <TableHead className="w-[60px]" />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {importantAccounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>
                                            <div className="font-medium">{account.name}</div>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {account.sector}
                                        </TableCell>

                                        <TableCell>{getPriorityBadge(account.priority)}</TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                    {account.owner
                                                        .split(" ")
                                                        .map((name) => name[0])
                                                        .join("")}
                                                </div>
                                                <span>{account.owner}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell>{getStatusBadge(account.status)}</TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {account.lastInteraction}
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Link
                                                            href={`/dashboard/marketing/corporate/accounts/${account.id}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Voir le compte
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Ajouter un appel
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Envoyer un email
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Opportunities + Activities */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Recent Opportunities */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Opportunités récentes</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Les affaires corporate en cours.
                            </p>
                        </div>

                        <Button variant="outline" size="sm">
                            <Link href="/dashboard/marketing/corporate/opportunities">
                                Voir tout
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {recentOpportunities.map((opportunity) => (
                            <div
                                key={opportunity.id}
                                className="rounded-2xl border p-4 transition hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">{opportunity.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {opportunity.account}
                                        </p>
                                    </div>

                                    <Badge variant="outline">{opportunity.stage}</Badge>
                                </div>

                                <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Montant</p>
                                        <p className="font-medium">{opportunity.amount}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Probabilité
                                        </p>
                                        <p className="font-medium">{opportunity.probability}%</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">Clôture</p>
                                        <p className="font-medium">{opportunity.closingDate}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Progress value={opportunity.probability} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Activités récentes</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Historique des dernières interactions corporate.
                            </p>
                        </div>

                        <Button variant="outline" size="sm">
                            <Link href="/dashboard/marketing/corporate/activities">
                                Voir tout
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {recentActivities.map((activity) => {
                            const Icon = activity.icon;

                            return (
                                <div
                                    key={`${activity.title}-${activity.time}`}
                                    className="flex gap-4 rounded-2xl border p-4"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary">{activity.type}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {activity.time}
                                            </span>
                                        </div>

                                        <h3 className="mt-2 text-sm font-semibold">
                                            {activity.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {activity.account}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Opportunités gagnées
                            </p>
                            <p className="text-xl font-bold">6</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-red-100 p-3 text-red-700">
                            <XCircle className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Opportunités perdues
                            </p>
                            <p className="text-xl font-bold">2</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                            <Users className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Contacts corporate
                            </p>
                            <p className="text-xl font-bold">128</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}