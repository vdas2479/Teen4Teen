import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import volunteersRouter from "./routes/volunteers.js";
import volunteerAuthRouter from "./routes/volunteerAuth.js";
import onboardingRouter from "./routes/onboarding.js";
import mockSessionRouter from "./routes/mockSession.js";
import communityRouter from "./routes/community.js";
import videosRouter from "./routes/videos.js";
import workshopsRouter from "./routes/workshops.js";
import meetingRequestsRouter from "./routes/meetingRequests.js";
import chatsRouter from "./routes/chats.js";
import adminChatsRouter from "./routes/adminChats.js";
import adminRouter from "./routes/admin.js";
import { mode } from "./db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", data_mode: mode });
});

app.use("/api/volunteers", volunteersRouter);
app.use("/api/volunteer-auth", volunteerAuthRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/mock-session", mockSessionRouter);
app.use("/api/community", communityRouter);
app.use("/api/videos", videosRouter);
app.use("/api/workshops", workshopsRouter);
app.use("/api/meeting-requests", meetingRequestsRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/admin-chats", adminChatsRouter);
app.use("/api/admin", adminRouter);

const clientDistPath = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
  console.log("Serving built frontend from client/dist alongside the API.");
} else {
  console.log("No client/dist found — running API-only. Run `npm run build` in client/ to serve the frontend from here too.");
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\nTeen4Teen server running on http://localhost:${PORT}`);
  console.log(`Data mode: ${mode}${mode === "local-json" ? " (set SUPABASE_URL + SUPABASE_SERVICE_KEY in .env to switch to Supabase)" : ""}\n`);
});

// ── Global error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Request error:", err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Something went wrong on our end. Please try again." });
});

// ── Process-level safety net ────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});