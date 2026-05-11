from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Atlantic CaseOps API"
    env: str = "local"
    database_url: str = "sqlite:///./atlantic_caseops.db"
    jwt_secret: str = "change-this-before-production"
    aws_region: str = "us-east-1"
    s3_evidence_bucket: str = "atlantic-caseops-evidence-dev"
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
