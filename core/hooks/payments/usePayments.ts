"use client";

import { createPayment, fetchPayments, getPaymentsBySale, getSaleById } from "@/core/services/payments/payments-service";
import { Payment } from "@/core/types/payments/type";
import { PaymentMethod, PaymentStatus } from "@/core/types/ventes/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export type CreatePaymentInput = {
    sale_id: string;
    amount: number;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    payment_date: string;
    created_by: string;
    transaction_reference: string | null;
    notes: string | null;
};

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: fetchPayments,
        staleTime: 30_000,
    });
}


export function useSaleById(saleId?: string) {
    return useQuery({
        queryKey: ["sale", saleId],
        queryFn: () => getSaleById(saleId!),
        enabled: Boolean(saleId),
    });
}

export function useSalePayments(saleId?: string) {
    return useQuery({
        queryKey: ["payments", saleId],
        queryFn: () =>
            getPaymentsBySale(saleId!),
        enabled: Boolean(saleId),
    });
}

export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation<
        Payment,
        Error,
        CreatePaymentInput
    >({
        mutationFn: createPayment,

        onSuccess: async (payment) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["payments"],
                }),

                queryClient.invalidateQueries({
                    queryKey: [
                        "payments",
                        payment.sale_id,
                    ],
                }),

                queryClient.invalidateQueries({
                    queryKey: [
                        "sale",
                        payment.sale_id,
                    ],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["sales"],
                }),
            ]);
        },
    });
}