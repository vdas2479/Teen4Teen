import express from "express";
import * as db from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const workshops = await db.list("workshops");
  res.json({ workshops: workshops.filter(w => w.is_visible !== false) });
}));

router.post("/", asyncHandler(async (req, res) => {
  const { title, date, time, format, location_or_link, description } = req.body;
  if (!title || !date) return res.status(400).json({ error: "Title and date are required." });
  const workshop = await db.insert("workshops", { title, date, time, format, location_or_link, description, is_visible: true });
  res.status(201).json({ workshop });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const updated = await db.update("workshops", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Workshop not found." });
  res.json({ workshop: updated });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await db.remove("workshops", req.params.id);
  const rsvps = await db.list("workshop_rsvps", { workshop_id: req.params.id });
  for (const r of rsvps) await db.remove("workshop_rsvps", r.id);
  res.json({ deleted: true });
}));

router.post("/:id/rsvp", asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });
  const workshop = await db.getOne("workshops", req.params.id);
  if (!workshop) return res.status(404).json({ error: "Workshop not found." });
  const existing = await db.list("workshop_rsvps", { workshop_id: req.params.id });
  if (existing.find(r => r.email === email)) {
    return res.status(409).json({ error: "You've already registered for this workshop." });
  }
  const rsvp = await db.insert("workshop_rsvps", { workshop_id: req.params.id, name, email });
  res.status(201).json({ rsvp });
}));

router.get("/:id/rsvps", asyncHandler(async (req, res) => {
  const rsvps = await db.list("workshop_rsvps", { workshop_id: req.params.id });
  res.json({ rsvps, count: rsvps.length });
}));

export default router;