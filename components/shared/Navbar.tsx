"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellDot, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";





export default function Navbar() {
    const { signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);



    return (
        <>
            {/* Progress bar */}
            {isLoading && (
                <Progress
                    value={progress}
                    className="h-1 absolute top-0 left-0 right-0 z-50 rounded-none"
                />
            )}

            <div className="w-full backdrop-blur-xl shadow-sm z-10">
                <div className="flex h-14 items-center px-4 justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-2 flex-1">
                        <SidebarTrigger />
                        <div className="flex-1 max-w-md">
                            {/* <CommandSearch /> */}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Date and time 
            <ClockTimer />*/}

                        {/* Actions 
            <BtnFullScreen />*/}
                        {/* <ThemeToggle /> */}
                        <BellDot className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        {/* <DropdownLegend /> */}

                        <Button variant="ghost" size="icon" title="Paramètres">
                            <Settings className="h-5 w-5 animate-spin" />
                            <span className="sr-only">Paramètres</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full"
                                >
                                    <Avatar className="h-10 w-10">
                                        {/*  <AvatarImage
                                            src={profile?.photo_url}
                                            alt={`photo`}
                                        /> */}
                                        <AvatarFallback>
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Mon Profil
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            dylanemempouza@gmail.com
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={"/users/setting"}>Mon Compte</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/users/setting"}>Paramètres</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </>
    );
}
