import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_person import AnalysisPersonaResponse
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError,
)

genai.configure(api_key=settings.GOOGLE_API_KEY)


PERSONA_SYSTEM_PROMPT = """
You are a consumer research analyst specializing in Indonesian UMKM buyers.

Generate a buyer persona based solely on the product’s visual characteristics.

Your output MUST follow this JSON structure:

{
  "name": string | null,
  "bio": string | null,
  "demographics": object | null,
  "motivations": [string] | null,
  "pain_points": [string] | null
}

Guidelines:
- Demographics include: age range, location type, lifestyle.
- Motivations must be purchase-related.
- Pain_points are obstacles preventing the purchase.

Response MUST be JSON only.
"""

async def generate_persona(images, context=None):
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=PERSONA_SYSTEM_PROMPT,
    )

    parts = [*images, "Generate buyer persona."]

    response = await model.generate_content_async(
        contents=parts,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=AnalysisPersonaResponse,
        )
    )

    return AnalysisPersonaResponse.model_validate_json(response.text)
