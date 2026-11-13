import crypto from "crypto";
import * as db from "./db.js";
import { supabase } from "./db.js";
import { asyncHandler } from "./asyncHandler.js";

const primaryAdminSessions = new Map();
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

// Issue a one-time server-recognized session token for the configured primary admin.
export function createAdminSession() {
  const token = crypto.randomBytes(32).toString("hex");
  primaryAdminSessions.set(token, Date.now() + ADMIN_SESSION_TTL_MS);
  return token;
}

// Reject requests unless their bearer token belongs to an active, authorized admin.
export const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!token) return res.status(401).json({ error: "Admin authentication required." });
  const expiresAt = primaryAdminSessions.get(token);
  if (expiresAt && expiresAt > Date.now()) return next();
  if (expiresAt) primaryAdminSessions.delete(token);
  if (!supabase) return res.status(401).json({ error: "Admin session is invalid or expired." });

  const { data, error } = await supabase.auth.getUser(token);
  const email = data?.user?.email?.trim().toLowerCase();
  if (error || !email) return res.status(401).json({ error: "Admin session is invalid or expired." });

  const admins = await db.list("admins");
  if (!admins.some(admin => admin.email?.trim().toLowerCase() === email)) {
    return res.status(403).json({ error: "This account is not authorized as an admin." });
  }

  next();
});
