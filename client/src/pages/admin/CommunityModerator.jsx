import { useEffect, useState } from "react";
import { api } from "../../api";

function ReplyRow({ reply, onHide }) {
  const flagged = (reply.flag_count || 0) > 0;
  return (
    <div style={{
      background: flagged ? "#FFF8F8" : "var(--lavender-soft)",
      border: flagged ? "1.5px solid #FBBCBC" : "1.5px solid transparent",
      borderRadius: 10,
      padding: "0.65rem 0.9rem",
      marginBottom: "0.5rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ fontSize: "0.88rem", color: "var(--purple-deep)" }}>{reply.display_name}</strong>
          <span className="tag" style={{ fontSize: "0.72rem" }}>{reply.tier_label}</span>
          {flagged && (
            <span className="tag" style={{ background: "#FFE0E0", color: "#C0392B", fontSize: "0.72rem" }}>
              🚩 {reply.flag_count} flag{reply.flag_count !== 1 ? "s" : ""}
            </span>
          )}
          {reply.is_hidden && (
            <span className="tag" style={{ background: "#E0E0E0", color: "var(--gray)", fontSize: "0.72rem" }}>Hidden</span>
          )}
        </div>
        <button
          className="btn-ghost btn"
          style={{ fontSize: "0.72rem" }}
          onClick={() => onHide(reply.id, !reply.is_hidden)}
        >
          {reply.is_hidden ? "Unhide reply" : "Hide reply"}
        </button>
      </div>
      <p style={{ margin: "0.4rem 0 0", fontSize: "0.88rem", color: reply.is_hidden ? "var(--gray)" : "var(--ink)", fontStyle: reply.is_hidden ? "italic" : "normal" }}>
        {reply.is_hidden ? "(hidden from public)" : reply.content}
      </p>
    </div>
  );
}

function PostRow({ post, onModerate, onDelete }) {
  const flaggedReplyCount = (post.replies || []).filter(r => (r.flag_count || 0) > 0).length;
  const [repliesOpen, setRepliesOpen] = useState(flaggedReplyCount > 0);

  async function handleHideReply(replyId, hide) {
    const updated = (post.replies || []).map(r =>
      r.id === replyId ? { ...r, is_hidden: hide } : r
    );
    onModerate(post.id, { replies: updated });
  }

  return (
    <div className="card" style={{ marginBottom: "0.8rem" }}>
      {/* Post header */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <strong>{post.display_name}</strong>
          <span className="tag">{post.tier_label}</span>
          {(post.flag_count || 0) > 0 && (
            <span className="tag" style={{ background: "#FFE0E0", color: "#C0392B" }}>
              🚩 {post.flag_count} flag{post.flag_count !== 1 ? "s" : ""}
            </span>
          )}
          {flaggedReplyCount > 0 && (
            <span className="tag" style={{ background: "#FFF3E0", color: "#8B4513", fontSize: "0.75rem" }}>
              ⚠️ {flaggedReplyCount} flagged repl{flaggedReplyCount !== 1 ? "ies" : "y"}
            </span>
          )}
          {post.is_pinned && <span className="tag" style={{ background: "var(--champagne)" }}>Pinned</span>}
          {post.is_hidden && <span className="tag" style={{ background: "#E0E0E0", color: "var(--gray)" }}>Hidden</span>}
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button className="btn-ghost btn" style={{ fontSize: "0.75rem" }} onClick={() => onModerate(post.id, { is_pinned: !post.is_pinned })}>
            {post.is_pinned ? "Unpin" : "Pin"}
          </button>
          <button className="btn-ghost btn" style={{ fontSize: "0.75rem" }} onClick={() => onModerate(post.id, { is_hidden: !post.is_hidden })}>
            {post.is_hidden ? "Unhide" : "Hide"}
          </button>
          <button
            className="btn-ghost btn"
            style={{ fontSize: "0.75rem", color: "#C0392B" }}
            onClick={() => onDelete(post.id, post.display_name)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Post content */}
      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: post.is_hidden ? "var(--gray)" : "var(--ink)", fontStyle: post.is_hidden ? "italic" : "normal" }}>
        {post.is_hidden ? "(post hidden from public)" : post.content}
      </p>
      {post.moderator_note && (
        <p className="note-soft" style={{ fontSize: "0.8rem" }}>Mod note: {post.moderator_note}</p>
      )}

      {/* Replies */}
      {(post.replies || []).length > 0 && (
        <div style={{ marginTop: "0.6rem" }}>
          <button
            className="btn-ghost btn"
            style={{ fontSize: "0.78rem", marginBottom: repliesOpen ? "0.6rem" : 0 }}
            onClick={() => setRepliesOpen(!repliesOpen)}
          >
            {repliesOpen ? "▲ Hide" : "▼ Show"} {post.replies.length} repl{post.replies.length !== 1 ? "ies" : "y"}
            {flaggedReplyCount > 0 && <span style={{ color: "#C0392B", marginLeft: "0.4rem" }}>({flaggedReplyCount} flagged)</span>}
          </button>
          {repliesOpen && (
            <div style={{ borderLeft: "3px solid var(--lavender)", paddingLeft: "0.9rem" }}>
              {post.replies.map(reply => (
                <ReplyRow key={reply.id} reply={reply} onHide={handleHideReply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommunityModerator() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const d = await api.listAllPosts();
      setPosts(d.posts);
    } catch (e) {
      setError(`Failed to load posts: ${e.message}`);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleModerate(id, patch) {
    try {
      await api.moderatePost(id, patch);
      await load();
    } catch (e) {
      setError(`Action failed: ${e.message}`);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Permanently delete this post by "${name}"? This cannot be undone.`)) return;
    try {
      await api.deletePost(id);
      await load();
    } catch (e) {
      setError(`Delete failed: ${e.message}`);
    }
  }

  const flagged = posts.filter(p =>
    ((p.flag_count || 0) > 0 || (p.replies || []).some(r => (r.flag_count || 0) > 0)) && !p.is_hidden
  );
  const hidden = posts.filter(p => p.is_hidden);
  const rest = posts.filter(p =>
    (p.flag_count || 0) === 0 && !(p.replies || []).some(r => (r.flag_count || 0) > 0) && !p.is_hidden
  );

  return (
    <div>
      <h2>Community Moderator</h2>

      {error && (
        <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.88rem", display: "flex", justifyContent: "space-between" }}>
          {error}
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#991B1B", cursor: "pointer", fontWeight: 700 }}>✕</button>
        </div>
      )}

      {flagged.length > 0 && (
        <>
          <h3 style={{ fontSize: "1rem" }}>Needs review — flagged content</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--gray)", marginTop: "-0.4rem", marginBottom: "0.8rem" }}>
            Flagged replies expand automatically. Hide or delete anything that violates community guidelines.
          </p>
          {flagged.map(p => <PostRow key={p.id} post={p} onModerate={handleModerate} onDelete={handleDelete} />)}
        </>
      )}

      <h3 style={{ fontSize: "1rem" }}>All posts</h3>
      {rest.length === 0 && <p style={{ color: "var(--gray)" }}>Nothing else to show.</p>}
      {rest.map(p => <PostRow key={p.id} post={p} onModerate={handleModerate} onDelete={handleDelete} />)}

      {hidden.length > 0 && (
        <>
          <h3 style={{ fontSize: "1rem" }}>Hidden posts</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--gray)", marginTop: "-0.4rem", marginBottom: "0.8rem" }}>
            Hidden from the public but still here if you need to review, restore, or permanently delete them.
          </p>
          {hidden.map(p => <PostRow key={p.id} post={p} onModerate={handleModerate} onDelete={handleDelete} />)}
        </>
      )}
    </div>
  );
}
