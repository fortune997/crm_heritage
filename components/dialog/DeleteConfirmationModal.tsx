"use client";

import { ReactNode, useState } from "react";
import {
    AlertTriangle,
    Loader2,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteConfirmationModalProps = {
    title?: string;
    description?: string;
    item?: string | null;
    trigger: ReactNode;
    onConfirm: () => Promise<void>;
};

export function DeleteConfirmationModal({
    item,
    trigger,
    title = "Confirmer la suppression",
    description = "Cette action est irréversible.",
    onConfirm,
}: DeleteConfirmationModalProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            await onConfirm();

            // Fermer après une suppression réussie
            setOpen(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Impossible de supprimer cet élément.";

            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(value) => {
                if (!isDeleting) {
                    setOpen(value);
                }
            }}
        >
            <AlertDialogTrigger >
                {trigger}
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                        <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                    </div>

                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}

                        {item && (
                            <>
                                {" "}
                                Vous êtes sur le point de supprimer{" "}
                                <strong className="text-foreground">
                                    {item}
                                </strong>
                                .
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isDeleting}
                    >
                        Annuler
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDelete}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 size-4" />
                                Supprimer
                            </>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}