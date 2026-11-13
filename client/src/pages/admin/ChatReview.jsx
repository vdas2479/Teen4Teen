import { useEffect, useState } from "react";
import { api } from "../../api";

// Show admins the private seeker conversations and let them close or reopen a chat.
export default function ChatReview() {
  const [chats, setChats] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [savingId, setSavingId] = useState(null);

  // Load all matched seeker conversations for authorized admin review.
  async function loadChats() {
    try {
      const { chats: latestChats } = await api.listSeekerChats();
      setChats(latestChats);
      setLoadError("");
    } catch (error) {
      setLoadError(`Could not load seeker chats: ${error.message}`);
    }
  }

  // Change a chat's active state and reload its latest messages and status.
  async function setChatStatus(chat, status) {
    setSavingId(chat.id);
    setActionError("");
    try {
      await api.updateSeekerChat(chat.id, status);
      await loadChats();
    } catch (error) {
      setActionError(`Could not update this chat: ${error.message}`);
    } finally {
      setSavingId(null);
    }
  }

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem" }}>
        <h2>Seeker Chats</h2>
        <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={loadChats}>↻ Refresh</button>
      </div>
      <p style={{ fontSize: "0.88rem", color: "var(--gray)", marginTop: "-0.3rem" }}>
        Private conversations are visible to admins for safety review. Closing a chat prevents both participants from sending new messages; reopening restores messaging.
      </p>
      {loadError && <p role="alert" style={{ color: "var(--pink-deep)" }}>{loadError}</p>}
      {actionError && <p role="alert" style={{ color: "var(--pink-deep)" }}>{actionError}</p>}
      {!loadError && chats.length === 0 && <p style={{ color: "var(--gray)" }}>No matched seeker chats yet.</p>}

      {chats.map(chat => {
        const isClosed = chat.status === "Closed";
        return (
          <section key={chat.id} className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.8rem", flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem" }}>{chat.seeker_name || "Seeker"} · {chat.volunteer_name}</h3>
                <p style={{ margin: "0.25rem 0", color: "var(--gray)", fontSize: "0.82rem" }}>
                  Seeker: {chat.seeker_email} · Volunteer: {chat.volunteer_email}
                </p>
                <span className="tag" style={{ background: isClosed ? "#E5E7EB" : "#E6F4EA", color: isClosed ? "var(--gray)" : "#2E7D32" }}>
                  {isClosed ? "Closed" : "Active"}
                </span>
                <span className="tag" style={{ marginLeft: "0.4rem" }}>
                  {chat.meeting_format === "call" ? "Call" : "Chat"}
                </span>
              </div>
              <button
                className={isClosed ? "btn btn-secondary" : "btn btn-ghost"}
                disabled={savingId === chat.id}
                onClick={() => setChatStatus(chat, isClosed ? "Active" : "Closed")}
              >
                {savingId === chat.id ? "Saving…" : isClosed ? "Reopen chat" : "Close chat"}
              </button>
            </div>

            {isClosed && (
              <p className="note-soft" style={{ marginTop: "0.8rem" }}>This conversation is closed. Participants can still read previous messages but cannot send new ones.</p>
            )}

            <div style={{ marginTop: "0.8rem", borderTop: "1px solid var(--lavender-soft)", paddingTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.55rem", maxHeight: 360, overflowY: "auto" }}>
              {(chat.messages || []).length === 0 && <p style={{ color: "var(--gray)", fontSize: "0.85rem", margin: 0 }}>No messages yet.</p>}
              {(chat.messages || []).map(message => (
                <div key={message.id} style={{
                  alignSelf: message.sender_type === "seeker" ? "flex-start" : "flex-end",
                  background: message.sender_type === "seeker" ? "var(--lavender-soft)" : "var(--gradient-primary)",
                  color: message.sender_type === "seeker" ? "var(--ink)" : "white",
                  borderRadius: 12,
                  padding: "0.55rem 0.8rem",
                  maxWidth: "82%",
                  fontSize: "0.88rem",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere"
                }}>
                  <strong style={{ display: "block", fontSize: "0.72rem", opacity: 0.75, marginBottom: "0.15rem" }}>
                    {message.sender_type === "seeker" ? chat.seeker_name || "Seeker" : chat.volunteer_name}
                  </strong>
                  {message.content}
                  <span style={{ display: "block", fontSize: "0.68rem", opacity: 0.7, marginTop: "0.15rem" }}>
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
