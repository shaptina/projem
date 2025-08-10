# API (FastAPI)

Türkçe loglar, OTel/Sentry ve S3/MinIO ile entegre FreeCAD üretim hattı API iskeleti.

## Geliştirme

- Docker Compose: kökten `make dev`
- Sağlık: `GET /api/v1/healthz` → 200/503
- Metrikler: `GET /metrics` → Prometheus formatı
- Dev Auth: `POST /api/v1/auth/dev-login` (X-Dev-User başlığı)

## Çevre Değişkenleri
Kök `.env.example` dosyasına bakınız.
