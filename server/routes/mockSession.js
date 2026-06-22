import express from "express";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

const ADULT_PERSONA = `You are role-playing as "Alex," a young woman from a low-income background
who is reaching out for support for the first time. You feel anxious and ashamed about
talking about your feelings. You are initially guarded, give short or deflecting answers,
and test whether the person on the other end is actually safe to open up to before
revealing more. Stay in character. Never break character to give meta-commentary.
Never resolve your own problems quickly — the point is to see how the volunteer responds
to silence, deflection, and emotional disclosure. Keep responses brief, like real chat
messages, not paragraphs.`;

const YOUNG_PERSONA = `You are role-playing as "Jordan," a teenager dealing with school stress
and feeling left out by friends. This is a lighter, age-appropriate scenario — not a clinical
one. You are a little hesitant to open up at first but warm up faster than an adult persona
would. Stay in character, keep responses short and casual, like real text messages.`;

function buildPrompt(tier) {
  return tier === "Young" ? YOUNG_PERSONA : ADULT_PERSONA;
}

const SCRIPTED_FALLBACK = [
  "hey",
  "I don't really know why I'm here honestly",
  "it's not that big of a deal, I don't want to waste your time",
  "...okay maybe it is kind of a big deal. things have just been a lot lately",
];

router.post("/start", asyncHandler(async (req, res) => {
  const { volunteer_id, tier } = req.body;
  res.json({
    session_id: volunteer_id,
    notice: "This is a simulated conversation with an AI designed to reflect real interactions on Teen4Teen. Your responses will be reviewed by an admin as part of your application. Please engage as you would in a real session — honestly and with care. The session typically takes 10–15 minutes.",
    opening_message: "hey"
  });
}));

router.post("/message", asyncHandler(async (req, res) => {
  const { tier, history, message } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    const turnIndex = (history || []).filter(h => h.role === "persona").length;
    const reply = SCRIPTED_FALLBACK[Math.min(turnIndex, SCRIPTED_FALLBACK.length - 1)];
    return res.json({ reply, mode: "scripted-demo" });
  }

  try {
    const systemPrompt = buildPrompt(tier);
    const contents = [
      ...(history || []).map(h => ({
        role: h.role === "volunteer" ? "user" : "model",
        parts: [{ text: h.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents
        })
      }
    );
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "...";
    res.json({ reply, mode: "gemini" });
  } catch (err) {
    res.status(500).json({ error: "AI session failed to respond.", details: err.message });
  }
}));

router.post("/:volunteerId/complete", asyncHandler(async (req, res) => {
  const { transcript } = req.body;
  const rows = await db.list("onboarding_progress", { volunteer_id: req.params.volunteerId });
  if (!rows[0]) return res.status(404).json({ error: "No onboarding record found." });
  const updated = await db.update("onboarding_progress", rows[0].id, {
    mock_session_completed: true,
    mock_session_transcript: transcript
  });
  await db.update("volunteers", req.params.volunteerId, { status: "In Review" });
  res.json({ progress: updated });
}));

export default router;