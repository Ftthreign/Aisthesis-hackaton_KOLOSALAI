"""
Prompt Builder - Modular builder for all Gemini prompt types.

This class ensures:
- Centralized prompt definitions
- Consistent formatting
- Context injection
- Vision result enrichment
- Maintainability for future analysis modules
"""

from typing import Any, Optional

from app.prompts import (
    STORY_SYSTEM_PROMPT,
    BRAND_THEME_SYSTEM_PROMPT,
    TASTE_SYSTEM_PROMPT,
    SEO_SYSTEM_PROMPT,
    MARKETPLACE_SYSTEM_PROMPT,
    PACKAGING_SYSTEM_PROMPT,
    PERSONA_SYSTEM_PROMPT,
    ACTION_PLAN_SYSTEM_PROMPT,
    VISION_SYSTEM_PROMPT,
)


class PromptBuilder:
    """
    A highly modular prompt construction class.

    Usage:
        prompt = (
            PromptBuilder()
            .system(STORY_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(user_context)
            .with_vision(vision_result)
            .with_instruction("Write a story from the product visuals.")
            .build()
        )
    """

    def __init__(self):
        self.system_prompt: str | None = None
        self.images: list[Any] = []
        self.context: str | None = None
        self.vision: dict[str, Any] | None = None
        self.extra_instruction: str | None = None

    # -------------------------------------------------------------------------
    # Builder Methods
    # -------------------------------------------------------------------------

    def system(self, prompt: str) -> "PromptBuilder":
        """Attach system-level instructions."""
        self.system_prompt = prompt
        return self

    def with_images(self, images: list[Any]) -> "PromptBuilder":
        """Attach image objects to the prompt."""
        self.images.extend(images)
        return self

    def with_context(self, context: Optional[str]) -> "PromptBuilder":
        """Optional natural-language user context."""
        if context:
            self.context = context
        return self

    def with_vision(self, vision: Optional[dict[str, Any]]) -> "PromptBuilder":
        """Provide structured vision analysis to guide LLM."""
        if vision:
            self.vision = vision
        return self

    def with_instruction(self, instruction: str) -> "PromptBuilder":
        """Human-readable guidance (append to user prompt)."""
        self.extra_instruction = instruction
        return self

    # -------------------------------------------------------------------------
    # Final Build Method
    # -------------------------------------------------------------------------

    def build(self) -> list[Any]:
        """
        Build the final prompt in the correct Gemini format:

        [
            system_instruction,
            <image1>,
            <image2>,
            ...,
            "User prompt"
        ]
        """

        if not self.system_prompt:
            raise ValueError("system_prompt must be set before building the prompt.")

        content = []

        # Start with system prompt
        content.append(self.system_prompt)

        # Attach images
        for img in self.images:
            content.append(img)

        # Build user message
        user_prompt = ""

        if self.extra_instruction:
            user_prompt += self.extra_instruction + "\n\n"

        if self.context:
            user_prompt += f"Additional context: {self.context}\n\n"

        if self.vision:
            user_prompt += "Vision analysis (optional helper data):\n"
            user_prompt += f"{self.vision}\n\n"

        content.append(user_prompt.strip())

        return content


# -------------------------------------------------------------------------
# Factory helpers for each analysis module
# -------------------------------------------------------------------------

class PromptFactory:
    """Preconfigured prompt builders for each analysis module."""

    @staticmethod
    def story(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(STORY_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate a product story in structured JSON format.")
        )

    @staticmethod
    def brand_theme(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(BRAND_THEME_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate a brand identity recommendation in JSON.")
        )

    @staticmethod
    def taste(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(TASTE_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Identify taste & aroma characteristics in JSON.")
        )

    @staticmethod
    def seo(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(SEO_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate SEO keywords and hashtags in JSON.")
        )

    @staticmethod
    def marketplace(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(MARKETPLACE_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate marketplace-ready descriptions in JSON.")
        )

    @staticmethod
    def persona(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(PERSONA_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate buyer persona information in JSON.")
        )

    @staticmethod
    def packaging(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(PACKAGING_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Recommend packaging styles in JSON.")
        )

    @staticmethod
    def action_plan(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(ACTION_PLAN_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate a 7-day UMKM action plan in JSON.")
        )

    @staticmethod
    def vision(images):
        return (
            PromptBuilder()
            .system(VISION_SYSTEM_PROMPT)
            .with_images(images)
        )
