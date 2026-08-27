export type PaymentMethod =
    | "especes"
    | "virement"
    | "mobile_money"
    | "cheque"
    | "carte"
    | "autre";

export type PaymentStatus =
    | "en_attente"
    | "confirme"
    | "annule";

export interface Payment {
    id: string;

    sale_id: string;

    reference: string;

    amount: number;

    payment_method: PaymentMethod;

    status: PaymentStatus;

    payment_date: string;

    transaction_reference: string | null;

    notes: string | null;

    created_by: string | null;

    created_at: string;

    updated_at: string;
}