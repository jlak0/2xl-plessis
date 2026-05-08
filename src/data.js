export const asset = (path) => `/assets/${path}`;

export const products = [
  {
    slug: "nube01",
    name: "Nube 01",
    title: "Serenity is in the air",
    description: "A natural refuge where time dilates.",
    image: "images/EspacioLaNube_Nube01Card.jpg.webp",
    categories: ["Single layer", "Rental"],
    stats: ["120 - 250 people", "18x12m", "160sq m", "6m"]
  },
  {
    slug: "nube02",
    name: "Nube 02",
    title: "Void is in the air",
    description: "The sky inside the Nube.",
    image: "images/EspacioLaNubeNube02Card.png.webp",
    categories: ["Double layer", "Rental"],
    stats: ["250 - 500 people", "20x14.6m", "240sq m", "8m"]
  },
  {
    slug: "nube03",
    name: "Nube 03",
    title: "Geometry is in the air",
    description: "A forest that breathes movement.",
    image: "images/EspacioLaNube_Nube03Card.jpg.webp",
    categories: ["Yard", "Single layer"],
    stats: ["80 - 180 people", "14x14m", "130sq m", "5m"]
  },
  {
    slug: "nube04",
    name: "Nube 04",
    title: "Infinity is in the air",
    description: "An endless space for an infinity of possibilities.",
    image: "images/EspacioLaNubeNube04Card.jpg.webp",
    categories: ["Double layer", "Rental"],
    stats: ["300 - 650 people", "32x18m", "420sq m", "8m"]
  },
  {
    slug: "nube05",
    name: "Nube 05",
    title: "Canvas is in the air",
    description: "A white canvas for art, light and performance.",
    image: "images/EspacioLaNube_Nube05Card.jpg.webp",
    categories: ["Single layer"],
    stats: ["60 - 140 people", "12x10m", "95sq m", "5m"]
  },
  {
    slug: "nube06",
    name: "Nube 06",
    title: "Sound is in the air",
    description: "A music festival afterparty with a floating atmosphere.",
    image: "images/EspacioLaNube_Nube06Card.jpg.webp",
    categories: ["Yard", "Rental"],
    stats: ["150 - 320 people", "20x12m", "210sq m", "6m"]
  },
  {
    slug: "nube07",
    name: "Nube 07",
    title: "Intimacy is in the air",
    description: "Single Nubes that bring privacy to open-air programs.",
    image: "images/EspacioLaNube_Nube07Card.jpg.webp",
    categories: ["Single layer", "Yard"],
    stats: ["20 - 80 people", "8x8m", "50sq m", "4m"]
  },
  {
    slug: "nube08",
    name: "Nube 08",
    title: "Race is in the air",
    description: "A travelling inflatable structure for San Miguel and the America's Cup.",
    image: "images/EspacioLaNube_Nube08Card.jpg.webp",
    categories: ["Custom", "Rental"],
    stats: ["Brand activation", "24x8m", "Nomadic", "1 day setup"]
  }
];

export const homeHero = [
  { type: "image", src: "images/NUBE01.jpg.webp", thumb: "images/SMNUBE01.jpg.webp", alt: "Exterior of Nube 01" },
  { type: "video", src: "videos/NUBEHeader01.mp4", thumb: "images/SMNUBE08.jpg.webp", alt: "Behind the process" },
  { type: "image", src: "images/NUBE08.jpg.webp", thumb: "images/SMNUBE08.jpg.webp", alt: "The tensors of a Nube" },
  { type: "video", src: "videos/NUBEHeader.mp4", thumb: "images/SMNUBE_01_4.jpg.webp", alt: "Inflating a cloud" },
  { type: "image", src: "images/NUBE_01_4.jpg.webp", thumb: "images/SMNUBE_01_4.jpg.webp", alt: "Inside the cloud" },
  { type: "video", src: "videos/NUBEHeader05.mp4", thumb: "images/SMNUBE01.jpg.webp", alt: "Overview of a cloud" }
];

export const homeSlider = [
  {
    image: "images/NubeIVPaseoFestivalEEUU201827.jpg.webp",
    title: "Lightweight sustainable materials tailored to each Nube"
  },
  {
    image: "images/20210618_132623.jpg.webp",
    title: "Well-designed, unique and safe temporary structures made in Spain"
  },
  {
    image: "images/686e43a31b050_NubeIVJeepsterpartyMediaseet201711.jpg.webp",
    title: "Shaped with the power of air leaving no trace behind"
  }
];

export const homeCards = [
  products[1],
  products[7],
  { ...products[5], image: "images/Nube07_CARD_LABEL.png.webp", title: "Music is in the air" }
];

export const caseStudies = [
  {
    title: "San Miguel",
    subtitle: "American's Cup",
    href: "/product/nube08",
    type: "video",
    src: "videos/NUBEHeader01.mp4"
  },
  {
    title: "Space 10",
    subtitle: "Denmark",
    href: "/product/nube02",
    type: "image",
    src: "images/NubeIISpace10201719.jpg.webp"
  },
  {
    title: "Cuatro",
    subtitle: "Mediaset",
    href: "/product/nube04",
    type: "image",
    src: "images/NubeIVJeepsterpartyMediaseet201711.jpg.webp"
  },
  {
    title: "Jeep",
    subtitle: "Launch event",
    href: "/product/nube04",
    type: "image",
    src: "images/68710ce150059_NubeIVJeepsterpartyMediaseet201720.jpg.webp"
  },
  {
    title: "Paseo Festival",
    subtitle: "USA",
    href: "/product/nube01",
    type: "image",
    src: "images/NUBE_01_12.jpg.webp"
  }
];

export const workSteps = [
  {
    kicker: "01",
    title: "Concept",
    text: "A first spatial idea shaped around audience, brand and location.",
    type: "video",
    src: "videos/Nube_Proceso_01_Concept.mp4"
  },
  {
    kicker: "02",
    title: "Design",
    text: "Geometry, pressure and fabric become a temporary architecture system.",
    type: "image",
    src: "images/NUBE_02_9.jpg.webp"
  },
  {
    kicker: "03",
    title: "Production",
    text: "Every Nube is handcrafted in local workshops with durable materials.",
    type: "image",
    src: "images/NUBE_04_8.jpg"
  }
];

export const team = [
  {
    image: "images/team1.jpg",
    role: "Co-Founder & Design Director",
    name: "Miguel A. Maure",
    text: "Architect and researcher behind the studio's spatial language."
  },
  {
    image: "images/team.jpg",
    role: "Co-Founder & Managing Director",
    name: "Hugo Cifre",
    text: "Architect and entrepreneur focused on technology and international projects."
  }
];

export const clients = [
  {
    image: "images/NUBE_02_9.jpg.webp",
    title: "Space 10",
    text: "A Nube for a research and design event in Copenhagen.",
    href: "/product/nube02"
  },
  {
    image: "images/NUBE_04_8.jpg",
    title: "Airbus",
    text: "An event in Sevilla about innovation and new realities.",
    href: "/product/nube04"
  },
  {
    image: "images/NUBE_08_2.jpg.webp",
    title: "San Miguel",
    text: "Three cities, one Nube travelling across the Mediterranean.",
    href: "/product/nube08"
  }
];

export const productGallery = [
  { type: "image", src: "images/NUBE01.jpg.webp", alt: "Cloud opening toward the sky" },
  { type: "image", src: "images/ZO5A4434.jpg.webp", alt: "Evening event with red lights" },
  { type: "image", src: "images/03NubeII.jpg.webp", alt: "Tensioners from the cloud ceiling" }
];

export const productDetails = [
  { image: "images/01NubeII.jpg.webp", title: "Compact scale that unfolds into a monumental space" },
  { image: "images/ZO5A4633.jpg.webp", title: "Oval design with a central oculus open to the sky" },
  { image: "images/ZO5A4427.jpg.webp", title: "Inner courtyard garden transforming the space into a sensory retreat" }
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
