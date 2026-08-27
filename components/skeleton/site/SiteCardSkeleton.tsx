import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SiteCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[260px_1fr]">
                {/* Image */}
                <Skeleton className="h-[240px] w-full" />

                {/* Content */}
                <div className="flex flex-col">
                    <CardHeader className="space-y-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>

                        <Skeleton className="h-7 w-72" />
                        <Skeleton className="h-5 w-48" />
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-44" />
                                <Skeleton className="h-4 w-28" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-40" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-44" />
                                <Skeleton className="h-4 w-28" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-5 w-36" />
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>

                            <Skeleton className="h-2 w-full" />

                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-44" />
                                <Skeleton className="h-10 w-32 rounded-lg" />
                            </div>

                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
}