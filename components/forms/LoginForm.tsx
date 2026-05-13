"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { LoginFormValues, loginSchema } from "@/lib/validations/schema";
import router from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function LoginForm() {
    const router = useRouter();
    const { signIn } = useAuth();


    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: LoginFormValues): Promise<void> {
        setAuthError(null);

        console.log(values)
        try {
            setLoading(true);
            const result = await signIn(values.email, values.password);
            console.log(result)


            if (result.success) {
                toast.success("Connexion réussie 🎉");
                router.push(`/admin/companies`);
            } else {
                if (result.error === "AuthApiError: Invalid login credentials") {
                    toast.error("Adresse email ou mot de passe incorrect 🚫");
                }
                if (result.error === "AuthApiError: Email not confirmed") {
                    toast.error("Vous n'avez pas encore confirmé votre email", {
                        description:
                            "Veuillez vous rendre dans la messagerie que vous avez choisie pour vérifier votre adresse",
                    });
                }
                // Optionnel : gérer d'autres erreurs ici
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(
                    "Erreur inattendue lors de la connexion ❌ " + error.message
                );
            } else {
                toast.error("Erreur inattendue lors de la connexion ❌");
            }
        } finally {
            setLoading(false);
        }



    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {authError ? (
                <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                </Alert>
            ) : null}

            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Adresse email</FieldLabel>

                            <Input
                                {...field}
                                id={field.name}
                                type="email"
                                placeholder="exemple@heritage.com"
                                autoComplete="email"
                                aria-invalid={fieldState.invalid}
                            />

                            {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                            ) : null}
                        </Field>
                    )}
                />

                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>

                            <div className="relative">
                                <Input
                                    {...field}
                                    id={field.name}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Votre mot de passe"
                                    autoComplete="current-password"
                                    aria-invalid={fieldState.invalid}
                                    className="pr-11"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label={
                                        showPassword
                                            ? "Masquer le mot de passe"
                                            : "Afficher le mot de passe"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>

                            {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                            ) : null}
                        </Field>
                    )}
                />

                <Controller
                    name="rememberMe"
                    control={form.control}
                    render={({ field }) => (
                        <Field orientation="horizontal">
                            <Checkbox
                                id="rememberMe"
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                            />

                            <FieldContent>
                                <FieldLabel
                                    htmlFor="rememberMe"
                                    className="cursor-pointer font-normal"
                                >
                                    Se souvenir de moi
                                </FieldLabel>
                            </FieldContent>
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-heritage-green text-white hover:bg-heritage-green-dark"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Connexion...
                    </>
                ) : (
                    "Se connecter"
                )}
            </Button>
        </form>
    );
}