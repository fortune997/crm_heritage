// app/(root)/unauthorized/page.tsx

import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="max-w-md rounded-xl border p-6 text-center">
                <h1 className="text-2xl font-bold">Accès refusé</h1>

                <p className="mt-2 text-muted-foreground">
                    Vous n’avez pas les permissions nécessaires pour accéder à cette page.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                    Retour à l’accueil
                </Link>
            </div>
        </div>
    );
}