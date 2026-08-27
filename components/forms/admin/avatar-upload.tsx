"use client";

import {
    ChangeEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ImagePlus,
    Trash2,
    Upload,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface AvatarUploadProps {
    value?: File | null;
    initialUrl?: string;
    onChange: (file: File | null) => void;
    disabled?: boolean;
}

export function AvatarUpload({
    value,
    initialUrl,
    onChange,
    disabled = false,
}: AvatarUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>(
        initialUrl ?? null
    );

    useEffect(() => {
        if (!value) {
            setPreview(initialUrl ?? null);
            return;
        }

        const objectUrl = URL.createObjectURL(value);

        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [value, initialUrl]);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        onChange(file);
    };

    const handleRemove = () => {
        onChange(null);

        setPreview(initialUrl ?? null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* PREVIEW */}

            <div
                className={cn(
                    "relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-muted/40",
                    preview &&
                    "border-solid border-border"
                )}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Prévisualisation de la photo"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <UserRound className="h-12 w-12 text-muted-foreground" />
                )}
            </div>

            {/* ACTIONS */}

            <div className="space-y-3">
                <div>
                    <p className="text-sm font-medium">
                        Photo de profil
                    </p>

                    <p className="text-xs text-muted-foreground">
                        JPG, PNG ou WEBP. Taille recommandée :
                        400 × 400 px.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() =>
                            inputRef.current?.click()
                        }
                    >
                        {preview ? (
                            <ImagePlus className="mr-2 h-4 w-4" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}

                        {preview
                            ? "Changer la photo"
                            : "Ajouter une photo"}
                    </Button>

                    {preview && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={disabled}
                            onClick={handleRemove}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </Button>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={disabled}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}