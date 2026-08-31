// core/validations/sale.schema.ts

import { z } from "zod";

export const createSaleSchema = z
    .object({
        prospect_id: z.string().min(
            1,
            "Sélectionnez un prospect"
        ),

        site_id: z.string().min(
            1,
            "Sélectionnez un site"
        ),

        sale_amount: z
            .number({
                message: "Le montant de la vente est obligatoire",
            })
            .positive(
                "Le montant doit être supérieur à zéro"
            ),

        payment_schedule: z.enum([
            "echelonne",
            "comptant",
        ]),

        installment_count: z.number().int().optional(),

        first_due_date: z.string().optional(),

        notes: z
            .string()
            .trim()
            .max(500, "Maximum 500 caractères")
            .optional(),
    })
    .superRefine((values, context) => {
        if (values.payment_schedule !== "comptant") {
            return;
        }

        if (
            !values.installment_count ||
            values.installment_count < 2
        ) {
            context.addIssue({
                code: "custom",
                path: ["installment_count"],
                message:
                    "Indiquez au moins deux échéances",
            });
        }

        if (!values.first_due_date) {
            context.addIssue({
                code: "custom",
                path: ["first_due_date"],
                message:
                    "La date de la première échéance est obligatoire",
            });
        }
    });

export type CreateSaleFormValues = z.infer<
    typeof createSaleSchema
>;