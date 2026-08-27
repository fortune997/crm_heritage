"use client";

import { useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
    Upload,
    Image as ImageIcon,
    FileText,
    Video,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type UploadBoxProps = {
    title: string;
    description: string;
    type: "image" | "video" | "file";
    multiple?: boolean;
    field: ControllerRenderProps<any, any>;
};

export function UploadBox({
    title,
    description,
    type,
    multiple = false,
    field,
}: UploadBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const Icon =
        type === "image"
            ? ImageIcon
            : type === "video"
                ? Video
                : FileText;

    const files = multiple
        ? (field.value as File[]) || []
        : field.value
            ? [field.value]
            : [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);

        if (multiple) {
            field.onChange(selected);
        } else {
            field.onChange(selected[0]);
        }
    };

    const removeFile = (index: number) => {
        if (multiple) {
            const copy = [...files];
            copy.splice(index, 1);
            field.onChange(copy);
        } else {
            field.onChange(undefined);
        }
    };

    return (
        <div className="rounded-2xl border p-4">
            <input
                ref={inputRef}
                hidden
                type="file"
                multiple={multiple}
                accept={
                    type === "image"
                        ? "image/*"
                        : type === "video"
                            ? "video/*"
                            : "*"
                }
                onChange={handleChange}
            />

            <div
                onClick={() => inputRef.current?.click()}
                className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-6 transition hover:bg-muted/50"
            >
                <div className="rounded-xl bg-background p-3 shadow">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="mt-3 font-semibold">{title}</h3>

                <p className="mt-1 text-center text-sm text-muted-foreground">
                    {description}
                </p>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Ajouter
                </Button>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-3">
                    {files.map((file, index) => {
                        const url = URL.createObjectURL(file);

                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-xl border"
                            >
                                {type === "image" && (
                                    <img
                                        src={url}
                                        alt=""
                                        className="h-40 w-full object-cover"
                                    />
                                )}

                                {type === "video" && (
                                    <video
                                        controls
                                        className="h-40 w-full object-cover"
                                    >
                                        <source src={url} />
                                    </video>
                                )}

                                {type === "file" && (
                                    <div className="flex items-center gap-3 p-4">
                                        <FileText />
                                        <span>{file.name}</span>
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}