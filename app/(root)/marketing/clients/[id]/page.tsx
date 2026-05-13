"use client";

import * as React from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    Banknote,
    Building2,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Download,
    Eye,
    FileText,
    Flag,
    History,
    Landmark,
    MapPin,
    MessageCircle,
    Phone,
    Plus,
    Receipt,
    ShieldCheck,
    UserRound,
    Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type ClientStatus =
    | "reservation"
    | "paiement_en_cours"
    | "contrat_en_preparation"
    | "contrat_signe"
    | "finalise"
    | "suspendu"
    | "annule";

type Priority = "faible" | "moyenne" | "haute" | "urgente";

type PaymentStatus = "en_attente" | "partiel" | "termine" | "retard";

type PaymentLineStatus = "paye" | "en_attente" | "en_retard" | "annule";

type DocumentStatus =
    | "disponible"
    | "manquant"
    | "expire"
    | "a_verifier"
    | "valide";

type DeadlineStatus = "a_venir" | "terminee" | "en_retard";

type ComplaintStatus = "ouverte" | "en_cours" | "resolue";

type ActivityStatus = "a_faire" | "terminee" | "en_retard";

type UserMini = {
    id: string;
    fullName: string;
    phone?: string;
    email?: string;
};

type ClientDocument = {
    id: string;
    name: string;
    type: string;
    status: DocumentStatus;
    fileUrl?: string;
    uploadedAt?: string;
    addedBy?: string;
};

type ClientActivity = {
    id: string;
    type:
    | "appel"
    | "whatsapp"
    | "email"
    | "relance"
    | "paiement"
    | "document"
    | "signature"
    | "rendez_vous"
    | "reclamation"
    | "note";
    title: string;
    description?: string;
    status: ActivityStatus;
    activityDate: string;
    createdBy: string;
};

type ClientProfile = {
    id: string;
    contactId: string;
    prospectId?: string;

    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    profession?: string;

    status: ClientStatus;
    priority: Priority;

    source?: string;
    createdAt: string;
    convertedAt: string;

    assignedCommercial?: UserMini;
    financeManager?: UserMini;
    legalManager?: UserMini;
    convertedBy?: UserMini;

    property: {
        id: string;
        siteName: string;
        propertyName: string;
        type: string;
        location: string;
        area?: number;
        initialPrice: number;
        discount?: number;
        finalPrice: number;
        status: "reserve" | "vendu" | "attribue" | "annule";
    };

    financial: {
        totalAmount: number;
        amountPaid: number;
        remainingAmount: number;
        paymentStatus: PaymentStatus;
        nextPaymentDueDate?: string;
        nextPaymentAmount?: number;
    };

    payments: {
        id: string;
        label: string;
        amount: number;
        paymentMethod?: string;
        status: PaymentLineStatus;
        paidAt?: string;
        dueDate?: string;
        receiptUrl?: string;
        reference?: string;
        note?: string;
    }[];

    clientDocuments: ClientDocument[];
    propertyDocuments: ClientDocument[];

    activities: ClientActivity[];

    deadlines: {
        id: string;
        title: string;
        dueDate: string;
        status: DeadlineStatus;
        priority: Priority;
        description?: string;
    }[];

    complaints: {
        id: string;
        title: string;
        description?: string;
        status: ComplaintStatus;
        assignedTo?: UserMini;
        createdAt: string;
    }[];

    conversionSummary?: {
        initialNeed?: string;
        selectedSite?: string;
        visitsBeforeConversion?: number;
        reason?: string;
        convertedFromProspectName?: string;
    };

    internalNotes?: string;
    handoverNote?: string;
};

const client: ClientProfile = {
    id: "CL-001",
    contactId: "CT-001",
    prospectId: "PR-001",

    fullName: "Jean Marc Tchinda",
    phone: "+237 699 000 111",
    email: "jeanmarc@email.com",
    address: "Bonamoussadi, Douala",
    city: "Douala",
    profession: "Entrepreneur",

    status: "paiement_en_cours",
    priority: "haute",

    source: "Facebook",
    createdAt: "2026-05-01",
    convertedAt: "2026-05-12",

    assignedCommercial: {
        id: "USR-001",
        fullName: "Commercial 1",
        phone: "+237 677 111 222",
        email: "commercial1@heritage.com",
    },

    financeManager: {
        id: "USR-002",
        fullName: "Responsable Finance",
        phone: "+237 677 333 444",
        email: "finance@heritage.com",
    },

    legalManager: {
        id: "USR-003",
        fullName: "Responsable Juridique",
        phone: "+237 677 555 666",
        email: "juridique@heritage.com",
    },

    convertedBy: {
        id: "USR-001",
        fullName: "Commercial 1",
    },

    property: {
        id: "PROP-001",
        siteName: "Site PK24",
        propertyName: "Terrain 500 m²",
        type: "Terrain",
        location: "PK24, Douala",
        area: 500,
        initialPrice: 5000000,
        discount: 500000,
        finalPrice: 4500000,
        status: "reserve",
    },

    financial: {
        totalAmount: 4500000,
        amountPaid: 2500000,
        remainingAmount: 2000000,
        paymentStatus: "partiel",
        nextPaymentDueDate: "2026-05-25",
        nextPaymentAmount: 1000000,
    },

    payments: [
        {
            id: "PAY-001",
            label: "Premier versement",
            amount: 2000000,
            paymentMethod: "Mobile Money",
            status: "paye",
            paidAt: "2026-05-12",
            receiptUrl: "#",
            reference: "MOMO-20260512-001",
            note: "Versement initial de réservation.",
        },
        {
            id: "PAY-002",
            label: "Deuxième versement",
            amount: 500000,
            paymentMethod: "Espèces",
            status: "paye",
            paidAt: "2026-05-15",
            receiptUrl: "#",
            reference: "CASH-20260515-002",
            note: "Complément versé au bureau.",
        },
        {
            id: "PAY-003",
            label: "Troisième versement",
            amount: 1000000,
            status: "en_attente",
            dueDate: "2026-05-25",
            note: "Échéance à relancer avant la date prévue.",
        },
        {
            id: "PAY-004",
            label: "Solde final",
            amount: 1000000,
            status: "en_attente",
            dueDate: "2026-06-25",
        },
    ],

    clientDocuments: [
        {
            id: "DOC-C-001",
            name: "Copie CNI",
            type: "Identité",
            status: "disponible",
            uploadedAt: "2026-05-12",
            fileUrl: "#",
            addedBy: "Commercial 1",
        },
        {
            id: "DOC-C-002",
            name: "Reçu premier versement",
            type: "Paiement",
            status: "disponible",
            uploadedAt: "2026-05-12",
            fileUrl: "#",
            addedBy: "Finance",
        },
        {
            id: "DOC-C-003",
            name: "Contrat signé",
            type: "Contrat",
            status: "manquant",
            addedBy: "Juridique",
        },
        {
            id: "DOC-C-004",
            name: "Fiche client signée",
            type: "Administratif",
            status: "a_verifier",
            uploadedAt: "2026-05-13",
            fileUrl: "#",
            addedBy: "Commercial 1",
        },
    ],

    propertyDocuments: [
        {
            id: "DOC-P-001",
            name: "Titre foncier",
            type: "Juridique",
            status: "disponible",
            uploadedAt: "2026-05-10",
            fileUrl: "#",
            addedBy: "Juridique",
        },
        {
            id: "DOC-P-002",
            name: "Plan cadastral",
            type: "Technique",
            status: "disponible",
            uploadedAt: "2026-05-10",
            fileUrl: "#",
            addedBy: "Topographe",
        },
        {
            id: "DOC-P-003",
            name: "PV de visite",
            type: "Visite",
            status: "disponible",
            uploadedAt: "2026-05-06",
            fileUrl: "#",
            addedBy: "Commercial 1",
        },
        {
            id: "DOC-P-004",
            name: "Autorisation de vente",
            type: "Juridique",
            status: "manquant",
            addedBy: "Juridique",
        },
    ],

    deadlines: [
        {
            id: "D-001",
            title: "Troisième versement",
            dueDate: "2026-05-25",
            status: "a_venir",
            priority: "haute",
            description: "Montant attendu : 1 000 000 FCFA.",
        },
        {
            id: "D-002",
            title: "Signature du contrat",
            dueDate: "2026-05-30",
            status: "a_venir",
            priority: "haute",
            description: "Le contrat doit être signé après validation juridique.",
        },
        {
            id: "D-003",
            title: "Solde final",
            dueDate: "2026-06-25",
            status: "a_venir",
            priority: "moyenne",
            description: "Paiement du solde restant.",
        },
    ],

    activities: [
        {
            id: "ACT-001",
            type: "appel",
            title: "Confirmation de conversion",
            description:
                "Le client confirme son choix pour le terrain de PK24 après visite.",
            status: "terminee",
            activityDate: "2026-05-12",
            createdBy: "Commercial 1",
        },
        {
            id: "ACT-002",
            type: "paiement",
            title: "Premier versement enregistré",
            description: "Versement de 2 000 000 FCFA enregistré.",
            status: "terminee",
            activityDate: "2026-05-12",
            createdBy: "Finance",
        },
        {
            id: "ACT-003",
            type: "document",
            title: "Contrat en préparation",
            description:
                "Le dossier est transmis au juridique pour préparation du contrat.",
            status: "terminee",
            activityDate: "2026-05-13",
            createdBy: "Juridique",
        },
        {
            id: "ACT-004",
            type: "relance",
            title: "Relancer pour troisième versement",
            description:
                "Relancer le client avant l’échéance du 25 mai pour confirmer le prochain versement.",
            status: "a_faire",
            activityDate: "2026-05-23",
            createdBy: "Commercial 1",
        },
    ],

    complaints: [
        {
            id: "REC-001",
            title: "Demande de documents fonciers",
            description:
                "Le client souhaite recevoir une copie du titre foncier et du plan cadastral.",
            status: "en_cours",
            assignedTo: {
                id: "USR-003",
                fullName: "Responsable Juridique",
            },
            createdAt: "2026-05-14",
        },
    ],

    conversionSummary: {
        initialNeed:
            "Le prospect recherchait un terrain titré entre 3M et 6M à Douala, avec possibilité de paiement progressif.",
        selectedSite: "Site PK24",
        visitsBeforeConversion: 2,
        reason:
            "Le client a validé le site après visite et après consultation des documents fonciers.",
        convertedFromProspectName: "Jean Marc Tchinda",
    },

    internalNotes:
        "Client sérieux. Il faut suivre de près les échéances de paiement et finaliser rapidement le contrat.",
    handoverNote:
        "Si un autre commercial reprend ce dossier, commencer par vérifier que le client a reçu les documents fonciers. Ensuite, relancer le troisième versement prévu le 25 mai 2026.",
};

function formatCurrency(value?: number) {
    if (!value) return "Non défini";

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value?: string) {
    if (!value) return "Non défini";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

function getDaysRemaining(date?: string) {
    if (!date) return null;

    const today = new Date();
    const targetDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diff = targetDate.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ClientStatusBadge({ status }: { status: ClientStatus }) {
    const labels: Record<ClientStatus, string> = {
        reservation: "Réservation",
        paiement_en_cours: "Paiement en cours",
        contrat_en_preparation: "Contrat en préparation",
        contrat_signe: "Contrat signé",
        finalise: "Finalisé",
        suspendu: "Suspendu",
        annule: "Annulé",
    };

    const className: Record<ClientStatus, string> = {
        reservation: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        paiement_en_cours: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        contrat_en_preparation:
            "border-purple-500/20 bg-purple-500/10 text-purple-600",
        contrat_signe: "border-green-500/20 bg-green-500/10 text-green-600",
        finalise: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
        suspendu: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        annule: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: Priority }) {
    const labels: Record<Priority, string> = {
        faible: "Faible",
        moyenne: "Moyenne",
        haute: "Haute",
        urgente: "Urgente",
    };

    const className: Record<Priority, string> = {
        faible: "border-border bg-muted text-muted-foreground",
        moyenne: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        haute: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        urgente: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[priority]}>
            {labels[priority]}
        </Badge>
    );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const labels: Record<PaymentStatus, string> = {
        en_attente: "En attente",
        partiel: "Paiement partiel",
        termine: "Terminé",
        retard: "En retard",
    };

    const className: Record<PaymentStatus, string> = {
        en_attente: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        partiel: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        termine: "border-green-500/20 bg-green-500/10 text-green-600",
        retard: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function PaymentLineStatusBadge({ status }: { status: PaymentLineStatus }) {
    const labels: Record<PaymentLineStatus, string> = {
        paye: "Payé",
        en_attente: "En attente",
        en_retard: "En retard",
        annule: "Annulé",
    };

    const className: Record<PaymentLineStatus, string> = {
        paye: "border-green-500/20 bg-green-500/10 text-green-600",
        en_attente: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        en_retard: "border-red-500/20 bg-red-500/10 text-red-600",
        annule: "border-muted bg-muted text-muted-foreground",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
    const labels: Record<DocumentStatus, string> = {
        disponible: "Disponible",
        manquant: "Manquant",
        expire: "Expiré",
        a_verifier: "À vérifier",
        valide: "Validé",
    };

    const className: Record<DocumentStatus, string> = {
        disponible: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        manquant: "border-red-500/20 bg-red-500/10 text-red-600",
        expire: "border-orange-500/20 bg-orange-500/10 text-orange-600",
        a_verifier: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        valide: "border-green-500/20 bg-green-500/10 text-green-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function DeadlineStatusBadge({ status }: { status: DeadlineStatus }) {
    const labels: Record<DeadlineStatus, string> = {
        a_venir: "À venir",
        terminee: "Terminée",
        en_retard: "En retard",
    };

    const className: Record<DeadlineStatus, string> = {
        a_venir: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        terminee: "border-green-500/20 bg-green-500/10 text-green-600",
        en_retard: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
    const labels: Record<ComplaintStatus, string> = {
        ouverte: "Ouverte",
        en_cours: "En cours",
        resolue: "Résolue",
    };

    const className: Record<ComplaintStatus, string> = {
        ouverte: "border-red-500/20 bg-red-500/10 text-red-600",
        en_cours: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
        resolue: "border-green-500/20 bg-green-500/10 text-green-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
    const labels: Record<ActivityStatus, string> = {
        a_faire: "À faire",
        terminee: "Terminée",
        en_retard: "En retard",
    };

    const className: Record<ActivityStatus, string> = {
        a_faire: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        terminee: "border-green-500/20 bg-green-500/10 text-green-600",
        en_retard: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
        <Badge variant="outline" className={className[status]}>
            {labels[status]}
        </Badge>
    );
}

export default function ClientProfilePage() {
    const paymentProgress =
        client.financial.totalAmount > 0
            ? Math.min(
                Math.round(
                    (client.financial.amountPaid / client.financial.totalAmount) * 100
                ),
                100
            )
            : 0;

    const remainingDays = getDaysRemaining(client.financial.nextPaymentDueDate);

    const missingClientDocuments = client.clientDocuments.filter(
        (document) => document.status === "manquant"
    ).length;

    const missingPropertyDocuments = client.propertyDocuments.filter(
        (document) => document.status === "manquant"
    ).length;

    const pendingActivities = client.activities.filter(
        (activity) => activity.status === "a_faire"
    ).length;

    const overdueDeadlines = client.deadlines.filter(
        (deadline) => deadline.status === "en_retard"
    ).length;

    const openComplaints = client.complaints.filter(
        (complaint) => complaint.status !== "resolue"
    ).length;

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #client-profile-print,
          #client-profile-print * {
            visibility: visible;
          }

          #client-profile-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div className="no-print flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" >
                        <Link href="/dashboard/marketing/clients">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Fiche client
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Vue complète du dossier après conversion : paiement, documents,
                            échéances, bien réservé et suivi.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 size-4" />
                        Télécharger
                    </Button>

                    <Button variant="outline">
                        <Plus className="mr-2 size-4" />
                        Activité
                    </Button>

                    <Button variant="outline">
                        <FileText className="mr-2 size-4" />
                        Document
                    </Button>

                    <Button>
                        <Receipt className="mr-2 size-4" />
                        Ajouter paiement
                    </Button>
                </div>
            </div>

            <div id="client-profile-print" className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex gap-4">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <UserRound className="size-8" />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-bold">{client.fullName}</h2>
                                        <ClientStatusBadge status={client.status} />
                                        <PriorityBadge priority={client.priority} />
                                        <PaymentStatusBadge status={client.financial.paymentStatus} />
                                    </div>

                                    <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Phone className="size-4" />
                                            {client.phone}
                                        </div>

                                        {client.email && <div>{client.email}</div>}

                                        {client.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-4" />
                                                {client.address}
                                            </div>
                                        )}

                                        <div>Source : {client.source ?? "Non renseignée"}</div>
                                        <div>Converti le : {formatDate(client.convertedAt)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 rounded-xl border bg-muted/40 p-4 lg:min-w-[340px]">
                                <InfoItem
                                    label="Commercial responsable"
                                    value={client.assignedCommercial?.fullName}
                                />
                                <InfoItem
                                    label="Responsable finance"
                                    value={client.financeManager?.fullName}
                                />
                                <InfoItem
                                    label="Responsable juridique"
                                    value={client.legalManager?.fullName}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="no-print grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    <Button >
                        <a href={`tel:${client.phone}`}>
                            <Phone className="mr-2 size-4" />
                            Appeler
                        </a>
                    </Button>

                    <Button variant="outline" >
                        <a
                            href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                            target="_blank"
                        >
                            <MessageCircle className="mr-2 size-4" />
                            WhatsApp
                        </a>
                    </Button>

                    <Button variant="outline">
                        <Receipt className="mr-2 size-4" />
                        Paiement
                    </Button>

                    <Button variant="outline">
                        <CalendarClock className="mr-2 size-4" />
                        Échéance
                    </Button>

                    <Button variant="outline">
                        <Flag className="mr-2 size-4" />
                        Réclamation
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Montant total</CardDescription>
                            <CardTitle className="text-xl">
                                {formatCurrency(client.financial.totalAmount)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Montant versé</CardDescription>
                            <CardTitle className="text-xl text-green-600">
                                {formatCurrency(client.financial.amountPaid)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Reste à payer</CardDescription>
                            <CardTitle className="text-xl text-orange-600">
                                {formatCurrency(client.financial.remainingAmount)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Progression</CardDescription>
                            <CardTitle className="text-xl">{paymentProgress}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={paymentProgress} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Échéance</CardDescription>
                            <CardTitle className="text-xl">
                                {remainingDays === null
                                    ? "Aucune"
                                    : remainingDays > 0
                                        ? `${remainingDays} jour(s)`
                                        : remainingDays === 0
                                            ? "Aujourd’hui"
                                            : `${Math.abs(remainingDays)} j retard`}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {(missingClientDocuments > 0 ||
                    missingPropertyDocuments > 0 ||
                    pendingActivities > 0 ||
                    overdueDeadlines > 0 ||
                    openComplaints > 0 ||
                    (remainingDays !== null && remainingDays <= 3)) && (
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="size-5" />
                                    Alertes du dossier
                                </CardTitle>
                                <CardDescription>
                                    Points à traiter pour éviter le blocage du dossier client.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2 text-sm">
                                {missingClientDocuments > 0 && (
                                    <p>
                                        {missingClientDocuments} document(s) client manquant(s).
                                    </p>
                                )}

                                {missingPropertyDocuments > 0 && (
                                    <p>{missingPropertyDocuments} document(s) du bien manquant(s).</p>
                                )}

                                {pendingActivities > 0 && (
                                    <p>{pendingActivities} activité(s) restent à traiter.</p>
                                )}

                                {overdueDeadlines > 0 && (
                                    <p>{overdueDeadlines} échéance(s) en retard.</p>
                                )}

                                {openComplaints > 0 && (
                                    <p>{openComplaints} réclamation(s) ouverte(s) ou en cours.</p>
                                )}

                                {remainingDays !== null && remainingDays <= 3 && (
                                    <p>
                                        La prochaine échéance de paiement est proche ou dépassée.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="size-5" />
                            Pipeline du dossier client
                        </CardTitle>
                        <CardDescription>
                            Étapes principales après conversion du prospect en client.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-5">
                            <PipelineStep
                                title="Réservation"
                                active
                                completed
                            />
                            <PipelineStep
                                title="Paiement"
                                active={client.status === "paiement_en_cours"}
                                completed={paymentProgress >= 100}
                            />
                            <PipelineStep
                                title="Contrat"
                                active={client.status === "contrat_en_preparation"}
                                completed={
                                    client.status === "contrat_signe" ||
                                    client.status === "finalise"
                                }
                            />
                            <PipelineStep
                                title="Signature"
                                active={client.status === "contrat_signe"}
                                completed={
                                    client.status === "contrat_signe" ||
                                    client.status === "finalise"
                                }
                            />
                            <PipelineStep
                                title="Finalisation"
                                active={client.status === "finalise"}
                                completed={client.status === "finalise"}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="size-5" />
                                    Bien réservé / acheté
                                </CardTitle>
                                <CardDescription>
                                    Informations du bien concerné par le dossier client.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <InfoItem label="Site" value={client.property.siteName} />
                                <InfoItem label="Bien" value={client.property.propertyName} />
                                <InfoItem label="Type" value={client.property.type} />
                                <InfoItem label="Localisation" value={client.property.location} />
                                <InfoItem
                                    label="Superficie"
                                    value={
                                        client.property.area
                                            ? `${client.property.area} m²`
                                            : "Non renseigné"
                                    }
                                />
                                <InfoItem
                                    label="Statut du bien"
                                    value={getPropertyStatusLabel(client.property.status)}
                                />
                                <InfoItem
                                    label="Prix initial"
                                    value={formatCurrency(client.property.initialPrice)}
                                />
                                <InfoItem
                                    label="Remise"
                                    value={formatCurrency(client.property.discount)}
                                />
                                <InfoItem
                                    label="Prix final"
                                    value={formatCurrency(client.property.finalPrice)}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wallet className="size-5" />
                                    Paiements et échéancier
                                </CardTitle>
                                <CardDescription>
                                    Historique des versements, paiements attendus et reçus.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="rounded-xl border bg-muted/40 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Prochaine échéance
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {formatCurrency(client.financial.nextPaymentAmount)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(client.financial.nextPaymentDueDate)}
                                            </p>
                                        </div>

                                        {remainingDays !== null && (
                                            <Badge
                                                variant="outline"
                                                className={
                                                    remainingDays <= 3
                                                        ? "border-red-500/20 bg-red-500/10 text-red-600"
                                                        : "border-blue-500/20 bg-blue-500/10 text-blue-600"
                                                }
                                            >
                                                {remainingDays > 0
                                                    ? `Dans ${remainingDays} jour(s)`
                                                    : remainingDays === 0
                                                        ? "Aujourd’hui"
                                                        : `En retard de ${Math.abs(remainingDays)} jour(s)`}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {client.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="rounded-xl border bg-background p-4"
                                        >
                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-semibold">{payment.label}</p>
                                                        <PaymentLineStatusBadge status={payment.status} />
                                                    </div>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {payment.paidAt
                                                            ? `Payé le ${formatDate(payment.paidAt)}`
                                                            : `Prévu le ${formatDate(payment.dueDate)}`}
                                                    </p>

                                                    {payment.reference && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Référence : {payment.reference}
                                                        </p>
                                                    )}

                                                    {payment.paymentMethod && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Mode : {payment.paymentMethod}
                                                        </p>
                                                    )}

                                                    {payment.note && (
                                                        <p className="mt-2 text-sm text-muted-foreground">
                                                            {payment.note}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">
                                                        {formatCurrency(payment.amount)}
                                                    </p>

                                                    {payment.receiptUrl && (
                                                        <Button size="icon" variant="ghost" >
                                                            <a href={payment.receiptUrl}>
                                                                <Eye className="size-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarClock className="size-5" />
                                    Échéances importantes
                                </CardTitle>
                                <CardDescription>
                                    Paiement, signature, contrat et autres dates critiques.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {client.deadlines.map((deadline) => (
                                    <div
                                        key={deadline.id}
                                        className="rounded-lg border bg-background p-4"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{deadline.title}</p>
                                                    <DeadlineStatusBadge status={deadline.status} />
                                                    <PriorityBadge priority={deadline.priority} />
                                                </div>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Date : {formatDate(deadline.dueDate)}
                                                </p>

                                                {deadline.description && (
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {deadline.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="size-5" />
                                    Activités et suivi client
                                </CardTitle>
                                <CardDescription>
                                    Appels, relances, paiements, documents, signatures et notes.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {client.activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-4">
                                        <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <CheckCircle2 className="size-4" />
                                        </div>

                                        <div className="flex-1 border-b pb-4 last:border-b-0">
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-medium">{activity.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(activity.activityDate)} —{" "}
                                                        {activity.createdBy}
                                                    </p>
                                                </div>

                                                <ActivityStatusBadge status={activity.status} />
                                            </div>

                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {activity.description ?? "Aucune description."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="size-5" />
                                    Situation du dossier
                                </CardTitle>
                                <CardDescription>
                                    État administratif, financier et juridique.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <InfoItem
                                    label="Statut client"
                                    value={getClientStatusLabel(client.status)}
                                />
                                <InfoItem
                                    label="Statut paiement"
                                    value={getPaymentStatusLabel(client.financial.paymentStatus)}
                                />
                                <InfoItem
                                    label="Date de conversion"
                                    value={formatDate(client.convertedAt)}
                                />
                                <InfoItem
                                    label="Converti par"
                                    value={client.convertedBy?.fullName}
                                />

                                <Separator />

                                <InfoItem
                                    label="Montant total"
                                    value={formatCurrency(client.financial.totalAmount)}
                                />
                                <InfoItem
                                    label="Montant versé"
                                    value={formatCurrency(client.financial.amountPaid)}
                                />
                                <InfoItem
                                    label="Reste à payer"
                                    value={formatCurrency(client.financial.remainingAmount)}
                                />
                            </CardContent>
                        </Card>

                        <DocumentListCard
                            title="Documents client"
                            description="Pièces d’identité, reçus, contrat et documents administratifs."
                            documents={client.clientDocuments}
                        />

                        <DocumentListCard
                            title="Documents du bien"
                            description="Dossier foncier, technique et juridique du bien."
                            documents={client.propertyDocuments}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flag className="size-5" />
                                    Réclamations / demandes
                                </CardTitle>
                                <CardDescription>
                                    Demandes spéciales, préoccupations et blocages client.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {client.complaints.length ? (
                                    client.complaints.map((complaint) => (
                                        <div
                                            key={complaint.id}
                                            className="rounded-lg border bg-background p-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-medium">{complaint.title}</p>
                                                <ComplaintStatusBadge status={complaint.status} />
                                            </div>

                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {complaint.description ?? "Aucune description."}
                                            </p>

                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Responsable :{" "}
                                                {complaint.assignedTo?.fullName ?? "Non assigné"} —
                                                Créée le {formatDate(complaint.createdAt)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        Aucune réclamation enregistrée.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Historique de conversion</CardTitle>
                                <CardDescription>
                                    Résumé du passage prospect vers client.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <InfoItem
                                    label="Prospect d’origine"
                                    value={client.conversionSummary?.convertedFromProspectName}
                                />
                                <InfoItem
                                    label="Site choisi"
                                    value={client.conversionSummary?.selectedSite}
                                />
                                <InfoItem
                                    label="Visites avant conversion"
                                    value={client.conversionSummary?.visitsBeforeConversion}
                                />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Besoin initial
                                    </p>
                                    <p className="mt-1 text-sm">
                                        {client.conversionSummary?.initialNeed ?? "Non renseigné"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Raison de conversion
                                    </p>
                                    <p className="mt-1 text-sm">
                                        {client.conversionSummary?.reason ?? "Non renseigné"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notes internes</CardTitle>
                                <CardDescription>
                                    Informations utiles pour l’équipe interne.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {client.internalNotes ?? "Aucune note interne."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Note de passation</CardTitle>
                                <CardDescription>
                                    Résumé utile si une autre personne reprend le dossier.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {client.handoverNote ?? "Aucune note de passation."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DocumentListCard({
    title,
    description,
    documents,
}: {
    title: string;
    description: string;
    documents: ClientDocument[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                        <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {document.type}
                                {document.uploadedAt
                                    ? ` — ${formatDate(document.uploadedAt)}`
                                    : ""}
                            </p>

                            {document.addedBy && (
                                <p className="text-xs text-muted-foreground">
                                    Ajouté par : {document.addedBy}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <DocumentStatusBadge status={document.status} />

                            {document.fileUrl && (
                                <Button size="icon" variant="ghost" >
                                    <a href={document.fileUrl}>
                                        <Eye className="size-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function PipelineStep({
    title,
    active,
    completed,
}: {
    title: string;
    active?: boolean;
    completed?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-xl border p-4 text-center",
                completed
                    ? "border-green-500/20 bg-green-500/10 text-green-700"
                    : active
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "bg-muted/40 text-muted-foreground",
            ].join(" ")}
        >
            <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-background">
                {completed ? (
                    <CheckCircle2 className="size-4" />
                ) : (
                    <Landmark className="size-4" />
                )}
            </div>
            <p className="text-sm font-medium">{title}</p>
        </div>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || "Non renseigné"}</p>
        </div>
    );
}

function getClientStatusLabel(status: ClientStatus) {
    const labels: Record<ClientStatus, string> = {
        reservation: "Réservation",
        paiement_en_cours: "Paiement en cours",
        contrat_en_preparation: "Contrat en préparation",
        contrat_signe: "Contrat signé",
        finalise: "Finalisé",
        suspendu: "Suspendu",
        annule: "Annulé",
    };

    return labels[status];
}

function getPaymentStatusLabel(status: PaymentStatus) {
    const labels: Record<PaymentStatus, string> = {
        en_attente: "En attente",
        partiel: "Paiement partiel",
        termine: "Terminé",
        retard: "En retard",
    };

    return labels[status];
}

function getPropertyStatusLabel(status: ClientProfile["property"]["status"]) {
    const labels: Record<ClientProfile["property"]["status"], string> = {
        reserve: "Réservé",
        vendu: "Vendu",
        attribue: "Attribué",
        annule: "Annulé",
    };

    return labels[status];
}