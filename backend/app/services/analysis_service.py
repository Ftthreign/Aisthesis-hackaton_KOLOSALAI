import asyncio
import logging

from app.schemas.analysis_story import AnalysisStoryResponse
from app.schemas.analysis_branding import AnalysisBrandThemeResponse
from app.schemas.analysis_taste import AnalysisTasteResponse
from app.schemas.analysis_action_plan import AnalysisActionPlanResponse
from app.schemas.analysis_marketplace import AnalysisMarketplaceResponse
from app.schemas.analysis_packaging import AnalysisPackagingResponse
from app.schemas.analysis_person import AnalysisPersonaResponse
from app.schemas.analysis_pricing import AnalysisPricingResponse
from app.schemas.analysis_seo import AnalysisSEOResponse

from app.services.ai.vision_service import VisionService
from app.services.ai.prompt_builder import PromptFactory
from app.services.ai.gemini_service import GeminiService
from app.models.analysis.analysis import Analysis, AnalysisStatus
from app.models.analysis.story import AnalysisStory
from app.models.analysis.brand_theme import AnalysisBrandTheme
from app.models.analysis.taste import AnalysisTaste
from app.models.analysis.action_plan import AnalysisActionPlan
from app.models.analysis.marketplace import AnalysisMarketplace
from app.models.analysis.packaging import AnalysisPackaging
from app.models.analysis.persona import AnalysisPersona
from app.models.analysis.pricing import AnalysisPricing
from app.models.analysis.seo import AnalysisSEO

logger = logging.getLogger(__name__)

class AnalysisService:

    @staticmethod
    async def analyze_product(db, analysis: Analysis, images: list, context: str | None = None):
        logger.info(f"Starting product analysis for analysis_id={analysis.id}")

        # -----------------------------
        # 1. Vision Analysis
        # -----------------------------
        logger.info(f"Running vision analysis for analysis_id={analysis.id}")
        vision_result = await VisionService.analyze(images)
        analysis.vision_result = vision_result.model_dump()
        logger.info(f"Vision analysis complete for analysis_id={analysis.id}")

        # -----------------------------
        # 2. Build all prompts
        # -----------------------------
        logger.info(f"Building prompts for analysis_id={analysis.id}")
        story_prompt = PromptFactory.story(images, context, vision_result.model_dump()).build()
        brand_prompt = PromptFactory.brand_theme(images, context, vision_result.model_dump()).build()
        taste_prompt = PromptFactory.taste(images, context, vision_result.model_dump()).build()
        action_plan_prompt = PromptFactory.action_plan(images, context, vision_result.model_dump()).build()
        marketplace_prompt = PromptFactory.marketplace(images, context, vision_result.model_dump()).build()
        packaging_prompt = PromptFactory.packaging(images, context, vision_result.model_dump()).build()
        persona_prompt = PromptFactory.persona(images, context, vision_result.model_dump()).build()
        pricing_prompt = PromptFactory.pricing(images, context, vision_result.model_dump()).build()
        seo_prompt = PromptFactory.seo(images, context, vision_result.model_dump()).build()

        # -----------------------------
        # 3. Parallel LLM calls
        # -----------------------------
        logger.info(f"Running parallel LLM calls for analysis_id={analysis.id}")
        results = await asyncio.gather(
            GeminiService.generate(story_prompt, AnalysisStoryResponse),
            GeminiService.generate(brand_prompt, AnalysisBrandThemeResponse),
            GeminiService.generate(taste_prompt, AnalysisTasteResponse),
            GeminiService.generate(action_plan_prompt, AnalysisActionPlanResponse),
            GeminiService.generate(marketplace_prompt, AnalysisMarketplaceResponse),
            GeminiService.generate(packaging_prompt, AnalysisPackagingResponse),
            GeminiService.generate(persona_prompt, AnalysisPersonaResponse),
            GeminiService.generate(pricing_prompt, AnalysisPricingResponse),
            GeminiService.generate(seo_prompt, AnalysisSEOResponse),
            return_exceptions=True,
        )

        story_res, brand_res, taste_res, action_plan_res, marketplace_res, packaging_res, persona_res, pricing_res, seo_res = results

        # -----------------------------
        # 4. Handle errors
        # -----------------------------
        for i, r in enumerate(results):
            if isinstance(r, Exception):
                logger.error(f"LLM call {i} failed for analysis_id={analysis.id}: {r}")
                await db.rollback()
                raise r

        # -----------------------------
        # 5. Save child tables
        # -----------------------------
        logger.info(f"Saving analysis results for analysis_id={analysis.id}")
        story_record = AnalysisStory(analysis_id=analysis.id, **story_res.model_dump())
        brand_record = AnalysisBrandTheme(analysis_id=analysis.id, **brand_res.model_dump())
        taste_record = AnalysisTaste(analysis_id=analysis.id, **taste_res.model_dump())
        action_plan_record = AnalysisActionPlan(analysis_id=analysis.id, **action_plan_res.model_dump())
        marketplace_record = AnalysisMarketplace(analysis_id=analysis.id, **marketplace_res.model_dump())
        packaging_record = AnalysisPackaging(analysis_id=analysis.id, **packaging_res.model_dump())
        persona_record = AnalysisPersona(analysis_id=analysis.id, **persona_res.model_dump())
        pricing_record = AnalysisPricing(analysis_id=analysis.id, **pricing_res.model_dump())
        seo_record = AnalysisSEO(analysis_id=analysis.id, **seo_res.model_dump())

        db.add_all([
            story_record, 
            brand_record, 
            taste_record,
            action_plan_record,
            marketplace_record,
            packaging_record,
            persona_record,
            pricing_record,
            seo_record
        ])

        # -----------------------------
        # 6. Update status to COMPLETED
        # -----------------------------
        analysis.status = AnalysisStatus.COMPLETED.value

        await db.commit()
        await db.refresh(analysis)
        
        logger.info(f"Analysis completed successfully for analysis_id={analysis.id}")

        return analysis
