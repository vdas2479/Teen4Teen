import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";
import Overview from "./admin/Overview";
import ApplicationInbox from "./admin/ApplicationInbox";
import OnboardingTracker from "./admin/OnboardingTracker";
import MeetingRequestInbox from "./admin/MeetingRequestInbox";
import CommunityModerator from "./admin/CommunityModerator";
import VideoManager from "./admin/VideoManager";
import WorkshopManager from "./admin/WorkshopManager";
import VolunteerInbox from "./admin/VolunteerInbox";
import SiteSettings from "./admin/SiteSettings";

const TABS = {
  overview: ["Overview", "📊", Overview],
  applications: ["Application Inbox", "📋", ApplicationInbox],
  onboarding: ["Onboarding Tracker", "🎓", OnboardingTracker],
  meetings: ["Meeting Requests + Matching", "💌", MeetingRequestInbox],
  community: ["Community Moderator", "💬", CommunityModerator],
  videos: ["Video Manager", "🎬", VideoManager],
  workshops: ["Workshop Manager", "🗓️", WorkshopManager],
  volunteerInbox: ["Volunteer Inbox", "✉️", VolunteerInbox],
  siteSettings: ["Site Settings", "⚙️", SiteSettings],
};

export default function AdminDashboard({ adminEmail, onLogout }) {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const logoSrc = settings.logo_url || "/logo.png";
  const [, , Component] = TABS[tab];

  function logout() {
    onLogout();
    navigate("/admin");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 250, padding: "1.6rem 1.2rem", background: "rgba(255,255,255,0.7)", borderRight: "1px solid rgba(233,213,255,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.6rem" }}>
          <span style={{
            width: 34, height: 34, borderRadius: "50%", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <img src={logoSrc} alt="Teen4Teen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Admin</span>
        </div>

        <p style={{ fontSize: "0.78rem", color: "var(--gray-soft)", marginBottom: "1rem" }}>
          Logged in as<br /><strong style={{ color: "var(--ink)" }}>{adminEmail}</strong>
        </p>

        {Object.entries(TABS).map(([key, [label, emoji]]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="btn"
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              width: "100%", textAlign: "left", marginBottom: "0.45rem",
              background: tab === key ? "var(--gradient-primary)" : "transparent",
              color: tab === key ? "white" : "var(--ink)",
              fontSize: "0.85rem", borderRadius: 14, padding: "0.6em 0.9em",
              boxShadow: tab === key ? "0 6px 16px rgba(219,39,119,0.25)" : "none"
            }}
          >
            <span>{emoji}</span> {label}
          </button>
        ))}
        <button onClick={logout} className="btn btn-ghost" style={{ width: "100%", marginTop: "1.2rem", fontSize: "0.8rem" }}>
          Log out
        </button>
      </aside>
      <main style={{ flex: 1, padding: "2.2rem" }}>
        <Component />
      </main>
    </div>
  );
}
