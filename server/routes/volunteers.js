import express from "express";
import * as db from "../db.js";
import { notifyAdmin, notifyVolunteer } from "../notify.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { name, email, country, age_range, is_therapist, is_peer_supporter,
          languages, availability_hours, timezone, motivation } = req.body;

  if (!name || !email || !age_range) {
    return res.status(400).json({ error: "Name, email, and age range are required." });
  }
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

  // Tell the volunteer themselves where to go next by email too, once
  // Resend is connected. Until then, the frontend already shows this
  // same link directly on screen, so nothing is blocked on email.
  const siteUrl = process.env.SITE_URL || "";
  const onboardingLink = siteUrl
    ? `${siteUrl}/onboarding?email=${encodeURIComponent(email)}`
    : "the Onboarding page on the site";
  await notifyVolunteer(
    email,
    "Your Teen4Teen application",
    `Thanks for applying to volunteer with Teen4Teen, ${name}! An admin will review your application shortly. Once approved, you can head to ${onboardingLink} to complete your short orientation checklist and practice session.`
  );

  res.status(201).json({ volunteer });
}));

router.get("/", asyncHandler(async (req, res) => {
  const filters = req.query.status ? { status: req.query.status } : {};
  const volunteers = await db.list("volunteers", filters);
  res.json({ volunteers });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const updated = await db.update("volunteers", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Volunteer not found." });
  res.json({ volunteer: updated });
}));

router.post("/:id/approve", asyncHandler(async (req, res) => {
  const volunteer = await db.getOne("volunteers", req.params.id);
  if (!volunteer) return res.status(404).json({ error: "Volunteer not found." });

  const updated = await db.update("volunteers", req.params.id, { status: "Approved" });

  const tierLabel = volunteer.volunteer_tier === "Young" ? "Young Responder" : "Verified Responder";
  const siteUrl = process.env.SITE_URL || "";
  const dashboardLink = siteUrl
    ? `${siteUrl}/volunteer-dashboard?email=${encodeURIComponent(volunteer.email)}`
    : "the Volunteer Dashboard on the Teen4Teen site";

  await notifyVolunteer(
    volunteer.email,
    "You've been approved — welcome to Teen4Teen!",
    `Hi ${volunteer.name},\n\nCongratulations! We're delighted to welcome you as a ${tierLabel} on Teen4Teen.\n\nYour application has been reviewed and you are now fully approved. You can log in to your volunteer dashboard at any time to see seekers you've been matched with and track your sessions:\n\n${dashboardLink}\n\nThank you for your commitment to supporting others. We're glad you're here.\n\n— The Teen4Teen team`
  );

  res.json({ volunteer: updated });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const volunteer = await db.getOne("volunteers", req.params.id);
  if (!volunteer) return res.status(404).json({ error: "Volunteer not found." });
  await db.remove("volunteers", req.params.id);
  const progress = await db.list("onboarding_progress", { volunteer_id: req.params.id });
  if (progress[0]) await db.remove("onboarding_progress", progress[0].id);
  res.json({ deleted: true });
}));

router.post("/:id/schedule-interview", asyncHandler(async (req, res) => {
  const { date, time, format, link_or_location, notes } = req.body;
  if (!date || !time) return res.status(400).json({ error: "Date and time are required." });

  const volunteer = await db.getOne("volunteers", req.params.id);
  if (!volunteer) return res.status(404).json({ error: "Volunteer not found." });

  const updated = await db.update("volunteers", req.params.id, {
    interview_date: date,
    interview_time: time,
    interview_format: format || "virtual",
    interview_link_or_location: link_or_location || "",
    interview_notes: notes || ""
  });

  const formatLabel = format === "in-person" ? "in person" : "virtually";
  const locationLine = link_or_location
    ? `\nLocation / link: ${link_or_location}`
    : "";
  const notesLine = notes
    ? `\n\nNote from the admin:\n${notes}`
    : "";

  await notifyVolunteer(
    volunteer.email,
    "Your Teen4Teen interview is scheduled",
    `Hi ${volunteer.name},\n\nWe'd love to have a short conversation with you as part of your Teen4Teen application. Here are your interview details:\n\nDate: ${date}\nTime: ${time}\nFormat: ${format === "in-person" ? "In person" : "Virtual"}${locationLine}${notesLine}\n\nIf you need to reschedule or have any questions, please reach out via the Help page on the site.\n\nLooking forward to speaking with you!\n\n— The Teen4Teen team`
  );

  res.json({ volunteer: updated });
}));

export default router;