"use client";

import { Visit } from "@/core/types/visites/type";
import { QuickActions } from "./quick-actions";

interface Props {
    active: "list" | "calendar";
    onChange: (value: "list" | "calendar") => void;
    visits: Visit[]
}

export function VisitsTabs({
    active,
    onChange,
    visits
}: Props) {
    return (
        <div className="flex w-full justify-between items-center rounded-lg border bg-muted/40 p-1">
            <div className="">
                <button
                    onClick={() => onChange("list")}
                    className={[
                        "rounded-md px-4 py-2 text-sm font-medium transition",
                        active === "list"
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                >
                    Liste des visites
                </button>

                <button
                    onClick={() => onChange("calendar")}
                    className={[
                        "rounded-md px-4 py-2 text-sm font-medium transition",
                        active === "calendar"
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                >
                    Calendrier des visites
                </button>
            </div>
            <div className="flex">
                <QuickActions
                    visits={visits}
                />
            </div>

        </div>
    );
}