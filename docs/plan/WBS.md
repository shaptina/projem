# WBS (M18  3+2 Indexleme, 3D CAM, Sim/Post, FE, CI/Sec/Obs)

## Backend
- DB/Migration: setups, fixtures, ops_3d, collisions, posts_runs
- Routers: setups, fixtures, plan-ops3d, cam/sim/post
- CAM: m18_builder (placement/stock/ops/export)
- SIM: voxel + holder collision + artefakt
- POST: post processor + lint + posts_runs
- Seed: tools, fixtures, cutting_data, machines, posts

## CAD/CAM/Sim/Post
- FreeCAD builder capability guards + fallback
- Holder swept-cylinder collision
- Post header/units/abs/wcs/toolchange/g43/coolant/subprogram/plane

## Frontend
- /projects/[id]/setups sayfası + wizard + rozetler
- Paket indir, RBAC/queue state UI

## CI/CD
- Pytest + coverage  75%, Playwright E2E
- Trivy scan (HIGH/CRITICAL fail), SBOM
- Staging smoke (healthz + kısa akış)

## Security
- OIDC zorunlu (prod), HSTS/CSP sıkı, CORS whitelist
- Secrets: KMS/SM, .env.prod repo dışı

## Observability
- Metrikler: cam3d_duration_seconds, simulate3d_duration_seconds, post_multi_setup_duration_seconds, holder collisions
- Alarm: time_limit, DLQ, retry

## Bağımlılıklar
- Seed  CAM/Sim
- CAM  Sim  Post
- FE  API hazır
- CI  tüm testlerin geçmesi
