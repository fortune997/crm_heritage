import { TProspects } from "@/core/types/prospects";
import {
    Check,
    ClipboardList,
    HandCoins,
    Landmark,
    MapPinned,
    ThumbsUp,
    X,
} from "lucide-react";

const stages = [
    {
        qualification: "H1",
        label: "Non intéressé",
        icon: X,
    },
    {
        qualification: "H2",
        label: "Besoin d’informations",
        icon: ClipboardList,
    },
    {
        qualification: "H3",
        label: "Intéressé",
        icon: ThumbsUp,
    },
    {
        qualification: "H4",
        label: "Souhaite un RDV au bureau",
        icon: Landmark,
    },
    {
        qualification: "H5",
        label: "Souhaite une visite",
        icon: MapPinned,
    },
    {
        qualification: "H6",
        label: "Visite effectuée",
        icon: Check,
    },
    {
        qualification: "H7",
        label: "Paiement effectué",
        icon: HandCoins,
    },
] as const;

interface Props {
    customer?: TProspects;
}

export function Customer360Pipeline({ customer }: Props) {
    const currentIndex = stages.findIndex(
        (stage) => stage.qualification === customer?.qualification
    );

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            {currentIndex === -1 && (
                <p className="px-5 pt-4 text-sm text-muted-foreground">
                    Aucune qualification reconnue pour ce prospect.
                </p>
            )}

            <div className="overflow-x-auto p-5">
                <div className="flex min-w-200 items-start">
                    {stages.map((stage, index) => {
                        const Icon = stage.icon;
                        const current = index === currentIndex;

                        // H1 indique un désintérêt, pas une étape accomplie.
                        const completed =
                            index > 0 && index < currentIndex;

                        const currentColor =
                            stage.qualification === "H1"
                                ? "border-red-500 bg-red-500 text-white shadow-md"
                                : "border-primary bg-primary text-primary-foreground shadow-md";

                        const currentTextColor =
                            stage.qualification === "H1"
                                ? "text-red-600"
                                : "text-primary";

                        return (
                            <div
                                key={stage.qualification}
                                className="flex min-w-27.5 flex-1 items-start"
                                aria-current={current ? "step" : undefined}
                            >
                                <div className="flex w-25 shrink-0 flex-col items-center">
                                    <div
                                        className={[
                                            "flex h-9 w-9 items-center justify-center rounded-full border-2",
                                            current
                                                ? currentColor
                                                : completed
                                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                                  : "border-muted bg-muted text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <span
                                        className={[
                                            "mt-2 text-xs font-bold",
                                            current
                                                ? currentTextColor
                                                : "text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        {stage.qualification}
                                    </span>

                                    <span
                                        className={[
                                            "mt-1 max-w-25 text-center text-[11px] leading-tight",
                                            current
                                                ? `font-bold ${currentTextColor}`
                                                : completed
                                                  ? "font-medium text-foreground"
                                                  : "text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        {stage.label}
                                    </span>

                                    {current && (
                                        <span
                                            className={`mt-1 text-center text-[10px] font-semibold ${currentTextColor}`}
                                        >
                                            Qualification actuelle
                                        </span>
                                    )}
                                </div>

                                {index < stages.length - 1 && (
                                    <div
                                        className={[
                                            "mt-4.5 h-0.5 flex-1",
                                            completed
                                                ? "bg-emerald-500"
                                                : "bg-muted",
                                        ].join(" ")}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}