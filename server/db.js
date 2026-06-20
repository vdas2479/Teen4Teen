// ─────────────────────────────────────────────────────────────────────────
// Data layer. Two modes, same function signatures either way:
//
//   1. LOCAL MODE (default) — no setup needed. Reads/writes a JSON file
//      at server/data.json. Perfect for running the prototype today.
//
//   2. SUPABASE MODE — set SUPABASE_URL + SUPABASE_SERVICE_KEY in .env
//      and this file automatically routes every call to your real
//      Supabase tables instead. Nothing in routes/ has to change.
//
// When you're ready to move to Supabase, run the SQL in /supabase/schema.sql
// against your project first, then just fill in the two env vars.
// ─────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");

const USING_SUPABASE = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

export const supabase = USING_SUPABASE
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

// ── Local JSON file helpers ────────────────────────────────────────────
function readLocal() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData(), null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeLocal(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function seedData() {
  return {
    volunteers: [],
    onboarding_progress: [],
    community_posts: [
      {
        id: nanoid(8),
        display_name: "quietharbor",
        tier_label: "Seeker",
        country: "Philippines",
        topic: "Anxiety",
        content: "Is it normal to feel guilty for resting? My family doesn't really get the concept of being tired from school stress.",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_pinned: false,
        is_hidden: false,
        flag_count: 0,
        moderator_note: null,
        replies: [
          {
            id: nanoid(8),
            display_name: "Maya R.",
            tier_label: "Verified Responder",
            content: "Rest isn't something you have to earn. Feeling behind doesn't mean you're doing something wrong by resting \u2014 it usually means you've been carrying more than you've had support for.",
            created_at: new Date(Date.now() - 80000000).toISOString(),
            is_hidden: false,
            flag_count: 0
          }
        ]
      }
    ],
    videos: [
      {
        id: nanoid(8),
        youtube_url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
        title: "What anxiety actually feels like in your body",
        description: "A short, grounded explainer on the physical side of anxiety \u2014 not just the racing thoughts.",
        category_tag: "Anxiety",
        created_at: new Date().toISOString(),
        is_visible: true
      }
    ],
    workshops: [
      {
        id: nanoid(8),
        title: "Naming Your Feelings: A Beginner's Workshop",
        date: "2026-07-12",
        time: "10:00",
        format: "virtual",
        location_or_link: "https://meet.example.com/teen4teen-workshop",
        description: "A gentle, no-pressure session for anyone who has never had language for what they're feeling.",
        created_at: new Date().toISOString(),
        is_visible: true
      }
    ],
    meeting_requests: [],
    admins: [
      { id: nanoid(8), email: process.env.DEV_ADMIN_EMAIL || "admin@teen4teen.org", role: "super_admin", created_at: new Date().toISOString() }
    ]
  };
}

// ── Generic table operations (local mode) ─────────────────────────────
function localList(table, filterFn) {
  const data = readLocal();
  const rows = data[table] || [];
  return filterFn ? rows.filter(filterFn) : rows;
}

function localInsert(table, row) {
  const data = readLocal();
  const record = { id: nanoid(8), created_at: new Date().toISOString(), ...row };
  data[table] = data[table] || [];
  data[table].push(record);
  writeLocal(data);
  return record;
}

function localUpdate(table, id, patch) {
  const data = readLocal();
  const rows = data[table] || [];
  const idx = rows.findIndex(r => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch };
  writeLocal(data);
  return rows[idx];
}

function localDelete(table, id) {
  const data = readLocal();
  data[table] = (data[table] || []).filter(r => r.id !== id);
  writeLocal(data);
  return true;
}

// ── Public API used by routes/ ─────────────────────────────────────────
// Every function below works identically whether USING_SUPABASE is true or false.

export async function list(table, filters = {}) {
  if (USING_SUPABASE) {
    let q = supabase.from(table).select("*").order("created_at", { ascending: false });
    for (const [key, val] of Object.entries(filters)) q = q.eq(key, val);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  }
  const filterFn = Object.keys(filters).length
    ? (row) => Object.entries(filters).every(([k, v]) => row[k] === v)
    : null;
  return localList(table, filterFn);
}

export async function insert(table, row) {
  if (USING_SUPABASE) {
    const { data, error } = await supabase.from(table).insert(row).select().single();
    if (error) throw error;
    return data;
  }
  return localInsert(table, row);
}

export async function update(table, id, patch) {
  if (USING_SUPABASE) {
    const { data, error } = await supabase.from(table).update(patch).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
  return localUpdate(table, id, patch);
}

export async function remove(table, id) {
  if (USING_SUPABASE) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  return localDelete(table, id);
}

export async function getOne(table, id) {
  const rows = await list(table);
  return rows.find(r => r.id === id) || null;
}

export const mode = USING_SUPABASE ? "supabase" : "local-json";
