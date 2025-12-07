// API Response Types based on backend documentation

// Generic wrapper for all API responses
export interface DataResponse<T> {
  data: T;
}

// Analysis Status Enum
export type AnalysisStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserResponse = DataResponse<User>;

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type TokenResponse = DataResponse<TokenData>;

export interface VisionResult {
  labels: string[] | null;
  colors: string[] | null;
  objects: string[] | null;
  mood: string | null;
  raw?: Record<string, unknown> | null;
}

export interface Story {
  product_name: string | null;
  tagline: string | null;
  short_desc: string | null;
  long_desc: string | null;
  caption_casual: string | null;
  caption_professional: string | null;
  caption_storytelling: string | null;
}

export interface Taste {
  taste_profile: string[] | null;
  aroma_profile: string[] | null;
  sensory_persona: string | null;
  pairing: string[] | null;
}

export interface Pricing {
  recommended_price: number | null;
  min_price: number | null;
  max_price: number | null;
  reasoning: string | null;
  promo_strategy: string[] | null;
  best_posting_time: string | null;
}

export interface BrandTheme {
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  tone: string | null;
  style_suggestions: string[] | null;
}

export interface SEO {
  keywords: string[] | null;
  hashtags: string[] | null;
}

export interface Marketplace {
  shopee_desc: string | null;
  tokopedia_desc: string | null;
  instagram_desc: string | null;
}

// Demographics is now a flexible dictionary
export interface Demographics {
  age_range?: string;
  location?: string;
  gender?: string;
  [key: string]: unknown;
}

export interface Persona {
  name: string | null;
  bio: string | null;
  demographics: Demographics | null;
  motivations: string[] | null;
  pain_points: string[] | null;
}

export interface Packaging {
  suggestions: string[] | null;
  material_recommendations: string[] | null;
}

export interface ActionPlan {
  day_1: string | null;
  day_2: string | null;
  day_3: string | null;
  day_4: string | null;
  day_5: string | null;
  day_6: string | null;
  day_7: string | null;
}

// Analysis creation response (async - 202 Accepted)
export interface AnalysisCreateData {
  id: string;
  status: AnalysisStatus;
}

export type AnalysisCreateResponse = DataResponse<AnalysisCreateData>;

// Full analysis data (when completed or polling)
export interface AnalysisData {
  id: string;
  status: AnalysisStatus;
  error?: string | null;
  image_url: string;
  image_filename: string;
  created_at: string;
  updated_at: string;
  vision_result: VisionResult | null;
  story: Story | null;
  taste: Taste | null;
  pricing: Pricing | null;
  brand_theme: BrandTheme | null;
  seo: SEO | null;
  marketplace: Marketplace | null;
  persona: Persona | null;
  packaging: Packaging | null;
  action_plan: ActionPlan | null;
}

export type AnalysisResponse = DataResponse<AnalysisData>;

// Legacy type for backwards compatibility with existing components
// Maps AnalysisData for easier consumption
export type AnalysisResult = AnalysisData;

export interface ApiError {
  detail: string;
  status: number;
}

// Validation error from FastAPI
export interface ValidationErrorItem {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: unknown;
}

export interface ValidationError {
  detail: ValidationErrorItem[];
}
