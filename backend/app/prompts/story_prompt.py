"""
Story generation prompt module.

Handles product storytelling generation using Gemini AI.
"""

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis_story import AnalysisStoryResponse

from .exceptions import GeminiAPIError, GeminiRateLimitError, GeminiValidationError

# Configure Gemini API
genai.configure(api_key=settings.GOOGLE_API_KEY)

STORY_SYSTEM_PROMPT = """You are an expert product storytelling specialist for Indonesian UMKM (small/medium businesses). 
Your task is to analyze product images and create compelling marketing content.

Based on the provided product image(s), generate:
1. **product_name**: A creative, marketable Indonesian product name (or suggest improvements if visible)
2. **tagline**: A catchy, memorable tagline in Indonesian (max 10 words)
3. **short_desc**: A brief product description for quick scanning (50-100 words, Indonesian)
4. **long_desc**: A detailed product story covering origin, craftsmanship, and value proposition (200-300 words, Indonesian)
5. **caption_casual**: An Instagram caption with casual, friendly tone for young audience (include relevant emojis)
6. **caption_professional**: A professional caption for business/corporate audience
7. **caption_storytelling**: A narrative caption that tells the product's story emotionally

Focus on:
- Indonesian market and cultural context
- Authentic storytelling that connects with local consumers
- Highlighting unique selling points visible in the image
- Creating emotional connection with potential buyers

Respond in valid JSON format matching the exact schema provided."""


async def generate_story(
    images: list,
    context: str | None = None,
) -> AnalysisStoryResponse:
    """
    Generate product story content using Gemini AI.

    Args:
        images: List of PIL Images or image bytes to analyze
        context: Optional additional context about the product

    Returns:
        AnalysisStoryResponse: Validated Pydantic model with story content

    Raises:
        GeminiAPIError: If API call fails
        GeminiValidationError: If response validation fails
        GeminiRateLimitError: If rate limit is exceeded
    """
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            system_instruction=STORY_SYSTEM_PROMPT,
        )

        # Build prompt content
        prompt_parts = []

        # Add images first
        for img in images:
            prompt_parts.append(img)

        # Add text prompt
        user_prompt = "Analyze the product image(s) above and generate comprehensive marketing content."
        if context:
            user_prompt += f"\n\nAdditional context: {context}"

        prompt_parts.append(user_prompt)

        # Generate content with JSON schema enforcement
        response = await model.generate_content_async(
            contents=prompt_parts,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AnalysisStoryResponse,
            ),
        )

        # Parse and validate response
        return AnalysisStoryResponse.model_validate_json(response.text)

    except google_exceptions.ResourceExhausted as e:
        raise GeminiRateLimitError(
            message="Gemini API rate limit exceeded. Please try again later.",
            original_error=e,
        )
    except google_exceptions.GoogleAPIError as e:
        raise GeminiAPIError(
            message=f"Gemini API error during story generation: {str(e)}",
            original_error=e,
        )
    except ValidationError as e:
        raise GeminiValidationError(
            message=f"Failed to validate story response: {str(e)}",
            original_error=e,
        )
    except Exception as e:
        raise GeminiAPIError(
            message=f"Unexpected error during story generation: {str(e)}",
            original_error=e,
        )
