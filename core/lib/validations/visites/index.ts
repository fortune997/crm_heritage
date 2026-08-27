import { z } from "zod";

export const scheduleVisitSchema = z.object({
    prospect_id: z
        .string()
        .uuid("Veuillez sélectionner un prospect."),

    site_id: z
        .string()
        .uuid("Veuillez sélectionner un site."),

    visit_type: z.enum([
        "terrain",
        "bureau",

    ]),

    visit_date: z
        .string()
        .min(1, "La date est obligatoire."),

    start_time: z
        .string()
        .min(1, "L'heure de début est obligatoire."),


    location: z
        .string()
        .max(500)
        .optional(),

    purpose: z
        .string()
        .max(500)
        .optional(),

    notes: z
        .string()
        .max(2000)
        .optional(),







});

export type ScheduleVisitFormValues = z.infer<typeof scheduleVisitSchema>;