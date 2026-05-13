import { MediaCategorie } from "@/app/components/calina/cards/CategorieCard";
import type { Easing } from "framer-motion"

export const easeOut: Easing = [0, 0, 0.58, 1] // ease-out
export const easeIn: Easing = [0.42, 0, 1, 1] // ease-in
export const easeInOut: Easing = [0.42, 0, 0.58, 1] // ease-in-out
export const linear: Easing = [0, 0, 1, 1] // linear


export const STATUT_VISITE = [
  { id: 1, value: "creer" },
  { id: 2, value: "en cours" },
  { id: 3, value: "manquer" },
  { id: 4, value: "terminer" },
]

export const GENRE = [
    { value: "Homme" },
    { value: "Femme" },
]



export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      // duration: 0.6
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  }
}

export const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
      ease: easeIn,
    },
  },
}

export const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: easeInOut,
      },
    },
  };

  export const type_conception = [
        "Duplex",
        "Villa",
        "Immeuble",
        "Magasin",
        "Entrepot",
        "Maison plein-pied",
        "Simple",
        "Restaurant",


  ]

export const CANAL_ECHANGE = [
    {
        value: "SMS",
        description: "Contacté par message",
        couleur: "bg-green-500"
    },
    {
        value: "WhatsApp",
        description: "Contacté par WhatsApp",
        couleur: "bg-green-800"
    },
    {
        value: "Appel - MTN",
        description: "Contacté par Appel",
        couleur: "bg-yellow-500"
    },
    {
        value: "Appel - ORANGE",
        description: "Contacté par Appel",
        couleur: "bg-orange-500"
    },
    {
        value: "Mail",
        description: "Contacté par Mail",
        couleur: "bg-red-500"
    },
    {
        value: "Informel",
        description: "Contacté par des cannaux inhabituel",
        couleur: "bg-gray-400"
    }
];
  
