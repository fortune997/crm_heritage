import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () =>
    createBrowserClient(
        "https://etmatyqawktbyaezzcks.supabase.co",
        "sb_publishable_l_VCQcY9gVzG4xlx4Tvelg_cn5bQLhd"
    );