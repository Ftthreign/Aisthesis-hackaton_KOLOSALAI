from typing import Any, Optional

from app.prompts import (
    ACTION_PLAN_SYSTEM_PROMPT,
    BRAND_THEME_SYSTEM_PROMPT,
    MARKETPLACE_SYSTEM_PROMPT,
    PACKAGING_SYSTEM_PROMPT,
    PERSONA_SYSTEM_PROMPT,
    PRICING_SYSTEM_PROMPT,
    SEO_SYSTEM_PROMPT,
    STORY_SYSTEM_PROMPT,
    TASTE_SYSTEM_PROMPT,
    VISION_SYSTEM_PROMPT,
)


class PromptBuilder:
    """
    Prompt builder dengan format baru Gemini 1.5:

    [
        {
            "role": "user",
            "parts": [
                <inline image>,
                {"text": "<instruction>"},
            ]
        }
    ]
    """

    def __init__(self):
        self.system_prompt: str | None = None
        self.images: list[Any] = []
        self.context: str | None = None
        self.vision: dict[str, Any] | None = None
        self.extra_instruction: str | None = None

    def system(self, prompt: str):
        self.system_prompt = prompt
        return self

    def with_images(self, images: list[Any]):
        self.images.extend(images)
        return self

    def with_context(self, context: Optional[str]):
        if context:
            self.context = context
        return self

    def with_vision(self, vision: Optional[dict[str, Any]]):
        if vision:
            self.vision = vision
        return self

    def with_instruction(self, instruction: str):
        self.extra_instruction = instruction
        return self

    def build(self) -> list[Any]:
        if not self.system_prompt:
            raise ValueError("system_prompt must be set before building the prompt.")

        # Parts list
        parts = []

        # System instruction
        parts.append({"text": self.system_prompt})

        # Images (inline_data dict)
        for img in self.images:
            # img is already {"inline_data": {...}}
            parts.append(img)

        # User text
        user_text = ""

        if self.extra_instruction:
            user_text += self.extra_instruction + "\n\n"

        if self.context:
            user_text += f"Additional context: {self.context}\n\n"

        if self.vision:
            user_text += "Vision analysis:\n"
            user_text += f"{self.vision}\n\n"

        parts.append({"text": user_text.strip() or ""})

        # Final format
        return [{"role": "user", "parts": parts}]


class PromptFactory:
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
    def pricing(images, context=None, vision=None):
        return (
            PromptBuilder()
            .system(PRICING_SYSTEM_PROMPT)
            .with_images(images)
            .with_context(context)
            .with_vision(vision)
            .with_instruction("Generate pricing recommendations in JSON.")
        )

    @staticmethod
    def vision(images):
        return PromptBuilder().system(VISION_SYSTEM_PROMPT).with_images(images)
