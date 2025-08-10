from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .instrumentation import setup_metrics, setup_tracing, setup_celery_instrumentation
from .sentry_setup import setup_sentry
from .logging_setup import setup_logging
from .middleware import SecurityHeadersMiddleware, CORSMiddlewareStrict
from .middleware.limiter import RateLimitMiddleware
from .routers import auth as auth_router
from .routers import health as health_router
from .routers import freecad as freecad_router
from .routers import assemblies as assemblies_router
from .routers import cam as cam_router
from .routers import jobs as jobs_router
from .routers import admin_dlq as admin_dlq_router
from .routers import admin_unmask as admin_unmask_router
try:
    from .routers import sim as sim_router  # type: ignore
    _sim_available = True
except Exception:
    sim_router = None  # type: ignore
    _sim_available = False
from .events import router as events_router


setup_logging()
setup_tracing()
setup_sentry()

app = FastAPI(title="FreeCAD Üretim Platformu API", version="0.1.0")
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CORSMiddlewareStrict)
app.add_middleware(RateLimitMiddleware)

setup_metrics(app)
setup_celery_instrumentation()

app.include_router(health_router.router)
app.include_router(auth_router.router)
app.include_router(freecad_router.router)
app.include_router(assemblies_router.router)
app.include_router(cam_router.router)
app.include_router(jobs_router.router)
app.include_router(admin_dlq_router.router)
app.include_router(admin_unmask_router.router)
if _sim_available and sim_router is not None:
    app.include_router(sim_router.router)
app.include_router(events_router)


@app.get("/", include_in_schema=False)
def root():
    return {"mesaj": "FreeCAD API çalışıyor", "env": settings.env}


