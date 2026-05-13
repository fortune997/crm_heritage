"use client"

import * as React from "react"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string
        logo: React.ElementType
        plan: string
    }[]
}) {
    const [activeTeam, setActiveTeam] = React.useState(teams[0])

    if (!activeTeam) {
        setActiveTeam(teams[0])
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger >
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">

                                <Image
                                    src={'/images/heritage-logo.jpg'}
                                    alt="logo"
                                    width={100}
                                    height={100}
                                    className="w-fit h-fit object-cover"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm border border-red-400 leading-tight">
                                <span className="truncate font-semibold">{activeTeam.name}</span>
                                <span className="truncate text-xs">{activeTeam.plan}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

