import express from "express";
import * as db from "../db.js";
import { rankVolunteers } from "../match.js";
import { notifyAdmin } from "../notify.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { display_name, email, support_type, preferred_responder_type, notes, availability } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required so we can follow up." });

  const request = await db.insert("meeting_requests", {
    display_name, email, support_type, preferred_responder_type, notes, availability, status: "New"
  });

  await notifyAdmin(
    "New meeting request",
    `A new meeting request was submitted (${preferred_responder_type || "no preference specified"}).`
  );

  res.status(201).json({ request });
}));

router.get("/", asyncHandler(async (req, res) => {
  const filters = req.query.status ? { status: req.query.status } : {};
  const requests = await db.list("meeting_requests", filters);
  res.json({ requests });
}));

router.get("/:id/matches", asyncHandler(async (req, res) => {
  const request = await db.getOne("meeting_requests", req.params.id);
  if (!request) return res.status(404).json({ error: "Request not found." });
  const volunteers = await db.list("volunteers");
  const suggestions = rankVolunteers(request, volunteers);
  res.json({ suggestions });
}));

router.post("/:id/match", asyncHandler(async (req, res) => {
  const { volunteer_id } = req.body;
  const updated = await db.update("meeting_requests", req.params.id, {
    status: "Matched",
    matched_volunteer_id: volunteer_id
  });
  if (!updated) return res.status(404).json({ error: "Request not found." });
  res.json({ request: updated });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const updated = await db.update("meeting_requests", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Request not found." });
  res.json({ request: updated });
}));

export default router;