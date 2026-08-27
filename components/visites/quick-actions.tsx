"use client";

import { Visit } from "@/core/types/visites/type";
import { exportVisitsCSV, printVisits } from "@/lib/visit-export";
import {
    FileDown,
    FileText,
    Printer,
} from "lucide-react";


interface Props {
    visits: Visit[];
}

export function QuickActions({
    visits,
}: Props) {
    return (
        <aside className=" bg-card ">

            <div className="space-y-2 flex gap-2 items-center ">
                <button
                    onClick={() =>
                        exportVisitsCSV(visits)
                    }
                    className="flex h-10 w-full items-center gap-2 rounded-lg border bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                    <FileDown className="h-4 w-4" />

                </button>

                <button
                    onClick={printVisits}
                    className="flex h-10 w-full items-center gap-2 rounded-lg border bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                    <FileText className="h-4 w-4" />

                </button>

                <button
                    onClick={printVisits}
                    className="flex h-10 w-full items-center gap-2 rounded-lg border bg-blue-50 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                    <Printer className="h-4 w-4" />

                </button>
            </div>
        </aside>
    );
}