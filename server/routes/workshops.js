import express from "express";
import * as db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const workshops = await db.list("workshops");
  res.json({ workshops: workshops.filter(w => w.is_visible !== false) });
});

router.post("/", async (req, res) => {
  const { title, date, time, format, location_or_link, description } = req.body;
  if (!title || !date) return res.status(400).json({ error: "Title and date are required." });
  const workshop = await db.insert("workshops", { title, date, time, format, location_or_link, description, is_visible: true });
  res.status(201).json({ workshop });
});

router.patch("/:id", async (req, res) => {
  const updated = await db.update("workshops", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Workshop not found." });
  res.json({ workshop: updated });
});

router.delete("/:id", async (req, res) => {
  await db.remove("workshops", req.params.id);
  res.json({ deleted: true });
});

export default router;
