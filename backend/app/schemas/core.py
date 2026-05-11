from pydantic import BaseModel

class CaseCreate(BaseModel):
    case_number: str
    claimant_name: str
    client_name: str
    status: str = "Active"
    investigator: str | None = None
    address: str | None = None
    injury: str | None = None
    primary_vehicle: str | None = None

class CaseOut(CaseCreate):
    id: int
    class Config:
        from_attributes = True

class DailyUpdateCreate(BaseModel):
    case_id: int
    date: str
    weather: str
    start_time: str
    end_time: str
    narrative: str
    status: str = "Draft"
    submitted_by: str | None = None

class DailyUpdateOut(DailyUpdateCreate):
    id: int
    class Config:
        from_attributes = True

class PresignRequest(BaseModel):
    case_id: int
    filename: str
    content_type: str

class PresignResponse(BaseModel):
    upload_url: str
    s3_key: str
