# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working with the founder

Mahesh is the founder and super admin, and is non-technical. Explain changes in plain terms and give click-by-click guidance for any terminal, GitHub, or cloud-dashboard steps.

When he asks for something to be built or fixed, build it — ordinary local edits don't need permission first. Do confirm before pushing to GitHub, deploying to Render, deleting data, or anything that weakens access control. Note that the admin dashboard exposes private chat logs and mental-health context belonging to users as young as 13, so if a request would weaken access control, implement the safe fix and name the tradeoff plainly rather than quietly complying or quietly refusing.

## What this is

Teen4Teen is a free mental wellness platform connecting underserved women and teen girls with volunteer supporters. It is explicitly not a clinical service. This repo is the working prototype described in `Teen4Teen_Product_Specification_v1.0.docx`. It runs with zero setup (no Supabase account, no API keys) and is structured so each external integration can be plugged in later without code changes.

## Commands

There is no test suite, lint config, or CI in this repo.

**Backend** (`server/`, Node.js + Express, ESM):
```
cd server
npm install
npm run dev     # node --watch index.js, http://localhost:4000
npm start       # node index.js (no watch)
```

**Frontend** (`client/`, React + Vite):
```
cd client
npm install
npm run dev       # http://localhost:5173, proxies /api -> localhost:4000 (see vite.config.js)
npm run build     # outputs client/dist
npm run preview
```

Run both servers concurrently for local development. In production, `server/index.js` serves `client/dist` directly if it exists (single-process deploy); otherwise it runs API-only.

Admin dashboard: `http://localhost:5173/admin` — intentionally not linked from public nav. Default login comes from `server/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`, falling back to defaults in `server/routes/admin.js`).

## Architecture

### Dual-mode data layer (the core architectural idea)

`server/db.js` exposes one async API — `list`, `insert`, `update`, `remove`, `getOne`, `getSettings`, `updateSettings` — that transparently targets either:
- **Local JSON mode** (default): reads/writes `server/data.json`, auto-seeded on first run. Zero setup.
- **Supabase mode**: activated automatically when `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` are set in `server/.env`. Same function signatures, so nothing in `server/routes/` ever needs to change when switching modes.

`export const mode` reports which mode is active (`"local-json"` or `"supabase"`); surfaced via `GET /api/health`. When adding a new entity, add it to `seedData()` in `db.js` and to `supabase/schema.sql` so both modes stay in sync.

The same optional-integration pattern applies elsewhere:
- `server/notify.js` — sends email via Resend if `RESEND_API_KEY` is set, otherwise logs to console and returns `{ sent: false }`.
- `server/routes/mockSession.js` — uses the real Gemini API if `GEMINI_API_KEY` is set, otherwise falls back to a scripted canned conversation (`SCRIPTED_FALLBACK`).

Always preserve this "fully functional with zero external services, automatically upgrades when credentials appear" behavior — it's a deliberate product requirement (zero financial cost during the prototype phase), not a shortcut to clean up.

### Backend structure

- `server/index.js` — Express app setup, mounts one router per domain under `/api/*`, serves `client/dist` if present, global error handler + process-level safety nets (`unhandledRejection` / `uncaughtException` just log, never crash).
- `server/routes/*.js` — one file per resource (`volunteers`, `volunteerAuth`, `onboarding`, `mockSession`, `community`, `videos`, `workshops`, `meetingRequests`, `chats`, `adminChats`, `admin`, `settings`). Every async route is wrapped in `asyncHandler` (`server/asyncHandler.js`) so a thrown/rejected promise reaches the error middleware instead of crashing the process.
- `server/match.js` — volunteer-matching scoring algorithm (support-type match > language > timezone proximity > availability). Always produces ranked *suggestions* (top 3) — a match is never finalized without admin approval via `confirmMatch` in `meetingRequests`.
- Auth is minimal/custom, not a library: `server/routes/admin.js` checks a single primary admin account from env vars *before* falling back to Supabase Auth (deliberately ordered this way so adding Supabase env vars can never lock out the primary admin — see comment in that file). `server/routes/volunteerAuth.js` issues random hex session tokens stored directly on the volunteer record (`session_token`) and hashes passwords with `crypto.pbkdf2Sync`. Seeker chat uses per-conversation tokens embedded in the URL, no login at all.

### Frontend structure

- `client/src/App.jsx` — all routing (`react-router-dom`). Admin routes (`/admin`, `/admin/dashboard`) are gated on `adminToken` in component state, hydrated from `sessionStorage` (`t4t_admin_token`, `t4t_vol_token`, `t4t_vol_info`). `NavBar`/`Footer` are hidden on any `/admin*` route.
- `client/src/api.js` — single module wrapping every backend call (`fetch` through a shared `request()` helper that throws on non-OK responses). This is the only place that should know about REST endpoint shapes; pages/components call `api.xxx()`, not `fetch` directly.
- `client/src/pages/` — one file per public page/tab (Home, Community, Podcast, VolunteerResources, Help, Onboarding, etc.) plus `pages/admin/` for each dashboard module (Overview, ApplicationInbox, OnboardingTracker, MeetingRequestInbox, CommunityModerator, VideoManager, WorkshopManager, SiteSettings, VolunteerInbox).
- `client/src/legalConfig.js` — the single file to edit for filling in Terms/Privacy placeholders (effective date, venue county, parental consent process, contact email). Blank values render as highlighted placeholders on the live Terms/Privacy pages — don't hardcode legal text elsewhere.
- `client/src/context/SiteSettingsContext.jsx` — site-wide settings (social links, logo, terms/privacy URLs) fetched via `api.getSettings()`/`api.updateSettings()`, backed by the `site_settings` single-document table in `db.js`.

### Community moderation model

Content is never auto-removed. Flags (`flagPost`) only increment `flag_count` and surface the post to an admin via `CommunityModerator`; hiding/deleting requires an explicit admin action (`moderatePost` / `deletePost`). Posts/replies carry a `tier_label` (`"Seeker"`, `"Verified Responder"`, `"Young Responder"`) that is always shown — Seekers can give full replies, not just reactions, per product decision.

## Code style

Write a one-sentence comment describing what each function does whenever you add one.

## Legal / compliance notes

The Terms of Service was drafted by a real lawyer under Kentucky law. Her inline *Drafting Notes* and *Legal Disclaimer to Platform Owner* are private notes to the client and must never be published to the site. There is no lawyer-drafted Privacy Policy — the live one was assembled from the ToS's data-handling clauses plus a description of what the code actually collects, and still needs her review.

- `client/src/legalConfig.js` is the single edit point for legal placeholders; don't duplicate those values elsewhere. Leave a value blank rather than inventing one — blanks render as visible yellow placeholders, which is safer than publishing a process the platform doesn't actually operate.
- Volunteers under 13 are rejected at the API layer, not just in the form UI — preserve that invariant in any changes to `server/routes/volunteers.js`.
- **Open gap:** `parentalConsentProcess` is intentionally still blank. Wording alone does not satisfy COPPA; a real mechanism is needed, and which mechanism is sufficient depends on the specific statute being targeted (a question outstanding with the lawyer). Don't fill this in speculatively.
- Age is self-declared by design. Don't add ID checks, payment-card checks or third-party age verification — they cost money and block exactly the underserved teen the platform exists to reach. The mitigation is recording consent well, not verifying harder.

### Consent audit trail

`server/consent.js` records what each person was shown and ticked at submission time, into the `consent_records` table. It stores the wording **verbatim** (captured from the DOM via a ref on the consent block in each form) rather than a list of checkbox ids, so the exact text someone saw stays recoverable after the forms are reworded. Wired into the three consented submissions: volunteer application, meeting request, and Seeker community posts (approved volunteers are never shown the tickbox, so nothing is recorded for them).

Two deliberate properties worth preserving:
- `consent_records` has no foreign key and no cascade — a consent record must outlive the account it came from, or deleting a volunteer would destroy the evidence they ever consented.
- This **records** consent; it does not yet **enforce** it server-side. A crafted request that omits the tickboxes is still accepted. Turning enforcement on requires the client and server to deploy together, or a newer server would reject every submission from an older built frontend.

`app.set("trust proxy", 1)` in `server/index.js` exists for this feature — without it `req.ip` is Render's proxy address and every IP in the audit trail would be identical.
