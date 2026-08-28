"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


import { VisitDetailsDialog } from "./VisitDetailsDialog";
import { useConfirmVisit } from "@/core/hooks/visites/useVisite";
import { ProspectActivity } from "@/core/types/activities";
import { Visit } from "@/core/types/visites/type";



interface VisitActionsProps {
    visit: Visit;
}

export function VisitActions({
    visit,
}: VisitActionsProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);

    const { mutate, isPending } = useConfirmVisit();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                    >
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-52"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            Actions
                        </DropdownMenuLabel>

                        {visit.status === "planned" && (
                            <DropdownMenuItem
                                disabled={isPending}
                                onSelect={(event) => {
                                    event.preventDefault();

                                    mutate({
                                        id: visit.id,
                                    });
                                }}
                            >
                                <CheckCircle2 className="mr-2 size-4" />
                                {isPending
                                    ? "Confirmation..."
                                    : "Confirmer la visite"}
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault();
                                setDetailsOpen(true);
                            }}
                        >
                            <Eye className="mr-2 size-4" />
                            Voir les détails
                        </DropdownMenuItem>

                        <DropdownMenuItem >
                            <Link
                                href={`/activites/${visit.id}/edit`}
                            >
                                <Pencil className="mr-2 size-4" />
                                Modifier
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 size-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            Détails de la visite
                        </DialogTitle>
                    </DialogHeader>

                    <VisitDetailsDialog visit={visit} />
                </DialogContent>
            </Dialog>
        </>
    );
}