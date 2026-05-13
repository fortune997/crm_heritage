"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "../lib/auth/RequireSuperAdmin";
import { CompanyFormValues, companySchema } from "@/lib/validations/schema";


export async function createCompanyAction(values: CompanyFormValues) {
    const { supabase, user } = await requireSuperAdmin();

    const parsed = companySchema.safeParse(values);

    if (!parsed.success) {
        return {
            success: false,
            message: "Données invalides.",
        };
    }

    const { data: company, error } = await supabase
        .from("companies")
        .insert({
            name: parsed.data.name,
            slug: parsed.data.slug,
            legal_name: parsed.data.legal_name || null,
            company_type: parsed.data.company_type || null,
            email: parsed.data.email || null,
            phone: parsed.data.phone || null,
            address: parsed.data.address || null,
            logo_url: parsed.data.logo_url || null,
            status: parsed.data.status || "active",
        })
        .select("id, name, slug")
        .single();

    if (error) {
        return {
            success: false,
            message: error.message,
        };
    }

    /*  await supabase.from("activity_logs").insert({
         company_id: company.id,
         actor_id: user.id,
         action: "company.created",
         entity_type: "company",
         entity_id: company.id,
         description: `Création de l'entreprise ${company.name}`,
         metadata: {
             slug: company.slug,
         },
     }); */

    revalidatePath("/admin/companies");

    return {
        success: true,
        message: "Entreprise créée avec succès.",
    };
}