import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function SeekerChat() {
  const { token } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const scrollBoxRef = useRef(null);
  const prevCountRef = useRef(0);

  async function loadMessages() {
    try {
      const data = await api.getSeekerChat(token);
      setChat(data.chat);
      setMessages(data.messages);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // Only auto-scroll the chat box itself, and only when a new message arrives
  // (not on every 5s poll) — otherwise it keeps yanking the whole page down.
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
      await api.sendSeekerMessage(token, draft.trim());
      setDraft("");
      await loadMessages();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  if (error) {
    return (
      <div className="page-narrow">
        <p style={{ color: "var(--pink-deep)", marginBottom: "0.5rem" }}>{error}</p>
        <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
          If this link doesn't look right, please check your email from Teen4Teen for the correct chat link.
        </p>
        <Link to="/help" className="btn btn-secondary" style={{ display: "inline-block", marginTop: "1rem" }}>
          Go to Help page →
        </Link>
      </div>
    );
  }

  if (!chat) {
    return <div className="page-narrow"><p style={{ color: "var(--gray)" }}>Loading your chat…</p></div>;
  }

  return (
    <div className="page-narrow" style={{ maxWidth: 660 }}>
      <span className="eyebrow">Private Chat</span>
      <h1 style={{ marginBottom: "0.25rem" }}>
        Your conversation with your volunteer
      </h1>
      <p style={{ color: "var(--gray)", fontSize: "0.88rem", marginBottom: "1.3rem" }}>
        This chat is private — just between you and your volunteer. It refreshes automatically.
      </p>

      {chat.meeting_format === "call" && (
        <div className="note-soft" style={{ marginBottom: "1.2rem", fontSize: "0.88rem" }}>
          📞 You requested a <strong>call session</strong>. Your volunteer will suggest available times here — just reply to let them know what works for you.
        </div>
      )}

      {/* Chat area */}
      <div ref={scrollBoxRef} style={{
        background: "rgba(255,255,255,0.65)",
        border: "1.5px solid var(--lavender)",
        borderRadius: "var(--radius-md)",
        padding: "1rem",
        minHeight: 320,
        maxHeight: 480,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        marginBottom: "0.9rem"
      }}>
        {messages.length === 0 && (
          <p style={{ color: "var(--gray)", fontSize: "0.88rem", textAlign: "center", margin: "auto 0" }}>
            Your conversation will appear here. Send your first message to get started.
          </p>
        )}

        {messages.map(msg => {
          const isMe = msg.sender_type === "seeker";
          if (msg.proposed_call_time) {
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{
                  background: "#FFFBEA",
                  border: "1.5px solid #F6D860",
                  borderRadius: 14,
                  padding: "0.75rem 1rem",
                  maxWidth: "85%",
                  fontSize: "0.9rem"
                }}>
                  <p style={{ margin: "0 0 0.3rem", fontWeight: 700, color: "#6B5300" }}>📅 Suggested call time</p>
                  <p style={{ margin: 0, color: "#6B5300" }}>{msg.proposed_call_time}</p>
                  {msg.content && msg.content !== msg.proposed_call_time && (
                    <p style={{ margin: "0.4rem 0 0", color: "#6B5300", fontSize: "0.88rem" }}>{msg.content}</p>
                  )}
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--gray-soft)", marginTop: "0.2rem" }}>
                  {msg.sender_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <div style={{
                background: isMe ? "var(--gradient-primary)" : "var(--lavender-soft)",
                color: isMe ? "white" : "var(--ink)",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "0.65rem 1rem",
                maxWidth: "82%",
                fontSize: "0.93rem",
                lineHeight: 1.5
              }}>
                {msg.content}
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--gray-soft)", marginTop: "0.2rem" }}>
                {isMe ? "You" : msg.sender_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: "0.6rem" }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type a message…"
          style={{
            flex: 1,
            padding: "0.75em 1.1em",
            borderRadius: 999,
            border: "1.5px solid var(--lavender)",
            fontSize: "0.93rem",
            fontFamily: "var(--font-body)"
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={sending || !draft.trim()}
          style={{ flexShrink: 0 }}
        >
          {sending ? "…" : "Send"}
        </button>
      </form>

      <p style={{ marginTop: "1.8rem", fontSize: "0.8rem", color: "var(--gray-soft)" }}>
        If you need immediate help, visit our{" "}
        <Link to="/help" style={{ color: "var(--pink)" }}>Help page →</Link>
      </p>
    </div>
  );
}
