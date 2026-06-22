import express from "express";
import * as db from "../db.js";
import { supabase } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: "Invalid email or password." });
    return res.json({ token: data.session.access_token, email: data.user.email });
  }

  const devEmail = process.env.DEV_ADMIN_EMAIL || "admin@teen4teen.org";
  const devPassword = process.env.DEV_ADMIN_PASSWORD || "changeme123";
  if (email === devEmail && password === devPassword) {
    return res.json({ token: "dev-mode-token", email });
  }
  return res.status(401).json({ error: "Invalid email or password." });
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