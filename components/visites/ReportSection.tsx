'use client'


interface ReportSectionProps {
    icon?: React.ReactNode;
    title: string;
    value?: string;
}
const ReportSection = ({
    icon,
    title,
    value,
}: ReportSectionProps) => {
    return (
        <section className="mb-6">

            <div className="mb-2 flex items-center gap-2">

                {icon && (
                    <span className="text-slate-400">
                        {icon}
                    </span>
                )}

                <h3 className="text-sm font-semibold">
                    {title}
                </h3>

            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                {value?.trim()
                    ? value
                    : "Aucune information renseignée."}
            </div>

        </section>
    );
}

export default ReportSection