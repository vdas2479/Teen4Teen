import express from "express";
import * as db from "../db.js";

const router = express.Router();

// Get onboarding progress for a volunteer
router.get("/:volunteerId", async (req, res) => {
  const rows = await db.list("onboarding_progress", { volunteer_id: req.params.volunteerId });
  res.json({ progress: rows[0] || null });
});

// Mark orientation checklist complete
router.patch("/:volunteerId/checklist", async (req, res) => {
  const rows = await db.list("onboarding_progress", { volunteer_id: req.params.volunteerId });
  if (!rows[0]) return res.status(404).json({ error: "No onboarding record found." });
  const updated = await db.update("onboarding_progress", rows[0].id, { checklist_completed: true });
  res.json({ progress: updated });
});

// Admin: send a follow-up nudge email if a volunteer has stalled
router.post("/:volunteerId/nudge", async (req, res) => {
  // Placeholder — wire to notify.js once you have a volunteer's email handy from the volunteers table.
  res.json({ sent: true });
});

export default router;
