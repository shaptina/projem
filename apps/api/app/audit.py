from __future__ import annotations

import json
import time
from typing import Any

from .logging_setup import get_logger


logger = get_logger(__name__)


def audit(event: str, **fields: Any) -> None:
    payload = {"event": event, **fields, "ts_ms": int(time.time() * 1000)}
    try:
        logger.info(json.dumps(payload, ensure_ascii=False))
    except Exception:
        logger.info({"event": event, **fields})


