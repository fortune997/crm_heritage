

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/core/lib/auth/RequireSuperAdmin";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return <>{children}</>;
}