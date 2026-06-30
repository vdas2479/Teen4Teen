import { useEffect, useState } from "react";
import { api } from "../../api";

export default function MeetingRequestInbox() {
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState({});
  const [loadingMatches, setLoadingMatches] = useState(null);

  function load() { api.listMeetingRequests().then(d => setRequests(d.requests)); }
  useEffect(load, []);

  async function viewMatches(id) {
    setLoadingMatches(id);
    const { suggestions } = await api.getMatches(id);
    setMatches({ ...matches, [id]: suggestions });
    setLoadingMatches(null);
  }

  async function confirm(requestId, volunteerId) {
    await api.confirmMatch(requestId, volunteerId);
    load();
  }

  return (
    <div>
      <h2>Meeting Request Inbox</h2>
      {requests.length === 0 && <p style={{ color: "var(--gray)" }}>No meeting requests yet.</p>}

      {requests.map(r => (
        <div key={r.id} className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <strong>{r.display_name || "Anonymous"}</strong> · {r.email} ·{" "}
              <span className="tag">{r.preferred_responder_type}</span>{" "}
              <span className="tag" style={{ background: r.meeting_format === "call" ? "#FFF9E6" : "var(--lavender-soft)", color: r.meeting_format === "call" ? "#6B5300" : "var(--purple-deep)" }}>
                {r.meeting_format === "call" ? "📞 Call" : "💬 Chat"}
              </span>{" "}
              <span className="tag" style={{ background: "var(--lavender)", color: "var(--purple)" }}>{r.status}</span>
            </div>
            {r.status === "New" && (
              <button className="btn btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => viewMatches(r.id)}>
                {loadingMatches === r.id ? "Finding matches..." : "Suggest matches"}
              </button>
            )}
          </div>
          {r.notes && <p style={{ fontSize: "0.88rem", marginTop: "0.5rem" }}>"{r.notes}"</p>}

          {matches[r.id] && (
            <div style={{ marginTop: "0.8rem" }}>
              {matches[r.id].length === 0 && <p style={{ fontSize: "0.85rem", color: "var(--gray)" }}>No approved volunteers match yet.</p>}
              {matches[r.id].map(m => (
                <div key={m.volunteer.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderTop: "1px solid var(--lavender)" }}>
                  <div style={{ fontSize: "0.88rem" }}>
                    <strong>{m.volunteer.name}</strong> — {m.rationale || "General match"}
                  </div>
                  <button className="btn btn-primary" style={{ fontSize: "0.78rem" }} onClick={() => confirm(r.id, m.volunteer.id)}>
                    Approve match
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
