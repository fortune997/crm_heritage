import { createSupabaseServerClient } from "@/lib/config/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";


type CreateUserPayload = {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    roleId: string;
    department: string;
    status: string;
    brandIds: string[];
};


const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);



export async function POST(request: Request) {
    let authUserId: string | null = null;

    try {
        const body = (await request.json()) as CreateUserPayload;
        console.log("CREATE USER BODY:", body);

        // ===============================
        // Validation
        // ===============================

        if (
            !body.first_name ||
            !body.last_name ||
            !body.email ||
            !body.password
        ) {
            return NextResponse.json(
                {
                    message:
                        "Le prénom, le nom, l'email et le mot de passe sont obligatoires.",
                },
                { status: 400 }
            );
        }

        if (!body.roleId) {
            return NextResponse.json(
                {
                    message: "Veuillez sélectionner un rôle.",
                },
                { status: 400 }
            );
        }

        // ===============================
        // Vérifier que le rôle existe
        // ===============================

        const { data: role, error: roleCheckError } = await supabaseAdmin
            .from("roles")
            .select("id")
            .eq("id", body.roleId)
            .single();

        if (roleCheckError || !role) {
            return NextResponse.json(
                {
                    message: "Le rôle sélectionné est invalide.",
                },
                { status: 400 }
            );
        }

        // ===============================
        // Création du compte Auth
        // ===============================

        const { data: authData, error: authError } =
            await supabaseAdmin.auth.admin.createUser({
                email: body.email,
                password: body.password,
                email_confirm: true,
                user_metadata: {
                    first_name: body.first_name,
                    last_name: body.last_name,
                },
            });

        if (authError) {
            return NextResponse.json(
                {
                    message: authError.message,
                },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                {
                    message: "Impossible de créer l'utilisateur.",
                },
                { status: 400 }
            );
        }

        authUserId = authData.user.id;

        // ===============================
        // Création du profil
        // ===============================

        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .insert({
                id: authUserId,
                first_name: body.first_name,
                last_name: body.last_name,
                professional_email: body.email,
                full_name: `${body.first_name} ${body.last_name}`,
                phone: body.phone,
                department: body.department,
                status: body.status,
            });

        if (profileError) {
            console.error("PROFILE ERROR:", profileError);
            throw profileError;
        }

        // ===============================
        // Attribution du rôle
        // ===============================

        const { error: userRoleError } = await supabaseAdmin
            .from("user_roles")
            .insert({
                user_id: authUserId,
                role_id: body.roleId,
            });

        if (userRoleError) {
            console.error("USER ROLE ERROR:", userRoleError);
            throw userRoleError;
        }

        const { error: brandError } = await supabaseAdmin
            .from("user_scopes")
            .insert(
                body.brandIds.map((brandId) => ({
                    user_id: authUserId,
                    brand_id: brandId,
                }))
            );

        if (brandError) {
            console.error("BRAND ERROR:", brandError);
            throw brandError;
        }

        // ===============================
        // Succès
        // ===============================

        return NextResponse.json(
            {
                success: true,
                message: "Utilisateur créé avec succès.",
                userId: authUserId,
            },
            {
                status: 201,
            }
        );
    } catch (error: any) {

        console.error("CREATE USER ERROR:", error);

        if (authUserId) {
            await supabaseAdmin.auth.admin.deleteUser(authUserId);
        }

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Erreur lors de la création de l'utilisateur.",
                details: error?.details,
                hint: error?.hint,
                code: error?.code,
            },
            {
                status: 500,
            }
        );
    }
}