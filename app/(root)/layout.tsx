import Navbar from "@/components/shared/Navbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "CRM - HERITAGE",
    description: "Page de connexion du CRM Heritage",
};

export default function DashBoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                {/*  <BackgroundGradient /> */}
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 relative z-10">
                    <Navbar />
                </header>
                <div className="flex flex-1 flex-col gap-4  md:px-6 pt-5 relative z-10">
                    <div>{children}</div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}