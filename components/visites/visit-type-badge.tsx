import { VisitType } from "@/core/types/visites/type";
import {
    Building2,
    MapPinned,
    MoreHorizontal,
} from "lucide-react";



export function VisitTypeBadge({
    type,
}: {
    type: VisitType;
}) {
    const config = {
        terrain: {
            label: "Visite terrain",
            className:
                "bg-emerald-50 text-emerald-700",
            icon: MapPinned,
        },

        bureau: {
            label: "Visite bureau",
            className:
                "bg-blue-50 text-blue-700",
            icon: Building2,
        },

        autre: {
            label: "Autre",
            className:
                "bg-gray-100 text-gray-700",
            icon: MoreHorizontal,
        },
    };

    const item = config[type];
    const Icon = item.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${item.className}`}
        >
            <Icon className="h-3 w-3" />

            {item.label}
        </span>
    );
}