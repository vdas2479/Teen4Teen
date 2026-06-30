import { useEffect, useState } from "react";
import { api } from "../../api";

export default function MeetingRequestInbox() {
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState({});
  const [loadingMatches, setLoadingMatches] = useState(null);
  const [chatLinks, setChatLinks] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  function load() { api.listMeetingRequests().then(d => setRequests(d.requests)); }
  useEffect(load, []);

  async function viewMatches(id) {
    setLoadingMatches(id);
    const { suggestions } = await api.getMatches(id);
    setMatches({ ...matches, [id]: suggestions });
    setLoadingMatches(null);
  }

  async function confirm(requestId, volunteerId) {
    const { chat_link } = await api.confirmMatch(requestId, volunteerId);
    setChatLinks(prev => ({ ...prev, [requestId]: chat_link }));
    load();
  }

  async function showChatLink(requestId) {
    if (chatLinks[requestId]) return;
    const { chat_link } = await api.getChatLink(requestId);
    setChatLinks(prev => ({ ...prev, [requestId]: chat_link }));
  }

  async function copyLink(requestId, link) {
    await navigator.clipboard.writeText(link);
    setCopiedId(requestId);
    setTimeout(() => setCopiedId(null), 1500);
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

          {r.status === "Matched" && (
            <div style={{ marginTop: "0.7rem" }}>
              {chatLinks[r.id] ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <code style={{ fontSize: "0.78rem", background: "var(--lavender-soft)", padding: "0.3em 0.7em", borderRadius: 8, wordBreak: "break-all" }}>
                    {chatLinks[r.id]}
                  </code>
                  <button className="btn btn-ghost" style={{ fontSize: "0.78rem" }} onClick={() => copyLink(r.id, chatLinks[r.id])}>
                    {copiedId === r.id ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              ) : (
                <button className="btn btn-ghost" style={{ fontSize: "0.78rem" }} onClick={() => showChatLink(r.id)}>
                  Show seeker's chat link
                </button>
              )}
              <p style={{ fontSize: "0.76rem", color: "var(--gray-soft)", marginTop: "0.3rem" }}>
                Use this to manually send the seeker their chat link if email delivery isn't set up yet.
              </p>
            </div>
          )}

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
