import express from "express";
import * as db from "../db.js";
import { notifyAdmin } from "../notify.js";

const router = express.Router();

// Volunteer submits the interest form (public)
router.post("/", async (req, res) => {
  const { name, email, country, age_range, is_therapist, is_peer_supporter,
          languages, availability_hours, timezone, motivation } = req.body;

  if (!name || !email || !age_range) {
    return res.status(400).json({ error: "Name, email, and age range are required." });
  }

  // Safety rule from the spec: no volunteers under 13, no exceptions.
  if (age_range === "under_13") {
    return res.status(400).json({ error: "Volunteers must be at least 13 years old." });
  }

  const volunteer_tier = (age_range === "13_17") ? "Young" : "Verified";

  const volunteer = await db.insert("volunteers", {
    name, email, country, age_range, is_therapist: !!is_therapist,
    is_peer_supporter: !!is_peer_supporter, languages, availability_hours,
    timezone, motivation, volunteer_tier, status: "Pending"
  });

  await db.insert("onboarding_progress", {
    volunteer_id: volunteer.id,
    checklist_completed: false,
    mock_session_completed: false,
    mock_session_transcript: null,
    interview_required: false,
    interview_completed: false,
    approved_at: null
  });

  await notifyAdmin(
    "New volunteer application",
    `${name} (${email}) just applied as a ${volunteer_tier === "Young" ? "Young Responder" : "Verified Responder"}.`
  );

  res.status(201).json({ volunteer });
});

// Admin: list all applications, optionally filtered by status
router.get("/", async (req, res) => {
  const filters = req.query.status ? { status: req.query.status } : {};
  const volunteers = await db.list("volunteers", filters);
  res.json({ volunteers });
});

// Admin: update application status (Pending | In Review | Awaiting Mock Session |
// Flagged for Interview | Approved | Declined)
router.patch("/:id", async (req, res) => {
  const updated = await db.update("volunteers", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Volunteer not found." });
  res.json({ volunteer: updated });
});

export default router;
