import n2words from 'n2words';

export function NumnerToLetter(nombre: number): string {
  return n2words(nombre, { lang: 'fr' });


}

export function formatMontant(montant: number | string): string {
  const num = typeof montant === 'string' ? parseFloat(montant) : montant;
  return new Intl.NumberFormat('fr-FR').format(num);
}

export const getFirstNWords = (
  text: string,
  wordCount: number = 3,
  suffix: string = '...'
): string => {
  if (!text) return "";

  // Nettoyer le texte et splitter par espaces (un ou plusieurs)
  const words = text.trim().split(/\s+/);

  // Si le nombre de mots est inférieur ou égal au nombre demandé, retourner le texte complet
  if (words.length <= wordCount) return text;

  // Retourner les N premiers mots avec le suffixe
  return words.slice(0, wordCount).join(' ') + suffix;
};