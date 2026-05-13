export const showDateFormat = (rawDate: string) => {

  // On transforme en objet Date
  const date = new Date(rawDate);

  // Formatter la date en français
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

  return formattedDate
}