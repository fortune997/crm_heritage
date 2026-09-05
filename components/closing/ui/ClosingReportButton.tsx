"use client";

import { useState } from "react";

import {
    Download,
    Eye,
    FileText,
    Loader2,
} from "lucide-react";

import { toast } from "sonner";

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
    generateClosingReportPdf,
    type ClosingReportMode,
} from "@/core/lib/pdf/generateClosingReportPdf";

import type {
    ClosingCase,
} from "@/core/types/closing";


// ============================================================
// PROPS
// ============================================================

interface ClosingReportButtonProps {
    closingCases: ClosingCase[];
    disabled?: boolean;
}


// ============================================================
// COMPOSANT
// ============================================================

export function ClosingReportButton({
    closingCases,
    disabled = false,
}: ClosingReportButtonProps) {
    const [
        generatingMode,
        setGeneratingMode,
    ] = useState<ClosingReportMode | null>(
        null
    );

    function handleGenerate(
        mode: ClosingReportMode
    ) {
        if (closingCases.length === 0) {
            toast.error(
                "Aucun dossier à exporter."
            );

            return;
        }

        try {
            setGeneratingMode(mode);

            generateClosingReportPdf({
                closingCases,
                mode,
                reportTitle:
                    "Rapport décisionnel du Closing",
            });

            toast.success(
                mode === "download"
                    ? "Le rapport PDF a été téléchargé."
                    : "Le rapport PDF a été ouvert."
            );
        } catch (error: unknown) {
            console.error(
                "Erreur génération PDF :",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Impossible de générer le rapport PDF.";

            toast.error(message);
        } finally {
            setGeneratingMode(null);
        }
    }

    const isGenerating =
        generatingMode !== null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                
            >
                <Button
                    type="button"
                    variant="outline"
                    disabled={
                        disabled ||
                        isGenerating ||
                        closingCases.length === 0
                    }
                >
                    {isGenerating ? (
                        <Loader2
                            className="
                                size-4 animate-spin
                            "
                        />
                    ) : (
                        <FileText className="size-4" />
                    )}

                    Rapport PDF
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56"
            >
                <DropdownMenuGroup>
                <DropdownMenuLabel>
                    Rapport décisionnel
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        handleGenerate(
                            "preview"
                        );
                    }}
                >
                    {generatingMode ===
                    "preview" ? (
                        <Loader2
                            className="
                                size-4 animate-spin
                            "
                        />
                    ) : (
                        <Eye className="size-4" />
                    )}

                    Afficher le PDF
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        handleGenerate(
                            "download"
                        );
                    }}
                >
                    {generatingMode ===
                    "download" ? (
                        <Loader2
                            className="
                                size-4 animate-spin
                            "
                        />
                    ) : (
                        <Download className="size-4" />
                    )}

                    Télécharger le PDF
                </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}