# Cloudflare productie-checklist — Star Local

Dit document beschrijft de **handmatige stappen** om Star Local live te zetten op één centrale Cloudflare-omgeving. Voer deze stappen **niet automatisch** uit vanuit de codebase. **Geen deploy in dit document uitvoeren zonder expliciete goedkeuring.**

**Branch:** `feature/saas-phase-1-foundation`  
**Laatst gecontroleerd:** 2026-08-05 (OPDRACHT 62)

---

## Publicatieflow (volledig)

```
Builder → Concept → Ter goedkeuring → Goedgekeurd → Publicatiepakket → Cloudflare-ready → Live
         (D1)      (pending_review)   (approved)    (package_ready)    (R2 deploy)      (published)
```

| Stap | Status | Actie |
|------|--------|-------|
| 1 | `concept` / `pending_review` | Builder indienen → D1 |
| 2 | `pending_review` | Admin goedkeuren/afkeuren (+ Resend mail) |
| 3 | `approved` | Admin "Pakket genereren" → disk `publications/{tenantId}/{websiteId}/vN/` |
| 4 | `package_ready` | Admin productiepreview + "Live zetten" → R2 `{tenantId}/site/*` |
| 5 | `published` | Tenant actief op `https://{slug}.starlocal.nl` |

**API-routes:**
- `POST /api/admin/websites/publish/` — pakket genereren
- `POST /api/admin/websites/go-live/` — R2 deploy + `markPublished()`
- `GET /api/admin/publication/file/` — productiepreview

**Config-bestanden:**
- `wrangler.toml` — alleen lokale ontwikkeling (dev D1/R2)
- `wrangler.prod.toml` — productie (D1/R2 + `[vars]`)

---

## Architectuurprincipe

**Één codebase · één Cloudflare-applicatie · één D1 · één R2 · multi-tenant**

| Hostname | Doel |
|----------|------|
| `starlocal.nl` / `www.starlocal.nl` | Marketingwebsite (pSEO, wizard, content) |
| `app.starlocal.nl` | Dashboard, login, editor |
| `{slug}.starlocal.nl` | Tenantwebsite (uit D1 + R2) |

**GEEN apart Cloudflare Pages- of Workers-project per ondernemer.**

---

## Configuratie-audit (huidige staat)

### `wrangler.toml` (ontwikkeling — actief)

| Binding / setting | Status | Waarde |
|-------------------|--------|--------|
| `DB` (D1) | ✅ Dev | `star-local-saas-dev` — **geen** `database_id` |
| `MEDIA` (R2) | ✅ Dev | `star-local-saas-media-dev` |
| `[vars]` | ⬜ Ontbreekt | Alleen in `wrangler.prod.toml` |
| Resend secrets | ⬜ Lokaal | Via `.env` / `.env.example` |

### `wrangler.prod.toml` (productie — deploy config)

| Binding / setting | Status | Waarde |
|-------------------|--------|--------|
| `DB` (D1) | 📋 Klaar | `star-local-saas-prod` + `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` |
| `MEDIA` (R2) | 📋 Klaar | `star-local-saas-media-prod` |
| `[vars]` | ✅ Aanwezig | `APP_BASE_URL`, `DASHBOARD_BASE_URL`, `TENANT_BASE_DOMAIN`, `ENVIRONMENT` |
| Secrets | 📋 Handmatig | `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_TO_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` |

### `wrangler.example.toml` (legacy sjabloon)

| Binding / setting | Status | Opmerking |
|-------------------|--------|-----------|
| `DB` (D1) | 📋 Sjabloon | `star-local-saas-prod` + `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` |
| `MEDIA` (R2) | 📋 Sjabloon | `star-local-saas-media-prod` |
| `SESSION` (KV) | 📋 Uitgecommentarieerd | Optioneel |
| `[vars]` | 📋 Sjabloon | `APP_BASE_URL`, `DASHBOARD_BASE_URL`, … |
| Resend | 📋 Documentatie | Secrets via Dashboard |

### Ontbrekende configuraties vóór productie-setup (5)

1. D1 `database_id` invullen in `wrangler.prod.toml`
2. Cloudflare D1 + R2 resources aanmaken (prod names)
3. Secrets instellen in Dashboard (`RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_TO_EMAIL`, optioneel `ADMIN_NOTIFICATION_EMAIL`)
4. `MEDIA_PUBLIC_BASE_URL` invullen wanneer CDN actief is
5. DNS: `app.starlocal.nl` + `*.starlocal.nl` (handmatig, na deploy)

*(Dev `wrangler.toml` blijft ongewijzigd — geen testdatabase in productieconfig.)*

---

## Stap-voor-stap productie-setup

Volg deze volgorde. Vink af na handmatige uitvoering.

### ✓ Stap 1 — D1 aanmaken

- [ ] Cloudflare-account + Wrangler CLI geauthenticeerd
- [ ] Database aanmaken:

```bash
wrangler d1 create star-local-saas-prod
```

- [ ] `database_id` noteren
- [ ] `wrangler.prod.toml` bijwerken (niet `wrangler.toml`):

```toml
# wrangler.prod.toml
[[d1_databases]]
binding = "DB"
database_name = "star-local-saas-prod"
database_id = "<database_id>"
migrations_dir = "migrations"
```

- [ ] Migraties uitvoeren (zie [Database-migraties](#database-migraties-0001-0008)):

```bash
wrangler d1 migrations apply star-local-saas-prod --remote --config wrangler.prod.toml
```

- [ ] Tabellen controleren:

```bash
wrangler d1 execute star-local-saas-prod --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

**Verwacht:** `users`, `tenants`, `magic_links`, `tenant_users`, `websites`, `contacts`, `services`, `opening_hours`, `sessions`, `website_pages`, `media_items`, `publication_logs`, `admin_publication_logs`, `publication_versions`.

---

### ✓ Stap 2 — R2 aanmaken

- [ ] Bucket aanmaken:

```bash
wrangler r2 bucket create star-local-saas-media-prod
```

- [ ] Binding in `wrangler.prod.toml`:

```toml
[[r2_buckets]]
binding = "MEDIA"
bucket_name = "star-local-saas-media-prod"
```

- [ ] Bucket-naam controleren in Cloudflare Dashboard → R2
- [ ] **Geen test-uploads** uitvoeren tenzij expliciet gewenst

#### R2 opslagstructuur (productie)

Alle objecten in **één bucket**, gescheiden per `tenantId`:

**Media-uploads** (`src/lib/media/paths.ts`):

```
{tenantId}/logo/{uuid}.{ext}
{tenantId}/photos/{uuid}.{ext}
{tenantId}/hero/{uuid}.{ext}       ← ook social/OG-afbeeldingen
{tenantId}/gallery/{uuid}.{ext}
```

**Publicatiepakketten (archief)** (`src/lib/publish/package-r2-paths.ts`):

```
{tenantId}/packages/{versionLabel}/index.html
{tenantId}/packages/{versionLabel}/assets/...
```

**Exports** (`src/lib/publish/package-r2-paths.ts`):

```
{tenantId}/exports/{exportId}/{filename}
```

**Gepubliceerde tenant-sites** (`src/lib/publish/site-paths.ts`):

```
{tenantId}/site/index.html
{tenantId}/site/over-ons/index.html
{tenantId}/site/diensten/index.html
{tenantId}/site/contact/index.html
{tenantId}/site/privacy/index.html
{tenantId}/site/robots.txt
{tenantId}/site/sitemap.xml
{tenantId}/site/manifest.webmanifest
{tenantId}/site/favicon.svg
```

**Lokaal (dev zonder R2):** `LocalMediaAdapter` gebruikt prefix `local/{tenantId}/…` in geheugen — dit is **niet** de productiestructuur.

**Metadata in D1:** tabel `media_items` (`storage_key`, `media_type`, `filename`, `sort_order`).

---

### ✓ Stap 3 — KV controleren

- [ ] **Niet verplicht** voor Website Builder V1
- [ ] Sessies: D1-tabel `sessions` (migratie `0004_auth_sessions.sql`)
- [ ] Astro kan waarschuwen over `SESSION` KV-binding — negeer tenzij Astro-sessions via KV gewenst
- [ ] Indien later nodig:

```toml
# [[kv_namespaces]]
# binding = "SESSION"
# id = "REPLACE_WITH_KV_NAMESPACE_ID"
```

---

### ✓ Stap 4 — Environment variables

#### Secrets (Cloudflare Dashboard → Settings → Secrets)

| Variabele | Verplicht | Gebruik |
|-----------|-----------|---------|
| `RESEND_API_KEY` | ✅ Ja | Magic links, save-e-mail, tenant-contactformulier |
| `FROM_EMAIL` | ✅ Ja | Afzender alle Resend-mails (bijv. `Star Local <noreply@starlocal.nl>`) |
| `CONTACT_TO_EMAIL` | ✅ Ja | Ontvanger marketingcontactformulier (`/api/contact/`) |
| `ADMIN_NOTIFICATION_EMAIL` | ⬜ Optioneel | Admin notificatie bij go-live |

```bash
wrangler pages secret put RESEND_API_KEY --project-name star-local --config wrangler.prod.toml
wrangler pages secret put FROM_EMAIL --project-name star-local --config wrangler.prod.toml
wrangler pages secret put CONTACT_TO_EMAIL --project-name star-local --config wrangler.prod.toml
wrangler pages secret put ADMIN_NOTIFICATION_EMAIL --project-name star-local --config wrangler.prod.toml
```

#### Plain-text variabelen (`[vars]` in `wrangler.toml` of Dashboard)

| Variabele | Verplicht | Voorbeeld |
|-----------|-----------|-----------|
| `APP_BASE_URL` | ✅ Ja | `https://www.starlocal.nl` |
| `DASHBOARD_BASE_URL` | ✅ Ja | `https://app.starlocal.nl` |
| `TENANT_BASE_DOMAIN` | ✅ Ja | `starlocal.nl` |
| `ENVIRONMENT` | ✅ Ja | `production` |
| `MEDIA_PUBLIC_BASE_URL` | ⬜ Optioneel | CDN-host media (toekomstige fase) |

#### Resend-checklist

- [ ] Magic Login (`src/lib/auth/auth.service.ts`) — `RESEND_API_KEY` + `FROM_EMAIL`
- [ ] Goedkeuringsmails (`PATCH /api/admin/websites/`) — zelfde secrets
- [ ] Publicatiemails (`POST /api/admin/websites/go-live/`) — owner + optioneel admin
- [ ] Contactformulier (`/api/contact/`) — `CONTACT_TO_EMAIL`

#### Niet vereist

| Variabele | Reden |
|-----------|-------|
| `MAGIC_LINK_SECRET` | **Niet gebruikt** — tokens gehasht opgeslagen in D1 (`magic_links.token_hash`) |

#### Astro env schema (`astro.config.mjs`)

Gedefinieerd in `astro.config.mjs` (alle optioneel lokaal):

- `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_TO_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` (secrets)
- `APP_BASE_URL`, `DASHBOARD_BASE_URL`, `TENANT_BASE_DOMAIN`, `ENVIRONMENT`, `MEDIA_PUBLIC_BASE_URL` (public)

Lokaal: kopieer `.env.example` → `.env` (niet committen).

---

### ✓ Stap 5 — Bindings controleren (Dashboard)

Cloudflare Dashboard → Workers & Pages → **star-local** → Settings → Bindings:

| Binding | Type | Productiewaarde |
|---------|------|-----------------|
| `DB` | D1 | `star-local-saas-prod` |
| `MEDIA` | R2 | `star-local-saas-media-prod` |
| `SESSION` | KV | *(optioneel — overslaan)* |

Binding-namen moeten exact overeenkomen met `src/env.d.ts` (`DB`, `MEDIA`).

---

### ✓ Stap 6 — Deploy

**Nog niet uitvoeren zonder goedkeuring.**

```bash
npm run build
wrangler pages deploy dist --config wrangler.prod.toml --project-name star-local
```

Of via GitHub-integratie (bestaand `star-local` Pages-project).

- [ ] Build exit 0
- [ ] Deployment succesvol in Dashboard
- [ ] `_worker.js` + statische assets aanwezig in `dist/`

---

### ✓ Stap 7 — Test (na deploy)

#### Infrastructuur

- [ ] `https://www.starlocal.nl` — homepage laadt
- [ ] `https://app.starlocal.nl` — dashboard redirect/login
- [ ] SSL Full (strict) op alle hostnames
- [ ] D1-binding werkt (`/api/website/save/` retourneert geen `DB_UNAVAILABLE`)
- [ ] R2-binding werkt (media-upload na save)

#### Website Builder V1

- [ ] `/gratis-website/` — landing + header/footer CTA
- [ ] `/gratis-website/start/` — wizard 8 stappen
- [ ] Opslaan als concept → D1 + R2
- [ ] Magic link e-mail ontvangen (Resend)
- [ ] Dashboard laadt opgeslagen website
- [ ] Editor wijzigingen persistent in D1
- [ ] Preview desktop / tablet / mobiel
- [ ] Contactformulier tenant-site (Resend)

#### Admin publicatieflow

- [ ] Admin goedkeuring → status `approved`
- [ ] Pakket genereren → status `package_ready` + disk package
- [ ] Productiepreview (`/admin/production-preview/`)
- [ ] Live zetten → R2 + status `published` + `{slug}.starlocal.nl`

#### Automatische tests (lokaal, vóór deploy)

```bash
node scripts/production-readiness-check.mjs
npm run test:generate   # 22/22
npm run test:publish    # 13/13
npm run build           # exit 0
```

---

## Database-migraties (0001–0008)

Migraties staan in `migrations/` en worden in **vaste volgorde** uitgevoerd door `wrangler d1 migrations apply`.

| # | Bestand | Inhoud | Afhankelijk van |
|---|---------|--------|-----------------|
| **0001** | `0001_auth_foundation.sql` | `users`, `tenants`, `magic_links`, `tenant_users` | — |
| **0002** | `0002_website_foundation.sql` | `websites`, `contacts`, `services`, `opening_hours`; `ALTER tenants` (+branche) | 0001 |
| **0003** | `0003_publish_fields.sql` | `ALTER tenants/websites` (+description, status, package, logo_key) | 0002 |
| **0004** | `0004_auth_sessions.sql` | `sessions`; `ALTER magic_links` (+tenant_id) | 0001, 0003 |
| **0005** | `0005_website_save_foundation.sql` | `website_pages`, `media_items`; contact/website uitbreidingen | 0002, 0003 |
| **0006** | `0006_publication_pipeline.sql` | `publication_logs`; `ALTER websites` (+publication_status) | 0002, 0005 |
| **0007** | `0007_admin_approval_queue.sql` | `approval_status`, `config_snapshot_json`, `admin_publication_logs` | 0002 |
| **0008** | `0008_publication_packages.sql` | `publication_versions`; uitgebreide approval statuses | 0007 |

### Volgorde-controle

- ✅ **0001 → 0002 → 0003** — lineair; elke stap bouwt voort op vorige tabellen
- ✅ **0004** — vereist `tenants` (0001) en `magic_links` (0001); veilig na 0003
- ✅ **0005** — vereist `websites`, `contacts` (0002); `ALTER websites` vereist 0003-kolommen
- ✅ **0006** — vereist `websites` (0002); geen conflict met 0005
- ✅ **0007** — vereist `websites`; voegt admin approval kolommen toe
- ✅ **0008** — vereist 0007 approval statuses; recreates CHECK constraints veilig

**Geen circular dependencies.** Alle migraties gebruiken `IF NOT EXISTS` / `ADD COLUMN` waar mogelijk — herhaald uitvoeren is veilig via Wrangler migration tracking.

### Lokaal toepassen (dev)

```bash
wrangler d1 migrations apply star-local-saas-dev --local
```

---

## DNS & hostnames (na deploy — handmatig)

### app.starlocal.nl

```
app.starlocal.nl  CNAME  star-local.pages.dev
```

Middleware redirect `/` → `/dashboard/` op app-hostname.

### Wildcard tenant-sites

```
*.starlocal.nl  CNAME  star-local.pages.dev
```

Gereserveerde subdomeinen: zie `src/config/reserved-subdomains.ts` (`www`, `app`, `api`, …).

**Nog niet activeren** tot staging-validatie compleet is.

---

## Rollbackprocedure

1. **Cloudflare Pages** → Deployments → vorige deployment → Rollback
2. **D1-backup** vóór grote wijzigingen:

```bash
wrangler d1 export star-local-saas-prod --remote --output backup-YYYYMMDD.sql
```

3. **R2**: tenant-objecten blijven; herpublicatie na fix
4. **DNS**: wildcard/app-subdomein kan tijdelijk worden verwijderd

---

## Bekende blokkades vóór livegang

| Blokkade | Impact |
|----------|--------|
| `database_id` placeholder in `wrangler.prod.toml` | Handmatig invullen na D1 create |
| Cloudflare D1/R2 prod resources | Nog niet aangemaakt (bewust) |
| DNS wildcard + app subdomain | Handmatig na deploy |
| `MEDIA_PUBLIC_BASE_URL` placeholder | Geen CDN-media-URLs op tenant sites |
| Resend domeinverificatie | E-mail pas na SPF/DKIM + secrets |
| Go-live vereist R2 binding | Lokaal: platformProxy dev bucket |

---

## Checklist samenvatting

- [ ] **Stap 1** — D1 aangemaakt + migraties 0001–0008 remote
- [ ] **Stap 2** — R2 bucket aangemaakt + binding `MEDIA`
- [ ] **Stap 3** — KV gecontroleerd (overslaan indien D1-sessies voldoende)
- [ ] **Stap 4** — Secrets + environment variables ingesteld
- [ ] **Stap 5** — Bindings gevalideerd in Dashboard
- [ ] **Stap 6** — Deploy uitgevoerd
- [ ] **Stap 7** — Test checklist doorlopen
- [ ] DNS `app.starlocal.nl` + wildcard (handmatig, na deploy)
- [ ] SSL gevalideerd
- [ ] Rollbackprocedure bekend

**GEEN apart Cloudflare-project per ondernemer.**

---

## Lokale ontwikkeling (referentie)

```bash
wrangler d1 migrations apply star-local-saas-dev --local
npm run dev          # platformProxy → D1/R2 dev bindings
npm run build        # exit 0 vereist vóór deploy
npm run test:generate
npm run test:publish
```

Zie ook: `docs/website-builder-v1-checklist.md`
