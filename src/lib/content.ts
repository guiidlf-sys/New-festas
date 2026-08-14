/**
 * Contenu du site — à personnaliser.
 * Remplacez les valeurs ci-dessous par les vraies informations de votre salle.
 * Les photos sont dans /public/images (remplacez les fichiers placeholder-*.svg
 * par vos propres photos, au même nom ou en mettant à jour `gallery` ci-dessous).
 */

export const siteContent = {
  name: "New Festas",
  shortName: "New Festas",
  tagline: "Le lieu idéal pour vos mariages, anniversaires et événements d'entreprise",
  city: "Chelles",
  address: "7 rue Henri Becquerel, 77500 Chelles",
  mapsQuery: "7 rue Henri Becquerel, 77500 Chelles",

  // TODO : remplacez par une vraie description de la salle (ambiance, matériel, particularités).
  description:
    "Nichée au cœur de Chelles, notre salle allie charme authentique et confort moderne. Baignée de lumière naturelle, elle s'adapte aussi bien à un mariage intimiste qu'à une grande soirée d'entreprise. Parking sur place, cuisine équipée et espace extérieur privatif complètent cet écrin pensé pour que vos invités se sentent chez eux.",

  capacity: {
    seated: 80,
    standing: 80,
  },
  // TODO : surface réelle de la salle en m².
  surfaceM2: 200,

  amenities: [
    "Tables et chaises Napoléon incluses",
    "Cuisine équipée (four, plaques, réfrigérateur)",
    "Sonorisation et éclairage d'ambiance",
    "Parking privé gratuit",
    "Accès PMR",
    "Terrasse / espace extérieur",
    "Wifi",
    "Climatisation / chauffage",
  ],

  eventTypes: [
    "Mariage",
    "Anniversaire",
    "Baptême",
    "Séminaire d'entreprise",
    "Soirée privée",
    "Autre",
  ],

  pricing: {
    // Prix en centimes (ex : 80000 = 800,00 €)
    perDayCents: 80000,
    depositPercent: 30,
    currency: "EUR",
    note: "Tarif pour la journée, de 15h à 22h (horaires modifiables sur demande). Tables et chaises Napoléon inclus. Un acompte est demandé pour confirmer la réservation, le solde étant réglé avant l'événement.",
  },

  gallery: [
    { src: "/images/placeholder-1.svg", alt: "Vue d'ensemble de la salle" },
    { src: "/images/placeholder-2.svg", alt: "Salle dressée pour un mariage" },
    { src: "/images/placeholder-3.svg", alt: "Espace extérieur / terrasse" },
    { src: "/images/placeholder-4.svg", alt: "Coin bar et cuisine équipée" },
  ],

  // TODO : remplacez par la vraie adresse email et le vrai numéro de téléphone.
  contact: {
    email: "contact@example.com",
    phone: "06 12 34 56 78",
  },

  // TODO : remplacez par de vrais avis clients avant la mise en ligne (ceux-ci sont des
  // exemples fictifs, à ne pas publier tels quels).
  testimonials: [
    {
      quote:
        "Une salle magnifique et un accueil parfait, nos invités en parlent encore ! Nous recommandons vivement.",
      author: "Camille & Antoine",
      event: "Mariage",
    },
    {
      quote:
        "Cadre idéal pour notre séminaire annuel, tout était prêt à notre arrivée et la salle est très modulable.",
      author: "Julie R.",
      event: "Séminaire d'entreprise",
    },
  ],
} as const;

export type SiteContent = typeof siteContent;
