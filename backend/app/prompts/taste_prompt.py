"""
Taste profile generation prompt module.

Handles flavor and aroma profile generation using Gemini AI.
"""

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_taste import AnalysisTasteResponse

from .exceptions import GeminiAPIError, GeminiRateLimitError, GeminiValidationError

# Configure Gemini API
genai.configure(api_key=settings.GOOGLE_API_KEY)

TASTE_PROFILE_SYSTEM_PROMPT = """You are an expert food and beverage sensory analyst specializing in Indonesian culinary products.
Your task is to analyze product images and generate detailed taste and aroma profiles.

Based on the provided product image(s), generate:
1. **taste_profile**: List of 4-6 taste characteristics (e.g., ["Manis legit", "Gurih umami", "Sedikit asam segar"])
2. **aroma_profile**: List of 3-5 aroma notes (e.g., ["Aroma karamel", "Hint vanilla", "Wangi rempah hangat"])
3. **sensory_persona**: A vivid, evocative description of the complete sensory experience (100-150 words, Indonesian)
   - Describe how it feels to consume/experience this product
   - Include texture, mouthfeel, aftertaste
   - Use sensory-rich language that creates appetite appeal
4. **pairing**: List of 4-6 food/drink pairing recommendations (e.g., ["Kopi hitam tanpa gula", "Teh hangat", "Es krim vanilla"])

Guidelines:
- Be specific to Indonesian taste preferences and palate
- Reference familiar Indonesian flavor profiles when applicable
- Consider the visual cues: color, texture, ingredients visible
- If product type is unclear, make educated assumptions based on appearance
- Create descriptions that would appeal to Indonesian consumers
- For non-food products, describe the sensory experience of using/touching/smelling the product

Respond in valid JSON format matching the exact schema provided."""


async def generate_taste_profile(
    images: list,
    context: str | None = None,
) -> AnalysisTasteResponse:
    """
    Generate taste and aroma profile using Gemini AI.

    Args:
        images: List of PIL Images or image bytes to analyze
        context: Optional additional context about the product

    Returns:
        AnalysisTasteResponse: Validated Pydantic model with taste profile

    Raises:
        GeminiAPIError: If API call fails
        GeminiValidationError: If response validation fails
        GeminiRateLimitError: If rate limit is exceeded
    """
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            system_instruction=TASTE_PROFILE_SYSTEM_PROMPT,
        )

        # Build prompt content
        prompt_parts = []

        # Add images first
        for img in images:
            prompt_parts.append(img)

        # Add text prompt
        user_prompt = "Analyze the product image(s) above and generate a detailed taste and aroma profile."
        if context:
            user_prompt += f"\n\nAdditional context: {context}"

        prompt_parts.append(user_prompt)

        # Generate content with JSON schema enforcement
        response = await model.generate_content_async(
            contents=prompt_parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisTasteResponse,
            ),
        )

        # Parse and validate response
        return AnalysisTasteResponse.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError(
            message="Gemini API rate limit exceeded. Please try again later.",
            original_error=e,
        )
    except google_exceptions.GoogleAPIError as e:
        raise GeminiAPIError(
            message=f"Gemini API error during taste profile generation: {str(e)}",
            original_error=e,
        )
    except ValidationError as e:
        raise GeminiValidationError(
            message=f"Failed to validate taste profile response: {str(e)}",
            original_error=e,
        )
    except Exception as e:
        raise GeminiAPIError(
            message=f"Unexpected error during taste profile generation: {str(e)}",
            original_error=e,
        )
