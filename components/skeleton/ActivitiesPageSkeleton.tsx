"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ActivitiesPageSkeleton() {
    return (
        <div className="space-y-6 p-4 md:p-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-[500px]" />
                </div>

                <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader className="space-y-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-16" />
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Follow-up Board */}
            <div className="grid gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <Skeleton className="h-5 w-36" />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="space-y-2 rounded-lg border p-4"
                                >
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-2/3" />

                                    <div className="flex justify-between">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-10 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card>
                <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>

                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-80" />

                    <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-6 gap-4 py-3"
                            >
                                <Skeleton className="h-4 col-span-2" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                                <Skeleton className="h-4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}