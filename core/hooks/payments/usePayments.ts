"use client";

import { fetchPayments } from "@/core/services/payments/payments-service";
import { useQuery } from "@tanstack/react-query";


export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: fetchPayments,
        staleTime: 30_000,
    });
}