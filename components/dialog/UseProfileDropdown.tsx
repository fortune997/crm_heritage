"use client";

import { useRouter } from "next/navigation";
import {
    ChevronDown,
    LogOut,
    Settings,
    User,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { createClient } from "@/lib/config/supabase";
import { HeritageUser } from "@/core/types/profiles";


type UserProfileDropdownProps = {
    profile: HeritageUser | null;
};

export function getInitials(name?: string | null) {
    if (!name?.trim()) {
        return "U";
    }

    return name
        .trim()
        .split(/\s+/)
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function UserProfileDropdown({
    profile,
}: UserProfileDropdownProps) {
    const router = useRouter();
    const supabase = createClient();

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error("Déconnexion impossible", {
                description: error.message,
            });
            return;
        }

        toast.success("Déconnexion réussie");

        router.replace("/login");
        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="ghost"
                    className="flex h-11 items-center gap-3 rounded-xl px-2"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={profile?.avatar_url ?? ""}
                            alt={profile?.full_name ?? "Utilisateur"}
                        />

                        <AvatarFallback className="bg-green-100 text-green-700">
                            {getInitials(profile?.full_name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden text-left md:block">
                        <p className="max-w-[140px] truncate text-sm font-medium">
                            {profile?.full_name ?? "Utilisateur"}
                        </p>

                        <p className="max-w-[140px] truncate text-xs text-muted-foreground">
                            {profile?.first_name ?? "Mon compte"}
                        </p>
                    </div>

                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-72"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11">
                                <AvatarImage
                                    src={profile?.avatar_url ?? ""}
                                    alt={profile?.full_name ?? "Utilisateur"}
                                />

                                <AvatarFallback className="bg-green-100 text-green-700">
                                    {getInitials(profile?.full_name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {profile?.full_name ?? "Utilisateur"}
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                    {profile?.phone ??
                                        "Téléphone non renseigné"}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() =>
                        router.push("/users/settings")
                    }
                >
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        router.push("/users/settings")
                    }
                >
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        router.push(
                            "/admin/roles"
                        )
                    }
                >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Rôles et accès
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}