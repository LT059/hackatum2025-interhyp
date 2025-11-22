export interface House {
  id: string
  title: string
  type: "APPARTMENTBUY" | "HOUSEBUY" | "LANDBUY" | "GARAGEBUY" | "OFFICEBUY"
  buying_price: number
  rooms: number
  squaremeter: number
  image_url: string
  description: string
  publishDate: string
  rentPricePerSqm?: number
  grossReturn?: number
  constructionYear?: number
  pricePerSqm: number
}

export const MOCK_HOUSES: House[] = [
  {
    id: "1",
    title: "Cyber Loft Alpha",
    type: "APPARTMENTBUY",
    buying_price: 450000,
    rooms: 2,
    squaremeter: 85,
    image_url: "/cyberpunk-loft.jpg",
    description: "Compact living unit in the upper sector with integrated neural-link ports.",
    publishDate: "2025-11-15",
    rentPricePerSqm: 18.5,
    grossReturn: 4.2,
    constructionYear: 2024,
    pricePerSqm: 5294,
  },
  {
    id: "2",
    title: "Neon Villa",
    type: "HOUSEBUY",
    buying_price: 850000,
    rooms: 5,
    squaremeter: 200,
    image_url: "/neon-villa.jpg",
    description: "Luxury dwelling with private energy shield and smart-grid connection.",
    publishDate: "2025-10-20",
    rentPricePerSqm: 22.0,
    grossReturn: 5.1,
    constructionYear: 2023,
    pricePerSqm: 4250,
  },
  {
    id: "3",
    title: "Sector 7 Module",
    type: "APPARTMENTBUY",
    buying_price: 250000,
    rooms: 1,
    squaremeter: 45,
    image_url: "/scifi-module.jpg",
    description: "Efficient, stackable space for the modern nomad. Low carbon footprint.",
    publishDate: "2025-11-20",
    rentPricePerSqm: 16.0,
    grossReturn: 3.8,
    constructionYear: 2025,
    pricePerSqm: 5556,
  },
  {
    id: "4",
    title: "Sky-High Penthouse",
    type: "APPARTMENTBUY",
    buying_price: 1200000,
    rooms: 4,
    squaremeter: 180,
    image_url: "/luxury-penthouse.png",
    description: "Dominate the skyline. Features gravity-stabilized floors and panoramic views.",
    publishDate: "2025-09-10",
    rentPricePerSqm: 28.0,
    grossReturn: 4.5,
    constructionYear: 2024,
    pricePerSqm: 6667,
  },
  {
    id: "5",
    title: "Eco-Pod Beta",
    type: "HOUSEBUY",
    buying_price: 350000,
    rooms: 2,
    squaremeter: 70,
    image_url: "/eco-pod.jpg",
    description: "Sustainable living with biophilic design and aeroponic garden walls.",
    publishDate: "2025-11-01",
    rentPricePerSqm: 19.0,
    grossReturn: 4.8,
    constructionYear: 2025,
    pricePerSqm: 5000,
  },
]

export const LIFE_EVENTS = [
  {
    type: "career",
    title: "Career Promotion",
    description: "Your performance metrics have exceeded sector averages.",
    options: [
      { label: "Accept Lead Role", effect: { income: 1500, capital: 0 } },
      { label: "Cash Bonus", effect: { income: 0, capital: 5000 } },
    ],
  },
  {
    type: "market",
    title: "Crypto Crash",
    description: "Global credit markets are fluctuating wildly.",
    options: [
      { label: "Panic Sell", effect: { income: 0, capital: -2000 } },
      { label: "Hold Assets", effect: { income: -200, capital: 0 } },
    ],
  },
  {
    type: "family",
    title: "Family Expansion",
    description: "A new life enters your orbit. Costs will increase, but so will purpose.",
    options: [
      { label: "Welcome Child", effect: { income: -500, capital: -2000 } },
      { label: "Postpone", effect: { income: 0, capital: 0 } },
    ],
  },
  {
    type: "investment",
    title: "Startup Opportunity",
    description: "A promising tech startup is seeking early investors.",
    options: [
      { label: "Invest €10k", effect: { income: 0, capital: -10000 } },
      { label: "Pass", effect: { income: 0, capital: 0 } },
    ],
  },
]
