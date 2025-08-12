# RUNBOOK — FreeCAD Üretim Platformu (Prod)

Bu belge prod/staging ortamlarında sık yaşanan durumlarda izlenecek adımları ve rollback işlemlerini özetler.

## 1) Sağlık Kontrolleri
- API: `curl -fsS http://<host>:8000/api/v1/healthz`
- Prometheus: `http://<host>:9090`
- Grafana: `http://<host>:3001` — Dashboard: cnc.json

## 2) Kuyruk Operasyonları
- Duraklat: `POST /api/v1/jobs/queues/{name}/pause`
- Devam: `POST /api/v1/jobs/queues/{name}/resume`
- İptal: `POST /api/v1/jobs/{id}/cancel`
- DLQ: `GET /api/v1/admin/dlq`, `POST /api/v1/admin/dlq/{job_id}/requeue`

## 3) FreeCAD Hata/Timeout
1) Kuyruğu duraklatın (freecad/sim)
2) İş `metrics/artefacts` inceleyin
3) Gerekirse `cancel` → DLQ → requeue
4) Sistemikse concurrency/time_limit ayarlayın

## 4) S3/MinIO Sorunları
- Erişim anahtarları, bucket policy, ağ erişimleri kontrolü

## 5) Rate-Limit
- 429 artarsa `RATE_LIMIT_RULES` ayarlayın; gerekirse WAF’ta kısıtlayın

## 6) Rollback
- Compose: image tag’i geri alın, `docker compose -f docker-compose.prod.yml up -d`
- Helm: `helm history cnc` → `helm rollback cnc <REV>`

## 7) Backup/Restore
- PostgreSQL: `pg_dump` / `pg_restore`
- MinIO: policy/lifecycle/retention

## 8) Alarm & Gözlemlenebilirlik
- Alarmlar: hata oranı, başarısız FreeCAD işleri, unmask denemeleri
- Dashboard: latency p95/p50, queue_wait, failures/retries

## 9) Güvenlik
- Prod: dev-bypass kapalı, OIDC zorunlu
- CORS whitelist, HSTS açık, CSP `default-src 'self'`
- PII unmask: admin + gerekçe; audit’li

## 10) Migrasyon
- Compose: `migrate` servisi veya `docker compose exec api alembic upgrade head`
- Helm: pre-install/upgrade hook `job-migrate.yaml`


