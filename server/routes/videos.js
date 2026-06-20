import express from "express";
import * as db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const filters = req.query.tag ? { category_tag: req.query.tag } : {};
  const videos = await db.list("videos", filters);
  res.json({ videos: videos.filter(v => v.is_visible !== false) });
});

// Admin only in a real build (gate behind auth middleware)
router.post("/", async (req, res) => {
  const { youtube_url, title, description, category_tag } = req.body;
  if (!youtube_url || !title) return res.status(400).json({ error: "YouTube URL and title are required." });
  const video = await db.insert("videos", { youtube_url, title, description, category_tag, is_visible: true });
  res.status(201).json({ video });
});

router.patch("/:id", async (req, res) => {
  const updated = await db.update("videos", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Video not found." });
  res.json({ video: updated });
});

router.delete("/:id", async (req, res) => {
  await db.remove("videos", req.params.id);
  res.json({ deleted: true });
});

export default router;
