import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

type SubscribePayload = {
    profileId: string;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SubscribePayload;

        if (!body.profileId || !body.subscription?.endpoint) {
            return NextResponse.json(
                { message: "Données de subscription invalides." },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("push_subscriptions")
            .upsert(
                {
                    profile_id: body.profileId,
                    endpoint: body.subscription.endpoint,
                    p256dh: body.subscription.keys.p256dh,
                    auth: body.subscription.keys.auth,
                    user_agent: request.headers.get("user-agent"),
                    is_active: true,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "profile_id,endpoint",
                }
            );

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: "Notifications activées.",
        });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de l’activation des notifications.",
            },
            { status: 500 }
        );
    }
}