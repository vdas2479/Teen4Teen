import { useEffect, useState } from "react";
import { api } from "../../api";

// Defined outside the parent so React doesn't unmount/remount on every re-render.
function PostRow({ post, onModerate, onDelete }) {
  return (
    <div className="card" style={{ marginBottom: "0.8rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <strong>{post.display_name}</strong> · <span className="tag">{post.tier_label}</span>{" "}
          {post.flag_count > 0 && <span className="tag" style={{ background: "#FFE0E0", color: "#C0392B" }}>{post.flag_count} flag(s)</span>}
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
      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{post.content}</p>
      {post.moderator_note && <p className="note-soft" style={{ fontSize: "0.8rem" }}>Mod note: {post.moderator_note}</p>}
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

  const flagged = posts.filter(p => (p.flag_count || 0) > 0 && !p.is_hidden);
  const hidden = posts.filter(p => p.is_hidden);
  const rest = posts.filter(p => (p.flag_count || 0) === 0 && !p.is_hidden);

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
          <h3 style={{ fontSize: "1rem" }}>Flagged (review first)</h3>
          {flagged.map(p => <PostRow key={p.id} post={p} onModerate={handleModerate} onDelete={handleDelete} />)}
        </>
      )}

      <h3 style={{ fontSize: "1rem" }}>All posts</h3>
      {rest.length === 0 && <p style={{ color: "var(--gray)" }}>Nothing else to show.</p>}
      {rest.map(p => <PostRow key={p.id} post={p} onModerate={handleModerate} onDelete={handleDelete} />)}

      {hidden.length > 0 && (
        <>
          <h3 style={{ fontSize: "1rem" }}>Hidden posts</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
            These are hidden from public view but still here if you need to review, unhide, or permanently delete them.
          </p>
          {hidden.map(p => <PostRow key={p.id} post={p} onModerate={handleModerate} onDelete={handleDelete} />)}
        </>
      )}
    </div>
  );
}
