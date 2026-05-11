import uuid
import boto3
from ..config import settings
from ..schemas.core import PresignRequest, PresignResponse


def create_upload_presigned_url(payload: PresignRequest) -> PresignResponse:
    safe_name = payload.filename.replace(" ", "_")
    s3_key = f"cases/{payload.case_id}/evidence/{uuid.uuid4()}-{safe_name}"
    client = boto3.client("s3", region_name=settings.aws_region)
    upload_url = client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": settings.s3_evidence_bucket,
            "Key": s3_key,
            "ContentType": payload.content_type,
        },
        ExpiresIn=900,
        HttpMethod="PUT",
    )
    return PresignResponse(upload_url=upload_url, s3_key=s3_key)
