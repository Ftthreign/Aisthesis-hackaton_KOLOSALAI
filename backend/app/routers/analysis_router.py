from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
from pathlib import Path
from PIL import Image
from io import BytesIO

from app.database import get_db
from app.core.auth import get_current_user
from app.schemas.analysis import AnalysisResponse, AnalysisData
from app.models.analysis.analysis import Analysis
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/analysis", tags=["Analysis"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("", response_model=AnalysisResponse)
async def create_analysis(
    file: UploadFile = File(...),
    context: str | None = None,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):

    # 1. Validasi file
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image.",
        )

    # 2. Convert ke PIL image (untuk AI pipeline)
    try:
        image = Image.open(BytesIO(await file.read()))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image format.")

    # 3. Simpan file ke disk (UUID)
    new_filename = f"{uuid4()}.png"
    save_path = UPLOAD_DIR / new_filename
    image.save(save_path)

    # 4. Create Analysis row
    analysis = Analysis(
        user_id=user.id,
        image_url=f"/uploads/{new_filename}",
        image_filename=new_filename,
    )
    db.add(analysis)
    await db.flush()

    # 5. Run AI pipeline
    updated_analysis = await AnalysisService.analyze_product(
        db=db,
        analysis=analysis,
        images=[image],
        context=context,
    )

    return AnalysisResponse(data=AnalysisData.model_validate(updated_analysis))
