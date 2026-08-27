"use client";

import {
    Bell,
    CheckCheck,
    AlertTriangle,
    MapPin,
    FileCheck2,
    UserPlus,
    CalendarCheck,
    BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
    {
        id: "1",
        title: "Nouveau prospect",
        description:
            "Jean-Marc souhaite obtenir des informations sur un terrain de 500 m² à Japoma.",
        time: "Il y a 2 min",
        type: "prospect",
        unread: true,
    },
    {
        id: "2",
        title: "Nouvelle demande de visite",
        description:
            "Sandra a demandé une visite de terrain pour samedi à 10h à Yassa.",
        time: "Il y a 8 min",
        type: "visit",
        unread: true,
    },
    {
        id: "3",
        title: "Terrain réservé",
        description:
            "Le terrain HER-YAS-0054 de 500 m² vient d'être réservé par Rodrigue.",
        time: "Il y a 15 min",
        type: "reservation",
        unread: true,
    },
    {
        id: "4",
        title: "Dossier foncier validé",
        description:
            "Les documents du site Héritage Japoma ont été vérifiés et validés.",
        time: "Il y a 25 min",
        type: "document",
        unread: false,
    },
    {
        id: "5",
        title: "Vente confirmée",
        description:
            "La vente du terrain HER-DIB-0028 de 300 m² a été confirmée.",
        time: "Il y a 42 min",
        type: "sale",
        unread: false,
    },
    {
        id: "6",
        title: "Visite à venir",
        description:
            "Une visite de terrain est programmée aujourd'hui à 14h à Bonamoussadi.",
        time: "Il y a 1h",
        type: "visit",
        unread: false,
    },
    {
        id: "7",
        title: "Nouveau terrain ajouté",
        description:
            "Un nouveau site de 2 hectares situé à Logbessou a été ajouté au catalogue.",
        time: "Il y a 2h",
        type: "land",
        unread: false,
    },
];

function getNotificationIcon(type: string) {
    switch (type) {
        case "prospect":
            return UserPlus;

        case "visit":
            return CalendarCheck;

        case "reservation":
            return BadgeCheck;

        case "document":
            return FileCheck2;

        case "sale":
            return CheckCheck;

        case "land":
            return MapPin;

        case "warning":
            return AlertTriangle;

        default:
            return Bell;
    }
}

function getNotificationColor(type: string) {
    switch (type) {
        case "prospect":
            return "bg-blue-50 text-blue-600";

        case "visit":
            return "bg-orange-50 text-orange-600";

        case "reservation":
            return "bg-purple-50 text-purple-600";

        case "document":
            return "bg-green-50 text-green-600";

        case "sale":
            return "bg-emerald-50 text-emerald-600";

        case "land":
            return "bg-red-50 text-red-600";

        default:
            return "bg-gray-50 text-gray-600";
    }
}

export function NotificationDropdown() {
    const unreadCount = notifications.filter(
        (item) => item.unread
    ).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <Button
                    size="icon"
                    variant="ghost"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-96 p-0"
            >
                <DropdownMenuGroup>
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <DropdownMenuLabel className="p-0 text-base">
                                Notifications
                            </DropdownMenuLabel>

                            <p className="text-xs text-muted-foreground">
                                {unreadCount} notification(s) non lue(s)
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                        >
                            Tout lire
                        </Button>
                    </div>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <ScrollArea className="h-100">
                    <div className="p-2">
                        {notifications.map((notification) => {
                            const Icon = getNotificationIcon(
                                notification.type
                            );

                            const iconColor =
                                getNotificationColor(
                                    notification.type
                                );

                            return (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className="flex cursor-pointer items-start gap-3 rounded-xl p-3"
                                >
                                    <div
                                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconColor}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium">
                                                {notification.title}
                                            </p>

                                            {notification.unread && (
                                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-600" />
                                            )}
                                        </div>

                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                            {
                                                notification.description
                                            }
                                        </p>

                                        <p className="mt-2 text-[11px] text-muted-foreground">
                                            {notification.time}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}
                    </div>
                </ScrollArea>

                <DropdownMenuSeparator />

                <div className="p-2">
                    <Button
                        variant="outline"
                        className="w-full"
                    >
                        Voir toutes les notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}