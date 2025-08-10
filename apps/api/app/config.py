from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env: str = "development"
    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 30 * 24 * 60

    dev_auth_bypass: bool = True

    database_url: str
    redis_url: str = "redis://redis:6379/0"

    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_s3_endpoint: str | None = None
    aws_s3_region: str | None = "us-east-1"
    s3_bucket_name: str = "artefacts"

    otel_exporter_otlp_endpoint: str | None = None
    otel_service_name: str = "freecad-api"
    sentry_dsn: str | None = None

    freecadcmd_path: str | None = None
    freecad_timeout_seconds: int = 1200
    freecad_asm4_required: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


settings = Settings()  # type: ignore[call-arg]


