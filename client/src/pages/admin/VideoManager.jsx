import { useEffect, useState } from "react";
import { api } from "../../api";

const TAGS = ["Anxiety", "Self-Worth", "Grief", "Relationships", "Identity", "Healing", "General"];
const initialForm = { youtube_url: "", title: "", description: "", category_tag: "General" };

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);

  function load() { api.listVideos().then(d => setVideos(d.videos)); }
  useEffect(load, []);

  async function submit(e) {
    e.preventDefault();
    await api.addVideo(form);
    setForm(initialForm);
    load();
  }

  async function del(id) { await api.deleteVideo(id); load(); }

  return (
    <div>
      <h2>Video Manager</h2>

      <form onSubmit={submit} className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
        <div className="field">
          <label>YouTube URL</label>
          <input required value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
        </div>
        <div className="field">
          <label>Title</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="field">
          <label>Category</label>
          <select value={form.category_tag} onChange={e => setForm({ ...form, category_tag: e.target.value })}>
            {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Add video</button>
      </form>

      {videos.map(v => (
        <div key={v.id} className="card" style={{ marginBottom: "0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>{v.title}</strong> · <span className="tag">{v.category_tag}</span>
          </div>
          <button className="btn-ghost btn" style={{ fontSize: "0.78rem", color: "var(--rose)" }} onClick={() => del(v.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
