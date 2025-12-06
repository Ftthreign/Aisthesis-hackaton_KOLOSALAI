import asyncio

from app.schemas.analysis_story import AnalysisStoryResponse
from app.schemas.analysis_branding import AnalysisBrandThemeResponse
from app.schemas.analysis_taste import AnalysisTasteResponse

from app.services.ai.vision_service import VisionService
from app.services.ai.prompt_builder import PromptFactory
from app.services.ai.gemini_service import GeminiService
from app.models.analysis.analysis import Analysis
from app.models.analysis.story import AnalysisStory
from app.models.analysis.brand_theme import AnalysisBrandTheme
from app.models.analysis.taste import AnalysisTaste

class AnalysisService:

    @staticmethod
    async def analyze_product(db, analysis: Analysis, images: list, context: str | None = None):

        # -----------------------------
        # 1. Vision Analysis
        # -----------------------------
        vision_result = await VisionService.analyze(images)
        analysis.vision_result = vision_result.model_dump()

        # -----------------------------
        # 2. Build all prompts
        # -----------------------------
        story_prompt = PromptFactory.story(images, context, vision_result.model_dump()).build()
        brand_prompt = PromptFactory.brand_theme(images, context, vision_result.model_dump()).build()
        taste_prompt = PromptFactory.taste(images, context, vision_result.model_dump()).build()

        # -----------------------------
        # 3. Parallel LLM calls
        # -----------------------------
        results = await asyncio.gather(
            GeminiService.generate(story_prompt, AnalysisStoryResponse),
            GeminiService.generate(brand_prompt, AnalysisBrandThemeResponse),
            GeminiService.generate(taste_prompt, AnalysisTasteResponse),
            return_exceptions=True,
        )

        story_res, brand_res, taste_res = results

        # -----------------------------
        # 4. Handle errors
        # -----------------------------
        for r in results:
            if isinstance(r, Exception):
                await db.rollback()
                raise r

        # -----------------------------
        # 5. Save child tables
        # -----------------------------
        story_record = AnalysisStory(analysis_id=analysis.id, **story_res.model_dump())
        brand_record = AnalysisBrandTheme(analysis_id=analysis.id, **brand_res.model_dump())
        taste_record = AnalysisTaste(analysis_id=analysis.id, **taste_res.model_dump())

        db.add_all([story_record, brand_record, taste_record])
        await db.commit()
        await db.refresh(analysis)

        return analysis
