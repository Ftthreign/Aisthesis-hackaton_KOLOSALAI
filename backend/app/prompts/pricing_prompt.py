import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError
)

PRICING_SYSTEM_PROMPT = """
You recommend pricing for UMKM products based ONLY on visible packaging, quality cues, and market norms.

JSON:

{
  "recommended_price": float | null,
  "min_price": float | null,
  "max_price": float | null,
  "reasoning": string | null,
  "promo_strategy": [string] | null,
  "best_posting_time": string | null
}

Rules:
- Use Indonesian market context.
- Keep price realistic.
- JSON only.
"""

async def generate_pricing(images, context=None):
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=PRICING_SYSTEM_PROMPT,
    )

    parts = [*images, "Analyze pricing."]

    response = await model.generate_content_async(
        contents=parts,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=AnalysisPricingResponse,
        )
    )

    return AnalysisPricingResponse.model_validate_json(response.text)

