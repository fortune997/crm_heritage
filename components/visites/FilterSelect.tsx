'use client'

import { ChevronDown } from "lucide-react";


interface FilterOption<T extends string> {
    value: T;
    label: string;
}

interface FilterSelectProps<
    T extends string
> {
    value: T;
    onChange: (value: T) => void;
    options: FilterOption<T>[];
}

const FilterSelect = <T extends string>({
    value,
    onChange,
    options,
}: FilterSelectProps<T>) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value as T)
                }
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
    );
}


export default FilterSelect