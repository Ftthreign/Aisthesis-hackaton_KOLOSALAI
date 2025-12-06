import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_packaging import AnalysisPackagingResponse
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError,
)

genai.configure(api_key=settings.GOOGLE_API_KEY)


PACKAGING_SYSTEM_PROMPT = """
You are a packaging consultant for Indonesian UMKM products.

Generate packaging recommendations based on the product image(s).

Your output MUST follow this JSON schema:

{
  "suggestions": [string] | null,
  "material_recommendations": [string] | null
}

Guidelines:
- Suggest practical packaging options.
- Consider affordability + aesthetics.
- Recommendations must match the product category.

Response MUST be JSON only.
"""


async def generate_packaging(images, context=None):
    """Generate packaging recommendations using Gemini AI."""
    try:
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            system_instruction=PACKAGING_SYSTEM_PROMPT,
        )

        parts = [*images]
        text = "Generate packaging recommendations."
        if context:
            text += f"\nContext: {context}"
        parts.append(text)

        response = await model.generate_content_async(
            contents=parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisPackagingResponse,
            ),
        )

        return AnalysisPackagingResponse.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError("Rate limit exceeded", e)
    except ValidationError as e:
        raise GeminiValidationError("Packaging JSON validation failed", e)
    except Exception as e:
        raise GeminiAPIError("Packaging generation error", e)
