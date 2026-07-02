import { useEffect, useState } from "react";
import { api } from "../../api";

const TAGS = ["Anxiety", "Self-Worth", "Grief", "Relationships", "Identity", "Healing", "General"];
const initialForm = { youtube_url: "", title: "", creator: "", description: "", category_tag: "General" };

function VideoForm({ value, onChange, onSubmit, submitLabel, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label>YouTube URL</label>
        <input required value={value.youtube_url} onChange={e => onChange({ ...value, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
      </div>
      <div className="field">
        <label>Title</label>
        <input required value={value.title} onChange={e => onChange({ ...value, title: e.target.value })} />
      </div>
      <div className="field">
        <label>Creator / channel name</label>
        <input value={value.creator || ""} onChange={e => onChange({ ...value, creator: e.target.value })} placeholder="e.g. Kati Morton" />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={2} value={value.description} onChange={e => onChange({ ...value, description: e.target.value })} />
      </div>
      <div className="field">
        <label>Category</label>
        <select value={value.category_tag} onChange={e => onChange({ ...value, category_tag: e.target.value })}>
          {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  function load() { api.listVideos().then(d => setVideos(d.videos)); }
  useEffect(load, []);

  async function add(e) {
    e.preventDefault();
    await api.addVideo(form);
    setForm(initialForm);
    load();
  }

  function startEdit(v) {
    setEditingId(v.id);
    setEditForm({ youtube_url: v.youtube_url, title: v.title, creator: v.creator || "", description: v.description || "", category_tag: v.category_tag });
  }

  async function saveEdit(e) {
    e.preventDefault();
    await api.updateVideo(editingId, editForm);
    setEditingId(null);
    setEditForm(null);
    load();
  }

  async function del(id) {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    await api.deleteVideo(id);
    load();
  }

  return (
    <div>
      <h2>Video Manager</h2>

      <div className="card" style={{ marginBottom: "1.5rem", maxWidth: 520 }}>
        <h3 style={{ fontSize: "1rem", marginTop: 0 }}>Add a new video</h3>
        <VideoForm value={form} onChange={setForm} onSubmit={add} submitLabel="Add video" />
      </div>

      {videos.length === 0 && <p style={{ color: "var(--gray)" }}>No videos yet.</p>}

      {videos.map(v => (
        <div key={v.id} className="card" style={{ marginBottom: "0.7rem" }}>
          {editingId === v.id ? (
            <>
              <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.8rem" }}>Editing: {v.title}</p>
              <VideoForm value={editForm} onChange={setEditForm} onSubmit={saveEdit} submitLabel="Save changes" onCancel={() => setEditingId(null)} />
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
              <div>
                <strong>{v.title}</strong>
                {v.creator && <span style={{ fontSize: "0.82rem", color: "var(--gray-soft)", marginLeft: "0.5rem" }}>by {v.creator}</span>}
                <span className="tag" style={{ marginLeft: "0.5rem" }}>{v.category_tag}</span>
                {v.description && <p style={{ fontSize: "0.83rem", color: "var(--gray)", margin: "0.3rem 0 0" }}>{v.description}</p>}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <button className="btn-ghost btn" style={{ fontSize: "0.78rem" }} onClick={() => startEdit(v)}>Edit</button>
                <button className="btn-ghost btn" style={{ fontSize: "0.78rem", color: "#C0392B" }} onClick={() => del(v.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
