import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function VolunteerDashboard({ volunteerToken, volunteerInfo, onLogout }) {
  const [volunteer, setVolunteer] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!volunteerToken) return;
    // Re-validate the session and get fresh data on each load
    api.volunteerMe(volunteerToken)
      .then(async info => {
        setVolunteer(info);
        if (info.status === "Approved") {
          const { meetings } = await api.getVolunteerMeetings(info.volunteer_id);
          setMeetings(meetings);
        }
      })
      .catch(() => {
        // Session expired — clear it
        onLogout();
      });
  }, [volunteerToken]);

  if (!volunteerToken) {
    return (
      <div className="page-narrow">
        <span className="eyebrow">Volunteer Area</span>
        <h1>Volunteer dashboard</h1>
        <p>Sign in to your volunteer account to view your dashboard and matched sessions.</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <Link to="/volunteer-login" className="btn btn-primary">Sign in →</Link>
          <Link to="/volunteer" className="btn btn-secondary">Apply to volunteer</Link>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return <div className="page-narrow"><p style={{ color: "var(--gray)" }}>Loading…</p></div>;
  }

  // Re-map from /me response shape (volunteer_id) to what we use below
  const vol = { ...volunteer, id: volunteer.volunteer_id, volunteer_tier: volunteer.tier };

  const statusConfig = {
    "Pending": {
      label: "Application under review",
      message: "Your application has been received and is being reviewed by our team. We'll be in touch by email soon — nothing for you to do right now.",
      bg: "var(--amber-bg)", text: "#6B5300"
    },
    "Awaiting Mock Session": {
      label: "Ready for onboarding",
      message: "Great news — you've been approved to begin onboarding! Complete your orientation checklist and practice session to move forward.",
      bg: "#E6F4EA", text: "#2E7D32",
      action: <Link to={`/onboarding?email=${encodeURIComponent(volunteer.email || "")}`} className="btn btn-secondary" style={{ display: "inline-block", marginTop: "0.8rem", fontSize: "0.88rem" }}>Go to Onboarding →</Link>
    },
    "In Review": {
      label: "Onboarding complete — in review",
      message: "You've finished the onboarding steps. An admin is reviewing your mock session transcript now. We'll email you once a final decision has been made.",
      bg: "var(--lavender-soft)", text: "var(--purple-deep)"
    },
    "Flagged for Interview": {
      label: "Interview requested",
      message: "We'd love to have a short conversation with you as part of your application. Please check your email — our team will be in touch with scheduling details.",
      bg: "var(--amber-bg)", text: "#6B5300"
    },
    "Approved": {
      label: "Fully approved",
      message: "Welcome to the Teen4Teen volunteer team! You're fully approved and may be matched with seekers. Your matched sessions appear below.",
      bg: "#E6F4EA", text: "#2E7D32"
    },
    "Declined": {
      label: "Application closed",
      message: "We weren't able to move forward with your application at this time. If you have questions, please reach out via the Help page.",
      bg: "#FEE2E2", text: "#991B1B"
    }
  };

  const cfg = statusConfig[vol.status] || { label: vol.status, message: "", bg: "var(--lavender-soft)", text: "var(--purple-deep)" };

  return (
    <div className="page-narrow">
      <span className="eyebrow">Volunteer Dashboard</span>
      <h1>Welcome back, {vol.name}.</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", flexWrap: "wrap", alignItems: "center" }}>
        <span className={`tag ${vol.volunteer_tier === "Young" ? "badge-young" : "badge-verified"}`}>
          {vol.volunteer_tier === "Young" ? "Young Responder" : "Verified Responder"}
        </span>
        <span className="tag" style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
        <button
          onClick={onLogout}
          style={{ background: "none", border: "none", color: "var(--gray)", fontSize: "0.8rem", cursor: "pointer", marginLeft: "auto" }}
        >
          Sign out
        </button>
      </div>

      <div style={{ background: cfg.bg, color: cfg.text, borderRadius: "var(--radius-md)", padding: "1.1rem 1.3rem", marginBottom: "1.5rem", fontSize: "0.93rem", border: "1px solid rgba(0,0,0,0.06)" }}>
        {cfg.message}
        {cfg.action}
      </div>

      {vol.status === "Approved" && (
        <>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.05rem", marginBottom: "0.8rem" }}>Your profile</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 1.5rem", fontSize: "0.9rem" }}>
              <p style={{ margin: 0 }}><strong>Country:</strong> {vol.country || "—"}</p>
              <p style={{ margin: 0 }}><strong>Languages:</strong> {vol.languages || "—"}</p>
              <p style={{ margin: 0 }}><strong>Availability:</strong> {vol.availability_hours ? `${vol.availability_hours} hrs/wk` : "—"}</p>
              <p style={{ margin: 0 }}><strong>Timezone:</strong> {vol.timezone || "—"}</p>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: "1.05rem", marginBottom: "0.8rem" }}>Your matched sessions</h2>
            {meetings.length === 0 ? (
              <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                No sessions matched yet. When a seeker is a good fit for you, an admin will make the match and you'll be notified.
              </p>
            ) : (
              meetings.map(m => (
                <div key={m.id} style={{ borderTop: "1px solid var(--lavender-soft)", paddingTop: "0.8rem", marginTop: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.4rem" }}>
                    <div>
                      <strong>{m.display_name || "Anonymous seeker"}</strong>
                      {m.support_type && (
                        <span className="tag badge-seeker" style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>{m.support_type}</span>
                      )}
                    </div>
                    <span className="tag" style={{ fontSize: "0.75rem" }}>{m.status}</span>
                  </div>
                  {m.availability && (
                    <p style={{ fontSize: "0.85rem", margin: "0.3rem 0 0", color: "var(--gray)" }}>
                      Availability: {m.availability}
                    </p>
                  )}
                  {m.notes && (
                    <p style={{ fontSize: "0.85rem", margin: "0.3rem 0 0", fontStyle: "italic", color: "var(--gray-soft)" }}>
                      {m.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--gray-soft)" }}>
        Questions? <Link to="/help">Visit the Help page →</Link>
      </p>
    </div>
  );
}
