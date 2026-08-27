import { Visit } from "@/core/types/visites/type";
import {
    Building2,
    MapPinned,
} from "lucide-react";



interface Props {
    visit: Visit;
}

export function CalendarEvent({
    visit,
}: Props) {
    const startHour = Number(
        visit.startTime.split(":")[0]
    );

    const startMinute = Number(
        visit.startTime.split(":")[1]
    );



    const top =
        ((startHour - 8) * 60 + startMinute) /
        60 *
        80;

    const height =
        ((0 - startHour) * 60 +
            (0 - startMinute)) /
        60 *
        80;

    const typeClass =
        visit.type === "terrain"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : visit.type === "bureau"
                ? "border-blue-200 bg-blue-50 text-blue-800"
                : "border-gray-200 bg-gray-50 text-gray-800";

    return (
        <div
            className={`absolute left-1 right-1 overflow-hidden rounded-md border p-2 text-[10px] shadow-sm ${typeClass}`}
            style={{
                top: `${top}px`,
                height: `${Math.max(height, 45)}px`,
            }}
        >
            <div className="flex items-center gap-1 font-bold">
                {visit.type === "terrain" ? (
                    <MapPinned className="h-3 w-3" />
                ) : (
                    <Building2 className="h-3 w-3" />
                )}

                {visit.startTime}
            </div>

            <p className="mt-1 truncate font-semibold">
                {visit.type === "terrain"
                    ? "Visite terrain"
                    : "Visite bureau"}
            </p>

            <p className="truncate">
                {visit.sites?.nom_titre ||
                    visit.prospects.full_name}
            </p>

            <p className="truncate text-[9px] opacity-70">
                {visit.prospects.full_name}
            </p>
        </div>
    );
}