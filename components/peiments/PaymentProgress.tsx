'use client'

import { Progress } from "@/components/ui/progress";

interface PaymentProgressProps {
    total: number;
    paid: number;
}

export function PaymentProgress({
    total,
    paid,
}: PaymentProgressProps) {
    const percentage =
        total > 0
            ? Math.min((paid / total) * 100, 100)
            : 0;

    return (
        <div className="min-w-[160px] space-y-1.5">
            <div className="flex justify-between text-xs">
                <span>
                    {paid.toLocaleString("fr-FR")} FCFA
                </span>

                <span className="text-muted-foreground">
                    {Math.round(percentage)}%
                </span>
            </div>

            <Progress value={percentage} />

            <p className="text-xs text-muted-foreground">
                Reste :{" "}
                {Math.max(total - paid, 0).toLocaleString(
                    "fr-FR"
                )}{" "}
                FCFA
            </p>
        </div>
    );
}