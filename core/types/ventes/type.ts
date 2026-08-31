export type SaleStatus =
    | "en_attente"
    | "active"
    | "soldee"
    | "annulee";

export type PaymentStatus =
    | "confirme"
    | "en_attente"
    

export type PaymentMethod =
    | "especes"
    | "virement"
    | "mobile_money"
    | "cheque"
    | "carte"
    | "autre";

export type PaymentSchedule =
    | "comptant"
    | "echelonne";

export interface ProspectSummary {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
}

export interface SiteSummary {
    id: string;
    nom_titre: string;
    ville: string | null;
    quartier: string | null;
}

export interface Sale {
    id: string;
    reference: string;
    prospect_id: string;
    site_id: string | null;

    sale_amount: number;
    total_paid: number;
    remaining_amount: number;

    payment_schedule: PaymentSchedule;
    status: SaleStatus;

    created_at: string;
    updated_at: string;

    prospects: ProspectSummary;
    sites: SiteSummary | null;
}

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

    sale: Sale;
}