from __future__ import annotations

from celery import Celery

from ..config import settings
from ..settings import app_settings as appset


celery_app = Celery(
    "freecad_tasks",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=[
        "app.tasks.assembly",
        "app.tasks.cam",
        "app.tasks.sim",
        "app.tasks.design",
        "app.tasks.cad",
        "app.tasks.cam_build",
        "app.tasks.reports",
        "app.tasks.m18_cam",
        "app.tasks.m18_sim",
        "app.tasks.m18_post",
    ],
)

# Ek güvence: paket altındaki tüm task modüllerini keşfet
try:  # pragma: no cover
    celery_app.autodiscover_tasks(["app.tasks"])  # type: ignore[arg-type]
except Exception:
    pass

celery_app.conf.task_queues = {
    "freecad": {},
    "cpu": {},
    "postproc": {},
    "sim": {},
}

celery_app.conf.task_default_queue = "cpu"
celery_app.conf.task_acks_late = True
celery_app.conf.task_acks_on_failure_or_timeout = True
celery_app.conf.task_default_retry_delay = 30
celery_app.conf.broker_pool_limit = 4
celery_app.conf.worker_prefetch_multiplier = 1
celery_app.conf.task_annotations = {
    "app.tasks.assembly.assembly_generate": {"rate_limit": appset.rate_limits.get("assembly", "6/m")},
    "app.tasks.cam.cam_generate": {"rate_limit": appset.rate_limits.get("cam", "12/m")},
    "app.tasks.sim.sim_generate": {"rate_limit": appset.rate_limits.get("sim", "4/m")},
}
celery_app.conf.task_routes = {
    "app.tasks.cad.*": {"queue": "freecad"},
    "app.tasks.cam_build.*": {"queue": "freecad"},
    "app.tasks.m18_cam.*": {"queue": "freecad"},
    "app.tasks.m18_sim.*": {"queue": "sim"},
    "app.tasks.m18_post.*": {"queue": "postproc"},
    "app.tasks.reports.*": {"queue": "postproc"},
}
celery_app.conf.broker_connection_retry_on_startup = True


# API prosesi içinde shared_task çağrılarının doğru broker'a publish edebilmesi için
try:  # pragma: no cover
    celery_app.set_default()
except Exception:
    pass

