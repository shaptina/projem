from __future__ import annotations

from prometheus_client import Counter, Histogram

# Histogram buckets: seconds
_latency_buckets = (
    0.5,
    1.0,
    2.0,
    5.0,
    10.0,
    30.0,
    60.0,
    120.0,
    300.0,
    900.0,
    1800.0,
)

job_latency_seconds = Histogram(
    name="job_latency_seconds",
    documentation="E2E iş süresi (started->finished)",
    labelnames=("type", "status"),
    buckets=_latency_buckets,
)

queue_wait_seconds = Histogram(
    name="queue_wait_seconds",
    documentation="Kuyruk bekleme süresi (created->started)",
    labelnames=("queue",),
    buckets=(0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0, 120.0),
)

failures_total = Counter(
    name="failures_total",
    documentation="Görev hata sayacı",
    labelnames=("task", "reason"),
)

retried_total = Counter(
    name="retried_total",
    documentation="Görev retry sayacı",
    labelnames=("task",),
)


