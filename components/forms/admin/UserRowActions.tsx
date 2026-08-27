"use client";

import {
    Eye,
    MoreHorizontal,
    Pencil,
    ShieldCheck,
    Lock,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeritageUser } from "./CreateUserDialog";


type Props = {
    user: HeritageUser;

    onView: (
        user: HeritageUser
    ) => void;

    onEdit: (
        user: HeritageUser
    ) => void;
};

export function UserRowActions({
    user,
    onView,
    onEdit,
}: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() =>
                        onView(user)
                    }
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir le profil
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        onEdit(user)
                    }
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Gérer les rôles
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Lock className="mr-2 h-4 w-4" />
                    Suspendre
                </DropdownMenuItem>

                <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}