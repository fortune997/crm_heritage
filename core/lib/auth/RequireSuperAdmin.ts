import { requireAuth } from "./RequireAuth";


export async function requireSuperAdmin() {
    const { supabase, user, profile } = await requireAuth();

    const { data: member, error } = await supabase
        .from("company_members")
        .select(`
      id,
      access_scope,
      status,
      roles (
        name
      )
    `)
        .eq("profile_id", user.id)
        .eq("access_scope", "global")
        .single();

    if (error || !member) {
        throw new Error("Access denied");
    }

    const roleName = member.roles?.[0]?.name

    if (member.status !== "active" || roleName !== "SUPER_ADMIN") {
        throw new Error("Access denied");
    }

    return {
        supabase,
        user,
        profile,
        member,
    };
}