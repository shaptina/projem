from __future__ import annotations

import json
import os
from typing import Dict


def _get_bool(name: str, default: bool) -> bool:
    v = os.getenv(name)
    if v is None:
        return default
    return str(v).strip().lower() in {"1", "true", "yes", "on"}


def _get_int(name: str, default: int) -> int:
    v = os.getenv(name)
    if v is None:
        return default
    try:
        return int(v)
    except Exception:
        return default


def _get_float(name: str, default: float) -> float:
    v = os.getenv(name)
    if v is None:
        return default
    try:
        return float(v)
    except Exception:
        return default


def _get_json_dict(name: str, default: Dict) -> Dict:
    v = os.getenv(name)
    if not v:
        return default
    try:
        return json.loads(v)
    except Exception:
        return default


class AppSettings:
    def __init__(self) -> None:
        self.freecad_queue_concurrency: int = _get_int("FREECAD_QUEUE_CONCURRENCY", 1)
        self.freecad_timeout_seconds: int = _get_int("TIMEOUT_S", 900)
        self.sim_resolution_mm_default: float = _get_float("SIM_RESOLUTION_MM_DEFAULT", 0.8)
        self.sim_timeout_s: int = _get_int("SIM_TIMEOUT_S", 1200)
        self.sim_queue_concurrency: int = _get_int("SIM_QUEUE_CONCURRENCY", 1)
        self.require_idempotency: bool = _get_bool("REQUIRE_IDEMPOTENCY", True)
        self.rate_limits: Dict[str, str] = _get_json_dict(
            "RATE_LIMITS", {"assembly": "6/m", "cam": "12/m", "sim": "4/m"}
        )
        self.task_time_limits: Dict[str, int] = _get_json_dict(
            "TASK_TIME_LIMITS", {"freecad": 900, "sim": 1200}
        )
        self.task_soft_limits: Dict[str, int] = _get_json_dict(
            "TASK_SOFT_LIMITS", {"freecad": 870, "sim": 1140}
        )
        # CORS
        self.cors_allowed_origins: list[str] = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") if o.strip()]
        # OIDC / SSO
        self.oidc_enabled: bool = _get_bool("OIDC_ENABLED", False)
        self.oidc_issuer_url: str | None = os.getenv("OIDC_ISSUER_URL")
        self.oidc_jwks_url: str | None = os.getenv("OIDC_JWKS_URL")
        self.oidc_audience: str | None = os.getenv("OIDC_AUDIENCE")
        self.oidc_client_id: str | None = os.getenv("OIDC_CLIENT_ID")
        self.roles_claim: str = os.getenv("ROLES_CLAIM", "realm_access.roles")
        # Rate limit kuralları (route bazlı)
        self.rate_limit_rules: Dict[str, str] = _get_json_dict(
            "RATE_LIMIT_RULES", {"assemblies": "60/m", "cam": "120/m", "simulate": "30/m"}
        )
        # Güvenlik başlıkları
        self.security_hsts_enabled: bool = _get_bool("SECURITY_HSTS_ENABLED", True)


app_settings = AppSettings()


