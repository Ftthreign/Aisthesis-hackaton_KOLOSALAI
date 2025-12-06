import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.vision import VisionResult
from app.prompts.exceptions import GeminiAPIError, GeminiRateLimitError, GeminiValidationError

genai.configure(api_key=settings.GOOGLE_API_KEY)

VISION_SYSTEM_PROMPT = """
You are a vision analysis model. Extract ONLY what is visible.

Return JSON with fields:
{
  "labels": [string] | null,
  "colors": [string] | null,
  "objects": [string] | null,
  "mood": string | null
}

Definitions:
- "labels": General categorization of the product (e.g., "food", "drink", "snack").
- "colors": Dominant colors in simple words (e.g., "red", "beige", "dark brown").
- "objects": Objects detected in the scene.
- "mood": Emotional tone conveyed by the product presentation (e.g., "warm", "fresh", "premium").
- "raw": Additional extracted metadata if relevant.

Rules:
1. Do not generate descriptions, only structured values.
2. Do not invent details not visible in the image.
3. Response MUST be valid JSON. No extra text.
"""

async def generate_vision(images: list):
    try:
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_VISION_MODEL,
            system_instruction=VISION_SYSTEM_PROMPT,
        )

        prompt_parts = [*images, "Analyze the product image(s)."]

        response = await model.generate_content_async(
            contents=prompt_parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=VisionResult,
            ),
        )

        return VisionResult.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError(message="Rate limit exceeded", original_error=e)
    except ValidationError as e:
        raise GeminiValidationError(message="Vision JSON validation failed", original_error=e)
    except Exception as e:
        raise GeminiAPIError(message="Vision generation error", original_error=e)
