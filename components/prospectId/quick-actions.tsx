"use client";

import {
    CalendarPlus,
    FilePlus2,
    MessageCircle,
    Phone,
    Plus,
} from "lucide-react";

export function QuickActions() {
    const actions = [
        {
            label: "Appeler",
            icon: Phone,
        },
        {
            label: "WhatsApp",
            icon: MessageCircle,
        },
        {
            label: "Planifier visite",
            icon: CalendarPlus,
        },
        {
            label: "Ajouter document",
            icon: FilePlus2,
        },
    ];

    return (
        <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-2xl border bg-background/95 p-2 shadow-xl backdrop-blur md:hidden">
            {actions.map((action) => {
                const Icon = action.icon;

                return (
                    <button
                        key={action.label}
                        title={action.label}
                        className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted"
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                );
            })}

            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plus className="h-4 w-4" />
            </button>
        </div>
    );
}