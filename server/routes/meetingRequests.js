import express from "express";
import crypto from "crypto";
import * as db from "../db.js";
import { rankVolunteers } from "../match.js";
import { notifyAdmin, notifyVolunteer } from "../notify.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { display_name, email, support_type, preferred_responder_type, notes, availability, meeting_format } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required so we can follow up." });

  const request = await db.insert("meeting_requests", {
    display_name, email, support_type, preferred_responder_type, notes, availability,
    meeting_format: meeting_format || "chat",
    status: "New"
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

  const meetingReq = await db.getOne("meeting_requests", req.params.id);
  if (!meetingReq) return res.status(404).json({ error: "Request not found." });

  const updated = await db.update("meeting_requests", req.params.id, {
    status: "Matched",
    matched_volunteer_id: volunteer_id
  });

  // Create a private chat for this seeker–volunteer pair
  const seekerToken = crypto.randomBytes(16).toString("hex");
  await db.insert("chats", {
    meeting_request_id: req.params.id,
    volunteer_id,
    seeker_name: meetingReq.display_name || "Seeker",
    seeker_email: meetingReq.email,
    meeting_format: meetingReq.meeting_format || "chat",
    seeker_token: seekerToken
  });

  // Email the seeker their unique chat link
  const baseUrl = process.env.BASE_URL || "http://localhost:5173";
  const chatLink = `${baseUrl}/chat/${seekerToken}`;
  const formatNote = meetingReq.meeting_format === "call"
    ? "\n\nYour volunteer will send you their available times for a call through the chat — just reply with what works for you."
    : "";

  await notifyVolunteer(
    meetingReq.email,
    "You've been matched with a volunteer!",
    `Hi ${meetingReq.display_name || "there"},\n\nGreat news — we've found a volunteer match for you on Teen4Teen!\n\nOpen your private chat here:\n${chatLink}\n\nThis link is unique to you. Bookmark it so you can return to your conversation at any time.${formatNote}\n\nWe're rooting for you,\nThe Teen4Teen Team`
  );

  res.json({ request: updated });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const updated = await db.update("meeting_requests", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Request not found." });
  res.json({ request: updated });
}));

router.get("/volunteer/:volunteerId", asyncHandler(async (req, res) => {
  const meetings = await db.list("meeting_requests", { matched_volunteer_id: req.params.volunteerId });
  res.json({ meetings });
}));

export default router;