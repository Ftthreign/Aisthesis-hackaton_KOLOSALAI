import google.generativeai as genai

from app.config import settings
from app.schemas.vision import VisionResult
from app.prompts.vision_prompt import VISION_SYSTEM_PROMPT
from app.services.ai.prompt_builder import PromptFactory
from app.prompts.exceptions import GeminiAPIError

genai.configure(api_key=settings.GOOGLE_API_KEY)


class VisionService:

    @staticmethod
    async def analyze(images: list):
        prompt = PromptFactory.vision(images).build()

        model = genai.GenerativeModel(
            model_name=settings.GEMINI_VISION_MODEL,
            system_instruction=VISION_SYSTEM_PROMPT,
        )

        try:
            response = await model.generate_content_async(
                contents=prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=VisionResult,
                ),
            )

            return VisionResult.model_validate_json(response.text)

        except Exception as e:
            raise GeminiAPIError("Vision analysis failed", original_error=e)
