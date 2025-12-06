"""
Modular prompt modules for Gemini AI analysis.

Each module handles a specific analysis type with system prompts
and async generation functions.
"""

# Import all system prompts and generators
from .story_prompt import STORY_SYSTEM_PROMPT, generate_story
from .brand_prompt import BRAND_THEME_SYSTEM_PROMPT, generate_brand_theme
from .taste_prompt import TASTE_SYSTEM_PROMPT, generate_taste_profile
from .SEO_prompt import SEO_SYSTEM_PROMPT, generate_seo
from .marketplace_prompt import MARKETPLACE_SYSTEM_PROMPT, generate_marketplace
from .packaging_prompt import PACKAGING_SYSTEM_PROMPT, generate_packaging
from .persona_prompt import PERSONA_SYSTEM_PROMPT, generate_persona
from .pricing_prompt import PRICING_SYSTEM_PROMPT, generate_pricing
from .action_plan_prompt import ACTION_PLAN_SYSTEM_PROMPT, generate_action_plan
from .vision_prompt import VISION_SYSTEM_PROMPT, generate_vision

# Import exceptions
from .exceptions import (
    GeminiAPIError,
    GeminiError,
    GeminiRateLimitError,
    GeminiValidationError,
)

__all__ = [
    # System prompts (for PromptBuilder/PromptFactory)
    "STORY_SYSTEM_PROMPT",
    "BRAND_THEME_SYSTEM_PROMPT",
    "TASTE_SYSTEM_PROMPT",
    "SEO_SYSTEM_PROMPT",
    "MARKETPLACE_SYSTEM_PROMPT",
    "PACKAGING_SYSTEM_PROMPT",
    "PERSONA_SYSTEM_PROMPT",
    "PRICING_SYSTEM_PROMPT",
    "ACTION_PLAN_SYSTEM_PROMPT",
    "VISION_SYSTEM_PROMPT",
    # Generator functions
    "generate_story",
    "generate_brand_theme",
    "generate_taste_profile",
    "generate_seo",
    "generate_marketplace",
    "generate_packaging",
    "generate_persona",
    "generate_pricing",
    "generate_action_plan",
    "generate_vision",
    # Exceptions
    "GeminiError",
    "GeminiAPIError",
    "GeminiValidationError",
    "GeminiRateLimitError",
]
