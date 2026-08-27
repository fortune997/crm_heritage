'use client'

interface InfoBoxProps {
    icon?: React.ReactNode;
    label: string;
    value: string;
}


const InfoBox = ({
    icon,
    label,
    value,
}: InfoBoxProps) => {
    return (
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">

            <div className="flex items-center gap-2 text-xs text-slate-400">
                {icon}
                {label}
            </div>

            <p className="mt-2 text-sm font-medium">
                {value}
            </p>

        </div>
    );
}

export default InfoBox