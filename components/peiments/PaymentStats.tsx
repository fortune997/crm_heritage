"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    CircleDollarSign,
    Clock3,
    FileCheck2,
    Wallet,
} from "lucide-react";

interface PaymentStatsProps {
    totalCollected: number;
    pendingAmount: number;
    totalRemaining: number;
    totalSales: number;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}

export function PaymentStats({
    totalCollected,
    pendingAmount,
    totalRemaining,
    totalSales,
}: PaymentStatsProps) {
    const stats = [
        {
            title: "Total encaissé",
            value: formatCurrency(totalCollected),
            icon: CircleDollarSign,
        },
        {
            title: "Paiements en attente",
            value: formatCurrency(pendingAmount),
            icon: Clock3,
        },
        {
            title: "Reste à encaisser",
            value: formatCurrency(totalRemaining),
            icon: Wallet,
        },
        {
            title: "Ventes",
            value: totalSales.toString(),
            icon: FileCheck2,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <Card key={stat.title}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {stat.title}
                                </p>

                                <p className="mt-2 text-2xl font-bold tracking-tight">
                                    {stat.value}
                                </p>
                            </div>

                            <div className="rounded-lg bg-primary/10 p-3">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}