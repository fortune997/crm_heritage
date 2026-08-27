'use client'

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

const StatVisitCard = ({
    icon,
    label,
    value,
}: StatCardProps) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {icon}
                </div>

                <span className="text-2xl font-bold">
                    {value}
                </span>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {label}
            </p>
        </div>
    );
}


export default StatVisitCard