"use client";

import type * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

import { useSidebarData } from "@/core/utils/const/nav-item-sidebar";
import { TeamSwitcher } from "./TeamsWitcher";
import { NavUser } from "./NavUser";
import { NavMain } from "./NavMain";
import { useAuth } from "@/contexts/AuthContext";


function SidebarSkeleton() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="h-10 rounded-md bg-muted animate-pulse" />
            </SidebarHeader>

            <SidebarContent className="space-y-3 p-3">
                <div className="h-8 rounded-md bg-muted animate-pulse" />
                <div className="h-8 rounded-md bg-muted animate-pulse" />
                <div className="h-8 rounded-md bg-muted animate-pulse" />
            </SidebarContent>

            <SidebarFooter>
                <div className="h-10 rounded-md bg-muted animate-pulse" />
            </SidebarFooter>
        </Sidebar>
    );
}


export function AppSidebar(
    { ...props }: React.ComponentProps<typeof Sidebar>
) {

    const { loading } = useAuth();

    const dataSidebar = useSidebarData();


    if (loading) {
        return <SidebarSkeleton />;
    }


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={dataSidebar.teams} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={dataSidebar.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}