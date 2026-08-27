import { Customer360 } from "@/core/types/prospectId/Customer360";
import {
    Check,
    ClipboardList,
    FileCheck,
    FileSignature,
    Flag,
    HandCoins,
    Landmark,
    MapPinned,
    Receipt,
} from "lucide-react";



const stages = [
    {
        label: "Nouveau prospect",
        icon: ClipboardList,
    },
    {
        label: "Qualification",
        icon: Check,
    },
    {
        label: "Visite terrain",
        icon: MapPinned,
    },
    {
        label: "Visite bureau",
        icon: Landmark,
    },
    {
        label: "Négociation",
        icon: HandCoins,
    },
    {
        label: "Réservation",
        icon: Receipt,
    },
    {
        label: "Achat",
        icon: FileCheck,
    },
    {
        label: "Paiement",
        icon: HandCoins,
    },
    {
        label: "DT / Bornage",
        icon: MapPinned,
    },
    {
        label: "Finalisation",
        icon: FileSignature,
    },
];

interface Props {
    customer: Customer360;
}

export function Customer360Pipeline({
    customer,
}: Props) {
    const currentIndex = stages.findIndex(
        (stage) =>
            stage.label === customer.currentStage
    );

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto p-5">
                <div className="flex min-w-[900px] items-start">
                    {stages.map((stage, index) => {
                        const Icon = stage.icon;

                        const completed =
                            index < currentIndex;

                        const current =
                            index === currentIndex;

                        return (
                            <div
                                key={stage.label}
                                className="flex min-w-[95px] flex-1 items-start"
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className={[
                                            "flex h-9 w-9 items-center justify-center rounded-full border-2",
                                            completed
                                                ? "border-emerald-500 bg-emerald-500 text-white"
                                                : current
                                                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                                                    : "border-muted bg-muted text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <span
                                        className={[
                                            "mt-2 max-w-[90px] text-center text-[11px] leading-tight",
                                            current
                                                ? "font-bold text-primary"
                                                : completed
                                                    ? "font-medium text-foreground"
                                                    : "text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        {stage.label}
                                    </span>

                                    {current && (
                                        <span className="mt-1 text-[10px] font-semibold text-primary">
                                            Étape actuelle
                                        </span>
                                    )}
                                </div>

                                {index < stages.length - 1 && (
                                    <div
                                        className={[
                                            "mt-[18px] h-0.5 flex-1",
                                            index < currentIndex
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