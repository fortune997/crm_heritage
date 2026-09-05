// @ts-nocheck
import { SidebarConfig } from "@/core/types/permissions";
import {
    Building2,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    Target,
    Users,
    Handshake,
    Activity,
    BriefcaseBusiness,
    MapPinned,
    Map,
    Route,
    Megaphone,
    Share2,
    Share,
    User,
    DollarSign,
    Banknote,
    BarChart3,
    ActivityIcon,
    CalendarClock,
    HandshakeIcon,
    Users2,
    LayoutDashboardIcon,
    TargetIcon,
} from "lucide-react";

type TRequiredPermissions = string[];
export const sidebarConfig: SidebarConfig = {

    teams: [
        {
            name: "HERITAGE CRM",
            logo: Building2,
            plan: "Administration",
        },
    ],

    navMain: [
        {
            title: "Tableau de bord",
            url: "/dashboard",
            icon: LayoutDashboard,
            requiredPermissions: ["dashboard.view"],
        },



        {
            title: "Marketing",
            url: "/marketing",
            icon: Target,
            requiredPermissions: ["marketing.read"],
            items: [
                {
                    title: "Prospects",
                    url: "/marketing/prospects",
                    icon: Users,
                    requiredPermissions: ["prospect.read", "prospect.read.own"],
                },
                {
                    title: "Clients",
                    url: "/marketing/clients",
                    icon: Handshake,
                    requiredPermissions: ["client.read", "client.read.own"],
                },
                {
                    title: "Activités",
                    url: "/marketing/activities",
                    icon: Activity,
                    requiredPermissions: ["activity.read", "activity.view", "activity.read.own",],
                },

            ],
        },
       {
    title: "Closing",
    url: "/closing",
    icon: TargetIcon,

    requiredPermissions: [
        "closing.read.all",
        "closing.read.assigned",
    ],

    items: [
        {
            title: "Vue d’ensemble",
            url: "/closing",
            icon: LayoutDashboardIcon,

            requiredPermissions: [
                "closing.read.all",
                "closing.read.assigned",
            ],
        },
        {
            title: "Prospects à closer",
            url: "/closing/prospects",
            icon: Users2,

            requiredPermissions: [
                "closing.read.all",
                "closing.read.assigned",
            ],
        },
       /*  {
            title: "Pipeline",
            url: "/closing/pipeline",
            icon: HandshakeIcon,

            requiredPermissions: [
                "closing.read.all",
                "closing.read.assigned",
            ],
        },
        {
            title: "Relances",
            url: "/closing/follow-ups",
            icon: CalendarClock,

            requiredPermissions: [
                "closing.manage",
            ],
        }, */
        {
            title: "Activités",
            url: "/closing/activities",
            icon: ActivityIcon,

            requiredPermissions: [
                "closing.read.all",
                "closing.read.assigned",
            ],
        },
       /*  {
            title: "Performances",
            url: "/closing/reports",
            icon: BarChart3,

            requiredPermissions: [
                "closing.report",
            ],
        }, */
    ],
},
        {
            title: "Corporate",
            url: "/corporate",
            icon: Building2,
            requiredPermissions: ["corporate.access"],
            items: [
                {
                    title: "Vue d’ensemble",
                    url: "/corporate",
                    requiredPermissions: ["corporate.read"],
                },
                {
                    title: "Comptes corporate",
                    url: "/corporate/accounts",
                    requiredPermissions: ["corporate.account.read"],
                },
                {
                    title: "Opportunités",
                    url: "/corporate/opportunity",
                    requiredPermissions: ["corporate.opportunity.read"],
                },
                {
                    title: "Activités",
                    url: "/corporate/activities",
                    requiredPermissions: ["corporate.activity.read"],
                },
            ],
        },
        {
            title: "Topographe",
            url: "/topographiques",
            icon: MapPinned,
            requiredPermissions: ["topography.read"],
            items: [
                {
                    title: "Sites",
                    url: "/topographiques/sites",
                    requiredPermissions: ["site.read"],
                },
                {
                    title: "Visites",
                    url: "/topographiques/visites",
                    requiredPermissions: ["visit.read"],
                },
                {
                    title: "Rapport Visites",
                    url: "/topographiques/rapport",
                    requiredPermissions: [],
                },
                {
                    title: "Dossier",
                    url: "/topographiques/dossier",
                    requiredPermissions: [],
                },
            ],
        },
        {
            title: "Comptabilité",
            url: "/comptabilite",
            icon: Banknote,
            requiredPermissions: ["accounting.view"],
            items: [
                {
                    title: "Ventes",
                    url: "/comptabilite/ventes",
                    icon: Banknote,
                    requiredPermissions: ["sales.view"],
                },
                {
                    title: "Paiements",
                    url: "/comptabilite/paiements",
                    icon: DollarSign,
                    requiredPermissions: ["payments.view"],
                },
                /* {
                    title: "Reçus",
                    url: "/comptabilite/recus",
                    icon: Banknote,
                    requiredPermissions: ["receipts.view"],
                },
                {
                    title: "Factures",
                    url: "/comptabilite/factures",
                    icon: BriefcaseBusiness,
                    requiredPermissions: ["invoices.view"],
                },
                {
                    title: "Rapports financiers",
                    url: "/comptabilite/rapports",
                    icon: Activity,
                    requiredPermissions: ["financial_reports.view"],
                }, */
                {
                    title: "Dépenses",
                    url: "/comptabilite/depenses",
                    icon: DollarSign,
                    requiredPermissions: ["expenses.view"],
                },
            ],
        },
        {
            title: "Digital",
            url: "/digital",
            icon: Megaphone,
            requiredPermissions: ["digital.read"],
            items: [
                {
                    title: "Overview",
                    url: "/digital",
                    icon: Share,
                    requiredPermissions: ["acquisition_channel.read"],
                },
                {
                    title: "Canaux d’acquisition",
                    url: "/digital/channel-acquisition",
                    icon: Share2,
                    requiredPermissions: ["acquisition_channel.read"],
                },
            ],
        },

        {
            title: "Paramètres",
            url: "/users",
            icon: Settings,
            requiredPermissions: ["settings.read"],
            items: [
                {
                    title: "Mon Profil",
                    url: "/users/settings",
                    icon: Share2,
                    requiredPermissions: ["settings.read"],
                },

            ],
        },
        {
            title: "Administration",
            url: "/admin",
            icon: ShieldCheck,
            requiredPermissions: ["user.read"],
            items: [
                {
                    title: "Utilisateurs",
                    url: "/admin/users",
                    requiredPermissions: ["user.read"],
                },
                {
                    title: "Rôles",
                    url: "/admin/roles",
                    requiredPermissions: ["role.read"],
                },
            ],
        },
    ],
};