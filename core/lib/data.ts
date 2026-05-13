

import { TBiens, TClients, TPaiement } from "../types/calineTypes";

export const iconOptions = [
    // 🔹 Département RH
    { value: "Users", label: "Équipe / Recrutement" },
    { value: "CalendarCheck", label: "Entretiens" },
  
    // 🔹 Département Communication
    { value: "MessageSquare", label: "Communication" },
    { value: "Megaphone", label: "Annonces / Campagnes" },
  
    // 🔹 Département Marketing
    { value: "Target", label: "Objectifs Marketing" },
  
    // 🔹 Département Finance
    { value: "Wallet", label: "Finances" },
    { value: "CreditCard", label: "Paiements / Factures" },
    { value: "Calculator", label: "Calculs & Budgets" },
  
    // 🔹 Département Digital / Tech
    { value: "Code", label: "Code" },
    { value: "Rocket", label: "Lancement de projet" },
    { value: "Lightbulb", label: "Idées / Innovation" },
  
    // 🔹 Tâches transversales
    { value: "Palette", label: "Design / Création" },
  ]



// export const biensData: TBiens[] = [
//   {
//     titre: "Duplex Bella Vista",
//     categorie: {
//       id: '_ètghkjkj',
//       titre: 'Maison',
//       description: 'Maison familiale de 4 chambre avec 4 salle de bains un salon et une salle a manger, une salle de jeu, un grand bureau et une cuisine , une terasse et une grande cour'
//     },
//     superfice: 301,
//     status_occupation: true,
//     description: "Une résidence contemporaine à l'architecture épurée et élégante.",
//     nb_chambre: 4,
//     nb_salle_bain: 4,
//     nb_salon: 1,
//     nb_cuisine: 1,
//     isFavory: true,
//     parking: true,
//     wifi: true,
//     prix: 200000,
//     nb_mois_requis: 10,
//     prix_visite: 10000,
//     nb_mois_requis_second_paiement: 6,
//     proprietaire: {
      
//         id: 'rtyhh432-è',
//         nom: 'Mempouza',
//         prenom: 'Dylane',
//         profession: 'Développeur',
//         sexe: 'Homme',
//         telephone: '655889677',
//         ville: 'Douala',
//         status: 'actif'
      
//       nb_biens: 3,
//       quartier: "Bonamoussadi",
//       montant_total_bien: 53000000
//     },
//     localisation: {
//       ville: "Douala",
//       quartier: "Bonamoussadi",
//       latitude: "4.0573",
//       longitude: "9.7679"
//     },
//     media: {
//       video: '/videos/duplex-tour.mp4',
//       image: ['/images/Duplex.png', '/images/duplex2.jpg']
//     },
//     charge_commercial: {
//       id: '1',
//       nom: 'Kamdem',
//       prenom: 'Steve',
//       email: 'steve.kamdem@example.com',
//       telephone: '655432189',
//       adresse: 'Rue 123 Bonapriso',
//       nom_urgence: 'Kamdem',
//       prenom_urgence: 'Claire',
//       lien_parente: 'Sœur',
//       telephone_urgence: '659874738',
//       poste: 'Commercial',
//       departement: 'MCV',
//       statut: 'Actif',
//       salaire: 150000,
//       date_embauche: new Date('2023-05-10'),
//       photo_url: '/cv/photo1.jpg',
//       cv_url: '/cv/steve.pdf',
//       diplome_url: '/docs/steve_diplome.pdf',
//       plan_localisation_url: '/docs/plan1.pdf',
//       cni_url: '/docs/cni1.pdf',
//       profile_id: 'cm-1',
//       year_xp: 4,
//       contrat_type: 'CDI',
//       created_at: '2023-05-10',
//     }
//   },
//   {
//     titre: "Appartement AquaZen",
//     categorie: {
//       id: '_app897hjk',
//       titre: 'Appartement',
//       description: 'Appartement moderne avec 2 chambres, salon ouvert, balcon et cuisine équipée.'
//     },
//     superfice: 85,
//     isFavory: true,
//     status_occupation: false,
//     prix: 100000,
//     description: "Appartement lumineux avec vue sur la mer.",
//     nb_chambre: 2,
//     nb_salle_bain: 2,
//     nb_salon: 1,
//     nb_cuisine: 1,
//     parking: false,
//     wifi: true,
//     nb_mois_requis: 6,
//     prix_visite: 7000,
//     nb_mois_requis_second_paiement: 3,
//     proprietaire: {
//       user: {
//         id: 'rtyhh-è',
//         nom: 'Ndongo',
//         prenom: 'Clarisse',
//         profession: 'Médecin',
//         sexe: 'Femme',
//         telephone: '656334899',
//         ville: 'Kribi',
//         status: 'actif'
//       },
//       nb_biens: 2,
//       quartier: "Mbalmayo",
//       montant_total_bien: 28000000
//     },
//     localisation: {
//       ville: "Kribi",
//       quartier: "Elaboudou",
//       latitude: "2.9333",
//       longitude: "9.9000"
//     },
//     media: {
//       video: '/videos/app-aquazen.mp4',
//       image: ['/images/appart.jpg', '/images/aqua2.jpg']
//     },
//     charge_commercial: {
//       id: '2',
//       nom: 'Tchoumi',
//       prenom: 'Fabrice',
//       email: 'fabrice.t@example.com',
//       telephone: '654321987',
//       adresse: 'Rue des palmiers',
//       nom_urgence: 'Tchoumi',
//       prenom_urgence: 'Mireille',
//       lien_parente: 'Mère',
//       telephone_urgence: '650123456',
//       poste: 'Commercial',
//       departement: 'MCV',
//       statut: 'Actif',
//       salaire: 140000,
//       date_embauche: new Date('2022-09-15'),
//       photo_url: '/cv/photo2.jpg',
//       cv_url: '/cv/fabrice.pdf',
//       diplome_url: '/docs/fabrice_diplome.pdf',
//       plan_localisation_url: '/docs/plan2.pdf',
//       cni_url: '/docs/cni2.pdf',
//       profile_id: 'cm-2',
//       year_xp: 3,
//       contrat_type: 'CDD',
//       created_at: '2022-09-15',
//     }
//   },

// ]

export const paiementsMock: TPaiement[] = [
  {
    methode_paiement: "Orange Money",
    date_paiement: "2025-06-01T10:30:00Z",
    montant_recu: 100000,
    transaction_id: "OM-20250601-0001"
  },
  {
    methode_paiement: "MTN Mobile Money",
    date_paiement: "2025-06-02T15:45:00Z",
    montant_recu: 85000,
    transaction_id: "MTN-20250602-0023"
  },
  {
    methode_paiement: "Espèce",
    date_paiement: "2025-06-03T09:00:00Z",
    montant_recu: 50000,
    transaction_id: "CASH-20250603-0456"
  },
  {
    methode_paiement: "Virement Bancaire",
    date_paiement: "2025-06-04T12:20:00Z",
    montant_recu: 200000,
    transaction_id: "BANK-20250604-7890"
  },
  {
    methode_paiement: "Wave",
    date_paiement: "2025-06-05T17:10:00Z",
    montant_recu: 120000,
    transaction_id: "WAVE-20250605-3007"
  }
];



// export const clients: TClients[] = [
//   {
//     quartier: "Bastos",
//     user: {
//       id: '13TYU4',
//       nom: "Ngono",
//       prenom: "Amandine",
//       sexe: "Femme",
//       telephone: "699123456",
//       ville: "Yaoundé",
//       profession: "Entrepreneur",
//       status: 'actif'
//     },
//   },
//   {
//     quartier: "Bonapriso",
//     user: {
//       id: '4567gfgh',
//       nom: "Fouda",
//       prenom: "Jean-Paul",
//       sexe: "Homme",
//       telephone: "677112233",
//       ville: "Douala",
//       profession: "Avocat",
//       status: 'actif'
//     },
//   },
//   {
//     quartier: "Melen",
//     user: {
//       id: '4567gfgh',
//       nom: "Mbarga",
//       prenom: "Sylvie",
//       sexe: "Femme",
//       telephone: "690998877",
//       ville: "Yaoundé",
//       profession: "Architecte",
//       status: 'actif'
//     },
//   },
//   {
//     quartier: "Logbaba",
//     user: {
//       id: '4567gfgh',
//       nom: "Tchouangue",
//       prenom: "Michel",
//       sexe: "Homme",
//       telephone: "656443322",
//       ville: "Douala",
//       profession: "Médecin",
//       status: 'actif'
//     },
//   },
//   {
//     quartier: "Etoa-Meki",
//     user: {
//       id: '4567gfgh',
//       nom: "Eboutou",
//       prenom: "Claire",
//       sexe: "Femme",
//       telephone: "674332211",
//       ville: "Yaoundé",
//       profession: "Banquière",
//       status: 'actif'
//     },
//   },
//   {
//     quartier: "Bonamoussadi",
//     user: {
//       id: '4567gfgh',
//       nom: "Djoumessi",
//       prenom: "Arsène",
//       sexe: "Homme",
//       telephone: "698887766",
//       ville: "Douala",
//       profession: "Ingénieur Civil",status: 'actif'
//     },
//   },
//   {
//     quartier: "Nlongkak",
//     user: {
//       id: '4567gfgh',
//       nom: "Essomba",
//       prenom: "Valérie",
//       sexe: "Femme",
//       telephone: "679554433",
//       ville: "Yaoundé",
//       profession: "Juriste",
//       status: 'actif'
//     },
//   },
// ];
  

