export const asset = (path) => `/assets/${path}`;

const imageMapping = {
  "buffet-hero": "images/5.jpg",      // Spacious multi-island buffet counters view (Hero)
  "buffet-layout": "images/5.jpg",    // Spacious multi-island buffet counters view (Layout)
  "buffet-kitchen": "images/4.jpg",   // Long buffet counter with visible chef (Kitchen)
  "buffet-breakfast": "images/1.jpg", // Elegant Gold Lounge Bar (Breakfast/Drinks)
  "buffet-beverage": "images/1.jpg",  // Elegant Gold Lounge Bar (Beverage/Drinks)
  "buffet-salad": "images/2.jpg",     // Main Dining Hall with Autumn Leaves (Salads/Freshness)
  "buffet-family": "images/2.jpg",    // Main Dining Hall with Autumn Leaves (Family Dining/Salle principale)
  "buffet-hotline": "images/4.jpg",   // Long marble buffet counter with warming pans (Hotline)
  "buffet-global": "images/4.jpg",    // Long marble buffet counter with warming pans (Global Table)
  "buffet-carving": "images/4.jpg",   // Long marble buffet counter with warming pans (Carving Station)
  "buffet-dessert": "images/1.jpg",   // Elegant Gold Lounge Bar (Desserts)
  "buffet-team": "images/3.jpg"       // Cozy dining booths with geometric screens (Team/Cozy Space)
};

const img = (name) => imageMapping[name] || "images/1.jpg";


export const products = [
  {
    slug: "breakfast",
    name: "Bar du Matin",
    title: "Le petit-déjeuner dans un espace Lounge d'exception",
    description: "Démarrez votre journée avec élégance autour de viennoiseries fraîches et de boissons chaudes servies dans notre majestueux Lounge Bar.",
    image: img("buffet-breakfast"),
    categories: ["Petit-déjeuner", "Frais", "Toute la journée"],
    stats: ["07:00 - 11:00", "24 plats chauds", "Fruits frais", "Café inclus"]
  },
  {
    slug: "salad",
    name: "Îlot Jardin",
    title: "La fraîcheur sous la canopée d'érables rouges",
    description: "Dégustez nos salades croquantes et compositions saines confortablement installés sous le magnifique plafond d'érables rouges suspendus.",
    image: img("buffet-salad"),
    categories: ["Végétarien", "Frais", "Déjeuner"],
    stats: ["18 garnitures", "6 sauces", "Options véganes", "Comptoir froid"]
  },
  {
    slug: "hot-line",
    name: "Comptoir Chaud",
    title: "Le grand buffet chaud sur marbre noir",
    description: "Un immense et splendide linéaire en marbre noir équipé de chauffe-plats encastrés, réapprovisionné continuellement de spécialités fumantes.",
    image: img("buffet-hotline"),
    categories: ["Plats chauds", "Déjeuner", "Dîner"],
    stats: ["12 plats", "8 accompagnements", "Réassort chef", "Service chaud"]
  },
  {
    slug: "world-table",
    name: "Table du Monde",
    title: "Un voyage culinaire autour de nos îlots prestigieux",
    description: "Explorez nos riches spécialités méditerranéennes et asiatiques présentées avec raffinement sur nos superbes îlots centraux en marbre.",
    image: img("buffet-global"),
    categories: ["Monde", "Dîner", "Famille"],
    stats: ["5 cuisines", "Rotation quotidienne", "Bar à sauces", "Cuisine ouverte"]
  },
  {
    slug: "grill",
    name: "Grill Découpe",
    title: "Découpes et grillades fines préparées sous vos yeux",
    description: "Des viandes sélectionnées et grillades saisies à la minute par notre chef devant le grand comptoir de marbre noir.",
    image: img("buffet-carving"),
    categories: ["Plats chauds", "Dîner", "Station chef"],
    stats: ["Station live", "3 protéines", "Légumes grillés", "Heures de pointe"]
  },
  {
    slug: "dessert",
    name: "Comptoir Dessert",
    title: "Douceurs sucrées et grande finale",
    description: "Tartelettes fines, mousses légères et gâteaux gourmands dressés avec le plus grand soin pour clore votre repas sur une note magique.",
    image: img("buffet-dessert"),
    categories: ["Dessert", "Famille"],
    stats: ["16 douceurs", "Tartelettes fruitées", "Bar chocolat", "Réassort fréquent"]
  },
  {
    slug: "beverage",
    name: "Station Boissons",
    title: "Le somptueux Lounge Bar d'exception",
    description: "Un espace bar étincelant en laiton doré rétroéclairé, offrant une vaste sélection de cafés, jus frais et boissons de prestige.",
    image: img("buffet-beverage"),
    categories: ["Boissons", "Petit-déjeuner", "Toute la journée"],
    stats: ["Jus frais", "Espresso", "Eaux infusées", "Verres prêts"]
  },
  {
    slug: "family-dining",
    name: "Espaces Alcôves",
    title: "L'intimité de nos espaces banquettes et claustras",
    description: "Installez-vous en groupe ou en famille dans le confort intime de nos box privatifs équipés de banquettes en cuir et de superbes claustras.",
    image: img("buffet-family"),
    categories: ["Famille", "Déjeuner", "Dîner"],
    stats: ["160 places", "Allées larges", "Chaises hautes", "Tables de groupe"]
  }
];

export const homeHero = [
  { type: "image", src: img("buffet-hero"), thumb: img("buffet-hero"), alt: "Grande salle de restaurant buffet moderne et spacieuse avec îlots en marbre" },
  { type: "image", src: img("buffet-hotline"), thumb: img("buffet-hotline"), alt: "Immense comptoir de buffet chaud en marbre noir avec chauffe-plats encastrés" },
  { type: "image", src: img("buffet-salad"), thumb: img("buffet-salad"), alt: "Grande salle feutrée ornée d'érables rouges suspendus et assises confortables" },
  { type: "image", src: img("buffet-dessert"), thumb: img("buffet-dessert"), alt: "Élégant espace Lounge Bar en laiton doré rétroéclairé" },
  { type: "image", src: img("buffet-family"), thumb: img("buffet-family"), alt: "Espaces banquettes intimes avec superbes claustras géométriques" },
  { type: "image", src: img("buffet-beverage"), thumb: img("buffet-beverage"), alt: "Comptoir Bar d'exception en laiton doré rétroéclairé" }
];

export const homeSlider = [
  {
    image: img("buffet-layout"),
    title: "Des îlots de buffets modernes et des allées spacieuses pour circuler librement"
  },
  {
    image: img("buffet-kitchen"),
    title: "Une cuisine ouverte où nos chefs s'activent pour dresser les plats en direct"
  },
  {
    image: img("buffet-global"),
    title: "Une architecture intérieure d'exception mêlant érables rouges et alcôves intimes"
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
    subtitle: "Entrées fraîches under maple leaves",
    href: "/product/salad",
    type: "image",
    src: img("buffet-salad")
  },
  {
    title: "Comptoir Chaud",
    subtitle: "Plats chauds sur marbre noir",
    href: "/product/hot-line",
    type: "image",
    src: img("buffet-hotline")
  },
  {
    title: "Table du Monde",
    subtitle: "Spécialités internationales",
    href: "/product/world-table",
    type: "image",
    src: img("buffet-global")
  },
  {
    title: "Grill Découpe",
    subtitle: "Découpe en direct par le chef",
    href: "/product/grill",
    type: "image",
    src: img("buffet-carving")
  },
  {
    title: "Comptoir Dessert",
    subtitle: "Pâtisseries et douceur Lounge",
    href: "/product/dessert",
    type: "image",
    src: img("buffet-dessert")
  }
];

export const workSteps = [
  {
    kicker: "01",
    title: "Préparer",
    text: "Nos chefs concoctent des spécialités fines en cuisine ouverte en flux continu.",
    type: "image",
    src: img("buffet-kitchen")
  },
  {
    kicker: "02",
    title: "Dresser",
    text: "Les plats fumants sont disposés avec art sur de superbes comptoirs en marbre noir.",
    type: "image",
    src: img("buffet-hotline")
  },
  {
    kicker: "03",
    title: "Savourer",
    text: "Installez-vous sous les érables rouges ou dans le confort intime de nos box banquettes.",
    type: "image",
    src: img("buffet-beverage")
  }
];

export const team = [
  {
    image: img("buffet-team"),
    role: "Service & Hospitalité",
    name: "Équipe de salle",
    text: "Nos hôtes veillent sur l'élégance de la salle et le confort des alcôves privatives."
  },
  {
    image: img("buffet-kitchen"),
    role: "Création Culinaire",
    name: "Brigade de cuisine",
    text: "Nos chefs préparent et dressent les buffets chauds en direct sous vos yeux."
  }
];

export const clients = [
  {
    image: img("buffet-family"),
    title: "Espaces Groupes & Banquettes",
    text: "Des box privatifs très confortables équipés de claustras en bois pour vos repas en toute intimité.",
    href: "/product/family-dining"
  },
  {
    image: img("buffet-carving"),
    title: "Cuisine en direct live",
    text: "Nos cuisiniers s'activent le long de l'immense buffet linéaire pour préparer vos découpes.",
    href: "/product/grill"
  },
  {
    image: img("buffet-beverage"),
    title: "Le majestueux Lounge Bar",
    text: "Un espace bar d'exception rétroéclairé proposant une sélection variée de boissons fines.",
    href: "/product/beverage"
  }
];

export const pricing = [
  {
    name: "Déjeuner",
    hours: "11h50 - 14h30 / 15h00",
    rows: [
      {
        period: "Lundi-Jeudi",
        note: "11h50 - 14h30 / 18h50 - 22h30",
        adult: "20.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      },
      {
        period: "Vendredi",
        note: "11h50 - 14h30 / 18h50 - 23h00",
        adult: "20.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      },
      {
        period: "Samedi",
        note: "11h50 - 15h00 / 18h50 - 23h00",
        adult: "29.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      },
      {
        period: "Dimanche & J.F.",
        note: "11h50 - 15h00 / 18h50 - 22h30",
        adult: "29.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      }
    ]
  },
  {
    name: "Dîner",
    hours: "18h50 - 22h30 / 23h00",
    rows: [
      {
        period: "Lundi-Jeudi",
        note: "11h50 - 14h30 / 18h50 - 22h30",
        adult: "27.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      },
      {
        period: "Vendredi",
        note: "11h50 - 14h30 / 18h50 - 23h00",
        adult: "29.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      },
      {
        period: "Samedi",
        note: "11h50 - 15h00 / 18h50 - 23h00",
        adult: "29.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      },
      {
        period: "Dimanche & J.F.",
        note: "11h50 - 15h00 / 18h50 - 22h30",
        adult: "29.90€",
        childUnderOneForty: "13.90€",
        childUnderOneTen: "9.90€"
      }
    ]
  }
];

export const pricingNotes = [
  "Les cuisiniers cessent leur activité 15 minutes avant la fermeture.",
  "Réapprovisionnement du buffet, Naans, Wok, Grillades, Crêpes.",
  "Enfant de moins de 3 ans gratuit."
];

export const openingHours = [
  {
    name: "Lundi à jeudi",
    hours: "11:50 - 14:30 / 18:50 - 22:30",
    note: "Hors jours fériés"
  },
  {
    name: "Vendredi",
    hours: "11:50 - 14:30 / 18:50 - 23:00",
    note: "Hors jours fériés"
  },
  {
    name: "Samedi",
    hours: "11:50 - 15:00 / 18:50 - 23:00",
    note: "Hors jours fériés"
  },
  {
    name: "Dimanche et jours fériés",
    hours: "11:50 - 15:00 / 18:50 - 22:30",
    note: "Service midi & soir"
  }
];

function parseServiceTime(value) {
  const match = String(value).match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatServiceTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildReservationTimeGroups(hours = openingHours) {
  return hours.map((item) => {
    const periods = item.hours.split(" / ");
    const times = [];
    for (const period of periods) {
      const [opening, closing] = period.split(" - ");
      const start = parseServiceTime(opening);
      const end = parseServiceTime(closing);
      if (start !== null && end !== null) {
        const lastReservation = end - 30;
        for (let time = start; time <= lastReservation; time += 10) {
          times.push(formatServiceTime(time));
        }
      }
    }

    return { name: item.name, times };
  });
}

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
  if (path === "/menu") return { page: "menu" };
  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const product = products.find((item) => item.slug === productMatch[1]);
    return product ? { page: "product", product } : { page: "home" };
  }
  return { page: "home" };
}
