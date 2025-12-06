import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_branding import AnalysisBrandThemeResponse
from .exceptions import GeminiAPIError, GeminiRateLimitError, GeminiValidationError


BRAND_THEME_SYSTEM_PROMPT = """
You are a professional brand identity strategist for Indonesian UMKM businesses.

Generate a cohesive brand theme using ONLY what is visible in the product image(s).

Your output MUST strictly follow this JSON structure:

{
  "primary_color": string | null,
  "secondary_color": string | null,
  "accent_color": string | null,
  "tone": string | null,
  "style_suggestions": [string] | null
}

Clarifications:
- Colors MUST be hex format (e.g., "#A83232").
- "tone" describes brand voice (e.g., "hangat dan ramah", "premium dan elegan").
- "style_suggestions": Specific, actionable creative directions (3–5 items).

Rules:
1. No abstract or poetic descriptions.
2. Colors must be logically derived from the product image.
3. Response MUST be JSON with no additional text.
""" 


async def generate_brand_theme(images, context=None):
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=BRAND_THEME_SYSTEM_PROMPT,
    )

    items = [*images]
    text = "Analyze brand theme." + (f"\nContext: {context}" if context else "")
    items.append(text)

    response = await model.generate_content_async(
        contents=items,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=AnalysisBrandThemeResponse,
        )
    )

    return AnalysisBrandThemeResponse.model_validate_json(response.text)
