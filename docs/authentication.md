# Star Local SaaS — Authenticatie (fundering)

Technisch ontwerp voor magic-link login op `app.starlocal.nl`.  
**Status:** fundering only — geen loginpagina, geen API, geen sessies live.

## Bestaande situatie

| Onderdeel | Status |
|---|---|
| Authenticatie | Niet aanwezig |
| Sessiebeheer | Niet aanwezig |
| Auth-library | Niet aanwezig |
| Resend | Aanwezig (`resend` package + `/api/contact/`) |
| D1 | Development-voorbereid in `wrangler.toml` + `migrations/` |

## Loginflow (gepland)

1. Gebruiker opent `app.starlocal.nl/login` *(later)*.
2. Gebruiker vult zakelijk e-mailadres in.
3. Server normaliseert e-mail, upsert `users`-record.
4. Server maakt `magic_links`-record met **gehashte** token + vervaltijd.
5. Resend stuurt mail met eenmalige link.
6. Gebruiker klikt link → `app.starlocal.nl/auth/verify?token=…` *(later)*.
7. Server valideert token, markeert link als gebruikt, maakt sessie.
8. Gebruiker wordt doorgestuurd naar dashboard *(later)*.

## Magic Link flow

```
[Login form] → createMagicLink()
                    ↓
              users (upsert by email)
                    ↓
              magic_links (token_hash, expires_at)
                    ↓
              ResendEmailService.send()  ← wrapper, nog niet actief
                    ↓
              E-mail met plain token (niet in DB)

[Verify URL] → validateMagicLink()
                    ↓
              lookup token_hash, check expiry/used_at
                    ↓
              createSession()
```

### Tokenregels

- Plain token: cryptografisch random (min. 32 bytes), alleen in e-mail/URL.
- Opslag in D1: **SHA-256 hash** in `magic_links.token_hash`.
- Geldigheid: standaard **15 minuten** (configureerbaar in latere fase).
- Eenmalig: `used_at` wordt gezet na succesvolle validatie.
- Rate limiting op aanvraag per e-mail/IP *(later)*.

## Sessies (gepland)

- Uitgifte alleen na geldige magic link.
- Sessietoken in **httpOnly, Secure, SameSite=Lax** cookie op `app.starlocal.nl`.
- Server-side sessierecord *(D1 of KV in latere migratie)*.
- TTL: bijv. 30 dagen sliding expiration.
- Logout via `destroySession()` — cookie wissen + server invalidatie.

**Deze fase:** alleen placeholders in `src/lib/auth/session.ts`.

## Beveiliging

- Geen plaintext tokens in D1.
- Geen auth-secrets in client-side code.
- Resend API-key via bestaande Cloudflare secrets (`RESEND_API_KEY`).
- Magic links alleen via HTTPS.
- Tenant-isolatie: sessie gekoppeld aan `users.id`; tenantkeuze via `tenant_users`.
- CSRF: SameSite cookies + POST-only verify endpoint *(later)*.
- Brute force: rate limits op login/verify *(later)*.

## Tenant-isolatie

- `users` = globale identiteit (e-mail).
- `tenants` = organisatie/website-eigenaar.
- `tenant_users` = koppeling user ↔ tenant met rol (`owner`, `admin`, …).
- Elke dashboard- en data-query filtert op `tenant_id` uit sessiecontext.
- Geen cross-tenant data zonder expliciete membership in `tenant_users`.

## Development D1

Database (alleen development):

```bash
# Lokaal schema toepassen
npx wrangler d1 migrations apply star-local-saas-dev --local
```

Binding in `wrangler.toml`:

- `binding = "DB"`
- `database_name = "star-local-saas-dev"`
- **Geen `database_id`** in deze fase → geen productie-D1 gekoppeld.

## Module-structuur

```
src/lib/auth/
  index.ts        # public exports
  types.ts        # auth interfaces
  magic-link.ts   # createMagicLink, validateMagicLink (placeholders)
  session.ts      # createSession, destroySession (placeholders)

src/lib/email/
  resend.ts       # ResendEmailService wrapper (placeholder send)

src/types/
  auth.ts         # User, MagicLink, TenantRow, …

migrations/
  0001_auth_foundation.sql
```

## Wat nog niet bestaat

- Loginpagina, verify-route, API endpoints
- Cookies, middleware, tenant-routing
- Werkelijke Resend-verzending van magic links
- Productie-D1 of sessietabellen
