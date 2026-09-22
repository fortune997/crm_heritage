import { Customer360 } from "@/core/types/prospectId/Customer360";
import { Visit } from "@/core/types/visites/type";
import {
    CalendarDays,
    MapPin,
    Plus,
    UserRound,
} from "lucide-react";


interface Props {
    visits?: Visit[];
}

export function VisitsCard({
    visits
}: Props) {
    return (
        <section className="rounded-xl border bg-card p-5">
            <Header
                title="Visites effectuées"
                action="Voir tout"
            />

            <div className="space-y-4">
                 {visits ? visits?.map((visit) => (
                    <div
                        key={visit.id}
                        className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row"
                    >
                        {visit && (
                            <img
                                src={'ertyui'}
                                alt={visit.visit_type}
                                className="h-24 w-full rounded-lg object-cover sm:h-20 sm:w-24"
                            />
                        )}

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold">
                                        {"visit"}
                                    </p>

                                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {visit.location || "Bureau"}
                                    </p>
                                </div>

                                <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                    {visit.result}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {visit.date}
                                </span>

                                <span className="flex items-center gap-1">
                                    <UserRound className="h-3.5 w-3.5" />
                                    {'visit.commercial'}
                                </span>
                            </div>
                        </div>
                    </div>
                )) : <p>Pas de visite Effectué</p>}
            </div>

            <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium hover:bg-muted">
                <Plus className="h-4 w-4" />
                Planifier une visite
            </button>
        </section>
    );
}

function Header({
    title,
    action,
}: {
    title: string;
    action: string;
}) {
    return (
        <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">{title}</h2>

            <button className="text-xs font-semibold text-primary">
                {action}
            </button>
        </div>
    );
}