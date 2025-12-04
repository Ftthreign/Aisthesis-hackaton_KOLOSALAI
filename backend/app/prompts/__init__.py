"""
Modular prompt modules for Gemini AI analysis.

Each module handles a specific analysis type:
- story_prompt: Product storytelling generation
- brand_prompt: Brand theme/visual identity generation
- taste_prompt: Taste and aroma profile generation
"""

from .brand_prompt import generate_brand_theme
from .exceptions import (
    GeminiAPIError,
    GeminiError,
    GeminiRateLimitError,
    GeminiValidationError,
)
from .story_prompt import generate_story
from .taste_prompt import generate_taste_profile

__all__ = [
    "generate_story",
    "generate_brand_theme",
    "generate_taste_profile",
    "GeminiError",
    "GeminiAPIError",
    "GeminiValidationError",
    "GeminiRateLimitError",
]
