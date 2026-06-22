import { useEffect, useState } from "react";
import { api } from "../../api";

export default function CommunityModerator() {
  const [posts, setPosts] = useState([]);

  function load() { api.listAllPosts().then(d => setPosts(d.posts)); }
  useEffect(load, []);

  async function moderate(id, patch) { await api.moderatePost(id, patch); load(); }
  async function del(id) { await api.deletePost(id); load(); }

  const flagged = posts.filter(p => (p.flag_count || 0) > 0 && !p.is_hidden);
  const hidden = posts.filter(p => p.is_hidden);
  const rest = posts.filter(p => (p.flag_count || 0) === 0 && !p.is_hidden);

  function PostRow({ post }) {
    return (
      <div className="card" style={{ marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <strong>{post.display_name}</strong> · <span className="tag">{post.tier_label}</span>{" "}
            {post.flag_count > 0 && <span className="tag" style={{ background: "#FFE0E0", color: "var(--rose)" }}>{post.flag_count} flag(s)</span>}
            {post.is_pinned && <span className="tag" style={{ background: "var(--champagne)" }}>Pinned</span>}
            {post.is_hidden && <span className="tag" style={{ background: "#E0E0E0", color: "var(--gray)" }}>Hidden</span>}
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button className="btn-ghost btn" style={{ fontSize: "0.75rem" }} onClick={() => moderate(post.id, { is_pinned: !post.is_pinned })}>
              {post.is_pinned ? "Unpin" : "Pin"}
            </button>
            <button className="btn-ghost btn" style={{ fontSize: "0.75rem" }} onClick={() => moderate(post.id, { is_hidden: !post.is_hidden })}>
              {post.is_hidden ? "Unhide" : "Hide"}
            </button>
            <button className="btn-ghost btn" style={{ fontSize: "0.75rem", color: "var(--rose)" }} onClick={() => del(post.id)}>
              Delete
            </button>
          </div>
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{post.content}</p>
        {post.moderator_note && <p className="note-soft" style={{ fontSize: "0.8rem" }}>Mod note: {post.moderator_note}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Community Moderator</h2>
      {flagged.length > 0 && (
        <>
          <h3 style={{ fontSize: "1rem" }}>Flagged (review first)</h3>
          {flagged.map(p => <PostRow key={p.id} post={p} />)}
        </>
      )}
      <h3 style={{ fontSize: "1rem" }}>All posts</h3>
      {rest.length === 0 && <p style={{ color: "var(--gray)" }}>Nothing else to show.</p>}
      {rest.map(p => <PostRow key={p.id} post={p} />)}

      {hidden.length > 0 && (
        <>
          <h3 style={{ fontSize: "1rem" }}>Hidden posts</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
            These are hidden from public view but still here if you need to review, unhide, or permanently delete them.
          </p>
          {hidden.map(p => <PostRow key={p.id} post={p} />)}
        </>
      )}
    </div>
  );
}