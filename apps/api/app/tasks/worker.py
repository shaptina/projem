from __future__ import annotations

from celery import Celery

from ..config import settings
from ..settings import app_settings as appset


celery_app = Celery(
    "freecad_tasks",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.assembly", "app.tasks.cam", "app.tasks.sim"],
)

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
celery_app.conf.broker_connection_retry_on_startup = True


