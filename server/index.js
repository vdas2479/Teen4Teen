import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import volunteersRouter from "./routes/volunteers.js";
import onboardingRouter from "./routes/onboarding.js";
import mockSessionRouter from "./routes/mockSession.js";
import communityRouter from "./routes/community.js";
import videosRouter from "./routes/videos.js";
import workshopsRouter from "./routes/workshops.js";
import meetingRequestsRouter from "./routes/meetingRequests.js";
import adminRouter from "./routes/admin.js";
import { mode } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", data_mode: mode });
});

app.use("/api/volunteers", volunteersRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/mock-session", mockSessionRouter);
app.use("/api/community", communityRouter);
app.use("/api/videos", videosRouter);
app.use("/api/workshops", workshopsRouter);
app.use("/api/meeting-requests", meetingRequestsRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\nTeen4Teen API running on http://localhost:${PORT}`);
  console.log(`Data mode: ${mode}${mode === "local-json" ? " (set SUPABASE_URL + SUPABASE_SERVICE_KEY in .env to switch to Supabase)" : ""}\n`);
});
