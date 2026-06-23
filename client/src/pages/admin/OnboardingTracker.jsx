import { useEffect, useState } from "react";
import { api } from "../../api";

export default function OnboardingTracker() {
  const [volunteers, setVolunteers] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.listVolunteers().then(async ({ volunteers }) => {
      setVolunteers(volunteers);
      const entries = await Promise.all(volunteers.map(v => api.getOnboarding(v.id)));
      const map = {};
      volunteers.forEach((v, i) => { map[v.id] = entries[i].progress; });
      setProgressMap(map);
    });
  }, []);

  return (
    <div>
      <h2>Onboarding Tracker</h2>
      {volunteers.length === 0 && <p style={{ color: "var(--gray)" }}>No volunteers in onboarding yet.</p>}
      {volunteers.map(v => {
        const p = progressMap[v.id];
        const transcript = p?.mock_session_transcript;
        const hasTranscript = Array.isArray(transcript) && transcript.length > 0;
        const isExpanded = expandedId === v.id;
        return (
          <div key={v.id} className="card" style={{ marginBottom: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
              <div>
                <strong>{v.name}</strong> · {v.email}
              </div>
              <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.82rem", alignItems: "center", flexWrap: "wrap" }}>
                <span className="tag" style={{ background: p?.checklist_completed ? "#E6F4EA" : "#F5F5F5", color: p?.checklist_completed ? "#2E7D32" : "var(--gray)" }}>
                  Checklist {p?.checklist_completed ? "✓" : "—"}
                </span>
                <span className="tag" style={{ background: p?.mock_session_completed ? "#E6F4EA" : "#F5F5F5", color: p?.mock_session_completed ? "#2E7D32" : "var(--gray)" }}>
                  Mock session {p?.mock_session_completed ? "✓" : "—"}
                </span>
                <span className="tag" style={{ background: p?.interview_required ? "#FFF3CD" : "#F5F5F5", color: p?.interview_required ? "#8a6d00" : "var(--gray)" }}>
                  Interview {p?.interview_required ? "required" : "not needed"}
                </span>
                {hasTranscript && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: "0.78rem", padding: "0.28em 0.85em" }}
                    onClick={() => setExpandedId(isExpanded ? null : v.id)}
                  >
                    {isExpanded ? "Hide transcript ▲" : "View transcript ▼"}
                  </button>
                )}
              </div>
            </div>

            {isExpanded && hasTranscript && (
              <div style={{ marginTop: "1rem", borderTop: "1px solid #F2E8FF", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: 400, overflowY: "auto" }}>
                {transcript.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.role === "volunteer" ? "flex-end" : "flex-start",
                    background: m.role === "volunteer" ? "var(--pink)" : "var(--lavender)",
                    color: m.role === "volunteer" ? "white" : "var(--purple-deep)",
                    borderRadius: 12,
                    padding: "0.45em 0.85em",
                    maxWidth: "78%",
                    fontSize: "0.87rem"
                  }}>
                    <div style={{ fontSize: "0.71rem", fontWeight: 700, opacity: 0.7, marginBottom: "0.15em" }}>
                      {m.role === "volunteer" ? v.name : "AI Persona"}
                    </div>
                    {m.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
