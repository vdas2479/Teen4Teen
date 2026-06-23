import express from "express";
import crypto from "crypto";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

function hashPw(password) {
  const salt = process.env.PASSWORD_SALT || "t4t-dev-salt";
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

function publicVolunteer(v, token) {
  return { token, volunteer_id: v.id, name: v.name, tier: v.volunteer_tier, status: v.status };
}

// First-time account creation — only available once the admin has approved
// the volunteer for onboarding (status is not Pending or Declined).
router.post("/register", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Email and a password of at least 8 characters are required." });
  }

  const volunteers = await db.list("volunteers");
  const v = volunteers.find(vol => vol.email === email);

  if (!v) {
    return res.status(404).json({ error: "No volunteer application found with that email." });
  }
  if (v.status === "Pending" || v.status === "Declined") {
    return res.status(403).json({
      error: v.status === "Pending"
        ? "Your application is still under review. You can create an account once an admin approves you for onboarding."
        : "Your application was not approved. Please reach out via the Help page if you think this is a mistake."
    });
  }
  if (v.password_hash) {
    return res.status(409).json({ error: "An account already exists with this email. Please use the sign-in form." });
  }

  const token = makeToken();
  await db.update("volunteers", v.id, { password_hash: hashPw(password), session_token: token });
  res.json(publicVolunteer(v, token));
}));

// Login with email + password.
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const volunteers = await db.list("volunteers");
  const v = volunteers.find(vol => vol.email === email);

  if (!v || !v.password_hash || v.password_hash !== hashPw(password)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = makeToken();
  await db.update("volunteers", v.id, { session_token: token });
  res.json(publicVolunteer(v, token));
}));

// Restore session on page load — client sends stored token, gets back volunteer info.
router.get("/me", asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return res.status(401).json({ error: "Not authenticated." });

  const volunteers = await db.list("volunteers");
  const v = volunteers.find(vol => vol.session_token === token);
  if (!v) return res.status(401).json({ error: "Session expired. Please sign in again." });

  res.json({ volunteer_id: v.id, name: v.name, tier: v.volunteer_tier, status: v.status, email: v.email });
}));

export default router;
