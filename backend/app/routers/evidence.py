from fastapi import APIRouter
from ..schemas.core import PresignRequest, PresignResponse
from ..services.s3 import create_upload_presigned_url

router = APIRouter(prefix="/evidence", tags=["evidence"])

@router.post("/presign", response_model=PresignResponse)
def presign_upload(payload: PresignRequest):
    return create_upload_presigned_url(payload)
