import { useEffect, useState } from "react";
import { api } from "../../api";

const initialForm = { title: "", date: "", time: "", format: "virtual", location_or_link: "", description: "" };

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState([]);
  const [form, setForm] = useState(initialForm);

  function load() { api.listWorkshops().then(d => setWorkshops(d.workshops)); }
  useEffect(load, []);

  async function submit(e) {
    e.preventDefault();
    await api.addWorkshop(form);
    setForm(initialForm);
    load();
  }

  async function del(id) { await api.deleteWorkshop(id); load(); }

  return (
    <div>
      <h2>Workshop Manager</h2>

      <form onSubmit={submit} className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
        <div className="field"><label>Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div className="field"><label>Date</label><input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
        <div className="field"><label>Time</label><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
        <div className="field">
          <label>Format</label>
          <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}>
            <option value="virtual">Virtual</option>
            <option value="in-person">In-person</option>
          </select>
        </div>
        <div className="field"><label>Location or link</label><input value={form.location_or_link} onChange={e => setForm({ ...form, location_or_link: e.target.value })} /></div>
        <div className="field"><label>Description</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <button className="btn btn-primary" type="submit">Post workshop</button>
      </form>

      {workshops.map(w => (
        <div key={w.id} className="card" style={{ marginBottom: "0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><strong>{w.title}</strong> · {w.date}</div>
          <button className="btn-ghost btn" style={{ fontSize: "0.78rem", color: "var(--rose)" }} onClick={() => del(w.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
