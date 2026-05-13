


// lib/config/server.ts

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
        "https://etmatyqawktbyaezzcks.supabase.co",
        "sb_publishable_l_VCQcY9gVzG4xlx4Tvelg_cn5bQLhd",
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },

                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Normal dans certains Server Components.
                        // Le middleware s'occupera de rafraîchir la session.
                    }
                },
            },
        }
    );
}