"""
Brand theme generation prompt module.

Handles visual identity and color palette generation using Gemini AI.
"""

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_branding import AnalysisBrandThemeResponse

from .exceptions import GeminiAPIError, GeminiRateLimitError, GeminiValidationError

# Configure Gemini API
genai.configure(api_key=settings.GOOGLE_API_KEY)

BRAND_THEME_SYSTEM_PROMPT = """You are an expert brand identity designer specializing in Indonesian UMKM products.
Your task is to analyze product images and recommend a cohesive brand theme.

Based on the provided product image(s), generate:
1. **primary_color**: The main brand color in hex format (e.g., "#E74C3C") - should complement the product
2. **secondary_color**: A supporting color in hex format that pairs well with primary
3. **accent_color**: A highlight/accent color in hex format for CTAs and emphasis
4. **tone**: The brand voice/personality (e.g., "Hangat dan ramah", "Premium dan eksklusif", "Playful dan energik")
5. **style_suggestions**: List of 3-5 specific styling recommendations for:
   - Photography style
   - Typography suggestions
   - Social media aesthetic
   - Packaging design direction
   - Overall brand mood

Consider:
- Colors that naturally appear in or complement the product
- Indonesian market preferences and cultural color meanings
- Color psychology for the target demographic
- Consistency across digital and physical touchpoints
- Accessibility and readability of color combinations

Respond in valid JSON format matching the exact schema provided."""


async def generate_brand_theme(
    images: list,
    context: str | None = None,
) -> AnalysisBrandThemeResponse:
    """
    Generate brand theme and visual identity using Gemini AI.

    Args:
        images: List of PIL Images or image bytes to analyze
        context: Optional additional context about the brand/product

    Returns:
        AnalysisBrandThemeResponse: Validated Pydantic model with brand theme

    Raises:
        GeminiAPIError: If API call fails
        GeminiValidationError: If response validation fails
        GeminiRateLimitError: If rate limit is exceeded
    """
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            system_instruction=BRAND_THEME_SYSTEM_PROMPT,
        )

        # Build prompt content
        prompt_parts = []

        # Add images first
        for img in images:
            prompt_parts.append(img)

        # Add text prompt
        user_prompt = "Analyze the product image(s) above and generate a comprehensive brand theme recommendation."
        if context:
            user_prompt += f"\n\nAdditional context: {context}"

        prompt_parts.append(user_prompt)

        # Generate content with JSON schema enforcement
        response = await model.generate_content_async(
            contents=prompt_parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisBrandThemeResponse,
            ),
        )

        # Parse and validate response
        return AnalysisBrandThemeResponse.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError(
            message="Gemini API rate limit exceeded. Please try again later.",
            original_error=e,
        )
    except google_exceptions.GoogleAPIError as e:
        raise GeminiAPIError(
            message=f"Gemini API error during brand theme generation: {str(e)}",
            original_error=e,
        )
    except ValidationError as e:
        raise GeminiValidationError(
            message=f"Failed to validate brand theme response: {str(e)}",
            original_error=e,
        )
    except Exception as e:
        raise GeminiAPIError(
            message=f"Unexpected error during brand theme generation: {str(e)}",
            original_error=e,
        )
