from __future__ import annotations

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from ..settings import app_settings as appset


SECURITY_HEADERS = {
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; object-src 'none'",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        for k, v in SECURITY_HEADERS.items():
            if k == "Strict-Transport-Security" and not appset.security_hsts_enabled:
                continue
            response.headers.setdefault(k, v)
        return response


class CORSMiddlewareStrict(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        allowed = (not appset.cors_allowed_origins) or (origin in appset.cors_allowed_origins)
        if origin and not allowed:
            resp = Response(status_code=403, content="İstek kaynağı (Origin) izinli değil.")
            resp.headers["Vary"] = "Origin"
            return resp
        if request.method == "OPTIONS":
            resp = Response(status_code=204)
            if origin and allowed:
                resp.headers["Access-Control-Allow-Origin"] = origin
            resp.headers["Vary"] = "Origin"
            resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
            resp.headers["Access-Control-Allow-Headers"] = request.headers.get("access-control-request-headers", "*")
            resp.headers["Access-Control-Allow-Credentials"] = "false"
            resp.headers["Access-Control-Max-Age"] = "600"
            return resp
        response: Response = await call_next(request)
        if origin and allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Credentials"] = "false"
        return response


