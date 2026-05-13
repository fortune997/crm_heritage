

// features/activities/types/activity.type.ts

export type ActivityTargetType = "prospect" | "client";

export type ActivityType =
    | "appel"
    | "whatsapp"
    | "email"
    | "visite"
    | "relance"
    | "rendez_vous"
    | "note"
    | "paiement"
    | "reservation"
    | "autre";

export type ActivityStatus =
    | "a_faire"
    | "en_cours"
    | "terminee"
    | "en_retard"
    | "annulee";

export type ActivityPriority = "faible" | "moyenne" | "haute" | "urgente";

export type Activity = {
    id: string;

    targetType: ActivityTargetType;
    targetId: string;
    targetName: string;
    targetPhone?: string;

    type: ActivityType;
    title: string;
    description?: string;

    status: ActivityStatus;
    priority: ActivityPriority;

    dueDate?: string;
    dueTime?: string;

    completedAt?: string;

    assignedTo?: string;
    createdBy: string;

    createdAt: string;
    updatedAt?: string;
};

export type ActivityResult =
    | "appel_reussi"
    | "pas_de_reponse"
    | "interesse"
    | "non_interesse"
    | "rendez_vous_confirme"
    | "visite_planifiee"
    | "paiement_promis"
    | "a_relancer"
    | "autre";

export type ActivityNextAction =
    | "aucune"
    | "relance"
    | "visite"
    | "rendez_vous"
    | "paiement"
    | "appel"
    | "whatsapp";

export type Activity = {
    id: string;

    targetType: "client" | "prospect";
    targetId: string;
    targetName: string;
    targetPhone?: string;

    type:
    | "appel"
    | "whatsapp"
    | "email"
    | "visite"
    | "relance"
    | "rendez_vous"
    | "note"
    | "paiement"
    | "reservation"
    | "autre";

    title: string;
    description?: string;

    status: "a_faire" | "en_cours" | "terminee" | "en_retard" | "annulee";
    priority: "faible" | "moyenne" | "haute" | "urgente";

    dueDate?: string;
    dueTime?: string;

    result?: ActivityResult;
    resultNote?: string;

    completedAt?: string;

    assignedTo?: string;
    createdBy: string;

    createdAt: string;
    updatedAt?: string;
};

// features/contacts/types/contact-profile.type.ts

export type ContactLifecycleStatus =
    | "prospect"
    | "client"
    | "client_finalise"
    | "perdu";

export type ContactPriority = "faible" | "moyenne" | "haute" | "urgente";

export type VisitStatus = "planifiee" | "effectuee" | "annulee";

export type PaymentStatus = "en_attente" | "partiel" | "termine" | "retard";

export type DocumentStatus = "disponible" | "manquant" | "expire";

export type ContactActivity = {
    id: string;
    type: string;
    title: string;
    description?: string;
    date: string;
    createdBy: string;
};

export type ContactVisit = {
    id: string;
    siteName: string;
    propertyName?: string;
    visitDate: string;
    status: VisitStatus;
    commercialName: string;
    report?: string;
    clientFeedback?: string;
};

export type ContactPayment = {
    id: string;
    label: string;
    amount: number;
    paidAt?: string;
    dueDate?: string;
    status: PaymentStatus;
};

export type ContactDocument = {
    id: string;
    name: string;
    type: string;
    status: DocumentStatus;
    fileUrl?: string;
    uploadedAt?: string;
};

export type ContactProfile = {
    id: string;

    lifecycleStatus: ContactLifecycleStatus;
    priority: ContactPriority;

    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    profession?: string;

    source?: string;
    createdAt: string;

    assignedCommercial?: {
        id: string;
        fullName: string;
        phone?: string;
        email?: string;
    };

    need: {
        propertyType?: string;
        locationWanted?: string;
        budgetMin?: number;
        budgetMax?: number;
        paymentMode?: string;
        expectedPurchaseDate?: string;
        description?: string;
    };

    interestedSites: {
        id: string;
        siteName: string;
        location: string;
        propertyName?: string;
        price?: number;
    }[];

    visits: ContactVisit[];

    clientFile?: {
        propertyPurchased?: string;
        totalAmount?: number;
        amountPaid?: number;
        remainingAmount?: number;
        paymentStatus?: PaymentStatus;
        nextPaymentDueDate?: string;
        nextPaymentAmount?: number;
        contractStatus?: string;
    };

    documents: ContactDocument[];

    activities: ContactActivity[];

    nextAction?: {
        title: string;
        dueDate: string;
        dueTime?: string;
        priority: ContactPriority;
    };

    internalNotes?: string;
};

// features/prospects/types/prospect-profile.type.ts

export type ProspectStatus =
    | "nouveau"
    | "qualifie"
    | "interesse"
    | "visite_planifiee"
    | "negociation"
    | "converti"
    | "perdu";

export type ProspectPriority = "faible" | "moyenne" | "haute" | "urgente";

export type ProspectTemperature = "froid" | "tiede" | "chaud" | "urgent";

export type VisitStatus = "planifiee" | "effectuee" | "annulee";

export type ActivityStatus = "a_faire" | "terminee" | "en_retard";

export type ProspectActivity = {
    id: string;
    type:
    | "appel"
    | "whatsapp"
    | "email"
    | "relance"
    | "visite"
    | "rendez_vous"
    | "note"
    | "autre";
    title: string;
    description?: string;
    status: ActivityStatus;
    activityDate: string;
    createdBy: string;
};

export type ProspectVisit = {
    id: string;
    siteName: string;
    propertyName?: string;
    location: string;
    visitDate: string;
    visitTime?: string;
    status: VisitStatus;
    commercialName: string;
    report?: string;
    prospectFeedback?: string;
    nextRecommendation?: string;
};

export type ProspectDocument = {
    id: string;
    name: string;
    type: string;
    status: "disponible" | "manquant";
    fileUrl?: string;
    uploadedAt?: string;
};

export type ProspectProfile = {
    id: string;
    contactId: string;

    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    profession?: string;

    source?: string;
    status: ProspectStatus;
    priority: ProspectPriority;
    temperature: ProspectTemperature;
    leadScore: number;

    createdAt: string;

    assignedCommercial?: {
        id: string;
        fullName: string;
        phone?: string;
        email?: string;
    };

    need: {
        propertyType?: string;
        locationWanted?: string;
        budgetMin?: number;
        budgetMax?: number;
        paymentMode?: string;
        expectedPurchaseDate?: string;
        objective?: string;
        description?: string;
        objections?: string[];
    };

    interestedProperties: {
        id: string;
        siteName: string;
        propertyName: string;
        location: string;
        price?: number;
    }[];

    visits: ProspectVisit[];

    activities: ProspectActivity[];

    documents: ProspectDocument[];

    nextAction?: {
        title: string;
        dueDate: string;
        dueTime?: string;
        priority: ProspectPriority;
    };

    internalNotes?: string;
    handoverNote?: string;
};