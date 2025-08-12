## Model Politikası (Gizli / Admin Kontrollü)

Model seçimi kullanıcı arayüzünde görünmez; backend otomatik seçer.

Env değişkenleri:

```
MODEL_POLICY=quality_first        # quality_first | cost_first
DEFAULT_MODEL=gpt-5-high          # birincil model
FALLBACK_MODEL=o4-mini            # geri düşüş modeli
ALLOWED_MODELS=gpt-5-high,o4-mini
```

Politika:
- quality_first: primary=DEFAULT_MODEL, fallback=FALLBACK_MODEL
- cost_first:    primary=FALLBACK_MODEL, fallback=DEFAULT_MODEL

Sağlık kontrolü cache’lenir (60s). Üretim sanitizasyonu geçmezse otomatik escalate ve tek self-heal denemesi yapılır.

# API (FastAPI)

Türkçe loglar, OTel/Sentry ve S3/MinIO ile entegre FreeCAD üretim hattı API iskeleti.

## Geliştirme

- Docker Compose: kökten `make dev`
- Sağlık: `GET /api/v1/healthz` → 200/503
- Metrikler: `GET /metrics` → Prometheus formatı
- Dev Auth: `POST /api/v1/auth/dev-login` (X-Dev-User başlığı)

## Çevre Değişkenleri
Kök `.env.example` dosyasına bakınız.
