import { useEffect, useState } from "react";
import { api } from "../../api";

export default function OnboardingTracker() {
  const [volunteers, setVolunteers] = useState([]);
  const [progressMap, setProgressMap] = useState({});

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
        return (
          <div key={v.id} className="card" style={{ marginBottom: "0.8rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <div>
              <strong>{v.name}</strong> · {v.email}
            </div>
            <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.82rem" }}>
              <span className="tag" style={{ background: p?.checklist_completed ? "#E6F4EA" : "#F5F5F5", color: p?.checklist_completed ? "#2E7D32" : "var(--gray)" }}>
                Checklist {p?.checklist_completed ? "✓" : "—"}
              </span>
              <span className="tag" style={{ background: p?.mock_session_completed ? "#E6F4EA" : "#F5F5F5", color: p?.mock_session_completed ? "#2E7D32" : "var(--gray)" }}>
                Mock session {p?.mock_session_completed ? "✓" : "—"}
              </span>
              <span className="tag" style={{ background: p?.interview_required ? "#FFF3CD" : "#F5F5F5", color: p?.interview_required ? "#8a6d00" : "var(--gray)" }}>
                Interview {p?.interview_required ? "required" : "not needed"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
