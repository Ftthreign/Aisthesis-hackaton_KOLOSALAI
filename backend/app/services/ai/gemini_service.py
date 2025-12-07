import logging

import google.generativeai as genai

from app.config import settings
from app.prompts.exceptions import GeminiAPIError

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GOOGLE_API_KEY)


class GeminiService:
    @staticmethod
    async def generate(prompt: list, schema):
        """
        Generate content using Gemini API.

        Args:
            prompt: A list containing message dicts in format:
                   [{"role": "user", "parts": [{"text": "system prompt"}, image_data, {"text": "user text"}]}]
            schema: Pydantic model for response validation
        """
        # Extract system instruction from the first text part
        system_instruction = None
        contents = []

        try:
            if prompt and len(prompt) > 0:
                first_message = prompt[0]
                if isinstance(first_message, dict) and "parts" in first_message:
                    parts = first_message["parts"]
                    # First text part is the system instruction
                    if parts and isinstance(parts[0], dict) and "text" in parts[0]:
                        system_instruction = parts[0]["text"]
                        # Remove system instruction from parts for contents
                        remaining_parts = parts[1:] if len(parts) > 1 else []
                        contents = [{"role": "user", "parts": remaining_parts}]
                    else:
                        contents = prompt
                else:
                    contents = prompt

            logger.debug(
                f"Creating Gemini model with model={settings.GEMINI_LLM_MODEL}"
            )

            model = genai.GenerativeModel(
                settings.GEMINI_LLM_MODEL,
                system_instruction=system_instruction,
            )

            logger.debug(f"Calling Gemini API for schema={schema.__name__}")

            # Don't pass response_schema to avoid issues with default values
            # Instead, just request JSON and validate with Pydantic afterwards
            response = await model.generate_content_async(
                contents=contents,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                ),
            )

            if not response.text:
                logger.error(
                    f"Empty response from Gemini API for schema={schema.__name__}"
                )
                raise GeminiAPIError("Empty response from Gemini API")

            logger.debug(
                f"Gemini API response received, length={len(response.text)} chars"
            )

            # Validate response with Pydantic schema
            result = schema.model_validate_json(response.text)
            logger.debug(
                f"Successfully validated response for schema={schema.__name__}"
            )

            return result

        except GeminiAPIError:
            raise
        except Exception as e:
            logger.error(
                f"LLM generation failed for schema={schema.__name__ if schema else 'unknown'}: {type(e).__name__}: {str(e)}"
            )
            raise GeminiAPIError(
                f"LLM generation failed: {type(e).__name__}: {str(e)}", original_error=e
            )
