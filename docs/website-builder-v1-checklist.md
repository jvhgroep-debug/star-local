# Website Builder V1 — Productiechecklist

**Branch:** `feature/saas-phase-1-foundation`  
**Datum controle:** 2026-08-03  
**Scope:** Gratis Website Builder (wizard → concept → dashboard → editor → preview)  
**Geen wijzigingen aan productie-infrastructuur tijdens deze controle.**

---

## Samenvatting

| Meting | Resultaat |
|--------|-----------|
| Build (`npm run build`) | ✅ Geslaagd (exit 0) |
| Dev (`npm run dev`) | ✅ Draait lokaal (`http://localhost:4322/`) |
| Automatische tests | ✅ `test:generate` 22/22 · `test:publish` 13/13 (laatste succesvolle run) |
| TypeScript / build-compilatie | ✅ Geen compilefouten |
| **Productie-gereedheid V1** | ❌ **Nog niet** — applicatielaag klaar; infrastructuur en live publicatie ontbreken |

---

## Checklist — functionele onderdelen

| # | Onderdeel | Status | Toelichting |
|---|-----------|--------|-------------|
| 1 | **Wizard** | ✅ Aanwezig | 8 stappen (`/gratis-website/start/`), validatie, voortgangsbalk, beta-banner |
| 2 | **Dashboard** | ✅ Aanwezig | `/dashboard/` met tenant-load, website-lijst, beta-statuskaart |
| 3 | **Editor** | ✅ Aanwezig | `/dashboard/editor/` met live preview, autosave localStorage + D1-update |
| 4 | **Preview** | ✅ Aanwezig | Live preview in wizard en editor; desktop / tablet / mobiel viewport |
| 5 | **Foto upload** | ✅ Aanwezig | Hero + galerij (max. 5); persistent via `media-storage.ts` (data-URL localStorage) |
| 6 | **Logo upload** | ✅ Aanwezig | Verplicht in wizard; persistent na refresh |
| 7 | **Lettertypes** | ✅ Aanwezig | 4 opties; direct zichtbaar in preview (`--tenant-font`) |
| 8 | **Kleuren** | ✅ Aanwezig | Presets + kleurkiezer; hoofd-/accentkleur in preview |
| 9 | **Responsive** | ✅ Aanwezig | Wizard-preview viewports; marketing header/footer responsive |
| 10 | **Header CTA** | ✅ Aanwezig | "Gratis website maken" → `/gratis-website/` (`Header.astro`) |
| 11 | **Footer CTA** | ✅ Aanwezig | Link + promotieblok "Start gratis" (`Footer.astro`) |
| 12 | **Opslaan** | ✅ Aanwezig | `POST /api/website/save/` → D1 + media; editor-update via `tenantId` |
| 13 | **Concept herstellen** | ✅ Aanwezig | localStorage state + media; D1-load via `/api/website/load/` na login |

---

## Checklist — infrastructuur & integraties

| # | Onderdeel | Status | Toelichting |
|---|-----------|--------|-------------|
| 14 | **Magic Link flow voorbereid** | ⚠️ Voorbereid | Code compleet (`auth.service.ts`, `magic.astro`, `tenant_users`); vereist Resend + D1 in productie |
| 15 | **Resend voorbereid** | ⚠️ Voorbereid | Schema in `astro.config.mjs`; `RESEND_API_KEY` + `FROM_EMAIL` optioneel lokaal, **verplicht in productie** |
| 16 | **D1 voorbereid** | ⚠️ Dev only | 6 migraties in `migrations/`; `wrangler.toml` → `star-local-saas-dev` **zonder** productie-`database_id` |
| 17 | **R2 voorbereid** | ⚠️ Dev only | Binding `MEDIA` → `star-local-saas-media-dev`; productie-bucket alleen in `wrangler.example.toml` |
| 18 | **Cloudflare configuratie gecontroleerd** | ⚠️ Gedeeltelijk | `wrangler.example.toml` + `docs/cloudflare-production-checklist.md` aanwezig; productie-bindings **niet** geactiveerd |

---

## Checklist — kwaliteit & build

| # | Onderdeel | Status | Toelichting |
|---|-----------|--------|-------------|
| 19 | **Build succesvol** | ✅ | `npm run build` exit 0 (~214 s); sitemap gegenereerd |
| 20 | **Dev succesvol** | ✅ | `npm run dev` start zonder fouten op poort 4322 |
| 21 | **Geen TypeScript errors** | ✅ | Astro/Vite build compileert alle TS-bronnen zonder fout |
| 22 | **Geen console errors (builder)** | ✅ | Wizard, preview en dashboard laden zonder JS-fouten in smoke tests |
| 23 | **Geen blokkerende build warnings** | ⚠️ | Build slaagt; waarschuwingen aanwezig (zie hieronder) |

---

## Build-warnings (niet-blokkerend)

Deze waarschuwingen blokkeren de build **niet**, maar verdienen aandacht vóór een toekomstige Astro-upgrade:

1. **Route collisions** (8×): dubbele routes met/zonder trailing slash voor `/website-laten-maken/*`-redirects. Astro meldt dat dit in toekomstige versies een hard error wordt.
2. **`Astro.request.headers` op prerender-pagina's**: marketing/pSEO-pagina's; geen impact op Website Builder-routes.
3. **Cloudflare SESSION KV-hint**: optioneel; sessies draaien via D1 (`auth_sessions`), niet via KV.
4. **Sharp at runtime**: compile-time image-optimalisatie OK; geen impact op builder-flow.

---

## Kritieke aandachtspunten (blokkeren productie)

| # | Punt | Impact |
|---|------|--------|
| K1 | **Geen productie-D1** (`database_id` ontbreekt in `wrangler.toml`) | Opslaan/login werkt niet op productie |
| K2 | **Geen productie-R2** (alleen dev-bucket geconfigureerd) | Media-upload en publicatie naar live storage onmogelijk |
| K3 | **Live tenant-hosting niet operationeel** | `{slug}.starlocal.nl` nog niet end-to-end; bèta = handmatige publicatie |
| K4 | **Resend-secrets vereist in productie** | Magic links, contactformulier tenant-sites en save-e-mail falen zonder `RESEND_API_KEY` |

---

## Niet-kritieke aandachtspunten

| # | Punt | Impact |
|---|------|--------|
| N1 | Self-service publiceren uitgeschakeld tijdens bèta | Bewust; handmatige go-live na controle |
| N2 | localStorage-quota bij grote afbeeldingen | Zeldzaam; fallback: opnieuw uploaden |
| N3 | `/gratis-website/` alleen NL-pad | EN-marketing linkt naar hetzelfde pad |
| N4 | Route-collision warnings (trailing slash) | Toekomstige Astro-breaking change |
| N5 | `Astro.request.headers`-warnings op pSEO-pagina's | Geen builder-impact |
| N6 | Geen `astro check`-script in `package.json` | Build vangt TS-fouten af |
| N7 | Contactformulier tenant vereist Resend (503 zonder key) | Graceful fallback met melding |
| N8 | Publish-pipeline D1→R2→DNS nog niet self-service | Documentatie in `cloudflare-production-checklist.md` |

---

## Belangrijkste bestanden (referentie)

| Gebied | Pad |
|--------|-----|
| Wizard | `src/lib/builder/app.ts`, `src/pages/gratis-website/start.astro` |
| Dashboard | `src/lib/dashboard/`, `src/pages/dashboard.astro` |
| Editor | `src/lib/editor/app.ts`, `src/pages/dashboard/editor.astro` |
| Opslaan / laden | `src/pages/api/website/save.ts`, `load.ts` |
| Media persistentie | `src/lib/builder/media-storage.ts` |
| Auth / Magic Link | `src/lib/auth/`, `src/pages/auth/magic.astro` |
| Contactformulier | `src/pages/api/website/contact.ts` |
| Cloudflare config | `wrangler.toml`, `wrangler.example.toml` |
| Migraties | `migrations/0001` – `0006` |
| Productie-gids | `docs/cloudflare-production-checklist.md` |

---

## Productieadvies

### Nu mogelijk: beperkte publieke bèta

De **applicatielaag** van Website Builder V1 is functioneel compleet voor een beperkte bèta:

- Gebruikers kunnen een website samenstellen (wizard)
- Concept opslaan en later hervatten (localStorage + D1 na login)
- Dashboard en editor gebruiken
- Contactformulier en preview werken lokaal/staging

**Voorwaarden bèta:**

- Resend API-key configureren op staging/productie
- D1 dev-database of aparte staging-D1 met migraties
- Duidelijke bèta-messaging (geen automatische live publicatie)
- Handmatige go-live door Star Local-team

### Nog niet mogelijk: volledige productie

Voor **self-service productie** (gebruiker klikt "Publiceren" → live op `{slug}.starlocal.nl`) ontbreken:

1. Productie-D1 + R2 bindings en migraties op remote
2. DNS wildcard `*.starlocal.nl` + tenant-routing
3. Resend productie-domeinverificatie
4. End-to-end publish-pipeline (D1 → R2 → CDN)
5. Productie-smoke tests na deploy

**Advies:** Start met een **staging-deploy** op Cloudflare Pages met dev/staging D1+R2. Voer daarna de stappen uit in `docs/cloudflare-production-checklist.md` vóór openbare productie-lancering.

---

## Handtekening controle

| Item | Waarde |
|------|--------|
| Build geslaagd | **JA** |
| Productiecheck voltooid | **JA** |
| Kritieke fouten | **4** |
| Niet-kritieke aandachtspunten | **8** |
| Website Builder V1 gereed voor productie | **NEE** |
