# Teslimatlar ve Kabul Kriterleri (M18)

## Backend
- Setups/Fixtures API ve DB (ops_3d/collisions/posts_runs)
- CAM/SIM/POST Celery akışı, metrik ve audit bağları
- Lint raporu ve posts_runs kaydı

Kabul:
- Sim OK olmadan Post kilit (409)
- Artefaktlar: FCStd(derived), toolpath JSON/CSV, sim glTF, sim raporu JSON, NC

## Frontend
- /projects/[id]/setups liste + wizard + durum butonları
- Holder uyarı rozetleri ve birleşik paket indirme butonu

Kabul:
- Akış: Yön ekle  Plan 3D  CAM  SIM  POST (negatif: SIM fail  POST pasif)

## CI/CD
- Coverage  75%; Playwright E2E yeşil
- Trivy (HIGH/CRITICAL  fail), SBOM artefakt
- Staging smoke: healthz + kısa CAM/SIM akışı

## Security/Obs
- OIDC zorunlu (prod), HSTS/CSP sıkı, CORS whitelist
- Metrikler: cam3d_duration_seconds, simulate3d_duration_seconds, post_multi_setup_duration_seconds, holder collisions
- Alarm: time_limit, DLQ, retry; RUNBOOK güncel
