import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_marketplace import AnalysisMarketplaceResponse
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError,
)

genai.configure(api_key=settings.GOOGLE_API_KEY)


MARKETPLACE_SYSTEM_PROMPT = """
You are a content writer for Shopee, Tokopedia, and Instagram Shop.

Generate marketplace-ready product descriptions based ONLY on visible product traits.

Your output MUST follow this JSON schema:

{
  "shopee_desc": string | null,
  "tokopedia_desc": string | null,
  "instagram_desc": string | null
}

Guidelines:
- Shopee: short bullet-style Indonesian.
- Tokopedia: clearer and slightly more detailed.
- Instagram: friendly, persuasive, 1–2 sentences.
- Do NOT use hashtags.

Response MUST be JSON only.
"""


async def generate_marketplace(images, context=None):
    """Generate marketplace descriptions using Gemini AI."""
    try:
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            system_instruction=MARKETPLACE_SYSTEM_PROMPT,
        )

        parts = [*images]
        text = "Generate marketplace descriptions."
        if context:
            text += f"\nContext: {context}"
        parts.append(text)

        response = await model.generate_content_async(
            contents=parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisMarketplaceResponse,
            ),
        )

        return AnalysisMarketplaceResponse.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError("Rate limit exceeded", e)
    except ValidationError as e:
        raise GeminiValidationError("Marketplace JSON validation failed", e)
    except Exception as e:
        raise GeminiAPIError("Marketplace generation error", e)
