"use client";

import {
    Check,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useMemo } from "react";

interface Commercial {
    id: string;
    name: string;
}

interface Props {
    date: Date;
    setDate: (date: Date) => void;

    commercial: string;
    setCommercial: (value: string) => void;

    selectedTypes: string[];
    setSelectedTypes: (types: string[]) => void;

    commercials: Commercial[];
}

const VISIT_TYPES = [
    {
        value: "terrain",
        label: "Visite terrain",
        color: "bg-emerald-500",
    },
    {
        value: "bureau",
        label: "Visite bureau",
        color: "bg-blue-500",
    },
    {
        value: "phone",
        label: "Appel téléphonique",
        color: "bg-purple-500",
    },
    {
        value: "video",
        label: "Visio",
        color: "bg-orange-500",
    },
    {
        value: "other",
        label: "Autre",
        color: "bg-gray-400",
    },
];

const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

export function CalendarSidebar({
    date,
    setDate,
    commercial,
    setCommercial,
    selectedTypes,
    setSelectedTypes,
    commercials,
}: Props) {
    /**
     * Nombre de jours du mois
     */
    const daysInMonth = useMemo(() => {
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();
    }, [date]);

    /**
     * Premier jour du mois
     *
     * JS :
     * Dimanche = 0
     * Lundi = 1
     *
     * On transforme pour avoir :
     * Lundi = 0
     */
    const firstDayOfMonth = useMemo(() => {
        const day = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        ).getDay();

        return day === 0 ? 6 : day - 1;
    }, [date]);

    /**
     * Jours du calendrier
     */
    const calendarDays = useMemo(() => {
        return [
            ...Array(firstDayOfMonth).fill(null),
            ...Array.from(
                { length: daysInMonth },
                (_, index) => index + 1
            ),
        ];
    }, [firstDayOfMonth, daysInMonth]);

    /**
     * Mois précédent
     */
    function previousMonth() {
        setDate(
            new Date(
                date.getFullYear(),
                date.getMonth() - 1,
                1
            )
        );
    }

    /**
     * Mois suivant
     */
    function nextMonth() {
        setDate(
            new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                1
            )
        );
    }

    /**
     * Sélection d'un jour
     */
    function selectDay(day: number) {
        setDate(
            new Date(
                date.getFullYear(),
                date.getMonth(),
                day
            )
        );
    }

    /**
     * Gestion des types
     */
    function toggleType(type: string) {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(
                selectedTypes.filter(
                    (item) => item !== type
                )
            );

            return;
        }

        setSelectedTypes([
            ...selectedTypes,
            type,
        ]);
    }

    /**
     * Aujourd'hui
     */
    const today = new Date();

    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <aside className="space-y-5 rounded-xl border bg-card p-4">

            {/* Header */}
            <div>
                <h3 className="text-sm font-semibold">
                    Filtres calendrier
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                    Filtrez les visites affichées
                </p>
            </div>

            {/* Mini calendrier */}
            <div>
                <div className="mb-3 flex items-center justify-between">

                    <button
                        type="button"
                        onClick={previousMonth}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm font-semibold">
                        {MONTHS[date.getMonth()]}{" "}
                        {date.getFullYear()}
                    </span>

                    <button
                        type="button"
                        onClick={nextMonth}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                </div>

                {/* Jours semaine */}
                <div className="grid grid-cols-7 gap-1 text-center text-[9px]">
                    {[
                        "L",
                        "M",
                        "M",
                        "J",
                        "V",
                        "S",
                        "D",
                    ].map((day, index) => (
                        <span
                            key={`${day}-${index}`}
                            className="py-1 text-muted-foreground"
                        >
                            {day}
                        </span>
                    ))}

                    {calendarDays.map(
                        (day, index) => {
                            if (day === null) {
                                return (
                                    <span
                                        key={`empty-${index}`}
                                    />
                                );
                            }

                            const selected =
                                day === date.getDate();

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() =>
                                        selectDay(day)
                                    }
                                    className={[
                                        "rounded-md py-1.5 text-xs transition",
                                        selected
                                            ? "bg-primary font-bold text-primary-foreground"
                                            : isToday(day)
                                                ? "border border-primary text-primary"
                                                : "hover:bg-muted",
                                    ].join(" ")}
                                >
                                    {day}
                                </button>
                            );
                        }
                    )}
                </div>
            </div>

            {/* Commercial */}
            <div>
                <label className="mb-2 block text-xs font-medium">
                    Commercial
                </label>

                <select
                    value={commercial}
                    onChange={(e) =>
                        setCommercial(
                            e.target.value
                        )
                    }
                    className="h-9 w-full rounded-lg border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">
                        Tous les commerciaux
                    </option>

                    {commercials.map(
                        (item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        )
                    )}
                </select>
            </div>

            {/* Types */}
            <div>
                <p className="mb-2 text-xs font-medium">
                    Types de visite
                </p>

                <div className="space-y-2">
                    {VISIT_TYPES.map(
                        (item) => (
                            <CheckItem
                                key={item.value}
                                color={item.color}
                                label={item.label}
                                checked={selectedTypes.includes(
                                    item.value
                                )}
                                onChange={() =>
                                    toggleType(
                                        item.value
                                    )
                                }
                            />
                        )
                    )}
                </div>
            </div>

        </aside>
    );
}

function CheckItem({
    color,
    label,
    checked,
    onChange,
}: {
    color: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-xs">

            <button
                type="button"
                onClick={onChange}
                className={[
                    "flex h-4 w-4 items-center justify-center rounded border transition",
                    checked
                        ? `${color} border-transparent text-white`
                        : "border-muted-foreground/30 bg-background",
                ].join(" ")}
            >
                {checked && (
                    <Check className="h-3 w-3" />
                )}
            </button>

            <span>{label}</span>

        </label>
    );
}