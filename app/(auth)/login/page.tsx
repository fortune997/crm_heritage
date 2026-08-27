"use client"

import { LoginForm } from "@/components/forms/LoginForm";
import AuthHeader from "@/components/shared/AuthHeader";


const LoginPage = () => {
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

export default LoginPage