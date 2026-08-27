"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/core/services/clients/clients-service";

export function useClients() {
    return useQuery({
        queryKey: ["clients"],
        queryFn: fetchClients,
        staleTime: 30_000,
    });
}