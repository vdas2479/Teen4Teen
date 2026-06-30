import express from "express";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

async function volunteerFromToken(req) {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return null;
  const volunteers = await db.list("volunteers");
  return volunteers.find(v => v.session_token === token && v.status === "Approved") || null;
}

function sortAsc(msgs) {
  return [...msgs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

// ── Seeker routes (URL token IS the credential — no login) ────────────

router.get("/seeker/:token", asyncHandler(async (req, res) => {
  const chats = await db.list("chats", { seeker_token: req.params.token });
  const chat = chats[0];
  if (!chat) return res.status(404).json({ error: "Chat not found. Please check your email for the correct link." });
  const msgs = await db.list("chat_messages", { chat_id: chat.id });
  res.json({ chat, messages: sortAsc(msgs) });
}));

router.post("/seeker/:token/messages", asyncHandler(async (req, res) => {
  const chats = await db.list("chats", { seeker_token: req.params.token });
  const chat = chats[0];
  if (!chat) return res.status(404).json({ error: "Chat not found." });
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message cannot be empty." });
  const msg = await db.insert("chat_messages", {
    chat_id: chat.id,
    sender_type: "seeker",
    sender_name: chat.seeker_name || "Seeker",
    content: content.trim(),
    proposed_call_time: null
  });
  res.status(201).json({ message: msg });
}));

// ── Volunteer routes (require approved session token) ─────────────────

router.get("/by-volunteer", asyncHandler(async (req, res) => {
  const vol = await volunteerFromToken(req);
  if (!vol) return res.status(401).json({ error: "Not authorized." });
  const chats = await db.list("chats", { volunteer_id: vol.id });
  res.json({ chats });
}));

router.get("/volunteer/:chatId", asyncHandler(async (req, res) => {
  const vol = await volunteerFromToken(req);
  if (!vol) return res.status(401).json({ error: "Not authorized." });
  const chat = await db.getOne("chats", req.params.chatId);
  if (!chat || chat.volunteer_id !== vol.id) return res.status(403).json({ error: "Not your chat." });
  const msgs = await db.list("chat_messages", { chat_id: chat.id });
  res.json({ chat, messages: sortAsc(msgs) });
}));

router.post("/volunteer/:chatId/messages", asyncHandler(async (req, res) => {
  const vol = await volunteerFromToken(req);
  if (!vol) return res.status(401).json({ error: "Not authorized." });
  const chat = await db.getOne("chats", req.params.chatId);
  if (!chat || chat.volunteer_id !== vol.id) return res.status(403).json({ error: "Not your chat." });
  const { content, proposed_call_time } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message cannot be empty." });
  const msg = await db.insert("chat_messages", {
    chat_id: chat.id,
    sender_type: "volunteer",
    sender_name: vol.name,
    content: content.trim(),
    proposed_call_time: proposed_call_time || null
  });
  res.status(201).json({ message: msg });
}));

export default router;
