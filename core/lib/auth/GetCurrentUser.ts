import supabase from "../supabase";


export async function getCurrentUser() {


    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select(`
      id,
      full_name,
      professional_email,
      poste,
      status,
      company_members (
        id,
        access_scope,
        status,
        roles (
          name,
          role_permissions (
            permissions (
              key
            )
          )
        )
      )
    `)
        .eq("id", user.id)
        .single();

    if (error || !data) {
        return null;
    }

    const activeMember = data.company_members?.find(
        (member: any) => member.status === "active"
    );

    const role = Array.isArray(activeMember?.roles)
        ? activeMember?.roles[0]
        : activeMember?.roles;

    const permissions =
        role?.role_permissions?.map((rp: any) => rp.permissions?.key).filter(Boolean) ?? [];

    return {
        id: data.id,
        full_name: data.full_name,
        professional_email: data.professional_email,
        poste: data.poste,
        status: data.status,
        role: role?.name ?? null,
        permissions,
        access_scope: activeMember?.access_scope ?? null,
    };
}