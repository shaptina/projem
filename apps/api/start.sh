#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH=/app:${PYTHONPATH:-}

echo "[API] Başlatılıyor... Ortam=${ENV:-development}"

# DB migrate
if command -v alembic >/dev/null 2>&1; then
  echo "[API] Alembic migrate çalıştırılıyor..."
  alembic upgrade head || true
fi

RELOAD=""
if [ "${ENV:-development}" = "development" ]; then
  RELOAD="--reload"
fi
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers $RELOAD


