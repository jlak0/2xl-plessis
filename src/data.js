export const asset = (path) => `/assets/${path}`;

const img = (name) => `images/generated/${name}.png`;

export const products = [
  {
    slug: "breakfast",
    name: "Morning Bar",
    title: "Breakfast, ready when you are",
    description: "Pastries, fruit, eggs, yogurt and coffee laid out for a bright start.",
    image: img("buffet-breakfast"),
    categories: ["Breakfast", "Fresh", "All-day"],
    stats: ["07:00 - 11:00", "24 hot trays", "Fresh fruit", "Coffee included"]
  },
  {
    slug: "salad",
    name: "Garden Island",
    title: "Freshness by the bowl",
    description: "Greens, grains, roasted vegetables and dressings arranged for quick custom plates.",
    image: img("buffet-salad"),
    categories: ["Vegetarian", "Fresh", "Lunch"],
    stats: ["18 toppings", "6 dressings", "Vegan options", "Cold line"]
  },
  {
    slug: "hot-line",
    name: "Hot Line",
    title: "Comfort served in motion",
    description: "A rotating spread of warm mains, sides and chef-replenished classics.",
    image: img("buffet-hotline"),
    categories: ["Hot food", "Lunch", "Dinner"],
    stats: ["12 mains", "8 sides", "Chef refreshed", "Warm service"]
  },
  {
    slug: "world-table",
    name: "World Table",
    title: "A passport on one plate",
    description: "Mediterranean, Asian and seasonal specialties gathered in one generous counter.",
    image: img("buffet-global"),
    categories: ["Global", "Dinner", "Family"],
    stats: ["5 cuisines", "Daily rotation", "Sauce bar", "Open kitchen"]
  },
  {
    slug: "grill",
    name: "Carving Grill",
    title: "Fresh cuts, finished live",
    description: "Roasts, grilled vegetables and protein specials sliced and served at the station.",
    image: img("buffet-carving"),
    categories: ["Hot food", "Dinner", "Chef station"],
    stats: ["Live station", "3 proteins", "Grilled sides", "Peak hours"]
  },
  {
    slug: "dessert",
    name: "Dessert Counter",
    title: "Small sweets, big finish",
    description: "Tarts, cakes, mousse cups and fruit arranged for a flexible final course.",
    image: img("buffet-dessert"),
    categories: ["Dessert", "Family"],
    stats: ["16 sweets", "Fruit tarts", "Chocolate bar", "Refilled often"]
  },
  {
    slug: "beverage",
    name: "Drinks Station",
    title: "Coffee, juice and infused water",
    description: "A self-service refreshment counter designed for easy flow and clean refills.",
    image: img("buffet-beverage"),
    categories: ["Drinks", "Breakfast", "All-day"],
    stats: ["Juice carafes", "Espresso", "Infused water", "Glassware ready"]
  },
  {
    slug: "family-dining",
    name: "Family Dining",
    title: "Room for every appetite",
    description: "Comfortable seating, easy circulation and a relaxed rhythm for groups of all sizes.",
    image: img("buffet-family"),
    categories: ["Family", "Lunch", "Dinner"],
    stats: ["160 seats", "Wide aisles", "High chairs", "Group tables"]
  }
];

export const homeHero = [
  { type: "image", src: img("buffet-hero"), thumb: img("buffet-hero"), alt: "Modern self-service buffet restaurant" },
  { type: "image", src: img("buffet-hotline"), thumb: img("buffet-hotline"), alt: "Hot buffet line with freshly replenished dishes" },
  { type: "image", src: img("buffet-salad"), thumb: img("buffet-salad"), alt: "Fresh salad buffet island" },
  { type: "image", src: img("buffet-dessert"), thumb: img("buffet-dessert"), alt: "Dessert buffet counter" },
  { type: "image", src: img("buffet-family"), thumb: img("buffet-family"), alt: "Family dining room beside the buffet" },
  { type: "image", src: img("buffet-beverage"), thumb: img("buffet-beverage"), alt: "Self-service beverage station" }
];

export const homeSlider = [
  {
    image: img("buffet-layout"),
    title: "Clear stations, wide aisles and a faster self-service flow"
  },
  {
    image: img("buffet-kitchen"),
    title: "Prepared fresh in small batches before every service"
  },
  {
    image: img("buffet-global"),
    title: "A daily-changing spread for breakfast, lunch and dinner"
  }
];

export const homeCards = [
  products[1],
  products[2],
  products[5]
];

export const caseStudies = [
  {
    title: "Garden Island",
    subtitle: "Fresh bar",
    href: "/product/salad",
    type: "image",
    src: img("buffet-salad")
  },
  {
    title: "Hot Line",
    subtitle: "Lunch service",
    href: "/product/hot-line",
    type: "image",
    src: img("buffet-hotline")
  },
  {
    title: "World Table",
    subtitle: "Global counter",
    href: "/product/world-table",
    type: "image",
    src: img("buffet-global")
  },
  {
    title: "Carving Grill",
    subtitle: "Chef station",
    href: "/product/grill",
    type: "image",
    src: img("buffet-carving")
  },
  {
    title: "Dessert Counter",
    subtitle: "Sweet finish",
    href: "/product/dessert",
    type: "image",
    src: img("buffet-dessert")
  }
];

export const workSteps = [
  {
    kicker: "01",
    title: "Prep",
    text: "Fresh ingredients are portioned and staged before each service window.",
    type: "image",
    src: img("buffet-kitchen")
  },
  {
    kicker: "02",
    title: "Serve",
    text: "Stations are replenished in small batches so counters stay abundant and clean.",
    type: "image",
    src: img("buffet-hotline")
  },
  {
    kicker: "03",
    title: "Refresh",
    text: "Dining room, beverage counters and desserts are reset throughout the day.",
    type: "image",
    src: img("buffet-beverage")
  }
];

export const team = [
  {
    image: img("buffet-team"),
    role: "Hospitality Director",
    name: "Service Team",
    text: "The dining-room crew keeps stations clear, stocked and easy to navigate."
  },
  {
    image: img("buffet-kitchen"),
    role: "Kitchen Team",
    name: "Prep Crew",
    text: "Cooks work in short production cycles so dishes arrive fresh through the rush."
  }
];

export const clients = [
  {
    image: img("buffet-family"),
    title: "Family Lunch",
    text: "A relaxed room with generous circulation and flexible seating.",
    href: "/product/family-dining"
  },
  {
    image: img("buffet-carving"),
    title: "Chef Station",
    text: "Live carving and grill specials add a focal point to dinner service.",
    href: "/product/grill"
  },
  {
    image: img("buffet-beverage"),
    title: "All-day Drinks",
    text: "Coffee, juice and infused water support every service period.",
    href: "/product/beverage"
  }
];

export const productGallery = [
  { type: "image", src: img("buffet-hero"), alt: "Buffet restaurant interior" },
  { type: "image", src: img("buffet-hotline"), alt: "Hot buffet service" },
  { type: "image", src: img("buffet-layout"), alt: "Buffet layout before opening" }
];

export const productDetails = [
  { image: img("buffet-layout"), title: "A layout built for visible choice and steady movement" },
  { image: img("buffet-kitchen"), title: "Small-batch preparation keeps the buffet fresh through the day" },
  { image: img("buffet-beverage"), title: "Self-service drinks and reset points reduce waiting time" }
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
