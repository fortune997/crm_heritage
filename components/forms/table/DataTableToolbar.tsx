// components/data-table/data-table-toolbar.tsx

"use client";

import { Search, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    searchKey: string;
    searchPlaceholder?: string;
};

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Rechercher...",
}: DataTableToolbarProps<TData>) {
    const column = table.getColumn(searchKey);
    const value = (column?.getFilterValue() as string) ?? "";

    const hasFilter = value.length > 0;

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    placeholder={searchPlaceholder}
                    value={value}
                    onChange={(event) => column?.setFilterValue(event.target.value)}
                    className="pl-9"
                />
            </div>

            {hasFilter && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column?.setFilterValue("")}
                    className="w-full md:w-auto"
                >
                    Réinitialiser
                    <X className="ml-2 size-4" />
                </Button>
            )}
        </div>
    );
}