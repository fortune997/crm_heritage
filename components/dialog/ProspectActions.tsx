"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { TProspects } from "@/core/types/prospects";
import { useDeleteProspect } from "@/core/hooks/prospects/useProspect";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ProspectForm } from "../forms/ProspectForm";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

type ProspectActionsProps = {
    prospect: TProspects;
};

const ProspectActions = ({
    prospect,
}: ProspectActionsProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const [prospectToDelete, setProspectToDelete] =
        useState<TProspects | null>(null);

    const {
        mutateAsync: removeProspect,
    } = useDeleteProspect();

    const handleOpenDeleteModal = () => {
        // Fermer d’abord le DropdownMenu
        setMenuOpen(false);

        // Ouvrir ensuite la modale
        window.setTimeout(() => {
            setProspectToDelete(prospect);
        }, 0);
    };

    const handleConfirmDelete = async () => {
        if (!prospectToDelete) return;

        await removeProspect(prospectToDelete.id);
    };

    return (
        <>
            <div className="flex justify-end">
                <DropdownMenu
    modal={false}
    open={menuOpen}
    onOpenChange={setMenuOpen}
>
                    <DropdownMenuTrigger>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label="Actions du prospect"
                        >
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-44"
                    >
                        <DropdownMenuGroup className="flex flex-col">
                            <DropdownMenuLabel>
                                Actions
                            </DropdownMenuLabel>

                            <DropdownMenuItem>
                                <Link
                                    href={`/marketing/prospects/${prospect.id}`}
                                    className="w-full cursor-pointer"
                                >
                                    Voir
                                </Link>
                            </DropdownMenuItem>

                            <ProspectForm
                                prospect={prospect}
                                type="edit"
                                trigger={
                                    <button
                                        type="button"
                                        className="
                                            flex w-full cursor-pointer
                                            items-center rounded-sm
                                            px-2 py-1.5 text-sm
                                            outline-none transition-colors
                                            hover:bg-accent
                                            hover:text-accent-foreground
                                        "
                                    >
                                        <Edit className="mr-2 size-4" />
                                        Modifier
                                    </button>
                                }
                                submitLabel="Modifier"
                            />

                            <DropdownMenuSeparator />
 <DropdownMenu modal={false}>
    {/* ... */}

    <DeleteConfirmationModal
        item={prospect.full_name}
        title="Supprimer le prospect"
        description="Cette action supprimera définitivement ce prospect."
        onConfirm={async () => {
            await removeProspect(prospect.id);
        }}
        trigger={
            <button
                type="button"
                className="
                    flex w-full cursor-pointer items-center
                    rounded-sm px-2 py-1.5 text-sm
                    text-red-600 outline-none
                    transition-colors
                    hover:bg-accent
                    focus:bg-accent
                "
            >
                <Trash2 className="mr-2 size-4" />
                Supprimer
            </button>
        }
    />
</DropdownMenu>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

           
        </>
    );
};

export default ProspectActions;