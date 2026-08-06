# OPDRACHT 63 — Herstelrapport (vóór livegang)

**Datum:** 2026-08-05  
**Branch:** `feature/saas-phase-1-foundation`  
**Remote:** `origin` → `https://github.com/jvhgroep-debug/star-local.git`

---

## Commit-hashes (herstelpunten)

| Ref | Hash | Beschrijving |
|-----|------|--------------|
| **main** | `6010723e5802bc482ab139a5160cf99bf0c9c93b` | `chore: add SEO audit and production page count scripts` |
| **feature** (HEAD) | `23cd76346797b3ac8ab5b7a29814a1842824981d` | `feat(builder): complete website builder v1 beta foundation` |

---

## Verwachte aantallen (baseline vóór rebuild)

| Metric | Waarde |
|--------|--------|
| Pagina's (dist/index.html) | **6383** |
| Gemeentepagina's | **350** |
| Sitemap URL's (sitemap-0.xml) | **6386** |
| Route-collisions | **0** |

Auditbestand: `docs/audits/pre-live-audit-before.json`

---

## Rollback-instructie

### Code terugdraaien naar main (live marketing site)
```bash
git checkout main
git pull origin main
# Deploy vorige main-build via Cloudflare Pages rollback in Dashboard
```

### Feature branch terugzetten naar checkpoint
```bash
git checkout feature/saas-phase-1-foundation
git reset --hard 23cd76346797b3ac8ab5b7a29814a1842824981d
```

### Cloudflare Pages rollback (productie)
1. Dashboard → Workers & Pages → **star-local** → Deployments
2. Selecteer deployment vóór builder-beta
3. **Rollback to this deployment**

### D1 rollback (indien migraties zijn uitgevoerd)
```bash
wrangler d1 export star-local-saas-prod --remote --output backup-pre-beta.sql
# Herstel alleen na expliciete goedkeuring
```

---

## Gewijzigde bestanden (uncommitted)

- **31 modified** tracked files (builder, admin, config, styles)
- **~40+ new** untracked paths (admin, publication, migrations 0007–0008, scripts)
- **Uitgesloten van commit:** `publications/`, `.acceptance-test-assets/`, `node_modules/`, `dist/`, `.env`

Volledige lijst: `git status --short` op moment van audit.

---

## Cloudflare-configuratie (snapshot)

| Bestand | Doel |
|---------|------|
| `wrangler.toml` | Dev: `star-local-saas-dev`, `star-local-saas-media-dev` |
| `wrangler.prod.toml` | Prod: placeholders — **niet deploy-klaar** |
| `wrangler.example.toml` | Legacy sjabloon |

---

## Geen bestanden verwijderd

Werkmap is niet “opgeschoond”. Alle bestaande pagina's, routes en SEO-assets blijven intact.
