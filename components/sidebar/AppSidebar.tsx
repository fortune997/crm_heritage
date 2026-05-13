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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const dataSidebar = useSidebarData();

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