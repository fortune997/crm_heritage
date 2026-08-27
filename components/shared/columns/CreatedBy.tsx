type CreatedByCellProps = {
    creator?: {
        first_name: string | null;
        last_name: string | null;
    } | null;
};

export function CreatedByCell({
    creator,
}: CreatedByCellProps) {
    if (!creator) {
        return (
            <span className="text-sm text-muted-foreground">
                Inconnu
            </span>
        );
    }

    return (
        <span className="text-sm font-medium">
            {creator.first_name} {creator.last_name}
        </span>
    );
}