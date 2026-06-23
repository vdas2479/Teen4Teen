import express from "express";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

// Resolve the volunteer's real tier from their session token.
// Returns "Verified Responder" / "Young Responder" for approved volunteers,
// or null if the token is missing, invalid, or the volunteer is not yet approved.
async function tierFromToken(req) {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return null;
  const volunteers = await db.list("volunteers");
  const v = volunteers.find(vol => vol.session_token === token);
  if (!v || v.status !== "Approved") return null;
  return v.volunteer_tier === "Young" ? "Young Responder" : "Verified Responder";
}

router.get("/posts", asyncHandler(async (req, res) => {
  const posts = await db.list("community_posts");
  res.json({ posts: posts.filter(p => !p.is_hidden) });
}));

// Admin: get EVERY post, including hidden ones. Without this, hiding a
// post from the admin dashboard would make it permanently inaccessible.
router.get("/posts/all", asyncHandler(async (req, res) => {
  const posts = await db.list("community_posts");
  res.json({ posts });
}));

router.post("/posts", asyncHandler(async (req, res) => {
  const { display_name, content, country, topic } = req.body;
  if (!display_name || !content) {
    return res.status(400).json({ error: "Display name and content are required." });
  }
  const tier_label = (await tierFromToken(req)) || "Seeker";
  const post = await db.insert("community_posts", {
    display_name,
    tier_label,
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
}));

router.post("/posts/:postId/replies", asyncHandler(async (req, res) => {
  const { display_name, content } = req.body;
  const post = await db.getOne("community_posts", req.params.postId);
  if (!post) return res.status(404).json({ error: "Post not found." });

  const tier_label = (await tierFromToken(req)) || "Seeker";
  const reply = {
    id: Math.random().toString(36).slice(2, 10),
    display_name,
    tier_label,
    content,
    created_at: new Date().toISOString(),
    is_hidden: false,
    flag_count: 0
  };
  const replies = [...(post.replies || []), reply];
  const updated = await db.update("community_posts", post.id, { replies });
  res.status(201).json({ post: updated });
}));

router.post("/posts/:postId/flag", asyncHandler(async (req, res) => {
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
}));

router.patch("/posts/:postId/moderate", asyncHandler(async (req, res) => {
  const updated = await db.update("community_posts", req.params.postId, req.body);
  if (!updated) return res.status(404).json({ error: "Post not found." });
  res.json({ post: updated });
}));

router.delete("/posts/:postId", asyncHandler(async (req, res) => {
  await db.remove("community_posts", req.params.postId);
  res.json({ deleted: true });
}));

export default router;