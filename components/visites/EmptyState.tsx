'use client'

import { CalendarDays } from "lucide-react";


const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <CalendarDays className="h-5 w-5 text-slate-400" />
            </div>

            <h3 className="mt-4 font-semibold">
                Aucune visite trouvée
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Aucune visite ne correspond aux filtres
                sélectionnés.
            </p>

        </div>
    );
}

export default EmptyState