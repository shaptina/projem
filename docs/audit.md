# Prod-Readiness Denetim Raporu (M18 Odaklı)

Kapsam: apps/api/**, apps/web/**, compose/**, charts/**, .github/**, docker-compose*.yml, Makefile

## Bulgular (Özet)
- Güvenlik: OIDC/RBAC/CORS/Rate-limit mevcut; prodda OIDC zorunlu, HSTS/CSP sıkılaştırma, secrets KMS/SM gerekli.
- Gözlem: M18 metrikleri eklendi; alarm kuralları (time_limit, DLQ, retry) tanımlanmalı.
- Kuyruk/Limits: freecad/sim görevlerinde Celery soft/time limit değerleri M18 için yükseltilmeli; paused queue 409 koruması var.
- CI/CD: Trivy/SBOM/staging smoke pipeline tamamlanmalı; coverage eşiği  75%.
- Test boşlukları: FreeCAD gerçek builder/sim entegrasyon testleri (skip-if-no-FreeCAD), post-lint geniş vaka seti, FE E2E setups akışı.
- Secrets: .env.prod repo dışı; GH Secrets/KMS/SM; OPENAI_API_KEY ve OIDC JWKS zorunlu.
- FreeCAD riskleri: capability guard (surface/adaptive), tek recompute, timeout ve sandbox; OCL yoksa fallback.

## Sonuç
- M18 iskeleti hazır; PR-3 (gerçek builder/sim/holder) ve PR-4 (post/FE wizard/E2E) ile üretime taşınacak.
