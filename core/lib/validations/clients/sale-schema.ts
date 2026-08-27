import { z } from "zod";

export const saleSchema = z
    .object({
        prospectId: z
            .string()
            .uuid("Veuillez sélectionner un prospect."),

        siteId: z
            .string()
            .uuid("Veuillez sélectionner un site.")
            .nullable(),

        saleAmount: z
            .string()
            .min(1, "Le montant de la vente est obligatoire."),

        paymentSchedule: z.enum([
            "comptant",
            "echelonne",
        ]),

        firstPaymentAmount: z
            .string()
            .min(1, "Le montant du paiement est obligatoire."),

        paymentMethod: z.enum([
            "especes",
            "virement",
            "mobile_money",
            "cheque",
            "carte",
            "autre",
        ]),

        paymentDate: z
            .string()
            .min(1, "La date du paiement est obligatoire."),

        transactionReference: z
            .string()
            .optional(),

        notes: z
            .string()
            .max(
                1000,
                "Les notes ne peuvent pas dépasser 1000 caractères."
            )
            .optional(),
    })
    .superRefine((values, context) => {
        const saleAmount = Number(values.saleAmount);
        const firstPayment = Number(
            values.firstPaymentAmount
        );

        if (
            !Number.isFinite(saleAmount) ||
            saleAmount <= 0
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["saleAmount"],
                message:
                    "Le montant de la vente doit être supérieur à 0.",
            });
        }

        if (
            !Number.isFinite(firstPayment) ||
            firstPayment <= 0
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["firstPaymentAmount"],
                message:
                    "Le premier paiement doit être supérieur à 0.",
            });
        }

        if (
            Number.isFinite(saleAmount) &&
            Number.isFinite(firstPayment) &&
            firstPayment > saleAmount
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["firstPaymentAmount"],
                message:
                    "Le paiement ne peut pas dépasser le montant de la vente.",
            });
        }

        if (
            values.paymentSchedule === "comptant" &&
            Number.isFinite(saleAmount) &&
            Number.isFinite(firstPayment) &&
            firstPayment !== saleAmount
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["firstPaymentAmount"],
                message:
                    "Pour un paiement comptant, le montant doit correspondre au montant total de la vente.",
            });
        }
    });

export type SaleFormValues = z.infer<typeof saleSchema>;