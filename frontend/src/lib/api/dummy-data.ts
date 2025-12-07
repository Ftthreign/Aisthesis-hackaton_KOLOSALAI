// Dummy data for development while backend is being built
import type {
  AnalysisData,
  HistoryItem,
  VisionResult,
  Story,
  Taste,
  Pricing,
  BrandTheme,
  SEO,
  Marketplace,
  Persona,
  Packaging,
  ActionPlan,
  User,
  AnalysisStatus,
} from "./types";

export const dummyUser: User = {
  id: "user-001",
  email: "demo@example.com",
  name: "Demo User",
  avatar_url: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const dummyVisionResult: VisionResult = {
  labels: ["Coffee", "Latte", "Cappuccino", "Hot Beverage", "Breakfast"],
  colors: ["#5C4033", "#D4A574", "#F5F5DC", "#8B4513", "#FFFFFF"],
  objects: ["Coffee Cup", "Saucer", "Spoon", "Latte Art", "Steam"],
  mood: "Cozy and inviting, perfect for morning routines",
  raw: {
    confidence: 0.95,
    detected_at: new Date().toISOString(),
  },
};

export const dummyStory: Story = {
  product_name: "Sunrise Café Latte",
  tagline: "Awaken Your Senses, One Sip at a Time",
  short_desc:
    "A perfectly crafted latte with premium arabica beans and velvety steamed milk, topped with beautiful latte art.",
  long_desc:
    "Experience the perfect harmony of rich, single-origin arabica espresso and silky steamed milk in our signature Sunrise Café Latte. Each cup is meticulously prepared by our skilled baristas who take pride in creating not just a beverage, but a moment of pure indulgence. The carefully selected beans are roasted to perfection, releasing notes of caramel, chocolate, and a subtle fruity undertone that dance on your palate. Whether you're starting your morning or taking a well-deserved afternoon break, this latte promises to elevate your coffee experience to new heights.",
  caption_casual:
    "☕ Nothing beats that first sip of morning coffee! Our latte is giving all the cozy vibes today ✨ #CoffeeLover #MorningVibes",
  caption_professional:
    "Introducing our signature Sunrise Café Latte - crafted with precision using premium single-origin arabica beans. Experience coffee excellence. ☕",
  caption_storytelling:
    "Every morning at 6 AM, before the city wakes, our barista Maria begins her ritual. The beans are ground, the milk is steamed, and magic happens. This isn't just coffee – it's the start of something beautiful. ☕✨",
};

export const dummyTaste: Taste = {
  taste_profile: [
    "Rich and bold espresso base",
    "Subtle caramel sweetness",
    "Hint of dark chocolate",
    "Smooth and creamy finish",
    "Light fruity undertones",
  ],
  aroma_profile: [
    "Fresh roasted coffee beans",
    "Sweet vanilla notes",
    "Warm milk fragrance",
    "Subtle nutty essence",
  ],
  sensory_persona:
    "A sophisticated morning companion that wraps you in warmth and comfort. This latte speaks to the refined coffee lover who appreciates the balance between bold espresso and velvety milk.",
  pairing: [
    "Butter croissant",
    "Almond biscotti",
    "Dark chocolate truffle",
    "Fresh fruit danish",
    "Avocado toast",
  ],
};

export const dummyPricing: Pricing = {
  recommended_price: 45000,
  min_price: 35000,
  max_price: 55000,
  reasoning:
    "Based on the premium ingredients, artisanal preparation, and current market positioning for specialty coffee in urban Indonesia, the recommended price of Rp 45,000 positions this latte in the premium segment while remaining competitive with established specialty coffee chains.",
  promo_strategy: [
    "Buy 5 Get 1 Free loyalty program",
    "Morning Rush discount (7-9 AM) - 15% off",
    "Bundle with pastry for Rp 65,000",
    "Student discount with valid ID - 10% off",
    "Happy Hour pricing on weekdays 2-4 PM",
  ],
  best_posting_time:
    "7:00 AM - 9:00 AM (Morning coffee rush) and 2:00 PM - 4:00 PM (Afternoon break)",
};

export const dummyBrandTheme: BrandTheme = {
  primary_color: "#5C4033",
  secondary_color: "#D4A574",
  accent_color: "#F97316",
  tone: "Warm, inviting, and sophisticated with a touch of modern elegance",
  style_suggestions: [
    "Use warm, earthy tones in all marketing materials",
    "Incorporate natural textures like wood and linen in product photography",
    "Maintain clean, minimalist design with focus on the product",
    "Use serif fonts for headlines to convey tradition and quality",
    "Include lifestyle imagery showing cozy café environments",
  ],
};

export const dummySEO: SEO = {
  keywords: [
    "specialty coffee",
    "artisan latte",
    "premium coffee Indonesia",
    "café latte Jakarta",
    "single origin coffee",
    "handcrafted coffee",
    "morning coffee",
    "coffee shop near me",
    "best latte",
    "arabica coffee",
  ],
  hashtags: [
    "#CoffeeLover",
    "#LatteArt",
    "#SpecialtyCoffee",
    "#MorningCoffee",
    "#CoffeeTime",
    "#CafeLife",
    "#CoffeeAddict",
    "#ArabicaCoffee",
    "#CoffeeShop",
    "#BaristaCraft",
    "#CoffeeOfTheDay",
    "#CoffeeCulture",
  ],
};

export const dummyMarketplace: Marketplace = {
  shopee_desc: `☕ SUNRISE CAFÉ LATTE - Premium Artisan Coffee ☕

🌟 BEST SELLER! Latte premium dengan biji arabika single-origin pilihan

✅ Apa yang Anda dapatkan:
• Espresso shot dengan biji arabika premium
• Susu segar berkualitas tinggi
• Latte art cantik di setiap cangkir
• Rasa bold dengan finish creamy

💝 PROMO SPESIAL:
• Beli 5 Gratis 1
• Free ongkir untuk pembelian min. Rp 100,000

📦 Pengiriman aman dengan packaging khusus
⭐ Rating 4.9/5 dari 1000+ ulasan

#KopiPremium #LatteArt #KopiIndonesia`,

  tokopedia_desc: `Sunrise Café Latte - Kopi Premium Artisan

Nikmati pengalaman kopi premium dengan Sunrise Café Latte kami. Dibuat dengan biji arabika single-origin yang dipanggang sempurna dan susu segar berkualitas tinggi.

Keunggulan Produk:
• Biji kopi arabika premium 100%
• Fresh roasted untuk rasa optimal
• Creamy dan smooth texture
• Perfect untuk pecinta kopi sejati

Informasi Produk:
• Berat: 250ml per serving
• Penyimpanan: Suhu ruangan, hindari sinar matahari langsung
• Best before: Segera konsumsi untuk kesegaran optimal

Garansi kepuasan pelanggan - uang kembali jika tidak puas!`,

  instagram_desc: `☕ Sunrise Café Latte

Awaken your senses with our signature latte. Premium arabica meets velvety steamed milk in perfect harmony.

✨ Single-origin beans
✨ Handcrafted with love
✨ Perfect latte art every time

📍 Available for delivery
🛒 Order via link in bio

#SunriseCafeLatte #PremiumCoffee #LatteLovers #CoffeeTime #MorningRitual #CafeVibes #CoffeeArt #IndonesiaCoffee`,
};

export const dummyPersona: Persona = {
  name: "Sarah Wijaya",
  bio: "A 28-year-old creative professional working at a digital agency in Jakarta. She values quality over quantity and sees her morning coffee ritual as an essential part of her self-care routine. She's willing to pay premium for experiences that bring joy to her daily life.",
  demographics: {
    age_range: "25-35 years old",
    location: "Urban areas - Jakarta, Surabaya, Bandung",
    gender: "Female (60%) / Male (40%)",
  },
  motivations: [
    "Seeking quality and premium experiences",
    "Values aesthetically pleasing products for social sharing",
    "Looking for consistent taste and quality",
    "Appreciates the artistry behind handcrafted beverages",
    "Wants to support local and artisan businesses",
  ],
  pain_points: [
    "Tired of inconsistent coffee quality",
    "Limited time for café visits during busy workdays",
    "Difficulty finding authentic specialty coffee",
    "Overwhelmed by too many options in the market",
  ],
};

export const dummyPackaging: Packaging = {
  suggestions: [
    "Use kraft paper cups with a matte finish for an eco-friendly, artisanal look",
    "Include a custom sleeve with the brand logo and a QR code linking to the coffee story",
    "Add a biodegradable lid with a small cutout for enjoying the aroma",
    "Consider reusable cup program with branded tumblers",
    "Use minimalist design with earth tones to reflect the natural coffee journey",
  ],
  material_recommendations: [
    "FSC-certified paper products",
    "Compostable PLA lids",
    "Soy-based inks for printing",
    "Recycled cardboard for carrier trays",
    "Plant-based adhesives",
  ],
};

export const dummyActionPlan: ActionPlan = {
  day_1:
    "Set up social media accounts (Instagram, TikTok) with consistent branding. Create a content calendar for the week. Design and order initial packaging materials.",
  day_2:
    "Photograph product from multiple angles with professional lighting. Create 5 variations of product shots for different platforms. Write and schedule first 3 Instagram posts.",
  day_3:
    "Set up Shopee and Tokopedia store listings with optimized descriptions. Configure payment and shipping options. Create promotional banners for marketplace stores.",
  day_4:
    "Launch soft opening campaign on Instagram Stories. Reach out to 10 micro-influencers for collaboration opportunities. Set up customer feedback collection system.",
  day_5:
    "Analyze first sales data and customer feedback. Adjust pricing or promotions if needed. Create behind-the-scenes content showing coffee preparation process.",
  day_6:
    "Implement loyalty program system. Send thank you messages to first customers. Plan next week's content based on engagement data.",
  day_7:
    "Review weekly performance metrics. Prepare monthly content themes. Set goals for the following week based on learnings.",
};

export const createDummyAnalysisData = (
  id: string,
  imageUrl?: string,
  status: AnalysisStatus = "COMPLETED",
): AnalysisData => {
  // For pending/processing states, return minimal data
  if (status === "PENDING" || status === "PROCESSING") {
    return {
      id,
      status,
      image_url: imageUrl || "/placeholder-coffee.jpg",
      image_filename: "coffee-latte.jpg",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vision_result: null,
      story: null,
      taste: null,
      pricing: null,
      brand_theme: null,
      seo: null,
      marketplace: null,
      persona: null,
      packaging: null,
      action_plan: null,
    };
  }

  // For failed state
  if (status === "FAILED") {
    return {
      id,
      status,
      error: "Analysis failed due to an internal error",
      image_url: imageUrl || "/placeholder-coffee.jpg",
      image_filename: "coffee-latte.jpg",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vision_result: null,
      story: null,
      taste: null,
      pricing: null,
      brand_theme: null,
      seo: null,
      marketplace: null,
      persona: null,
      packaging: null,
      action_plan: null,
    };
  }

  // For completed state, return full data
  return {
    id,
    status: "COMPLETED",
    image_url: imageUrl || "/placeholder-coffee.jpg",
    image_filename: "coffee-latte.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vision_result: dummyVisionResult,
    story: dummyStory,
    taste: dummyTaste,
    pricing: dummyPricing,
    brand_theme: dummyBrandTheme,
    seo: dummySEO,
    marketplace: dummyMarketplace,
    persona: dummyPersona,
    packaging: dummyPackaging,
    action_plan: dummyActionPlan,
  };
};

// Legacy function name for backwards compatibility
export const createDummyAnalysisResponse = createDummyAnalysisData;

export const dummyHistoryItems: HistoryItem[] = [
  {
    id: "analysis-001",
    image_url: "/placeholder-coffee.jpg",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "analysis-002",
    image_url: "/placeholder-cake.jpg",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "analysis-003",
    image_url: "/placeholder-noodle.jpg",
    status: "PROCESSING",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "analysis-004",
    image_url: "/placeholder-sushi.jpg",
    status: "FAILED",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
  },
];

// Simulate API delay
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
