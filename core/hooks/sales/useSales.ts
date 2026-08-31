"use client";

import { createSale, fetchSales } from "@/core/services/sales/sales-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useSales() {
    return useQuery({
        queryKey: ["sales"],
        queryFn: fetchSales,
        staleTime: 30_000,
    });
}


import type {
    PaymentSchedule,
} from "@/core/types/ventes/type";

export type SiteOption = {
    id: string;
    name: string;
    location?: string;
};

export type CreateSaleInput = {
    prospect_id: string;
    site_id: string
    sale_amount: number;
    payment_schedule: PaymentSchedule;
    installment_count?: number;
    first_due_date?: string;
    notes?: string;
};

export function useCreateSale() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSale,

        onSuccess: async (sale) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["sales"],
                }),
               
            ]);
        },
    });
}