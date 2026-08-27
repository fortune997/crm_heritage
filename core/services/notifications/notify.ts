import { createClient } from "@supabase/supabase-js";


type NotificationInput = {
    profileId: string;
    title: string;
    body: string;
    type: string;
    entityType?: string;
    entityId?: string;
    url?: string;
};

/* const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
); */

/* export async function notify(input: NotificationInput) {

    // 1. Sauvegarde en base
    await supabaseAdmin
        .from("notifications")
        .insert({
            profile_id: input.profileId,
            title: input.title,
            body: input.body,
            type: input.type,
            entity_type: input.entityType,
            entity_id: input.entityId,
            url: input.url,
        });

    // 2. Envoi Push
    await sendPushNotificationToProfile({
        profileId: input.profileId,
        title: input.title,
        body: input.body,
        url: input.url,
    });
} */