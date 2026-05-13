import supabase from "../lib/supabase";
import { TApplication, TJob } from "../types/recrutement";

// ✅ Récupérer tous les jobs publiés
export const fetchJobs = async (): Promise<TJob[]> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    // .eq("status", "Publié")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Erreur lors du chargement des emplois :", error.message);
    throw new Error(error.message);
  }

  return data || [];
};

// ✅ Récupérer un job par slug
export const fetchJobsBySlug = async (slug: string): Promise<TJob | null> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .single(); // ✅ garantit qu'on récupère un seul objet

  if (error) {
    console.error("❌ Erreur lors du chargement de l'emploi :", error.message);
    throw new Error(error.message);
  }

  return data;
};

// ✅ Récupérer tous les candidatures
export const fetchApplicationJobs = async (): Promise<TApplication[]> => {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    // .eq("status", "Publié")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Erreur lors du chargement des candidatures :", error.message);
    throw new Error(error.message);
  }

  return data || [];
};

// Ajouter une nouvelle candidature
export const addApplication = async (application: TApplication) => {
  const { data, error } = await supabase
    .from("job_applications")
    .insert([application])
    .select()
    .single();

  if (error) {
    console.error(
      "❌ Erreur lors de l'ajout de la candidature :",
      error.message
    );
    throw new Error(error.message);
  }

  return data;
};
