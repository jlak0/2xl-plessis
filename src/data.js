export const asset = (path) => `/assets/${path}`;

const img = (name) => `images/generated/${name}.png`;

export const products = [
  {
    slug: "breakfast",
    name: "Bar du Matin",
    title: "Le petit-déjeuner, prêt quand vous l'êtes",
    description: "Viennoiseries, fruits, oeufs, yaourts et café pour commencer la journée avec légèreté.",
    image: img("buffet-breakfast"),
    categories: ["Petit-déjeuner", "Frais", "Toute la journée"],
    stats: ["07:00 - 11:00", "24 plats chauds", "Fruits frais", "Café inclus"]
  },
  {
    slug: "salad",
    name: "Îlot Jardin",
    title: "La fraîcheur dans chaque bol",
    description: "Salades, céréales, légumes rôtis et sauces pour composer rapidement votre assiette.",
    image: img("buffet-salad"),
    categories: ["Végétarien", "Frais", "Déjeuner"],
    stats: ["18 garnitures", "6 sauces", "Options véganes", "Comptoir froid"]
  },
  {
    slug: "hot-line",
    name: "Comptoir Chaud",
    title: "Le réconfort servi en mouvement",
    description: "Une sélection tournante de plats chauds, accompagnements et classiques réapprovisionnés par l'équipe.",
    image: img("buffet-hotline"),
    categories: ["Plats chauds", "Déjeuner", "Dîner"],
    stats: ["12 plats", "8 accompagnements", "Réassort chef", "Service chaud"]
  },
  {
    slug: "world-table",
    name: "Table du Monde",
    title: "Un voyage dans une seule assiette",
    description: "Spécialités méditerranéennes, asiatiques et saisonnières réunies sur un grand comptoir généreux.",
    image: img("buffet-global"),
    categories: ["Monde", "Dîner", "Famille"],
    stats: ["5 cuisines", "Rotation quotidienne", "Bar à sauces", "Cuisine ouverte"]
  },
  {
    slug: "grill",
    name: "Grill Découpe",
    title: "Des pièces fraîches, finies devant vous",
    description: "Rôtis, légumes grillés et spécialités protéinées découpés et servis au comptoir.",
    image: img("buffet-carving"),
    categories: ["Plats chauds", "Dîner", "Station chef"],
    stats: ["Station live", "3 protéines", "Légumes grillés", "Heures de pointe"]
  },
  {
    slug: "dessert",
    name: "Comptoir Dessert",
    title: "Petites douceurs, grande finale",
    description: "Tartelettes, gâteaux, mousses et fruits pour terminer le repas à votre rythme.",
    image: img("buffet-dessert"),
    categories: ["Dessert", "Famille"],
    stats: ["16 douceurs", "Tartelettes fruitées", "Bar chocolat", "Réassort fréquent"]
  },
  {
    slug: "beverage",
    name: "Station Boissons",
    title: "Café, jus et eaux infusées",
    description: "Un comptoir en libre-service pensé pour un passage fluide et des recharges propres.",
    image: img("buffet-beverage"),
    categories: ["Boissons", "Petit-déjeuner", "Toute la journée"],
    stats: ["Jus frais", "Espresso", "Eaux infusées", "Verres prêts"]
  },
  {
    slug: "family-dining",
    name: "Salle Famille",
    title: "De la place pour tous les appétits",
    description: "Assises confortables, circulation simple et ambiance détendue pour les groupes de toutes tailles.",
    image: img("buffet-family"),
    categories: ["Famille", "Déjeuner", "Dîner"],
    stats: ["160 places", "Allées larges", "Chaises hautes", "Tables de groupe"]
  }
];

export const homeHero = [
  { type: "image", src: img("buffet-hero"), thumb: img("buffet-hero"), alt: "Restaurant buffet moderne en libre-service" },
  { type: "image", src: img("buffet-hotline"), thumb: img("buffet-hotline"), alt: "Comptoir chaud avec plats réapprovisionnés" },
  { type: "image", src: img("buffet-salad"), thumb: img("buffet-salad"), alt: "Îlot de salades fraîches" },
  { type: "image", src: img("buffet-dessert"), thumb: img("buffet-dessert"), alt: "Comptoir de desserts" },
  { type: "image", src: img("buffet-family"), thumb: img("buffet-family"), alt: "Salle familiale près du buffet" },
  { type: "image", src: img("buffet-beverage"), thumb: img("buffet-beverage"), alt: "Station boissons en libre-service" }
];

export const homeSlider = [
  {
    image: img("buffet-layout"),
    title: "Des stations lisibles, des allées larges et un service plus fluide"
  },
  {
    image: img("buffet-kitchen"),
    title: "Préparé frais en petites séries avant chaque service"
  },
  {
    image: img("buffet-global"),
    title: "Une offre qui change chaque jour pour le matin, le midi et le soir"
  }
];

export const homeCards = [
  products[1],
  products[2],
  products[5]
];

export const caseStudies = [
  {
    title: "Îlot Jardin",
    subtitle: "Bar frais",
    href: "/product/salad",
    type: "image",
    src: img("buffet-salad")
  },
  {
    title: "Comptoir Chaud",
    subtitle: "Service déjeuner",
    href: "/product/hot-line",
    type: "image",
    src: img("buffet-hotline")
  },
  {
    title: "Table du Monde",
    subtitle: "Comptoir global",
    href: "/product/world-table",
    type: "image",
    src: img("buffet-global")
  },
  {
    title: "Grill Découpe",
    subtitle: "Station chef",
    href: "/product/grill",
    type: "image",
    src: img("buffet-carving")
  },
  {
    title: "Comptoir Dessert",
    subtitle: "Final sucré",
    href: "/product/dessert",
    type: "image",
    src: img("buffet-dessert")
  }
];

export const workSteps = [
  {
    kicker: "01",
    title: "Préparer",
    text: "Les ingrédients frais sont portionnés et organisés avant chaque fenêtre de service.",
    type: "image",
    src: img("buffet-kitchen")
  },
  {
    kicker: "02",
    title: "Servir",
    text: "Les stations sont réapprovisionnées en petites séries pour rester généreuses et nettes.",
    type: "image",
    src: img("buffet-hotline")
  },
  {
    kicker: "03",
    title: "Rafraîchir",
    text: "La salle, les boissons et les desserts sont remis en place tout au long de la journée.",
    type: "image",
    src: img("buffet-beverage")
  }
];

export const team = [
  {
    image: img("buffet-team"),
    role: "Direction hospitalité",
    name: "Équipe de salle",
    text: "L'équipe garde les stations lisibles, propres et faciles à parcourir."
  },
  {
    image: img("buffet-kitchen"),
    role: "Équipe cuisine",
    name: "Brigade préparation",
    text: "Les cuisiniers travaillent en cycles courts pour garder les plats frais pendant l'affluence."
  }
];

export const clients = [
  {
    image: img("buffet-family"),
    title: "Déjeuner famille",
    text: "Une salle détendue avec une circulation généreuse et des assises flexibles.",
    href: "/product/family-dining"
  },
  {
    image: img("buffet-carving"),
    title: "Station chef",
    text: "La découpe et le grill en direct donnent du rythme au service du soir.",
    href: "/product/grill"
  },
  {
    image: img("buffet-beverage"),
    title: "Boissons toute la journée",
    text: "Café, jus et eaux infusées accompagnent chaque moment du service.",
    href: "/product/beverage"
  }
];

export const productGallery = [
  { type: "image", src: img("buffet-hero"), alt: "Intérieur du restaurant buffet" },
  { type: "image", src: img("buffet-hotline"), alt: "Service du comptoir chaud" },
  { type: "image", src: img("buffet-layout"), alt: "Plan du buffet avant ouverture" }
];

export const productDetails = [
  { image: img("buffet-layout"), title: "Un agencement pensé pour voir, choisir et circuler sans attente" },
  { image: img("buffet-kitchen"), title: "Une préparation en petites séries pour garder la fraîcheur toute la journée" },
  { image: img("buffet-beverage"), title: "Des boissons en libre-service et des points de reprise pour limiter l'attente" }
];

export function getRoute(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/") return { page: "home" };
  if (path === "/work") return { page: "work" };
  if (path === "/info") return { page: "info" };
  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const product = products.find((item) => item.slug === productMatch[1]);
    return product ? { page: "product", product } : { page: "home" };
  }
  return { page: "home" };
}
