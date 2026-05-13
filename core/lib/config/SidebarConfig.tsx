import { SidebarConfig } from "@/core/utils/const/nav-item-sidebar";

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
} from "lucide-react";

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
            requiredPermissions: ["dashboard.read"],
        },

        {
            title: "Administration",
            url: "/admin",
            icon: ShieldCheck,
            requiredPermissions: ["admin.access"],
            items: [
                {
                    title: "Entreprises",
                    url: "/admin/companies",
                    requiredPermissions: ["company.read"],
                },
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
                    requiredPermissions: ["prospect.read"],
                },
                {
                    title: "Clients",
                    url: "/marketing/clients",
                    icon: Handshake,
                    requiredPermissions: ["client.read"],
                },
                {
                    title: "Activités",
                    url: "/marketing/activities",
                    icon: Activity,
                    requiredPermissions: ["activity.read"],
                },
                {
                    title: "Corporate",
                    url: "/marketing/corporate",
                    icon: BriefcaseBusiness,
                    requiredPermissions: ["corporate.read"],
                },
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
            url: "/topography",
            icon: MapPinned,
            requiredPermissions: ["topography.read"],
            items: [
                {
                    title: "Sites",
                    url: "/sites",
                    icon: Map,
                    requiredPermissions: ["site.read"],
                },
                {
                    title: "Visites",
                    url: "/visits",
                    icon: Route,
                    requiredPermissions: ["visit.read"],
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
                    title: "Canaux d’acquisition",
                    url: "/digital/acquisition-channels",
                    icon: Share2,
                    requiredPermissions: ["acquisition_channel.read"],
                },
            ],
        },

        {
            title: "Paramètres",
            url: "/settings",
            icon: Settings,
            requiredPermissions: ["settings.read"],
            items: [
                {
                    title: "Canaux d’acquisition",
                    url: "/digital/acquisition-channels",
                    icon: Share2,
                    requiredPermissions: ["acquisition_channel.read"],
                },
            ],
        },
    ],
};