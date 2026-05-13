
import supabase from "@/core/lib/supabase";
import { toast } from "sonner";
import { ZFormSchemaEmploye, type EmployeFormValues } from "@/core/lib/schema";
import { uploadFile } from "@/core/lib/upload-file";
import { PasswordPayload } from "../hooks/useEmploye";


// Récuperer tout les profiles
const fetchEmploye = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq("isActive", true).order('prenom', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

const fetchResponsableDepartement = async () => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("isActive", true)
        .or("poste.ilike.Responsable%, poste.ilike.Chef%")
        .order("prenom", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};


const fetchEmployeByNom = async (employeNom: string) => {
    if (!employeNom) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('nom', employeNom).single();
    if (error) throw new Error(error.message);
    return data;
}

const fetchEmployeById = async (id: string) => {
    if (!id) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
}


async function addEmployee(formData: EmployeFormValues) {
    const toastId = toast.loading("Ajout de l'employé en cours...");

    try {
        const validatedData = ZFormSchemaEmploye.parse(formData);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: process.env.SUPABASE_PASSWORD_SIGNUP || "BuildT2@05",
        });

        if (authError || !authData.user) {
            throw new Error(`Erreur d'inscription: ${authError?.message || "Utilisateur non créé"}`);
        }

        const userId = authData.user.id;

        const employeeData = {
            nom: validatedData.nom,
            prenom: validatedData.prenom,
            email: validatedData.email,
            telephone: validatedData.telephone,
            telephone_professionnel_mtn: validatedData.telephone_professionnel_mtn,
            telephone_professionnel_orange: validatedData.telephone_professionnel_orange,
            adresse: validatedData.adresse,
            poste: validatedData.poste,
            departement: validatedData.departement,
            statut: validatedData.statut,
            salaire: validatedData.salaire,
            date_embauche: validatedData.date_embauche.toISOString(),
            nom_urgence: validatedData.nom_urgence,
            prenom_urgence: validatedData.prenom_urgence,
            lien_parente: validatedData.lien_parente,
            telephone_urgence: validatedData.telephone_urgence,
            photo_url: "",
            cv_url: "",
            diplome_url: "",
            plan_localisation_url: "",
            cni_url: "",
        };

        if (validatedData.photo) {
            toast.loading("Upload de la photo...", { id: toastId });
            employeeData.photo_url = await uploadFile(validatedData.photo as File, "avatars", "photo");
        }
        if (validatedData.cv) {
            toast.loading("Upload du CV...", { id: toastId });
            employeeData.cv_url = await uploadFile(validatedData.cv as File, "cv", "cv");
        }
        if (validatedData.diplome) {
            toast.loading("Upload du diplôme...", { id: toastId });
            employeeData.diplome_url = await uploadFile(validatedData.diplome as File, "diplome", "diplome");
        }
        if (validatedData.plan_localisation) {
            toast.loading("Upload du plan de localisation...", { id: toastId });
            employeeData.plan_localisation_url = await uploadFile(validatedData.plan_localisation as File, "localisation", "plan_localisation");
        }
        if (validatedData.cni) {
            toast.loading("Upload de la CNI...", { id: toastId });
            employeeData.cni_url = await uploadFile(validatedData.cni as File, "cni", "cni");
        }

        toast.loading("Insertion en base de données...", { id: toastId });

        const { data: inserted, error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: userId, ...employeeData, user_id: authData.user.id }])
            .select()
            .single();

        if (insertError) {
            throw new Error(`Erreur BDD : ${insertError.message}`);
        }

        toast.success("Employé ajouté avec succès ✅", { id: toastId });

        return {
            success: true,
            message: "Employé ajouté avec succès.",
            employee: inserted,
        };
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur inconnue lors de l'ajout ❌", { id: toastId });

        return {
            success: false,
            message: error instanceof Error ? error.message : "Erreur inconnue lors de l'ajout.",
        };
    }
}

const updatePassord = async ({ email, currentPassword, newPassword }: PasswordPayload) => {
    // Étape 1 : re-authentification
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email, password: currentPassword });

    if (signInError) {
        return { success: false, message: "Mot de passe actuel incorrect." };
    }

    // Étape 2 : mise à jour du mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) {
        return { success: false, message: "Erreur lors de la mise à jour du mot de passe." };
    }

    return { success: true, message: "Mot de passe mis à jour avec succès !" };
};

const updateEmploye = async ({ id, employeData, }: { id: string; employeData: EmployeFormValues; }) => {
    try {
        const getUrl = async (
            file: File | string | null | undefined,
            bucket: string,
            name: string
        ): Promise<string | null> => {
            if (!file) return null;
            if (typeof file === "string") return file; // déjà une URL
            return await uploadFile(file, bucket, name);
        };

        const photo_url = await getUrl(employeData.photo, "avatars", "photo");
        const cv_url = await getUrl(employeData.cv, "cv", "cv");
        const diplome_url = await getUrl(employeData.diplome, "diplome", "diplome");
        const plan_localisation_url = await getUrl(employeData.plan_localisation, "localisation", "plan_localisation");
        const cni_url = await getUrl(employeData.cni, "cni", "cni");

        const employeeDataToUpdate = {
            nom: employeData.nom,
            prenom: employeData.prenom,
            email: employeData.email,
            telephone: employeData.telephone,
            telephone_professionnel_mtn: employeData.telephone_professionnel_mtn,
            telephone_professionnel_orange: employeData.telephone_professionnel_orange,
            adresse: employeData.adresse,
            poste: employeData.poste,
            departement: employeData.departement,
            statut: employeData.statut,
            salaire: employeData.salaire,
            date_embauche: employeData.date_embauche.toISOString(),
            nom_urgence: employeData.nom_urgence,
            prenom_urgence: employeData.prenom_urgence,
            lien_parente: employeData.lien_parente,
            telephone_urgence: employeData.telephone_urgence,
            photo_url,
            cv_url,
            diplome_url,
            plan_localisation_url,
            cni_url,
        };

        const { data, error } = await supabase
            .from("profiles")
            .update(employeeDataToUpdate)
            .eq("id", id);

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la mise à jour de l'employé.");
    }
};



const deleteEmployeById = async (id: string) => {

    const { data, error } = await supabase
        .from("profiles")
        .select("poste")
        .eq("id", id)
        .single();

    if (error) throw error;

    // Si le poste est "Chargée commerciale"
    if (data.poste === "Chargée commerciale") {
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ isActive: false })
            .eq("id", id);

        if (updateError) throw updateError;
        return { message: "Employé désactivé (Chargé commercial)" };
    }



    const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

    if (deleteError) throw deleteError;

    return { message: "Employé supprimé définitivement" };
}

const fetchTotalEmployes = async (): Promise<number> => {
    const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);
    return count || 0;
};

const fetchSalaireTotal = async (): Promise<number> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("salaire");

    if (error) throw new Error(error.message);

    const total = data?.reduce((acc, emp) => acc + (emp.salaire || 0), 0) ?? 0;
    return total;
};


async function getProfilesCountByDepartment(departement: string) {
    const { error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('departement', departement);

    if (error) {
        throw new Error(error.message);
    }

    return count || 0;
}

// Récuperer tout les commerciaux

const fetchAllCommerciaux = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('poste', ['Commerciale', 'Call Center', 'Chargée Commerciale', 'Responsable Commerciale', 'Responsable Produit', 'Customer Experience Manager'])
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Erreur lors de la récupération des commerciaux :', error);
        return [];
    }

    return data;
}

// Liste des Call center

const fetchAllCallCenter = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('poste', "Call Center")
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Erreur lors de la récupération des commerciaux :', error);
        return [];
    }

    return data;
}


// Récupère le nombre de prospects par employé (group by commercial_id)
const fetchProspectsCountByEmploye = async () => {
    const { data, error } = await supabase
        .from("prospects_count_by_commercial")
        .select("commercial_id, count");

    if (error) throw new Error(error.message);
    return data; // [{ commercial_id: "xxx", count: 5 }, ...]
};


// Recuperer tout les employe grâce à leur poste
const fetchEmployeByPoste = async (poste: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('poste', poste);
    if (error) throw new Error(error.message);
    return data;
}


export {
    fetchEmploye,
    fetchEmployeByNom,
    addEmployee,
    updatePassord,
    updateEmploye,
    deleteEmployeById,
    fetchTotalEmployes,
    fetchSalaireTotal,
    getProfilesCountByDepartment,
    fetchAllCommerciaux,
    fetchProspectsCountByEmploye,
    fetchEmployeByPoste,
    fetchEmployeById,
    fetchAllCallCenter,
    fetchResponsableDepartement
}

