import express from "express";
import * as db from "../db.js";
import { supabase } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────
// Admin login.
//
// There are TWO ways to be an admin, and they are checked in this order:
//
//   1. The PRIMARY ADMIN ACCOUNT, configured via env vars (or the defaults
//      below). This is checked FIRST, on purpose, and works whether or not
//      Supabase is configured. Previously this was only reachable when
//      Supabase was NOT configured, which meant that as soon as Supabase
//      env vars were added (e.g. on Render) the primary admin was locked
//      out entirely. Do not move this below the Supabase block.
//
//   2. ADDITIONAL ADMINS stored in Supabase Auth, used only when Supabase
//      is configured and the credentials did not match the primary admin.
//
// Both paths return 401 with the same message on failure, so this does not
// leak which emails exist.
// ─────────────────────────────────────────────────────────────────────────
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const invalid = { error: "Invalid email or password." };

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(401).json(invalid);
  }

  // ── 1. Primary admin account ───────────────────────────────────────────
  // Override on the host (Render → Environment) with ADMIN_EMAIL /
  // ADMIN_PASSWORD. DEV_ADMIN_* are the older names, still honoured.
  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.DEV_ADMIN_EMAIL || "midge2100@gmail.com";
  const adminPassword =
    process.env.ADMIN_PASSWORD || process.env.DEV_ADMIN_PASSWORD || "teen4teen";

  const emailMatches = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  if (emailMatches && password === adminPassword) {
    return res.json({ token: "admin-session-token", email: adminEmail.trim().toLowerCase() });
  }

  // ── 2. Supabase Auth admins ────────────────────────────────────────────
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) return res.status(401).json(invalid);
    return res.json({ token: data.session.access_token, email: data.user.email });
  }

  return res.status(401).json(invalid);
}));

router.get("/overview", asyncHandler(async (req, res) => {
  const [volunteers, requests, posts] = await Promise.all([
    db.list("volunteers"),
    db.list("meeting_requests"),
    db.list("community_posts")
  ]);

  res.json({
    pending_applications: volunteers.filter(v => v.status === "Pending").length,
    new_meeting_requests: requests.filter(r => r.status === "New").length,
    flagged_posts: posts.filter(p => (p.flag_count || 0) > 0).length,
    total_volunteers: volunteers.length
  });
}));

export default router;