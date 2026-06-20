# Teen4Teen — Prototype

Mental health support, without the barriers.

This is the working prototype described in `Teen4Teen_Product_Specification_v1.0.docx`.
It runs locally right now with **zero setup** — no Supabase account, no API keys,
no payment required — and is structured so each of those can be plugged in later
without rebuilding anything.

---

## What's inside

```
teen4teen/
├── client/          React frontend (all 5 public tabs + admin dashboard)
├── server/          Node.js + Express backend (REST API)
└── supabase/        SQL schema for when you're ready to move off local storage
```

---

## Running it locally (today, no setup)

You'll need [Node.js](https://nodejs.org) installed (v18 or later).

**1. Start the backend:**
```
cd server
cp .env.example .env
npm install
npm run dev
```
This starts the API on `http://localhost:4000`, using a local `data.json` file
as the database — no account needed. Sample community posts, a video, and a
workshop are seeded automatically the first time it runs.

**2. Start the frontend** (in a new terminal):
```
cd client
npm install
npm run dev
```
This starts the site on `http://localhost:5173`.

**3. Open `http://localhost:5173` in your browser.**

**Admin dashboard:** go to `http://localhost:5173/admin` (this URL is never
linked anywhere in the public navigation, per the spec). Default login:
- Email: `admin@teen4teen.org`
- Password: `changeme123`

(Change these in `server/.env` any time.)

---

## Turning on the real integrations

Everything below is optional. The site works fully without any of it — these
are upgrades, not requirements.

### Supabase (real, permanent database)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard, paste in the contents
   of `supabase/schema.sql`, and run it.
3. In Supabase, go to **Settings → API** and copy your **Project URL** and
   **service_role key**.
4. Paste them into `server/.env` as `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
5. Restart the server. It will automatically switch from the local JSON file
   to Supabase — nothing else changes, no code edits needed.

### Gemini API (real AI mock session, instead of the scripted demo)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create
   a free API key (no credit card required).
2. Paste it into `server/.env` as `GEMINI_API_KEY`.
3. Restart the server. The onboarding mock session will now use a real AI
   conversation instead of the built-in scripted fallback.

### Resend (real email notifications)
1. Create a free account at [resend.com](https://resend.com) and get an API key.
2. Paste it into `server/.env` as `RESEND_API_KEY`, and set
   `ADMIN_NOTIFICATION_EMAIL` to your real inbox.
3. Restart the server. Admin notifications (new applications, new meeting
   requests) will now arrive by email instead of just logging to the console.

### Going live (Hostinger + a real domain)
The codebase doesn't change for this — only where it's hosted.
1. Buy `teen4teen.org` (or similar) from a registrar like Namecheap.
2. Set up Node.js hosting on Hostinger.
3. Push this same codebase, set the same `.env` values in Hostinger's
   dashboard, and point your domain at it.
4. See Section 10 of the product spec for the full deployment checklist.

---

## What's built vs. what's a placeholder

**Fully working:**
- All 5 public tabs (Home, Community, Podcast, Volunteer Resources, Help)
- Two-tier community posting (Seekers + Verified/Young Responders), with
  flagging
- Volunteer interest form → admin Application Inbox → status workflow
- Orientation checklist → AI mock session (scripted demo until you add a
  Gemini key) → transcript saved for admin review
- Meeting request form → automated match suggestions → admin approval
- Full admin dashboard: Overview, Application Inbox, Onboarding Tracker,
  Meeting Requests + Matching, Community Moderator, Video Manager, Workshop
  Manager
- Admin login (works locally today; swaps to real Supabase Auth automatically
  once Supabase is connected)

**Intentionally a placeholder, ready for you to fill in:**
- Homepage hero image (currently using the confirmed stock photo from the
  spec — swap the URL in `client/src/pages/Home.jsx` any time)
- Social media links in the footer (`client/src/components/Footer.jsx`)
- Contact email on the Help page (`client/src/pages/Help.jsx`)
- i18next multilingual setup (not wired in yet — see Section 9 of the spec
  for the rollout plan when you're ready)

---

## A note on safety defaults already built in

- Volunteers under 13 are rejected by the API, not just the form.
- Seekers can post and reply with full advice (not just reactions), each
  reply clearly labeled with the poster's tier, per your confirmed decision.
- No content is ever auto-removed — flags only ever surface content to an
  admin for a human decision.
- The admin URL (`/admin`) is not linked anywhere in the public site.
