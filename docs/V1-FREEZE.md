# STAR LOCAL GRATIS WEBSITE BUILDER V1

**Status: FUNCTIONEEL KLAAR**

Datum freeze: 2026-08-06  
Branch: `feature/saas-phase-1-foundation`

Vanaf dit moment worden **geen nieuwe features** toegevoegd vóór de eerste praktijktest met een echte testklant.

## Kritieke flow (lokaal geverifieerd)

1. Wizard (stap 1–8) via `/gratis-website/start/`
2. Concept opslaan **met publication snapshot**
3. Admin: concept → goedkeuren → lokale publicatie (`/sites/{slug}/`)
4. Klantdashboard via magic link
5. Wijzigingsverzoek indienen (handmatige admin-afhandeling)

## Essentiële fix (opdracht 86)

- `src/lib/builder/publish/save-client.ts` — `configSnapshotJson` wordt meegestuurd bij concept-opslaan via de builder op `/gratis-website/start/`.

## Bekende niet-blokkerende punten

- Magic-link rate limiting bij snelle herhaalde tests
- Console/router-warnings op bestaande Star Local-pagina's
- `/sitemap.xml` 404 in dev (wel aanwezig in build)
- Wijzigingsverzoeken-lijst in dashboard UI: API werkt; UI soms traag in geautomatiseerde tests

## Regressie (build)

- Routes: 6385 → 6385
- Sitemap-URL's: 6389 → 6389
