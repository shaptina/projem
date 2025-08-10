Proje PRD + İş Akışı Planı (M1→M15)

1\) Amaç \& Kapsam

Amaç: FreeCAD tabanlı CNC/CAM/CAD üretim platformu. Kullanıcılar prompt veya parametrelerle montaj/3B model üretecek, CAM simülasyonu yapacak, G-code oluşturup ön izleyecek ve işlerini kuyruk üzerinden ölçekli şekilde çalıştıracak.



Dil \& UX: Tüm arayüz, e-postalar, log mesajları Türkçe.



Mocksuz: Eksik veri → açık hata. “Placeholder geometri” yasak.



Hedefler: Çoklu kullanıcı, eşzamanlı FreeCAD işler, doğrulama/izlenebilirlik, CI/CD, kurumsal güvenlik.



2\) Kullanıcı Rolleri \& Senaryolar

Mühendis/Operatör: Prompt/parametre girer, model \& CAM sonucu görür, G-code indirir.



Takım Lideri: İş kuyruklarını ve kaynakları yönetir, log/telemetri izler.



Yönetici: Yetkiler, proje ayarları, entegrasyonlar (S3/SSO) ve maliyet takibi.



3\) Mimari (Yüksek Seviye)

Monorepo:



apps/web → Next.js 14 (TS, App Router, Tailwind, react-three-fiber)



apps/api → FastAPI (Py 3.11+), SQLAlchemy + Alembic, Celery + Redis, S3/MinIO, OpenAI SDK



FreeCAD hattı: Sadece FreeCADCmd (GUI’siz), subprocess ile.



3B Önizleme: Backend’te STL/STEP → glTF dönüşümü; Frontend’de three.js ile görüntüleme.



G-code görüntüleme: Web’de G-code parser + toolpath renderer (2D/3D overlay).



Gözlemlenebilirlik: OpenTelemetry (traces/logs/metrics) + Prometheus/Grafana + Sentry.



CI/CD: GitHub Actions → test/lint/typecheck → Docker build → Trivy → Deploy (K8s/ECS).



Kimlik: Dev’de bypass; Prod’da OIDC/SSO + JWT.



4\) Özellikler (Özet)

Auth: Kayıt, giriş, şifre sıfırlama; dev modda bypass.



Prompt→Model: Prompt/parametre analizi (JSON Schema), montaj kuralları, doğrulama.



Model Üretimi: FreeCADCmd ile tek recompute() prensibi; Assembly4 kısıtları.



CAM: FreeCAD Path iş akışları + post-processor (ör. Fanuc/Marlin vb.).



Simülasyon: Kesici yolu/süre/işleme sırası; çakışma uyarıları.



G-code: Prompt/parametre → plan → toolpath → postproc → indirilebilir dosya.



3D Önizleme: glTF/STEP/STL görüntüleme, katman/işlem yolu overlay.



Kuyruk: Celery multiple queues (cpu, freecad, postproc) + idempotency + rate limit.



Log/Metrik: İstek başına request\_id, model, effort, token/metrik, FreeCAD sürümü.



Çoklu Kullanıcı: Proje/quote/job bazlı izolasyon; kota \& eşzamanlılık sınırları.



5\) İş Akışı (Milestones)

M1 — İskelet \& Dev Mod

Monorepo, Docker Compose, make dev/test/lint/fmt, .env.example, OTel/Sentry altyapısı.



Auth dev bypass: DEV\_AUTH\_BYPASS=true ise frontend “Geliştirici Kullanıcı” ile oturum aç.



M2 — Auth (Prod-Ready)

E-posta doğrulama (dev’de console mail), şifre sıfırlama, JWT + refresh, rol tabanlı yetki (RBAC).



M3 — FreeCAD Entegrasyon Temeli

freecad\_service.detect() (path keşfi), --version log’u, Assembly4 varlık kontrolü.



subprocess\_runner: process group, timeout, kill-tree (Win: taskkill /T /F, Unix: killpg).



M4 — Prompt/Parametre Analizi

JSON Schema + Pydantic: Planet dişli/dişli kutusu örnek şemaları.



Maks. 5 net soru ile eksikleri tamamla; varsayılanlar loglansın.



M5 — Model Üretimi (Mocksuz)

Üretilen script whitelist modüllerle güvenli exec: App, Part, Sketcher, Asm4.



Tek recompute; FCStd kaydı → yeniden aç/doğrula (nesne sayısı, isimler, oranlar, dosya boyutu eşiği).



Başarısızsa açık hata, basitleştirme yok.



M6 — CAM \& G-code

FreeCAD Path iş akışları: takım, operasyon, hız/ilerleme; post-processor (konfigürasyonlu).



Prompt→G-code zinciri: analiz → plan → toolpath → postproc → doğrulama (G-code lint).



M7 — 3D \& G-code Önizleme (Web)

STL/STEP→glTF dönüştürme; react-three-fiber görüntüleme.



G-code yol overlay + makine sınırları \& çarpışma uyarı katmanı.



M8 — Kuyruk \& Eşzamanlılık

Celery queues: freecad (seri/limitli), cpu (paralel), postproc.



Idempotency key, retry/backoff, rate limit, kullanıcı/organizasyon kotaları.



M9 — Telemetri \& Raporlama

Trace’ler: analiz→üretim→doğrulama süreleri; token/metrikler; artefakt yolları.



Yönetim paneli: kuyruk durumu, iş detayları, hata nedenleri.



M10 — Güvenlik \& Sertleştirme

SSO/OIDC, JWT imza rotasyonu, giriş denemesi limiti, dosya taraması (ClamAV/trivy).



Gizli anahtar yönetimi: cloud KMS/Secret Manager; politika \& roll-out.



M11 — Testler

Pytest (API), Playwright (web), entegrasyon (FreeCADCmd gerçek koşu).



Performans: eşzamanlı 10/50/100 iş senaryoları; uzun koşularda timeout/kaynak ölçümü.



M12 — Dağıtım

CI: test/lint/typecheck→Docker→Trivy→staging deploy.



CD: manuel onayla prod; mavi/yeşil veya canary dağıtımı.



6\) FreeCAD Çalıştırma Kuralları

Sadece FreeCADCmd.



Subprocess şart: izole çalışma dizini, tek recompute(), timeout + kill-tree.



Giriş/Çıkış protokolü (JSON):



Giriş: model türü, parametreler, takım bilgisi, CAM ayarları, çıktı yolları.



Çıkış: success, message, metrics{elapsed\_ms, file\_size, object\_count}, artefact{paths}.



Doğrulama zorunlu: Kaydedilen FCStd tekrar açılır, recompute edilir, eşiğe uymayan durumda açık hata.



7\) API Taslağı (özet)

POST /api/v1/auth/register|login|forgot



POST /api/v1/assemblies → analiz→üretim→doğrulama tetikler (job id döner)



GET /api/v1/jobs/:id → durum, log, metrik, indirilebilirler



POST /api/v1/cam/gcode → prompt/param’dan G-code üret



GET /api/v1/files/:id → imzalı URL ile indir



GET /api/v1/telemetry/summary → OTel’den özet metrikler



8\) Veri Modeli (özet tablolar)

users (id, email, hash, role, locale)



projects (org\_id, name, settings)



jobs (idempotency\_key, type, status, started\_at, finished\_at, metrics, artefacts)



artefacts (job\_id, type: fcstd/gltf/stl/gcode, s3\_key, size, sha256)



limits (org/user kotaları)



audit\_logs (actor, action, resource, request\_id)



9\) Kuyruk Politikaları

freecad kuyruğu: concurrency=1..N (CPU ve bellek sınırına göre), uzun timeout (örn. 10-20 dk).



cpu \& postproc: daha yüksek paralellik.



Retry/backoff: örn. 3 deneme, 30s→2m→5m; idempotency ile tekrarlı çalışmaya güvenli.



10\) Geliştirme Modu (Auth Bypass)

.env: DEV\_AUTH\_BYPASS=true → API X-Dev-User başlığını kabul eder; web otomatik login (banner ile uyar).



CI \& staging’de kapalı. Prod’da her zaman kapalı.



11\) Makefile \& Komutlar

make dev → compose ile web+api+redis+minio+db



make test → pytest + Playwright



make lint → Ruff/Black/isort + ESLint/Prettier + Trivy



make migrate|seed|logs|stop



make gen-docs → OpenAPI + mimari diyagramları üret



12\) Kabul Kriterleri

make dev tek komutta kalkar; /healthz ve /metrics yeşil.



Örnek “3 kademeli planet, 100:1, 10kW” isteği → FCStd üretildi, yeniden açılıp recompute OK, glTF üretildi, G-code üretildi ve web’de ön izlendi.



Loglarda: request\_id, model, effort, elapsed\_ms, freecad\_version, artefact\_path.



Eksik girişte HTTP 422, hangi alanların eksik/yanlış olduğu Türkçe açıklanır.



10 eşzamanlı işte kuyruk stabil, hiçbir iş kilitlenmeden tamamlanır.



\## M13 — Admin Uygulaması (Ayrı Kurumsal App)

\- \*\*Uygulama\*\*: `apps/admin` (Next.js 14, TS, Tailwind), tamamen Türkçe UI.

\- \*\*Ağ/erişim\*\*: Internal domain, VPN/ZTNA, IP allowlist, WAF. SSO (OIDC/SAML) + MFA.

\- \*\*Sayfalar\*\*:

&nbsp; 1) \*\*Genel Gösterge Paneli\*\*: sistem sağlığı, hata oranları, kuyruk gecikmesi, aktif işler.

&nbsp; 2) \*\*İşler (Jobs)\*\*: arama/filtre/sıralama; canlı log; \*\*cancel/retry/pause/resume\*\*; artefakt indirme.

&nbsp; 3) \*\*Kullanıcılar\*\*: kullanıcı/organizasyon detayları, kotlar; kilitle/aç; oturumları kapat.

&nbsp; 4) \*\*Kuyruk \& Worker’lar\*\*: concurrency, bekleme, drain/pause; yeniden başlat.

&nbsp; 5) \*\*Prompt \& Girdi Kayıtları\*\*: kullanıcı bazında zaman çizelgesi (prompt, parametre, sonuç/hata).

&nbsp; 6) \*\*CAM/FreeCAD Ayarları\*\*: takım kütüphanesi, post-processor profilleri, FreeCAD sürüm bilgisi.

&nbsp; 7) \*\*LLM Ayarları\*\*: varsayılan model (o4-mini), otomatik escalate politikası, bütçe/metrikler.

&nbsp; 8) \*\*Güvenlik\*\*: SSO/MFA durumu, IP listeleri, token rotasyonu.

&nbsp; 9) \*\*Audit Log (değiştirilemez)\*\*: tüm kritik aksiyonlar, PII-unmask istekleri (onay + sebep).

\- \*\*Gizlilik \& PII\*\*: Varsayılan log görünümü maskeli; `pii:view` scoped admin “gerekçe” girerek \*\*maskeyi geçici kaldırabilir\*\* (olay audit’e düşer).

\- \*\*Kabul Kriterleri\*\*:

&nbsp; - Public internetten erişim \*\*imkânsız\*\* (VPN/ZTNA zorunlu).

&nbsp; - Admin olmayan kullanıcılara \*\*403\*\*; bypass yok.

&nbsp; - Her sayfada sayfalama/filtre/sıralama/arama; tüm eylemler audit’te.



\## M14 — Audit, Forensic \& SIEM

\- \*\*Audit verisi\*\*: append-only tablo + hash-zincir (`id`, `ts`, `actor\_id`, `action`, `resource`, `request\_id`, `diff?`, `prev\_hash`, `hash`).

\- \*\*Arşiv\*\*: Günlük audit export’u WORM (S3 Object Lock); doğrulama için periyodik hash set.

\- \*\*SIEM entegrasyonu\*\*: OTel → log/metric/trace forward; anomali ve PII-unmask alarmları.

\- \*\*Forensic\*\*: “kullanıcı/iş zaman çizelgesi” tek ekranda; request\_id ile uçtan uca izleme.



\## M15 — Log \& Prompt/Girdi Kayıtları

\- \*\*Şema\*\*:

&nbsp; - `prompt\_logs` (id, user\_id, org\_id, job\_id, ts, prompt\_masked, params\_masked, model, effort, status, error\_code?, token\_usage?, artefact\_refs?)

&nbsp; - `audit\_events` (append-only; hash-zincirli)

&nbsp; - `pii\_unmask\_requests` (id, admin\_id, ts, reason, scope, approved\_by, expires\_at)

\- \*\*Sorgular\*\*:

&nbsp; - Kullanıcı → tarih aralığı → prompt \& sonuç/hata listesi.

&nbsp; - `job\_id` → tam yaşam döngüsü (analiz→üretim→doğrulama).

\- \*\*Görüntüleme\*\*: Admin panelde prompt/girdi \*\*maskeli\*\* göster; “Gör (PII)” butonu → onay modalı → \*\*geçici unmask\*\*.



\## Admin API (özet uçlar)

\- `GET /admin/overview`

\- `GET /admin/jobs` + `POST /admin/jobs/{id}/(cancel|retry|pause|resume)`

\- `GET /admin/users` + `GET /admin/users/{id}/timeline` (prompt \& iş akışı)

\- `GET /admin/queues` + `POST /admin/queues/{name}/(drain|pause|resume)`

\- `GET /admin/audit` (sayfalama + filtre)

\- `POST /admin/pii/unmask` (reason + scope; onay gerektirir)



\## Güvenlik Kriterleri

\- Prod’da \*\*DEV\_AUTH\_BYPASS kesinlikle yok\*\*; sadece dev ortamında web banner ile uyarı.

\- Tüm admin istekleri `request\_id` ve `trace\_id` taşır; 4xx/5xx alarmları SIEM’e gider.

\- PII görüntüleme her seferinde gerekçe + onay ister; olay audit’te görünür.

\- Artefakt indirme imzalı URL + kısa TTL + IP bağlı; erişimler audit’e yazılır.



\## Operasyon \& Retention

\- Log rotasyonu ve sıkıştırma (günlük).

\- Retention: İş/telemetri logları 90 gün sıcak, 1–7 yıl soğuk (politika dosyasında parametrik).

\- Otomatik health checks, kuyruk gecikmesi ve hata oranı için threshold bazlı uyarılar.



\## Make/CI ekleri

\- `make admin-dev` → `apps/admin` dev server’ı internal proxy ile.

\- CI’da admin lint/test/build; deploy \*\*ayrı\*\* (staging-admin, prod-admin).



