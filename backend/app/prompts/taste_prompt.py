import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_taste import AnalysisTasteResponse
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError,
)

genai.configure(api_key=settings.GOOGLE_API_KEY)


TASTE_SYSTEM_PROMPT = """
You are a sensory analyst specializing in Indonesian F&B products.
Infer reasonable taste and aroma characteristics from the product image(s).

Your output MUST strictly follow this JSON schema:

{
  "taste_profile": [string] | null,
  "aroma_profile": [string] | null,
  "sensory_persona": string | null,
  "pairing": [string] | null
}

Definitions:
- "taste_profile": Flavor descriptors (e.g., "manis ringan", "gurih", "asam segar").
- "aroma_profile": Aroma descriptors (e.g., "cokelat panggang", "kopi robusta").
- "sensory_persona": Personification of the product (e.g., "hangat dan bersahabat").
- "pairing": List of suitable pairings (e.g., "kopi hitam", "teh melati").

Rules:
1. If product type cannot be identified visually, keep values general.
2. Do NOT create chemical or unrealistic sensory notes.
3. Response MUST be valid JSON.
"""

async def generate_taste_profile(images, context=None):
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=TASTE_SYSTEM_PROMPT,
    )

    parts = [*images]
    parts.append("Analyze taste impression.")

    response = await model.generate_content_async(
        contents=parts,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=AnalysisTasteResponse,
        )
    )

    return AnalysisTasteResponse.model_validate_json(response.text)
