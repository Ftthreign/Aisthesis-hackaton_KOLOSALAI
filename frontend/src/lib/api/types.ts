// API Response Types based on backend documentation

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisionResult {
  labels: string[];
  colors: string[];
  objects: string[];
  mood: string;
  raw: Record<string, unknown>;
}

export interface Story {
  product_name: string;
  tagline: string;
  short_desc: string;
  long_desc: string;
  caption_casual: string;
  caption_professional: string;
  caption_storytelling: string;
}

export interface Taste {
  taste_profile: string[];
  aroma_profile: string[];
  sensory_persona: string;
  pairing: string[];
}

export interface Pricing {
  recommended_price: number;
  min_price: number;
  max_price: number;
  reasoning: string;
  promo_strategy: string[];
  best_posting_time: string;
}

export interface BrandTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  tone: string;
  style_suggestions: string[];
}

export interface SEO {
  keywords: string[];
  hashtags: string[];
}

export interface Marketplace {
  shopee_desc: string;
  tokopedia_desc: string;
  instagram_desc: string;
}

export interface Demographics {
  age_range: string;
  location: string;
  gender: string;
}

export interface Persona {
  name: string;
  bio: string;
  demographics: Demographics;
  motivations: string[];
  pain_points: string[];
}

export interface Packaging {
  suggestions: string[];
  material_recommendations: string[];
}

export interface ActionPlan {
  day_1: string;
  day_2: string;
  day_3: string;
  day_4: string;
  day_5: string;
  day_6: string;
  day_7: string;
}

export interface AnalysisResponse {
  id: string;
  image_url: string;
  image_filename: string;
  vision_result: VisionResult;
  story: Story;
  taste: Taste;
  pricing: Pricing;
  brand_theme: BrandTheme;
  seo: SEO;
  marketplace: Marketplace;
  persona: Persona;
  packaging: Packaging;
  action_plan: ActionPlan;
  created_at: string;
  updated_at: string;
}

export interface HistoryItem {
  id: string;
  image_url: string;
  created_at: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ApiError {
  detail: string;
  status: number;
}
