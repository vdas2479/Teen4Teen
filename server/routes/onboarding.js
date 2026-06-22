import express from "express";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.get("/:volunteerId", asyncHandler(async (req, res) => {
  const rows = await db.list("onboarding_progress", { volunteer_id: req.params.volunteerId });
  res.json({ progress: rows[0] || null });
}));

router.patch("/:volunteerId/checklist", asyncHandler(async (req, res) => {
  const rows = await db.list("onboarding_progress", { volunteer_id: req.params.volunteerId });
  if (!rows[0]) return res.status(404).json({ error: "No onboarding record found." });
  const updated = await db.update("onboarding_progress", rows[0].id, { checklist_completed: true });
  res.json({ progress: updated });
}));

router.post("/:volunteerId/nudge", asyncHandler(async (req, res) => {
  res.json({ sent: true });
}));

export default router;