import google.generativeai as genai
import logging
from typing import get_type_hints

from app.config import settings
from app.schemas.vision import VisionResult
from app.prompts.vision_prompt import VISION_SYSTEM_PROMPT
from app.services.ai.prompt_builder import PromptFactory
from app.prompts.exceptions import GeminiAPIError

logger = logging.getLogger(__name__)


class VisionService:
    """Vision analysis service using Google Gemini."""
    
    _configured = False
    
    @classmethod
    def _ensure_configured(cls):
        """Ensure Gemini is configured (idempotent)."""
        if not cls._configured:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            cls._configured = True
            logger.info("✅ Gemini API configured")

    @staticmethod
    def _convert_schema_for_gemini(pydantic_model):
        """
        Convert Pydantic model to Gemini-compatible schema.
        Removes unsupported fields like 'default', 'title', etc.
        """
        schema = pydantic_model.model_json_schema()
        
        def clean_schema(obj):
            """Recursively remove unsupported fields."""
            if isinstance(obj, dict):
                # Remove fields that Gemini doesn't support
                unsupported_fields = ['default', 'title', 'examples', 'description']
                cleaned = {k: v for k, v in obj.items() if k not in unsupported_fields}
                
                # Recursively clean nested objects
                return {k: clean_schema(v) for k, v in cleaned.items()}
            elif isinstance(obj, list):
                return [clean_schema(item) for item in obj]
            else:
                return obj
        
        cleaned = clean_schema(schema)
        logger.debug(f"Cleaned schema: {cleaned}")
        return cleaned

    @staticmethod
    async def analyze(images: list):
        """
        Analyze product images using Gemini Vision.
        
        Args:
            images: List of uploaded Gemini File objects
            
        Returns:
            VisionResult: Parsed vision analysis results
            
        Raises:
            GeminiAPIError: If vision analysis fails
        """
        try:
            # Ensure API is configured
            VisionService._ensure_configured()
            
            logger.info(f"🔄 Building vision prompt for {len(images)} image(s)")
            prompt = PromptFactory.vision(images).build()

            logger.info(f"🔄 Initializing Gemini model: {settings.GEMINI_VISION_MODEL}")
            model = genai.GenerativeModel(
                settings.GEMINI_VISION_MODEL,
                system_instruction=VISION_SYSTEM_PROMPT,
            )


            logger.info("🔄 Calling Gemini API for vision analysis")
            
            # Option 1: Use cleaned schema (recommended)
            try:
                response = await model.generate_content_async(
                    contents=prompt,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        # Don't pass schema, let Gemini generate free-form JSON
                    ),
                )
            except Exception as schema_error:
                logger.warning(f"Failed with schema approach: {schema_error}")
                # Fallback: Generate without schema constraint
                response = await model.generate_content_async(
                    contents=prompt,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                    ),
                )

            logger.info("✅ Gemini API call successful, parsing response")
            
            # Validate response text exists
            if not response.text:
                raise GeminiAPIError(
                    "Empty response from Gemini API",
                    original_error=ValueError("response.text is empty")
                )
            
            logger.info(f"📝 Response text length: {len(response.text)} chars")
            logger.debug(f"📝 Response preview: {response.text[:200]}...")
            
            # Parse and validate with Pydantic
            result = VisionResult.model_validate_json(response.text)
            logger.info("✅ Vision analysis completed successfully")
            
            return result

        except GeminiAPIError:
            # Re-raise custom errors as-is
            raise
            
        except Exception as e:
            # Wrap all other errors
            logger.error(f"❌ Vision analysis failed: {type(e).__name__}: {str(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise GeminiAPIError(
                f"Vision analysis failed: {type(e).__name__}",
                original_error=e
            )