import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_story import AnalysisStoryResponse
from .exceptions import (
    GeminiAPIError,
    GeminiRateLimitError,
    GeminiValidationError,
)

genai.configure(api_key=settings.GOOGLE_API_KEY)


STORY_SYSTEM_PROMPT = """
You are a product storytelling expert for Indonesian UMKM.

JSON:
{
  "product_name": string | null,
  "tagline": string | null,
  "short_desc": string | null,
  "long_desc": string | null,
  "caption_casual": string | null,
  "caption_professional": string | null,
  "caption_storytelling": string | null
}

Rules:
- Based ONLY on visible attributes.
- No hashtags.
- JSON only.
"""

async def generate_story(images, context=None):
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=STORY_SYSTEM_PROMPT,
    )

    parts = [*images]
    text = "Generate story." + (f"\nContext: {context}" if context else "")
    parts.append(text)

    response = await model.generate_content_async(
        contents=parts,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=AnalysisStoryResponse,
        )
    )

    return AnalysisStoryResponse.model_validate_json(response.text)
