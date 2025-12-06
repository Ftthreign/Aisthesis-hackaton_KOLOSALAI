import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_action_plan import AnalysisActionPlanResponse
from .exceptions import GeminiAPIError, GeminiRateLimitError, GeminiValidationError


ACTION_PLAN_SYSTEM_PROMPT = """
You are a business strategist for Indonesian UMKM sellers.

Create a 7-day action plan based ONLY on what is visible in the product image(s).

Your output MUST strictly follow this EXACT JSON structure:

{
  "day_1": string | null,
  "day_2": string | null,
  "day_3": string | null,
  "day_4": string | null,
  "day_5": string | null,
  "day_6": string | null,
  "day_7": string | null
}

Rules:
- Each day must contain ONE actionable, practical task (1–2 sentences only).
- Tasks must be specific to the product shown.
- No vague motivation, no marketing theory, no fluff.
- No introductory text, no explanations, no markdown.
- Output MUST be valid JSON. No extra characters before or after JSON.
"""


async def generate_action_plan(images, context=None):
    """
    Generate 7-day action plan JSON using Gemini with schema validation.
    """

    try:
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            system_instruction=ACTION_PLAN_SYSTEM_PROMPT,
        )

        prompt_parts = []

        # Add image files
        for img in images:
            prompt_parts.append(img)

        # Add instruction
        user_prompt = "Generate the 7-day action plan in JSON format only."
        if context:
            user_prompt += f"\nAdditional context: {context}"

        prompt_parts.append(user_prompt)

        # Generate response with schema enforcement
        response = await model.generate_content_async(
            contents=prompt_parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisActionPlanResponse,
            ),
        )

        return AnalysisActionPlanResponse.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError("Gemini API rate limit exceeded.", e)

    except google_exceptions.GoogleAPIError as e:
        raise GeminiAPIError("Gemini API internal failure.", e)

    except ValidationError as e:
        raise GeminiValidationError("Action plan JSON did not match schema.", e)

    except Exception as e:
        raise GeminiAPIError("Unexpected error during action plan generation.", e)
