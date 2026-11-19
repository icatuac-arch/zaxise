import {
  Calendar,
  Ticket,
  Wrench,
  Calculator,
  Clock,
  Tag,
  Home,
  Brain,
  Globe,
  Share2,
  Film,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  accentColor: string;
  features: string[];
  url: string;
  category: ProductCategory;
  badge?: string;
}

export type ProductCategory =
  | "events"
  | "tools"
  | "lifestyle"
  | "knowledge"
  | "finance"
  | "creative";

export const categoryLabels: Record<ProductCategory, string> = {
  events: "Events & Ticketing",
  tools: "Tools & Utilities",
  lifestyle: "Lifestyle",
  knowledge: "Knowledge & Discovery",
  finance: "Finance & Planning",
  creative: "Creative & Social",
};

export const categoryDescriptions: Record<ProductCategory, string> = {
  events: "Discover, create, and manage events with powerful ticketing",
  tools: "Browser-based tools that run instantly — no sign-up needed",
  lifestyle: "Smart tools for everyday life decisions",
  knowledge: "Learn something new every day",
  finance: "Make smarter money moves",
  creative: "Create content and grow your audience",
};

export const products: Product[] = [
  {
    id: "indianprograms",
    name: "IndianPrograms",
    tagline: "Discover Indian Cultural Events",
    description:
      "The #1 platform for Indian music, dance, theater, comedy, and film events across the United States. Browse by city, language, category, and price.",
    icon: Calendar,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    accentColor: "#f97316",
    features: [
      "Events across 50+ US cities",
      "Filter by language & genre",
      "Artist profiles & bios",
      "Business directory",
    ],
    url: "https://indianprograms.com",
    category: "events",
    badge: "Popular",
  },
  {
    id: "tikvite",
    name: "Tikvite",
    tagline: "Event Ticketing Made Simple",
    description:
      "Create events, sell tickets, and manage check-ins with QR code scanning. A complete ticketing platform for organizers of any size.",
    icon: Ticket,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    accentColor: "#8b5cf6",
    features: [
      "QR code check-in",
      "Seat management",
      "Real-time analytics",
      "Embeddable widgets",
    ],
    url: "https://tikvite.com",
    category: "events",
  },
  {
    id: "free-tools",
    name: "MediaToolkit",
    tagline: "30+ Free Browser Tools",
    description:
      "PDF manipulation, image editing, developer tools, and text utilities — all running client-side in your browser with zero uploads.",
    icon: Wrench,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    accentColor: "#06b6d4",
    features: [
      "PDF merge, split & compress",
      "Image resize & convert",
      "QR code generator",
      "Developer utilities",
    ],
    url: "https://mediatoolkit.zaxise.com",
    category: "tools",
    badge: "Free",
  },
  {
    id: "allcalc",
    name: "AllCalc",
    tagline: "50+ Calculators & Converters",
    description:
      "Every calculator you'll ever need — math, finance, health, science, cooking, and unit converters all in one place.",
    icon: Calculator,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    accentColor: "#10b981",
    features: [
      "Financial calculators",
      "Health & fitness tools",
      "Unit converters",
      "Scientific calculations",
    ],
    url: "https://allcalc.zaxise.com",
    category: "tools",
  },
  {
    id: "datezonely",
    name: "DateZonely",
    tagline: "Time, Dates & Astronomy",
    description:
      "Live world clocks, timezone converter, moon phases, eclipse tracking, ISS tracker, and NASA data — your window to time and space.",
    icon: Clock,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    accentColor: "#3b82f6",
    features: [
      "Live world clocks",
      "Timezone converter",
      "Eclipse & moon tracker",
      "ISS live position",
    ],
    url: "https://datezonely.com",
    category: "tools",
  },
  {
    id: "deals",
    name: "Tech Deals",
    tagline: "Verified Daily Tech Deals",
    description:
      "Daily verified deals on phones, TVs, laptops, audio, gaming, and more. Every price checked on the retailer's own page. Historical lows and MSRP restocks.",
    icon: Tag,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    accentColor: "#eab308",
    features: [
      "Verified daily prices",
      "Historical low tracking",
      "Direct retailer links",
      "15+ categories",
    ],
    url: "/deals",
    category: "finance",
    badge: "Daily",
  },
  {
    id: "rent-or-buy",
    name: "Rent or Buy",
    tagline: "Smart Home Decision Calculator",
    description:
      "Compare renting vs buying with detailed amortization schedules, break-even analysis, and monthly cost projections.",
    icon: Home,
    gradient: "from-teal-500 via-cyan-500 to-blue-500",
    accentColor: "#14b8a6",
    features: [
      "Side-by-side comparison",
      "Amortization schedule",
      "Break-even timeline",
      "Tax benefit analysis",
    ],
    url: "https://rentorbuy.zaxise.com",
    category: "finance",
  },
  {
    id: "didyouknow",
    name: "Did You Know",
    tagline: "40,000+ Amazing Facts",
    description:
      "Explore a universe of trivia across 40 categories with immersive themes, quizzes, difficulty levels, and streak tracking.",
    icon: Brain,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    accentColor: "#ec4899",
    features: [
      "40 categories",
      "Quiz & game modes",
      "Difficulty levels",
      "Daily streaks",
    ],
    url: "https://didyouknow.zaxise.com",
    category: "knowledge",
    badge: "40K+ Facts",
  },
  {
    id: "worldtourly",
    name: "WorldTourly",
    tagline: "Plan Your Dream Trip",
    description:
      "Cascading destination guides from countries to cities, with Top 10 lists, budget calculators, interactive maps, and local tips.",
    icon: Globe,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    accentColor: "#22c55e",
    features: [
      "Country to city guides",
      "Budget calculator",
      "Interactive maps",
      "Hidden gems finder",
    ],
    url: "https://worldtourly.com",
    category: "knowledge",
  },
  {
    id: "socialmarketly",
    name: "SocialMarketly",
    tagline: "Social Media Management",
    description:
      "Schedule posts, track analytics, and manage all your social accounts from one dashboard. Free forever.",
    icon: Share2,
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    accentColor: "#d946ef",
    features: [
      "Multi-platform scheduling",
      "Analytics dashboard",
      "Audience insights",
      "Content calendar",
    ],
    url: "https://socialmarketly.com",
    category: "creative",
    badge: "Free",
  },
  {
    id: "reelmaker",
    name: "ReelMaker",
    tagline: "AI Concert Video Editor",
    description:
      "Turn raw concert footage into polished, ready-to-post short reels with AI-powered moment detection and multi-camera sync.",
    icon: Film,
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    accentColor: "#ef4444",
    features: [
      "AI moment detection",
      "Multi-camera sync",
      "Auto phrase boundaries",
      "Batch processing",
    ],
    url: "https://reelmaker.zaxise.com",
    category: "creative",
  },
  {
    id: "alpaca-trading",
    name: "TradeBot",
    tagline: "Algorithmic Day Trading",
    description:
      "Automated intraday trading strategies with signal tracking and performance logging. Built for Interactive Brokers.",
    icon: TrendingUp,
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    accentColor: "#84cc16",
    features: [
      "Multiple strategies",
      "Signal tracking",
      "Performance logs",
      "IB integration",
    ],
    url: "https://tradebot.zaxise.com",
    category: "finance",
  },
];

export const categories = Object.keys(categoryLabels) as ProductCategory[];

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}
