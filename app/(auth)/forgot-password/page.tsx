

export default function ForgotPasswordPage() {
    return (
        <>
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Mot de passe oublié
                </h1>

                <p className="mt-4 text-base text-muted-foreground">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>
            </div>

            {/* ForgotPasswordForm ici */}
        </>
    );
}