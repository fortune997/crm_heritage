import { CompanyCreateForm } from "@/components/forms/admin/CreateCompanyForm";


export default function CreateCompanyPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-6">
            <div>
                <p className="text-sm text-muted-foreground">
                    Admin / Entreprises / Nouvelle entreprise
                </p>

                <h1 className="text-2xl font-semibold tracking-tight">
                    Créer une entreprise
                </h1>

                <p className="text-sm text-muted-foreground">
                    Configurez les informations de base d’une entreprise de la holding.
                </p>
            </div>

            <CompanyCreateForm />
        </div>
    );
}