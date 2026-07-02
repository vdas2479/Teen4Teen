import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

// ── Inline chat panel rendered inside each matched meeting card ───────

function ChatPanel({ chat, volunteerToken }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [callForm, setCallForm] = useState(null); // null = hidden, object = open
  const scrollBoxRef = useRef(null);
  const prevCountRef = useRef(0);

  async function loadMessages() {
    try {
      const data = await api.getVolunteerChatMessages(chat.id, volunteerToken);
      setMessages(data.messages);
    } catch (_) {}
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [chat.id, volunteerToken]);

  // Only auto-scroll the chat box itself, and only when a new message arrives
  // (not on every 5s poll) — otherwise it keeps yanking the whole page down.
  useEffect(() => {
    if (messages.length > prevCountRef.current && scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const content = callForm
      ? `${callForm.date} at ${callForm.time}${callForm.link ? ` — ${callForm.link}` : ""}${callForm.note ? `\n${callForm.note}` : ""}`
      : draft.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      await api.sendVolunteerMessage(
        chat.id,
        { content, proposed_call_time: callForm ? `${callForm.date} at ${callForm.time}${callForm.link ? ` — ${callForm.link}` : ""}` : null },
        volunteerToken
      );
      setDraft("");
      setCallForm(null);
      await loadMessages();
    } catch (_) {}
    finally { setSending(false); }
  }

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid var(--lavender)", paddingTop: "1rem" }}>
      {chat.meeting_format === "call" && (
        <div className="note-soft" style={{ marginBottom: "0.8rem", fontSize: "0.83rem", padding: "0.55rem 0.9rem" }}>
          📞 Call session — use "Propose call time" below to suggest times to the seeker.
        </div>
      )}

      {/* Messages */}
      <div ref={scrollBoxRef} style={{
        background: "rgba(255,255,255,0.55)",
        border: "1.5px solid var(--lavender)",
        borderRadius: 12,
        padding: "0.8rem",
        minHeight: 140,
        maxHeight: 340,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        marginBottom: "0.7rem"
      }}>
        {messages.length === 0 && (
          <p style={{ color: "var(--gray)", fontSize: "0.85rem", textAlign: "center", margin: "auto 0" }}>
            No messages yet. Send a kind hello to get the conversation started.
          </p>
        )}

        {messages.map(msg => {
          const isMe = msg.sender_type === "volunteer";
          if (msg.proposed_call_time) {
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{
                  background: "#FFFBEA",
                  border: "1.5px solid #F6D860",
                  borderRadius: 14,
                  padding: "0.65rem 0.9rem",
                  maxWidth: "85%",
                  fontSize: "0.87rem"
                }}>
                  <p style={{ margin: "0 0 0.25rem", fontWeight: 700, color: "#6B5300" }}>📅 Proposed call time</p>
                  <p style={{ margin: 0, color: "#6B5300" }}>{msg.proposed_call_time}</p>
                  {msg.content && !msg.content.startsWith(msg.proposed_call_time.split(" — ")[0]) && (
                    <p style={{ margin: "0.3rem 0 0", color: "#6B5300", fontSize: "0.83rem" }}>{msg.content}</p>
                  )}
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--gray-soft)", marginTop: "0.15rem" }}>
                  You · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <div style={{
                background: isMe ? "var(--gradient-primary)" : "var(--lavender-soft)",
                color: isMe ? "white" : "var(--ink)",
                borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "0.6rem 0.9rem",
                maxWidth: "82%",
                fontSize: "0.9rem",
                lineHeight: 1.45
              }}>
                {msg.content}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--gray-soft)", marginTop: "0.15rem" }}>
                {isMe ? "You" : msg.sender_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Call-time proposal form */}
      {callForm && (
        <div style={{
          background: "#FFFBEA",
          border: "1.5px solid #F6D860",
          borderRadius: 12,
          padding: "0.8rem 1rem",
          marginBottom: "0.6rem"
        }}>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#6B5300", margin: "0 0 0.6rem" }}>📅 Propose a call time</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 0.8rem" }}>
            <div className="field" style={{ margin: 0 }}>
              <label style={{ fontSize: "0.8rem" }}>Date</label>
              <input type="date" value={callForm.date} onChange={e => setCallForm({ ...callForm, date: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label style={{ fontSize: "0.8rem" }}>Time</label>
              <input type="time" value={callForm.time} onChange={e => setCallForm({ ...callForm, time: e.target.value })} />
            </div>
          </div>
          <div className="field" style={{ margin: "0.5rem 0 0" }}>
            <label style={{ fontSize: "0.8rem" }}>Video / call link (optional)</label>
            <input
              placeholder="e.g. meet.google.com/..."
              value={callForm.link}
              onChange={e => setCallForm({ ...callForm, link: e.target.value })}
            />
          </div>
          <div className="field" style={{ margin: "0.5rem 0 0" }}>
            <label style={{ fontSize: "0.8rem" }}>Additional note (optional)</label>
            <input
              placeholder="e.g. 'Let me know if this doesn't work and I'll suggest another time.'"
              value={callForm.note}
              onChange={e => setCallForm({ ...callForm, note: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.7rem" }}>
            <button
              className="btn btn-gold"
              disabled={!callForm.date || !callForm.time || sending}
              onClick={sendMessage}
              style={{ fontSize: "0.83rem" }}
            >
              {sending ? "Sending…" : "Send proposal"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setCallForm(null)}
              style={{ fontSize: "0.83rem" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message input row */}
      {!callForm && (
        <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Type a message…"
            style={{
              flex: 1,
              padding: "0.65em 1em",
              borderRadius: 999,
              border: "1.5px solid var(--lavender)",
              fontSize: "0.9rem",
              fontFamily: "var(--font-body)"
            }}
          />
          {chat.meeting_format === "call" && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCallForm({ date: "", time: "", link: "", note: "" })}
              style={{ fontSize: "0.8rem", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              📅 Propose call time
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={sending || !draft.trim()}
            style={{ flexShrink: 0 }}
          >
            {sending ? "…" : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Admin chat panel ─────────────────────────────────────────────────

function AdminChatPanel({ volunteerToken }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollBoxRef = useRef(null);
  const prevCountRef = useRef(0);

  async function load() {
    try {
      const d = await api.getMyAdminChat(volunteerToken);
      setMessages(d.messages);
    } catch (_) {}
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [volunteerToken]);

  useEffect(() => {
    if (messages.length > prevCountRef.current && scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      await api.sendAdminChatMessage(draft.trim(), volunteerToken);
      setDraft("");
      await load();
    } catch (_) {}
    finally { setSending(false); }
  }

  return (
    <div className="card" style={{ marginTop: "1.2rem" }}>
      <h2 style={{ fontSize: "1.05rem", marginBottom: "0.3rem" }}>💬 Message the admin</h2>
      <p style={{ fontSize: "0.83rem", color: "var(--gray)", marginBottom: "0.9rem", marginTop: 0 }}>
        Suggest a video, ask a question, or send us anything — this is your private thread with the Teen4Teen team.
      </p>

      <div ref={scrollBoxRef} style={{
        background: "rgba(255,255,255,0.55)",
        border: "1.5px solid var(--lavender)",
        borderRadius: 12,
        padding: "0.8rem",
        minHeight: 120,
        maxHeight: 300,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        marginBottom: "0.7rem"
      }}>
        {messages.length === 0 && (
          <p style={{ color: "var(--gray)", fontSize: "0.85rem", textAlign: "center", margin: "auto 0" }}>
            No messages yet. Send us a video suggestion, a question, or anything on your mind.
          </p>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_type === "volunteer";
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <div style={{
                background: isMe ? "var(--gradient-primary)" : "var(--lavender-soft)",
                color: isMe ? "white" : "var(--ink)",
                borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "0.6rem 0.9rem",
                maxWidth: "82%",
                fontSize: "0.9rem",
                lineHeight: 1.45
              }}>
                {msg.content}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--gray-soft)", marginTop: "0.15rem" }}>
                {isMe ? "You" : "Teen4Teen Admin"} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type a message or paste a video link…"
          style={{ flex: 1, padding: "0.65em 1em", borderRadius: 999, border: "1.5px solid var(--lavender)", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !draft.trim()} style={{ flexShrink: 0 }}>
          {sending ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}

// ── Main volunteer dashboard ──────────────────────────────────────────

export default function VolunteerDashboard({ volunteerToken, volunteerInfo, onLogout }) {
  const [volunteer, setVolunteer] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [chatsByMeeting, setChatsByMeeting] = useState({});
  const [openChatMeetingId, setOpenChatMeetingId] = useState(null);

  useEffect(() => {
    if (!volunteerToken) return;
    api.volunteerMe(volunteerToken)
      .then(async info => {
        setVolunteer(info);
        if (info.status === "Approved") {
          const [{ meetings }, { chats }] = await Promise.all([
            api.getVolunteerMeetings(info.volunteer_id),
            api.getVolunteerChats(volunteerToken)
          ]);
          setMeetings(meetings);
          const byMeeting = {};
          chats.forEach(c => { byMeeting[c.meeting_request_id] = c; });
          setChatsByMeeting(byMeeting);
        }
      })
      .catch(() => onLogout());
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
              meetings.map(m => {
                const chat = chatsByMeeting[m.id];
                const isOpen = openChatMeetingId === m.id;

                return (
                  <div key={m.id} style={{ borderTop: "1px solid var(--lavender-soft)", paddingTop: "0.9rem", marginTop: "0.9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.4rem" }}>
                      <div>
                        <strong>{m.display_name || "Anonymous seeker"}</strong>
                        {m.support_type && (
                          <span className="tag badge-seeker" style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>{m.support_type}</span>
                        )}
                        {m.meeting_format && (
                          <span className="tag" style={{ marginLeft: "0.4rem", fontSize: "0.75rem", background: m.meeting_format === "call" ? "#FFF9E6" : "var(--lavender-soft)", color: m.meeting_format === "call" ? "#6B5300" : "var(--purple-deep)" }}>
                            {m.meeting_format === "call" ? "📞 Call" : "💬 Chat"}
                          </span>
                        )}
                      </div>
                      {chat && (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: "0.8rem" }}
                          onClick={() => setOpenChatMeetingId(isOpen ? null : m.id)}
                        >
                          {isOpen ? "Close chat ▲" : "Open chat ▼"}
                        </button>
                      )}
                    </div>

                    {m.availability && (
                      <p style={{ fontSize: "0.85rem", margin: "0.3rem 0 0", color: "var(--gray)" }}>
                        Availability: {m.availability}
                      </p>
                    )}
                    {m.notes && (
                      <p style={{ fontSize: "0.85rem", margin: "0.3rem 0 0", fontStyle: "italic", color: "var(--gray-soft)" }}>
                        "{m.notes}"
                      </p>
                    )}

                    {chat && isOpen && (
                      <ChatPanel chat={chat} volunteerToken={volunteerToken} />
                    )}

                    {!chat && (
                      <p style={{ fontSize: "0.8rem", color: "var(--gray-soft)", marginTop: "0.4rem" }}>
                        Chat will appear here once the seeker opens their link.
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <AdminChatPanel volunteerToken={volunteerToken} />
        </>
      )}

      <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--gray-soft)" }}>
        Questions? <Link to="/help">Visit the Help page →</Link>
      </p>
    </div>
  );
}
