import supabase from "@/core/lib/supabase";
import { TCategorie } from "../types/calineTypes";
import { uploadFileToSupabase } from "../lib/uploadFile";

const fetchCategories = async () => {
    const { data, error } = await supabase
        .from('categorie_bien')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Erreur fetch : ${error.message}`);

    return data;
};

const fetchCategoriesById = async (id : number) => {
  const { data, error } = await supabase.from('categorie_bien')
      .select('*')
      .eq('id', id)
      .single();

  if (error) throw new Error(`Erreur fetch : ${error.message}`);
  return data;
};

const createCategorie = async (dataCategories: TCategorie) => {
  try {
    let imageUrl: string | undefined = undefined;

    if (dataCategories.image_url instanceof File) {
      const { success, url } = await uploadFileToSupabase(dataCategories.image_url, 'categorie');
      if (!success) throw new Error("Échec de l'upload de l'image");
      imageUrl = url;
    } else if (typeof dataCategories.image_url === "string") {
      imageUrl = dataCategories.image_url;
    }

    const { data: categorieResult, error } = await supabase
      .from('categorie_bien')
      .insert({
        titre: dataCategories.titre,
        description: dataCategories.description,
        image_url: imageUrl
      });


    if (error) {
        return { success: false, message: `Erreur création : ${error.message}` };
    }

      return categorieResult


  } catch (error: any) {
    console.error("Erreur dans createCategorie:", error.message);
    throw error; // on propage l'erreur si le composant parent veut la gérer
  }
};


const updateCategorie = async (id: number, nom: string) => {
    const { data, error } = await supabase
        .from('categorie_bien')
        .update({ nom })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Erreur update : ${error.message}`);
    return data;
};

const deleteCategorie = async (id: number) => {
    const { error } = await supabase
        .from('categorie_bien')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
};



export {
    fetchCategories,
    fetchCategoriesById,
    createCategorie,
    updateCategorie,
    deleteCategorie
}