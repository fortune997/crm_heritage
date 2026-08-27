"use client";

import { fetchSales } from "@/core/services/sales/sales-service";
import { useQuery } from "@tanstack/react-query";


export function useSales() {
    return useQuery({
        queryKey: ["sales"],
        queryFn: fetchSales,
        staleTime: 30_000,
    });
}