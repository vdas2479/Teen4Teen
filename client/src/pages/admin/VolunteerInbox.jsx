import { useEffect, useRef, useState } from "react";
import { api } from "../../api";

export default function VolunteerInbox() {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollBoxRef = useRef(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    api.listAdminChats().then(d => setChats(d.chats));
  }, []);

  async function openChat(chatId) {
    if (activeId === chatId) { setActiveId(null); setMessages([]); return; }
    setActiveId(chatId);
    const d = await api.getAdminChat(chatId);
    setMessages(d.messages);
  }

  useEffect(() => {
    if (!activeId) return;
    const interval = setInterval(async () => {
      const d = await api.getAdminChat(activeId);
      setMessages(d.messages);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeId]);

  useEffect(() => {
    if (messages.length > prevCountRef.current && scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!draft.trim() || sending || !activeId) return;
    setSending(true);
    try {
      await api.replyAdminChat(activeId, draft.trim());
      setDraft("");
      const d = await api.getAdminChat(activeId);
      setMessages(d.messages);
      api.listAdminChats().then(d => setChats(d.chats));
    } catch (_) {}
    finally { setSending(false); }
  }

  const activeChat = chats.find(c => c.id === activeId);

  return (
    <div>
      <h2>Volunteer Inbox</h2>
      <p style={{ fontSize: "0.88rem", color: "var(--gray)", marginTop: "-0.3rem", marginBottom: "1.2rem" }}>
        Private messages from your volunteers — video suggestions, questions, feedback.
      </p>

      {chats.length === 0 && <p style={{ color: "var(--gray)" }}>No messages from volunteers yet.</p>}

      <div style={{ display: "grid", gridTemplateColumns: activeId ? "280px 1fr" : "1fr", gap: "1rem", alignItems: "flex-start" }}>
        {/* Thread list */}
        <div>
          {chats.map(c => (
            <div
              key={c.id}
              onClick={() => openChat(c.id)}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: 12,
                marginBottom: "0.5rem",
                cursor: "pointer",
                background: activeId === c.id ? "var(--lavender-soft)" : "rgba(255,255,255,0.7)",
                border: `1.5px solid ${activeId === c.id ? "var(--lavender)" : "transparent"}`,
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.92rem" }}>{c.volunteer_name}</strong>
                {c.message_count > 0 && (
                  <span style={{ fontSize: "0.75rem", background: "var(--gradient-primary)", color: "white", borderRadius: 999, padding: "0.15em 0.6em" }}>
                    {c.message_count}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--gray-soft)", margin: "0.2rem 0 0" }}>{c.volunteer_email}</p>
            </div>
          ))}
        </div>

        {/* Active thread */}
        {activeId && activeChat && (
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
              <div>
                <strong>{activeChat.volunteer_name}</strong>
                <span style={{ fontSize: "0.8rem", color: "var(--gray-soft)", marginLeft: "0.5rem" }}>{activeChat.volunteer_email}</span>
              </div>
              <button className="btn-ghost btn" style={{ fontSize: "0.75rem" }} onClick={() => { setActiveId(null); setMessages([]); }}>Close ✕</button>
            </div>

            <div ref={scrollBoxRef} style={{
              background: "rgba(255,255,255,0.55)",
              border: "1.5px solid var(--lavender)",
              borderRadius: 12,
              padding: "0.8rem",
              minHeight: 200,
              maxHeight: 400,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "0.7rem"
            }}>
              {messages.length === 0 && (
                <p style={{ color: "var(--gray)", fontSize: "0.85rem", textAlign: "center", margin: "auto 0" }}>No messages yet.</p>
              )}
              {messages.map(msg => {
                const isAdmin = msg.sender_type === "admin";
                return (
                  <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start" }}>
                    <div style={{
                      background: isAdmin ? "var(--gradient-primary)" : "var(--lavender-soft)",
                      color: isAdmin ? "white" : "var(--ink)",
                      borderRadius: isAdmin ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      padding: "0.6rem 0.9rem",
                      maxWidth: "80%",
                      fontSize: "0.9rem",
                      lineHeight: 1.45
                    }}>
                      {msg.content}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--gray-soft)", marginTop: "0.15rem" }}>
                      {isAdmin ? "You (Admin)" : activeChat.volunteer_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={send} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Reply to this volunteer…"
                style={{ flex: 1, padding: "0.65em 1em", borderRadius: 999, border: "1.5px solid var(--lavender)", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}
              />
              <button type="submit" className="btn btn-primary" disabled={sending || !draft.trim()} style={{ flexShrink: 0 }}>
                {sending ? "…" : "Send"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
