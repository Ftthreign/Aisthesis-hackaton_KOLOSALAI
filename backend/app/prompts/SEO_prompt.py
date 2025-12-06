from pydantic import ValidationError

from app.config import settings
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError
)


SEO_SYSTEM_PROMPT = """
You are an SEO strategist for Indonesian online marketplaces and social media.

Generate SEO keywords and hashtags based on the product image(s).

Your output MUST follow this JSON schema:

{
  "keywords": [string] | null,
  "hashtags": [string] | null
}

Guidelines:
- Keywords must be high-intent Indonesian buyer queries.
- Hashtags must be simple, Indonesian, and no more than 12 total.
- No special characters besides "#".
- Do NOT duplicate words.

The response MUST be valid JSON only.
"""

async def generate_seo(images, context=None):
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=SEO_SYSTEM_PROMPT,
    )

    parts = [*images, "Generate SEO keywords and hashtags."]

    response = await model.generate_content_async(
        contents=parts,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=AnalysisSEOResponse,
        )
    )

    return AnalysisSEOResponse.model_validate_json(response.text)
