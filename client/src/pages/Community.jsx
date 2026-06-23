import { useEffect, useState } from "react";
import { api } from "../api";

const TOPICS = ["General", "Anxiety", "Self-Worth", "Grief", "Relationships", "Identity", "Healing"];

function Badge({ tier }) {
  const cls = tier === "Verified Responder" ? "badge-verified" : tier === "Young Responder" ? "badge-young" : "badge-seeker";
  return <span className={`tag ${cls}`}>{tier}</span>;
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Community({ volunteerToken, volunteerInfo }) {
  const isApprovedVolunteer = volunteerInfo?.status === "Approved";
  const tierLabel = volunteerInfo?.tier === "Young" ? "Young Responder" : "Verified Responder";

  const [posts, setPosts] = useState([]);
  const [showWarning, setShowWarning] = useState(true);
  const [displayName, setDisplayName] = useState(isApprovedVolunteer ? volunteerInfo.name : "");
  const [country, setCountry] = useState("");
  const [topic, setTopic] = useState("General");
  const [newPost, setNewPost] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listPosts().then(d => setPosts(d.posts)).finally(() => setLoading(false));
  }, []);

  async function submitPost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;
    const { post } = await api.createPost({
      display_name: displayName.trim() || "anonymous",
      content: newPost.trim(),
      country: country.trim() || null,
      topic
    }, volunteerToken);
    setPosts([post, ...posts]);
    setNewPost("");
  }

  async function submitReply(postId) {
    const text = (replyDrafts[postId] || "").trim();
    if (!text) return;
    const { post } = await api.reply(postId, {
      display_name: displayName.trim() || "anonymous",
      content: text
    }, volunteerToken);
    setPosts(posts.map(p => p.id === postId ? post : p));
    setReplyDrafts({ ...replyDrafts, [postId]: "" });
  }

  async function flag(postId, replyId) {
    await api.flagPost(postId, replyId ? { replyId } : {});
    alert("Thanks for flagging this. An admin will review it.");
  }

  return (
    <div className="page" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "2rem", alignItems: "flex-start" }}>
      {/* Sidebar */}
      <div className="card" style={{ position: "sticky", top: 90 }}>
        <span className="eyebrow">Community</span>
        <h1 style={{ fontSize: "2rem" }}>Ask, answer, and feel less alone.</h1>
        <p style={{ fontSize: "0.9rem" }}>
          Simple name-based posting creates an open advice space without full accounts.
        </p>

        {showWarning && (
          <div className="note-soft" style={{ marginBottom: "1.2rem", fontSize: "0.85rem" }}>
            This is a shared space. Posts here are public. Please protect your
            privacy and be kind.
            <button onClick={() => setShowWarning(false)} className="btn-ghost btn" style={{ display: "block", marginTop: "0.6rem", padding: "0.2em 0.7em", fontSize: "0.78rem" }}>
              Got it
            </button>
          </div>
        )}

        {isApprovedVolunteer && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", background: "var(--lavender-soft)", borderRadius: 10, padding: "0.6em 0.9em", fontSize: "0.85rem", color: "var(--purple-deep)" }}>
            <span style={{ fontWeight: 700 }}>Posting as</span>
            <Badge tier={tierLabel} />
          </div>
        )}

        <form onSubmit={submitPost}>
          <div className="field">
            <label>Your name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. quietharbor" />
          </div>
          <div className="field">
            <label>Country or region (optional)</label>
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Kenya" />
          </div>
          <div className="field">
            <label>Topic</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label>What's on your mind?</label>
            <textarea rows={3} value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share what you're going through, or ask for advice..." />
            <span className="field-hint">Please don't share personal identifying information.</span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Post</button>
        </form>
      </div>

      {/* Feed */}
      <div>
        {loading && <p>Loading...</p>}
        {!loading && posts.length === 0 && <p style={{ color: "var(--gray)" }}>No posts yet. Be the first to share something.</p>}

        {posts.map(post => (
          <div key={post.id} className="card" style={{ marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", flexWrap: "wrap" }}>
                  <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>{post.display_name}</strong>
                  {post.country && <span style={{ fontSize: "0.85rem", color: "var(--gray-soft)" }}>from {post.country}</span>}
                  <Badge tier={post.tier_label} />
                </div>
                {post.topic && <span className="tag" style={{ marginTop: "0.4rem", display: "inline-block" }}>{post.topic}</span>}
              </div>
              <button onClick={() => flag(post.id)} title="Flag this post" className="chip" style={{ fontSize: "0.75rem", padding: "0.3em 0.8em", border: "none" }}>
                🚩 Flag
              </button>
            </div>
            <p style={{ marginTop: "0.8rem", color: "var(--ink)" }}>{post.content}</p>
            <p style={{ fontSize: "0.78rem", color: "var(--gray-soft)" }}>{timeAgo(post.created_at)}</p>

            {/* Replies */}
            <div style={{ marginTop: "0.6rem" }}>
              {(post.replies || []).length > 0 && (
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--purple-deep)", marginBottom: "0.5rem" }}>
                  💬 {post.replies.length} repl{post.replies.length === 1 ? "y" : "ies"}
                </p>
              )}
              {(post.replies || []).map(reply => (
                <div key={reply.id} style={{
                  background: "var(--lavender-soft)", borderRadius: "var(--radius-sm)",
                  padding: "0.8rem 1rem", marginBottom: "0.6rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.9rem", color: "var(--purple-deep)" }}>{reply.display_name}</strong>
                      <Badge tier={reply.tier_label} />
                    </div>
                    <button onClick={() => flag(post.id, reply.id)} className="btn-ghost btn" style={{ fontSize: "0.7rem", padding: "0.1em 0.5em" }}>
                      Flag
                    </button>
                  </div>
                  <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.92rem" }}>{reply.content}</p>
                </div>
              ))}

              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
                <input
                  placeholder="Write a kind reply..."
                  value={replyDrafts[post.id] || ""}
                  onChange={e => setReplyDrafts({ ...replyDrafts, [post.id]: e.target.value })}
                  style={{ flex: 1, padding: "0.6em 1em", borderRadius: 999, border: "1.5px solid #ECDCFB" }}
                />
                <button onClick={() => submitReply(post.id)} className="btn btn-gold" style={{ fontSize: "0.85rem" }}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
