import { LoginForm } from "@/components/forms/LoginForm";
import AuthHeader from "@/components/shared/AuthHeader";


export default function LoginPage() {
    return (
        <>
            <AuthHeader
                title="Connexion"
                description="Connectez-vous pour accéder à votre espace CRM Heritage."
            />

            <LoginForm />
        </>
    );
}