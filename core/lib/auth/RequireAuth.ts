import { createSupabaseServerClient } from "@/lib/config/server";
import { redirect } from "next/navigation";
import supabase from "../supabase";

export async function requireAuth() {


    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    console.log("AUTH USER:", user);
    console.log("AUTH ERROR:", error);

    if (error || !user) {
        redirect("/login");
    }
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, professional_email, status")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        console.log("PROFILE ERROR:", profileError);
        throw new Error("Profile not found");
    }

    if (profile.status !== "active") {
        throw new Error("Account is not active");
    }

    return {
        supabase,
        user,
        profile,
    };
}