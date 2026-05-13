"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import type { LucideIcon } from "lucide-react";
import type { TPermissionName } from "@/core/types/type";

export type SidebarSubItem = {
    title: string;
    url: string;
    requiredPermissions?: TPermissionName[];
};

export type SidebarItem = {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    requiredPermissions?: TPermissionName[];
    items?: SidebarSubItem[];
};

export type SidebarConfig = {
    teams: {
        name: string;
        logo: LucideIcon;
        plan: string;
    }[];
    navMain: SidebarItem[];
};

export function NavMain({ items }: { items: SidebarItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Menu de navigation
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 space-y-1">
                {items.map((item) => {
                    const hasSubItems = Boolean(item.items?.length);
                    const Icon = item.icon;

                    if (!hasSubItems) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton

                                    tooltip={item.title}
                                    className="
                    h-10 rounded-lg px-3
                    text-sm font-medium
                    transition-all duration-200
                    hover:bg-muted hover:text-foreground
                    data-[active=true]:bg-primary/10
                    data-[active=true]:text-primary
                  "
                                    isActive={item.isActive}
                                >
                                    <Link href={item.url ?? "#"} className="flex items-center gap-3">
                                        {Icon && <Icon className="size-4 shrink-0" />}
                                        <span className="truncate">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger >
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className="
                      h-10 w-full rounded-lg px-3
                      text-sm font-medium
                      transition-all duration-200
                      hover:bg-muted hover:text-foreground
                      data-[state=open]:bg-muted
                    "
                                        isActive={item.isActive}
                                    >
                                        <div className="flex w-full items-center gap-3">
                                            {Icon && <Icon className="size-4 shrink-0" />}

                                            <span className="truncate">{item.title}</span>

                                            <ChevronRight
                                                className="
                          ml-auto size-4 shrink-0
                          text-muted-foreground
                          transition-transform duration-200
                          group-data-[state=open]/collapsible:rotate-90
                        "
                                            />
                                        </div>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent
                                    className="
                    overflow-hidden
                    data-[state=closed]:animate-collapsible-up
                    data-[state=open]:animate-collapsible-down
                  "
                                >
                                    <SidebarMenuSub className="ml-4 mt-1 border-l border-border/60 pl-3">
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton

                                                    className="
                            h-8 rounded-md px-3
                            text-sm text-muted-foreground
                            transition-all duration-200
                            hover:bg-muted hover:text-foreground
                          "
                                                >
                                                    <Link href={subItem.url}>
                                                        <span className="truncate">{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}