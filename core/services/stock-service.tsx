import supabase from "../lib/supabase";
import { ArticleStock } from "../types";


interface FormStock  {
  nom_produit: string;
  reference: string;
};

// fetch stock
//  Ajouter un produit
export const allArticleStock = async () => {
  const { data, error } = await supabase
    .from("stock_entreprise")
    .select("*")


  if (error) throw new Error(error.message);

  return data
};



//  Ajouter un produit
export const addArticleStoct = async (stockData: FormStock) => {
  const { data, error } = await supabase
    .from("stock_entreprise")
    .insert([stockData])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return { success: true, message: "Vente ajoutée avec succès.", data };
};
