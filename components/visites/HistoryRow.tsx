'use client'


import { formatDate } from "@/core/lib/utils";
import { Visit } from "@/core/types/visites/type";
import { formatDa } from "@/lib/utils";
import { FileText, MapPin } from "lucide-react";
import { getResultConfig, getStatusConfig, getTypeLabel } from "./visit-config";
import { VisitActions } from "./VisitActions";


interface HistoryRowProps {
    visit: Visit;
    onReport: () => void;
}

function HistoryRow({
    visit,
    onReport,
}: HistoryRowProps) {



    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-950">

            <td className="px-5 py-4">
                <div className="font-medium">
                    {formatDa(visit.visit_date)}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                    {visit.start_time}
                </div>
                <div className="font-medium">
                    {visit.prospects.full_name}
                </div>
            </td>

            <td className="px-5 py-4">
                <div className="font-medium">
                    Visite {getTypeLabel(visit.visit_type)}
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {visit.location ??
                        visit.meeting_point}
                </div>
                <div className="font-medium">
                    {visit.prospects.phone}
                </div>
            </td>

            <td className="px-5 py-4">
                {getTypeLabel(visit.visit_type)}
            </td>
            <td className="px-5 py-4">
                {visit.status ? (
                    (() => {
                        const status = getStatusConfig(visit.status);

                        return (
                            <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
                            >
                                {status.label}
                            </span>
                        );
                    })()
                ) : (
                    <span className="text-slate-400">—</span>
                )}
            </td>

            <td className="px-5 py-4">
                {visit.result ? (
                    <span
                        className={`text-sm font-medium ${getResultConfig(visit.result).className
                            }`}
                    >
                        {getResultConfig(visit.result).label}
                    </span>
                ) : (
                    <span className="text-slate-400">
                        —
                    </span>
                )}
            </td>

            <td className="px-5 py-4 text-right">



                <VisitActions
                    visit={visit}
                />

            </td>

            <td className="px-5 py-4 text-right">

                <button
                    type="button"
                    onClick={onReport}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                    <FileText className="h-4 w-4" />
                    Rapport
                </button>

            </td>
        </tr>
    );
}

export default HistoryRow