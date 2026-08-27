import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AcquisitionChannelsSkeleton() {
    return (
        <div className="space-y-8 p-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-4 w-[600px]" />
                    <Skeleton className="h-4 w-[450px]" />
                </div>

                <div className="flex gap-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* KPI */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-8 w-20" />
                            </div>

                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="h-4 w-36" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Insight */}
            <Card>
                <CardContent className="flex justify-between items-center p-6">
                    <div className="flex gap-4 items-center">
                        <Skeleton className="h-12 w-12 rounded-2xl" />

                        <div className="space-y-2">
                            <Skeleton className="h-5 w-80" />
                            <Skeleton className="h-4 w-[550px]" />
                        </div>
                    </div>

                    <Skeleton className="h-10 w-36" />
                </CardContent>
            </Card>

            {/* Search */}
            <Card>
                <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] p-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                </CardContent>
            </Card>

            {/* Cards */}
            <div className="grid gap-6 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader className="space-y-5">
                            <div className="flex justify-between">
                                <div className="flex gap-3">
                                    <Skeleton className="h-12 w-12 rounded-2xl" />

                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-36" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>

                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>

                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-28 rounded-full" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />

                            <div className="grid grid-cols-3 gap-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="rounded-xl border p-3 space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-6 w-12" />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-full" />
                            </div>

                            <div className="rounded-xl border p-4 space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between"
                                    >
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Bottom Cards */}
            <div className="grid gap-6 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <div
                                    key={j}
                                    className="rounded-xl border p-4 space-y-2"
                                >
                                    <Skeleton className="h-4 w-44" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}