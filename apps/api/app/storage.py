from __future__ import annotations

import mimetypes
from datetime import timedelta
from pathlib import Path
from typing import Optional
import hashlib

import boto3

from .config import settings


def get_s3_client():
    session = boto3.session.Session(
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
        region_name=settings.aws_s3_region,
    )
    return session.client("s3", endpoint_url=settings.aws_s3_endpoint)


def upload_file(path: Path, key: str) -> str:
    s3 = get_s3_client()
    ctype, _ = mimetypes.guess_type(str(path))
    extra = {"ContentType": ctype or "application/octet-stream"}
    s3.upload_file(str(path), settings.s3_bucket_name, key, ExtraArgs=extra)
    return key


def presigned_url(key: str, expires: int = 3600) -> Optional[str]:
    try:
        s3 = get_s3_client()
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": settings.s3_bucket_name, "Key": key},
            ExpiresIn=expires,
        )
        return url
    except Exception:
        return None


def upload_and_sign(path: Path, artefact_type: str) -> dict:
    sha = hashlib.sha256(path.read_bytes()).hexdigest()
    size = path.stat().st_size
    key = f"artefacts/{path.name}"
    upload_file(path, key)
    url = presigned_url(key)
    return {
        "type": artefact_type,
        "path": str(path),
        "s3_key": key,
        "size": size,
        "sha256": sha,
        "signed_url": url,
    }


