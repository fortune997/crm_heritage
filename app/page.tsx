"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import supabase from "@/core/lib/supabase";

// core/types/auth.type.ts

export type Role = {
  id: string;
  name: string;
  label: string | null;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
  updated_at: string | null;
};

export type CompanyMemberWithRole = {
  id: string;
  profile_id: string;
  company_id: string | null;
  role_id: string;
  department_id: string | null;
  access_scope: "global" | "company";
  status: "active" | "inactive" | "suspended";
  job_title: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string | null;
  roles: Role | null;
};







type MemberWithRole = {
  id: string;
  profile_id: string;
  company_id: string | null;
  role_id: string;
  department_id: string | null;
  access_scope: "global" | "company";
  status: "active" | "inactive" | "suspended";
  roles: {
    id: string;
    name: string;
    label: string | null;
  } | null;
};

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("Vérification de votre session...");

  useEffect(() => {
    const checkAuthAndRedirect = async () => {


      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      setMessage("Vérification de vos accès...");

      const { data, error } = await supabase
        .from("company_members")
        .select(`
          id,
          profile_id,
          company_id,
          role_id,
          department_id,
          access_scope,
          status,
          roles:role_id (
            id,
            name,
            label
          )
        `)
        .eq("profile_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error || !data) {
        router.replace("/login");
        return;
      }

      const member = data as unknown as MemberWithRole;

      const isSuperAdmin =
        member.roles?.name === "SUPER_ADMIN" &&
        member.access_scope === "global" &&
        member.status === "active";

      if (isSuperAdmin) {
        router.replace("/admin");
        return;
      }

      router.replace("/user/profile");
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-heritage-green/10 text-heritage-green">
          <Loader2 className="size-6 animate-spin" />
        </div>

        <div>
          <h1 className="text-lg font-semibold">Redirection en cours</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}