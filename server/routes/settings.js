import express from "express";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const settings = await db.getSettings();
  res.json(settings);
}));

router.patch("/", asyncHandler(async (req, res) => {
  const allowed = ["logo_url", "instagram_url", "tiktok_url", "discord_url", "youtube_url", "terms_url", "privacy_url"];
  const patch = {};
  for (const key of allowed) {
    if (key in req.body) patch[key] = req.body[key];
  }
  const updated = await db.updateSettings(patch);
  res.json(updated);
}));

export default router;
