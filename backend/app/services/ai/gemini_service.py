import google.generativeai as genai
from app.prompts.exceptions import GeminiAPIError
from app.config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)


class GeminiService:

    @staticmethod
    async def generate(prompt: list, schema):
        model = genai.GenerativeModel(
            settings.GEMINI_LLM_MODEL,
            system_instruction=prompt[0],
        )

        try:
            response = await model.generate_content_async(
                contents=prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )

            return schema.model_validate_json(response.text)

        except Exception as e:
            raise GeminiAPIError("LLM generation failed", original_error=e)
