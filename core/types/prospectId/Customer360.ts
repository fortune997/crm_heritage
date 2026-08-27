export type CustomerType = "prospect" | "client";

export type PipelineStatus =
    | "completed"
    | "current"
    | "pending";

export type VisitStatus =
    | "scheduled"
    | "completed"
    | "cancelled"
    | "postponed";

export type DocumentStatus =
    | "received"
    | "pending"
    | "validated"
    | "rejected";

export interface Customer360 {
    id: string;

    type: CustomerType;

    firstName: string;
    lastName: string;

    phone: string;
    email: string;

    address?: string;
    city?: string;

    civility?: string;
    profession?: string;
    identityNumber?: string;

    source?: string;
    createdAt: string;

    project: {
        type: string;
        usage: string;
        zones: string[];
        surface: string;
        budget: string;
        purchaseDelay: string;
        paymentMethod: string;
        comments?: string;
    };

    currentStage: string;
    currentStatus: string;

    interest: string;

    nextAction: string;
    nextActionDate: string;

    priority: "low" | "medium" | "high";

    commercial: {
        id: string;
        name: string;
        role: string;
        avatar?: string;
        phone: string;
        email: string;
    };

    visits: Visit[];

    payments: Payment[];

    documents: CustomerDocument[];

    activities: Activity[];

    land?: Land;

    notes?: string;
}

export interface Visit {
    id: string;
    type: "terrain" | "bureau";
    title: string;
    date: string;
    location?: string;
    commercial: string;
    status: VisitStatus;
    result?: string;
    comments?: string;
    image?: string;
}

export interface Payment {
    id: string;
    date: string;
    label: string;
    amount: number;
    status: "paid" | "pending" | "cancelled";
    reference?: string;
}

export interface CustomerDocument {
    id: string;
    name: string;
    type: string;
    date?: string;
    status: DocumentStatus;
}

export interface Activity {
    id: string;
    type: "call" | "visit" | "document" | "qualification" | "customer";
    title: string;
    description?: string;
    date: string;
    author: string;
}

export interface Land {
    id: string;
    title: string;
    location: string;
    surface: string;
    price: number;
    status: string;
    image?: string;
}