import { Customer360 } from "./Customer360";


export const customer360Demo: Customer360 = {
    id: "CUS-000125",

    type: "prospect",

    firstName: "Jean",
    lastName: "Dupont",

    phone: "+237 6 98 76 54 32",
    email: "jean.dupont@email.com",

    address: "Bonamoussadi",
    city: "Douala",

    civility: "Monsieur",
    profession: "Entrepreneur",
    identityNumber: "CNI 00112233",

    source: "Facebook Ads",
    createdAt: "12 mai 2025 à 10:32",

    project: {
        type: "Achat terrain",
        usage: "Habitation",
        zones: [
            "Douala",
            "Bonamoussadi",
            "Logbaba",
        ],
        surface: "500 – 800 m²",
        budget: "8 000 000 – 12 000 000 FCFA",
        purchaseDelay: "1 à 3 mois",
        paymentMethod: "Comptant ou échéancier",
        comments:
            "Souhaite un terrain bien situé, avec accès route et documents en règle.",
    },

    currentStage: "Négociation",
    currentStatus: "En cours",

    interest: "Très intéressé",

    nextAction: "Relancer le client",
    nextActionDate: "28/05/2025",

    priority: "high",

    commercial: {
        id: "USR-001",
        name: "Sandra M.",
        role: "Commerciale Senior",
        avatar:
            "https://i.pravatar.cc/150?img=47",
        phone: "+237 6 74 11 22 33",
        email: "sandra@heritage.cm",
    },

    visits: [
        {
            id: "VIS-001",
            type: "terrain",
            title: "Visite terrain - Lot 125",
            date: "18/05/2025 à 11:00",
            location: "Bonamoussadi",
            commercial: "Sandra M.",
            status: "completed",
            result: "Très intéressé",
            comments:
                "Client satisfait de l'emplacement.",
            image:
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        },
        {
            id: "VIS-002",
            type: "bureau",
            title: "Visite bureau",
            date: "20/05/2025 à 15:30",
            commercial: "Sandra M.",
            status: "completed",
            result: "Très intéressé",
            comments:
                "Présentation des documents et conditions de vente.",
            image:
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        },
    ],

    payments: [
        {
            id: "PAY-001",
            date: "20/05/2025",
            label: "Acompte",
            amount: 2500000,
            status: "paid",
            reference: "PAY-2025-00125",
        },
    ],

    documents: [
        {
            id: "DOC-001",
            name: "Copie CNI",
            type: "Pièce d'identité",
            date: "13/05/2025",
            status: "received",
        },
        {
            id: "DOC-002",
            name: "Justificatif de domicile",
            type: "Justificatif",
            date: "13/05/2025",
            status: "received",
        },
        {
            id: "DOC-003",
            name: "Attestation de revenus",
            type: "Financier",
            date: "14/05/2025",
            status: "received",
        },
        {
            id: "DOC-004",
            name: "Autres documents",
            type: "Autre",
            status: "pending",
        },
    ],

    activities: [
        {
            id: "ACT-001",
            type: "call",
            title: "Appel téléphonique",
            description:
                "Client intéressé par le terrain visité. Souhaite réfléchir et revenir vers nous.",
            date: "Aujourd'hui à 10:15",
            author: "Sandra M.",
        },
        {
            id: "ACT-002",
            type: "visit",
            title: "Visite bureau effectuée",
            description:
                "Présentation des documents et conditions de vente.",
            date: "20/05/2025 à 15:30",
            author: "Sandra M.",
        },
        {
            id: "ACT-003",
            type: "visit",
            title: "Visite terrain effectuée",
            description:
                "Client très satisfait de l'emplacement.",
            date: "18/05/2025 à 11:00",
            author: "Sandra M.",
        },
        {
            id: "ACT-004",
            type: "qualification",
            title: "Qualification du prospect",
            date: "13/05/2025 à 09:45",
            author: "Sandra M.",
        },
        {
            id: "ACT-005",
            type: "customer",
            title: "Nouveau prospect ajouté",
            date: "12/05/2025 à 10:32",
            author: "Sandra M.",
        },
    ],

    land: {
        id: "LOT-125",
        title: "Lot 125 - Bonamoussadi",
        location: "Bonamoussadi",
        surface: "600 m²",
        price: 10000000,
        status: "Disponible",
        image:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    },

    notes:
        "Client sérieux, très intéressé par le terrain. Prévoir relance dans 2 jours pour connaître sa décision finale.",
};