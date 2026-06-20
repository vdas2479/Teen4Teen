import express from "express";
import * as db from "../db.js";

const router = express.Router();

// Get all visible posts with their replies
router.get("/posts", async (req, res) => {
  const posts = await db.list("community_posts");
  res.json({ posts: posts.filter(p => !p.is_hidden) });
});

// Seeker or Verified/Young Responder creates a post.
// tier_label is trusted from the logged-in session in a real build —
// for the prototype it's passed in directly.
router.post("/posts", async (req, res) => {
  const { display_name, tier_label, content, country, topic } = req.body;
  if (!display_name || !content) {
    return res.status(400).json({ error: "Display name and content are required." });
  }
  const post = await db.insert("community_posts", {
    display_name,
    tier_label: tier_label || "Seeker",
    content,
    country: country || null,
    topic: topic || null,
    is_pinned: false,
    is_hidden: false,
    flag_count: 0,
    moderator_note: null,
    replies: []
  });
  res.status(201).json({ post });
});

// Reply to a thread — Seekers CAN give practical advice here, not just reactions,
// per the confirmed spec decision. They're simply labeled "Seeker" so others
// know the source.
router.post("/posts/:postId/replies", async (req, res) => {
  const { display_name, tier_label, content } = req.body;
  const post = await db.getOne("community_posts", req.params.postId);
  if (!post) return res.status(404).json({ error: "Post not found." });

  const reply = {
    id: Math.random().toString(36).slice(2, 10),
    display_name,
    tier_label: tier_label || "Seeker",
    content,
    created_at: new Date().toISOString(),
    is_hidden: false,
    flag_count: 0
  };
  const replies = [...(post.replies || []), reply];
  const updated = await db.update("community_posts", post.id, { replies });
  res.status(201).json({ post: updated });
});

// Flag a post or reply (Seekers and visitors can do this — no auto-removal)
router.post("/posts/:postId/flag", async (req, res) => {
  const { replyId } = req.body;
  const post = await db.getOne("community_posts", req.params.postId);
  if (!post) return res.status(404).json({ error: "Post not found." });

  if (replyId) {
    const replies = (post.replies || []).map(r =>
      r.id === replyId ? { ...r, flag_count: (r.flag_count || 0) + 1 } : r
    );
    const updated = await db.update("community_posts", post.id, { replies });
    return res.json({ post: updated });
  }
  const updated = await db.update("community_posts", post.id, { flag_count: (post.flag_count || 0) + 1 });
  res.json({ post: updated });
});

// ── Admin moderation actions ────────────────────────────────────────────
router.patch("/posts/:postId/moderate", async (req, res) => {
  // body: { is_pinned?, is_hidden?, moderator_note? }
  const updated = await db.update("community_posts", req.params.postId, req.body);
  if (!updated) return res.status(404).json({ error: "Post not found." });
  res.json({ post: updated });
});

router.delete("/posts/:postId", async (req, res) => {
  await db.remove("community_posts", req.params.postId);
  res.json({ deleted: true });
});

export default router;
