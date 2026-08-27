'use client'

const ReadValue = ({
    value,
}: {
    value: string;
}) => {
    return (
        <div
            className="
        flex min-h-11 items-center
        rounded-xl border
        border-slate-200
        bg-slate-50
        px-4
        text-sm font-medium
        text-slate-700

        dark:border-slate-800
        dark:bg-slate-950/50
        dark:text-slate-200
      "
        >
            {value}
        </div>
    );
}

export default ReadValue