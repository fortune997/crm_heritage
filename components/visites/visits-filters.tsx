"use client";

import {
    CalendarDays,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from "lucide-react";

interface Props {
    search: string;
    setSearch: (value: string) => void;

    type: string;
    setType: (value: string) => void;

    status: string;
    setStatus: (value: string) => void;

    commercial: string;
    setCommercial: (value: string) => void;

    result: string;
    setResult: (value: string) => void;

    reset: () => void;
}

export function VisitsFilters({
    search,
    setSearch,
    type,
    setType,
    status,
    setStatus,
    commercial,
    setCommercial,
    result,
    setResult,
    reset,
}: Props) {
    return (
        <section className="rounded-xl border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtres
                </h2>

                <button
                    onClick={reset}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Réinitialiser
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Rechercher..."
                        className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <Select
                    label="Type"
                    value={type}
                    onChange={setType}
                    options={[
                        ["", "Tous"],
                        ["terrain", "Visite terrain"],
                        ["bureau", "Visite bureau"],
                        ["autre", "Autre"],
                    ]}
                />

                <Select
                    label="Statut"
                    value={status}
                    onChange={setStatus}
                    options={[
                        ["", "Tous"],
                        ["planned", "Planifiée"],
                        ["completed", "Effectuée"],
                        ["cancelled", "Annulée"],
                        ["postponed", "Reportée"],
                    ]}
                />

                <Select
                    label="Commercial"
                    value={commercial}
                    onChange={setCommercial}
                    options={[
                        ["", "Tous"],
                        ["USR-001", "Sandra M."],
                        ["USR-002", "Pierre L."],
                    ]}
                />

                <Select
                    label="Résultat"
                    value={result}
                    onChange={setResult}
                    options={[
                        ["", "Tous"],
                        ["very_interested", "Très intéressé"],
                        ["interested", "Intéressé"],
                        ["not_interested", "Pas intéressé"],
                        ["pending", "À définir"],
                    ]}
                />

                <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="date"
                        className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>
        </section>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[][];
}) {
    return (
        <div>
            <label className="mb-1 block text-[10px] font-medium uppercase text-muted-foreground">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
                {options.map(([value, label]) => (
                    <option
                        key={value}
                        value={value}
                    >
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}