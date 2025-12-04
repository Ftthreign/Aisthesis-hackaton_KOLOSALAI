"""
Analysis Service - Orchestrator for AI-powered product analysis.

This service coordinates the generation of various analysis modules
and persists results to the database.
"""

import asyncio
import logging
from uuid import UUID

from PIL import Image
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analysis.analysis import Analysis
from app.models.analysis.brand_theme import AnalysisBrandTheme
from app.models.analysis.story import AnalysisStory
from app.models.analysis.taste import AnalysisTaste
from app.prompts.brand_prompt import generate_brand_theme
from app.prompts.exceptions import GeminiError
from app.prompts.story_prompt import generate_story
from app.prompts.taste_prompt import generate_taste_profile
from app.schemas.analysis_branding import AnalysisBrandThemeResponse
from app.schemas.analysis_story import AnalysisStoryResponse
from app.schemas.analysis_taste import AnalysisTasteResponse

logger = logging.getLogger(__name__)


class AnalysisService:
    """Service for orchestrating product analysis using Gemini AI."""

    @staticmethod
    async def create_full_analysis(
        db: AsyncSession,
        analysis: Analysis,
        images: list[Image.Image],
        context: str | None = None,
    ) -> Analysis:
        """
        Run all analysis modules in parallel and persist results.

        Args:
            db: Async database session
            analysis: The parent Analysis record (must be already persisted with ID)
            images: List of PIL Image objects to analyze
            context: Optional additional context for prompts

        Returns:
            Analysis: Updated analysis with all related records

        Raises:
            GeminiError: If any Gemini API call fails
        """
        # Run all analysis types in parallel for better performance
        story_task = asyncio.create_task(
            AnalysisService._generate_and_save_story(
                db=db,
                analysis_id=analysis.id,
                images=images,
                context=context,
            )
        )
        brand_task = asyncio.create_task(
            AnalysisService._generate_and_save_brand_theme(
                db=db,
                analysis_id=analysis.id,
                images=images,
                context=context,
            )
        )
        taste_task = asyncio.create_task(
            AnalysisService._generate_and_save_taste(
                db=db,
                analysis_id=analysis.id,
                images=images,
                context=context,
            )
        )

        # Wait for all tasks to complete
        results = await asyncio.gather(
            story_task,
            brand_task,
            taste_task,
            return_exceptions=True,
        )

        # Check for errors and log them
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                task_names = ["story", "brand_theme", "taste"]
                logger.error(f"Failed to generate {task_names[i]}: {result}")
                # Re-raise the first error encountered
                if isinstance(result, GeminiError):
                    raise result
                raise GeminiError(
                    message=f"Analysis generation failed: {str(result)}",
                    original_error=result,
                )

        # Assign results to analysis relationships
        analysis.story = results[0]
        analysis.brand_theme = results[1]
        analysis.taste = results[2]

        await db.flush()

        return analysis

    @staticmethod
    async def create_product_story(
        db: AsyncSession,
        analysis_id: UUID,
        images: list[Image.Image],
        context: str | None = None,
    ) -> AnalysisStory:
        """
        Generate and save product story analysis.

        Args:
            db: Async database session
            analysis_id: UUID of the parent Analysis record
            images: List of PIL Image objects
            context: Optional additional context

        Returns:
            AnalysisStory: Persisted story record
        """
        return await AnalysisService._generate_and_save_story(
            db=db,
            analysis_id=analysis_id,
            images=images,
            context=context,
        )

    @staticmethod
    async def create_brand_theme(
        db: AsyncSession,
        analysis_id: UUID,
        images: list[Image.Image],
        context: str | None = None,
    ) -> AnalysisBrandTheme:
        """
        Generate and save brand theme analysis.

        Args:
            db: Async database session
            analysis_id: UUID of the parent Analysis record
            images: List of PIL Image objects
            context: Optional additional context

        Returns:
            AnalysisBrandTheme: Persisted brand theme record
        """
        return await AnalysisService._generate_and_save_brand_theme(
            db=db,
            analysis_id=analysis_id,
            images=images,
            context=context,
        )

    @staticmethod
    async def create_taste_profile(
        db: AsyncSession,
        analysis_id: UUID,
        images: list[Image.Image],
        context: str | None = None,
    ) -> AnalysisTaste:
        """
        Generate and save taste profile analysis.

        Args:
            db: Async database session
            analysis_id: UUID of the parent Analysis record
            images: List of PIL Image objects
            context: Optional additional context

        Returns:
            AnalysisTaste: Persisted taste record
        """
        return await AnalysisService._generate_and_save_taste(
            db=db,
            analysis_id=analysis_id,
            images=images,
            context=context,
        )

    # -------------------------------------------------------------------------
    # Private helper methods
    # -------------------------------------------------------------------------

    @staticmethod
    async def _generate_and_save_story(
        db: AsyncSession,
        analysis_id: UUID,
        images: list[Image.Image],
        context: str | None = None,
    ) -> AnalysisStory:
        """Generate story content and persist to database."""
        logger.info(f"Generating story for analysis {analysis_id}")

        story_response: AnalysisStoryResponse = await generate_story(
            images=images,
            context=context,
        )

        story_record = AnalysisStory(
            analysis_id=analysis_id,
            product_name=story_response.product_name,
            tagline=story_response.tagline,
            short_desc=story_response.short_desc,
            long_desc=story_response.long_desc,
            caption_casual=story_response.caption_casual,
            caption_professional=story_response.caption_professional,
            caption_storytelling=story_response.caption_storytelling,
        )

        db.add(story_record)
        await db.flush()

        logger.info(f"Story generated and saved for analysis {analysis_id}")
        return story_record

    @staticmethod
    async def _generate_and_save_brand_theme(
        db: AsyncSession,
        analysis_id: UUID,
        images: list[Image.Image],
        context: str | None = None,
    ) -> AnalysisBrandTheme:
        """Generate brand theme and persist to database."""
        logger.info(f"Generating brand theme for analysis {analysis_id}")

        brand_response: AnalysisBrandThemeResponse = await generate_brand_theme(
            images=images,
            context=context,
        )

        brand_record = AnalysisBrandTheme(
            analysis_id=analysis_id,
            primary_color=brand_response.primary_color,
            secondary_color=brand_response.secondary_color,
            accent_color=brand_response.accent_color,
            tone=brand_response.tone,
            style_suggestions=brand_response.style_suggestions,
        )

        db.add(brand_record)
        await db.flush()

        logger.info(f"Brand theme generated and saved for analysis {analysis_id}")
        return brand_record

    @staticmethod
    async def _generate_and_save_taste(
        db: AsyncSession,
        analysis_id: UUID,
        images: list[Image.Image],
        context: str | None = None,
    ) -> AnalysisTaste:
        """Generate taste profile and persist to database."""
        logger.info(f"Generating taste profile for analysis {analysis_id}")

        taste_response: AnalysisTasteResponse = await generate_taste_profile(
            images=images,
            context=context,
        )

        taste_record = AnalysisTaste(
            analysis_id=analysis_id,
            taste_profile=taste_response.taste_profile,
            aroma_profile=taste_response.aroma_profile,
            sensory_persona=taste_response.sensory_persona,
            pairing=taste_response.pairing,
        )

        db.add(taste_record)
        await db.flush()

        logger.info(f"Taste profile generated and saved for analysis {analysis_id}")
        return taste_record
