'use client'

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    count: number;
}

const TabButton = ({
    active,
    onClick,
    icon,
    label,
    count,
}: TabButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition ${active
                ? "text-slate-950 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
        >
            {icon}

            {label}

            <span
                className={`rounded-full px-2 py-0.5 text-xs ${active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}
            >
                {count}
            </span>

            {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950 dark:bg-white" />
            )}
        </button>
    );
}


export default TabButton