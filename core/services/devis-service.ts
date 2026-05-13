import supabase from "@/core/lib/supabase"
import { TDevis } from "../types/calineTypes";


// Upload de fichier vers Supabase Storage
const uploadPlanDocument = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `plans/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('devis_documents')
    .upload(filePath, file);

  if (uploadError) throw new Error(`Erreur upload: ${uploadError.message}`);

  // Récupérer l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('devis_documents')
    .getPublicUrl(filePath);

  return publicUrl;
};


export const fetchDevis = async () => {
  const { data, error } = await supabase
    .from('devis_conception')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message);

  return data

}

export const fetchDevisById = async(id: number) => {
  const {data, error } = await supabase
    .from('devis_conception')
    .select('*')
    .eq('id', id)
    .single();

    if (error) throw new Error(error.message)

     return data 
}


// Création d'un devis
export const createDevis = async (formData: FormData): Promise<TDevis> => {
  // Traitement des données du formulaire
  const nom = formData.get('nom') as string;
  const email = formData.get('email') as string || null;
  const telephone = formData.get('telephone') as string;
  const ville = formData.get('ville') as string;
  const quartier = formData.get('quartier') as string;
  const type_projet = formData.get('type_projet') as string;
  const budget_estime = parseFloat(formData.get('budget_estime') as string);
  const delai_souhaite = formData.get('delai_souhaite') as string;
  const description = formData.get('description') as string;
  const plan_batiment = formData.get('plan_batiment') === 'true';
  const planFile = formData.get('plan_documents') as File | null;

  let plan_documents: string | null = null;

  // Upload du fichier si présent
  if (planFile && planFile.size > 0) {
    try {
      plan_documents = await uploadPlanDocument(planFile);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      throw new Error("Impossible d'uploader le fichier");
    }
  }
  const dataForm = {
        nom,
        email,
        telephone,
        ville,
        quartier,
        type_projet,
        budget_estime,
        delai_souhaite,
        description,
        plan_batiment,
        plan_documents,
        status_demande: 'en_attente', // Statut par défaut
  }

  // Insertion dans la base de données
  const { data, error } = await supabase
    .from('devis_conception')
    .insert([dataForm])
    .select()
    .single();

  if (error) throw new Error(`Erreur insertion: ${error.message}`);
  return data;
};

// Mise à jour d'un devis
export const updateDevis = async ({ id, formData }: { id: string; formData: FormData }): Promise<TDevis> => {
  const updates: Partial<TDevis> = {};

  // Récupérer les champs à mettre à jour
  const fields = ['nom', 'email', 'telephone', 'ville', 'quartier', 'type_projet', 
                   'delai_souhaite', 'description', 'status_demande'];
  
  fields.forEach(field => {
    const value = formData.get(field);
    if (value !== null) {
      updates[field as keyof TDevis] = value as any;
    }
  });

  // Budget
  const budget = formData.get('budget_estime');
  if (budget !== null) {
    updates.budget_estime = parseFloat(budget as string);
  }

  // Plan batiment
  const planBatiment = formData.get('plan_batiment');
  if (planBatiment !== null) {
    updates.plan_batiment = planBatiment === 'true';
  }

  // Upload nouveau fichier si présent
  const planFile = formData.get('plan_documents') as File | null;
  if (planFile && planFile.size > 0) {
    updates.plan_documents = await uploadPlanDocument(planFile);
  }

  const { data, error } = await supabase
    .from('devis_conception')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erreur mise à jour: ${error.message}`);
  return data;
};

// Suppression d'un devis
export const deleteDevis = async (id: string): Promise<void> => {
  // Récupérer d'abord le devis pour avoir l'URL du fichier
  const { data: devis } = await supabase
    .from('devis_conception')
    .select('plan_documents')
    .eq('id', id)
    .single();

  // Supprimer le fichier du storage si présent
  if (devis?.plan_documents) {
    const filePath = devis.plan_documents.split('/').pop();
    if (filePath) {
      await supabase.storage
        .from('devis_documents')
        .remove([`plans/${filePath}`]);
    }
  }

  // Supprimer l'enregistrement
  const { error } = await supabase
    .from('devis_conception')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Erreur suppression: ${error.message}`);
};