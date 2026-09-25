import { TProspects } from "@/core/types/prospects";
import { ProspectFormValues } from "@/lib/validations/schema";

export type ProspectStatus =
    | "nouveau"
    | "contacte"
    | "interesse"
    | "visite_planifiee"
    | "converti"
    | "perdu";

export type ProspectPriority = "faible" | "moyenne" | "haute";

export type Prospect = {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    status: ProspectStatus;
    priority: ProspectPriority;
    source: string;
    interestedProperty: string;
    budget?: number;
    assignedTo?: string;
    createdAt: string;
};

// Types
export interface Source {
    id: string;
    name: string;
}

export interface Company {
    id: string;
    name: string;
}


export interface ProspectFormProps {
    initialData?: Partial<ProspectFormValues> & { id?: string };
    submitLabel?: string;
    prospect?: any;
    open?: boolean;
     trigger?: React.ReactNode;
     type: string;
    onOpenChange?: (open: boolean) => void;
}