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

// Get or create the volunteer's chat thread + all messages
router.get("/my", asyncHandler(async (req, res) => {
  const vol = await volunteerFromToken(req);
  if (!vol) return res.status(401).json({ error: "Not authenticated." });

  let chats = await db.list("volunteer_admin_chats", { volunteer_id: vol.id });
  let chat = chats[0];
  if (!chat) {
    chat = await db.insert("volunteer_admin_chats", {
      volunteer_id: vol.id,
      volunteer_name: vol.name,
      volunteer_email: vol.email
    });
  }

  const messages = await db.list("volunteer_admin_messages", { chat_id: chat.id });
  const sorted = [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  res.json({ chat, messages: sorted });
}));

// Volunteer sends a message
router.post("/my/messages", asyncHandler(async (req, res) => {
  const vol = await volunteerFromToken(req);
  if (!vol) return res.status(401).json({ error: "Not authenticated." });

  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message cannot be empty." });

  let chats = await db.list("volunteer_admin_chats", { volunteer_id: vol.id });
  let chat = chats[0];
  if (!chat) {
    chat = await db.insert("volunteer_admin_chats", {
      volunteer_id: vol.id,
      volunteer_name: vol.name,
      volunteer_email: vol.email
    });
  }

  const message = await db.insert("volunteer_admin_messages", {
    chat_id: chat.id,
    sender_type: "volunteer",
    sender_name: vol.name,
    content: content.trim()
  });

  res.status(201).json({ message });
}));

// Admin: list all volunteer chat threads
router.get("/", asyncHandler(async (req, res) => {
  const chats = await db.list("volunteer_admin_chats");
  const withCounts = await Promise.all(chats.map(async c => {
    const msgs = await db.list("volunteer_admin_messages", { chat_id: c.id });
    return { ...c, message_count: msgs.length };
  }));
  res.json({ chats: withCounts });
}));

// Admin: get a specific thread + messages
router.get("/:chatId", asyncHandler(async (req, res) => {
  const chat = await db.getOne("volunteer_admin_chats", req.params.chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found." });
  const messages = await db.list("volunteer_admin_messages", { chat_id: chat.id });
  const sorted = [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  res.json({ chat, messages: sorted });
}));

// Admin: reply to a thread
router.post("/:chatId/reply", asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message cannot be empty." });

  const chat = await db.getOne("volunteer_admin_chats", req.params.chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found." });

  const message = await db.insert("volunteer_admin_messages", {
    chat_id: chat.id,
    sender_type: "admin",
    sender_name: "Teen4Teen Admin",
    content: content.trim()
  });

  res.status(201).json({ message });
}));

export default router;
