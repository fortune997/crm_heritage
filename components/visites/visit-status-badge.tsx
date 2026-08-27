import { VisitStatus } from "@/core/types/visites/type";


export function VisitStatusBadge({
    status,
}: {
    status: VisitStatus;
}) {
    const config = {
        planned: {
            label: "Planifiée",
            className:
                "bg-amber-50 text-amber-700",
        },

        completed: {
            label: "Effectuée",
            className:
                "bg-emerald-50 text-emerald-700",
        },

        cancelled: {
            label: "Annulée",
            className:
                "bg-red-50 text-red-700",
        },

        postponed: {
            label: "Reportée",
            className:
                "bg-purple-50 text-purple-700",
        },
    };

    const item = config[status];

    return (
        <span
            className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${item.className}`}
        >
            {item.label}
        </span>
    );
}