from fastapi import APIRouter, Response, status
import redis
import boto3

from ..config import settings
from ..db import check_db
from ..schemas import HealthStatus


router = APIRouter(prefix="/api/v1", tags=["Sağlık"]) 


@router.get("/healthz", response_model=HealthStatus)
def healthz(response: Response) -> HealthStatus:
    deps: dict[str, str] = {}

    db_ok = check_db()
    deps["postgres"] = "ok" if db_ok else "hata"

    try:
        r = redis.from_url(settings.redis_url)
        r.ping()
        deps["redis"] = "ok"
    except Exception:
        deps["redis"] = "hata"

    if settings.aws_s3_endpoint:
        try:
            session = boto3.session.Session(
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
                region_name=settings.aws_s3_region,
            )
            s3 = session.client("s3", endpoint_url=settings.aws_s3_endpoint)
            s3.list_buckets()
            deps["s3"] = "ok"
        except Exception:
            deps["s3"] = "hata"
    else:
        deps["s3"] = "atılandı"

    overall = "ok" if all(v == "ok" for v in deps.values()) else "hata"
    response.status_code = status.HTTP_200_OK if overall == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE
    return HealthStatus(status=overall, dependencies=deps)


@router.get("/readyz", response_model=HealthStatus)
def readyz() -> HealthStatus:
    return healthz()


