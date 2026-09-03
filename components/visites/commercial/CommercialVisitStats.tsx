import { CalendarDays, ClipboardCheck, Clock3, FileText } from "lucide-react";

import StatVisitCard from "@/components/visites/StatVisitCard";

interface CommercialVisitStatsProps {
    todayCount: number;
    remainingTodayCount: number;
    yesterdayReportsCount: number;
    weekReportsCount: number;
}

export function CommercialVisitStats({
    todayCount,
    remainingTodayCount,
    yesterdayReportsCount,
    weekReportsCount,
}: CommercialVisitStatsProps) {
    return (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatVisitCard
                icon={<CalendarDays className="h-5 w-5" />}
                label="Visites du jour"
                value={todayCount}
            />
            <StatVisitCard
                icon={<Clock3 className="h-5 w-5" />}
                label="À effectuer aujourd’hui"
                value={remainingTodayCount}
            />
            <StatVisitCard
                icon={<FileText className="h-5 w-5" />}
                label="Rapports de la veille"
                value={yesterdayReportsCount}
            />
            <StatVisitCard
                icon={<ClipboardCheck className="h-5 w-5" />}
                label="Rapports de la semaine"
                value={weekReportsCount}
            />
        </section>
    );
}
