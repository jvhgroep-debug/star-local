# Cloudflare productie-checklist — Star Local

Dit document beschrijft de **handmatige stappen** om Star Local live te zetten op één centrale Cloudflare-omgeving. Voer deze stappen **niet automatisch** uit vanuit de codebase. **Geen deploy in dit document uitvoeren zonder expliciete goedkeuring.**

**Branch:** `feature/saas-phase-1-foundation`  
**Laatst gecontroleerd:** 2026-08-03

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
| `SESSION` (KV) | ⬜ Niet geconfigureerd | Optioneel; niet vereist (sessies in D1) |
| `[vars]` | ⬜ Ontbreekt | Alleen in `wrangler.example.toml` |
| Resend secrets | ⬜ Ontbreekt | Via Dashboard / `.env` lokaal |

### `wrangler.example.toml` (productie-sjabloon)

| Binding / setting | Status | Opmerking |
|-------------------|--------|-----------|
| `DB` (D1) | 📋 Sjabloon | `star-local-saas-prod` + `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` |
| `MEDIA` (R2) | 📋 Sjabloon | `star-local-saas-media-prod` |
| `SESSION` (KV) | 📋 Uitgecommentarieerd | Optioneel |
| `[vars]` | 📋 Sjabloon | `APP_BASE_URL`, `DASHBOARD_BASE_URL`, … |
| Resend | 📋 Documentatie | Secrets via Dashboard |

### Ontbrekende configuraties vóór productie-setup (7)

1. D1 `database_id` (productie)
2. D1 `database_name` → `star-local-saas-prod` in actieve `wrangler.toml`
3. R2 `bucket_name` → `star-local-saas-media-prod` in actieve `wrangler.toml`
4. `[vars]` — `APP_BASE_URL`, `DASHBOARD_BASE_URL`, `RESEND_FROM_EMAIL`
5. Secret `RESEND_API_KEY`
6. Secret `FROM_EMAIL`
7. Secret `CONTACT_TO_EMAIL`

*(KV `SESSION` is optioneel — telt niet mee als blokkade.)*

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
- [ ] `wrangler.toml` bijwerken:

```toml
[[d1_databases]]
binding = "DB"
database_name = "star-local-saas-prod"
database_id = "<database_id>"
migrations_dir = "migrations"
```

- [ ] Migraties uitvoeren (zie [Database-migraties](#database-migraties-0001-0006)):

```bash
wrangler d1 migrations apply star-local-saas-prod --remote
```

- [ ] Tabellen controleren:

```bash
wrangler d1 execute star-local-saas-prod --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

**Verwacht:** `users`, `tenants`, `magic_links`, `tenant_users`, `websites`, `contacts`, `services`, `opening_hours`, `sessions`, `website_pages`, `media_items`, `publication_logs`.

---

### ✓ Stap 2 — R2 aanmaken

- [ ] Bucket aanmaken:

```bash
wrangler r2 bucket create star-local-saas-media-prod
```

- [ ] Binding in `wrangler.toml`:

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
{tenantId}/hero/{uuid}.{ext}
{tenantId}/gallery/{uuid}.{ext}
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

```bash
wrangler pages secret put RESEND_API_KEY --project-name star-local
wrangler pages secret put FROM_EMAIL --project-name star-local
wrangler pages secret put CONTACT_TO_EMAIL --project-name star-local
```

#### Plain-text variabelen (`[vars]` in `wrangler.toml` of Dashboard)

| Variabele | Verplicht | Voorbeeld |
|-----------|-----------|-----------|
| `APP_BASE_URL` | ✅ Ja | `https://www.starlocal.nl` |
| `DASHBOARD_BASE_URL` | ✅ Ja | `https://app.starlocal.nl` |
| `RESEND_FROM_EMAIL` | ⚠️ Aanbevolen | `Star Local <noreply@starlocal.nl>` |
| `MEDIA_PUBLIC_BASE_URL` | ⬜ Optioneel | CDN-host media (toekomstige fase) |

#### Resend-checklist (geen code-wijzigingen nodig)

- [ ] Resend-account aangemaakt
- [ ] Domein `starlocal.nl` geverifieerd in Resend (SPF/DKIM)
- [ ] `RESEND_API_KEY` ingesteld in Cloudflare Secrets
- [ ] `FROM_EMAIL` overeenkomstig geverifieerd afzenderdomein
- [ ] Test magic link na deploy (niet nu)
- [ ] Test contactformulier na deploy (niet nu)

#### Niet vereist

| Variabele | Reden |
|-----------|-------|
| `MAGIC_LINK_SECRET` | **Niet gebruikt** — tokens gehasht opgeslagen in D1 (`magic_links.token_hash`) |

#### Astro env schema (`astro.config.mjs`)

Gedefinieerd en optioneel lokaal:

- `RESEND_API_KEY` (secret)
- `FROM_EMAIL` (secret)
- `CONTACT_TO_EMAIL` (secret)

Lokaal: `.env` / `.env.local` (niet committen).

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
wrangler pages deploy dist --project-name star-local
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

#### Publicatie (indien geactiveerd)

- [ ] `/api/website/publish` — tenant live op `{slug}.starlocal.nl`
- [ ] R2: `{tenantId}/site/index.html` aanwezig
- [ ] Marketing pSEO (~6383 URL's) intact

#### Automatische tests (lokaal, vóór deploy)

```bash
npm run test:generate   # 22/22
npm run test:publish    # 13/13
npm run build           # exit 0
```

---

## Database-migraties (0001–0006)

Migraties staan in `migrations/` en worden in **vaste volgorde** uitgevoerd door `wrangler d1 migrations apply`.

| # | Bestand | Inhoud | Afhankelijk van |
|---|---------|--------|-----------------|
| **0001** | `0001_auth_foundation.sql` | `users`, `tenants`, `magic_links`, `tenant_users` | — |
| **0002** | `0002_website_foundation.sql` | `websites`, `contacts`, `services`, `opening_hours`; `ALTER tenants` (+branche) | 0001 |
| **0003** | `0003_publish_fields.sql` | `ALTER tenants/websites` (+description, status, package, logo_key) | 0002 |
| **0004** | `0004_auth_sessions.sql` | `sessions`; `ALTER magic_links` (+tenant_id) | 0001, 0003 |
| **0005** | `0005_website_save_foundation.sql` | `website_pages`, `media_items`; contact/website uitbreidingen | 0002, 0003 |
| **0006** | `0006_publication_pipeline.sql` | `publication_logs`; `ALTER websites` (+publication_status) | 0002, 0005 |

### Volgorde-controle

- ✅ **0001 → 0002 → 0003** — lineair; elke stap bouwt voort op vorige tabellen
- ✅ **0004** — vereist `tenants` (0001) en `magic_links` (0001); veilig na 0003
- ✅ **0005** — vereist `websites`, `contacts` (0002); `ALTER websites` vereist 0003-kolommen
- ✅ **0006** — vereist `websites` (0002); geen conflict met 0005

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
| `wrangler.toml` is dev-only | Productie-bindings ontbreken |
| Dashboard publish ≠ live R2-pipeline | Gebruik `/api/website/publish` voor echte live site |
| Geen republish-flow | Tweede publicatie vereist extra implementatie |
| Bèta: geen self-service publiceren | Handmatige go-live na controle |
| Custom domains niet geïmplementeerd | Alleen `{slug}.starlocal.nl` |
| `MEDIA_PUBLIC_BASE_URL` placeholder | Geen CDN-media-URLs op tenant sites |

---

## Checklist samenvatting

- [ ] **Stap 1** — D1 aangemaakt + migraties 0001–0006 remote
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
