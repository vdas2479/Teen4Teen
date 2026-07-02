import { useEffect, useState } from "react";
import { api } from "../../api";

const initialForm = { title: "", date: "", time: "", format: "virtual", location_or_link: "", description: "", flyer_url: "" };

function WorkshopForm({ value, onChange, onSubmit, submitLabel, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="field"><label>Title</label><input required value={value.title} onChange={e => onChange({ ...value, title: e.target.value })} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <div className="field"><label>Date</label><input required type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} /></div>
        <div className="field"><label>Time</label><input type="time" value={value.time} onChange={e => onChange({ ...value, time: e.target.value })} /></div>
      </div>
      <div className="field">
        <label>Format</label>
        <select value={value.format} onChange={e => onChange({ ...value, format: e.target.value })}>
          <option value="virtual">Virtual</option>
          <option value="in-person">In-person</option>
        </select>
      </div>
      <div className="field"><label>Location or link</label><input value={value.location_or_link} onChange={e => onChange({ ...value, location_or_link: e.target.value })} placeholder="e.g. https://meet.google.com/..." /></div>
      <div className="field"><label>Description</label><textarea rows={2} value={value.description} onChange={e => onChange({ ...value, description: e.target.value })} /></div>
      <div className="field">
        <label>Flyer image URL <span style={{ fontWeight: 400, color: "var(--gray)" }}>(optional)</span></label>
        <input value={value.flyer_url || ""} onChange={e => onChange({ ...value, flyer_url: e.target.value })} placeholder="Paste a link to your flyer image (Google Drive, Canva, Imgur…)" />
        <span className="field-hint">Tip: in Google Drive, open the image → Share → "Anyone with the link" → copy the link.</span>
      </div>
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [rsvps, setRsvps] = useState({});
  const [expandedRsvps, setExpandedRsvps] = useState(null);

  function load() { api.listWorkshops().then(d => setWorkshops(d.workshops)); }
  useEffect(load, []);

  async function loadRsvps(workshopId) {
    if (expandedRsvps === workshopId) { setExpandedRsvps(null); return; }
    const d = await api.getWorkshopRsvps(workshopId);
    setRsvps(prev => ({ ...prev, [workshopId]: d.rsvps }));
    setExpandedRsvps(workshopId);
  }

  async function add(e) {
    e.preventDefault();
    await api.addWorkshop(form);
    setForm(initialForm);
    load();
  }

  function startEdit(w) {
    setEditingId(w.id);
    setEditForm({ title: w.title, date: w.date, time: w.time || "", format: w.format, location_or_link: w.location_or_link || "", description: w.description || "", flyer_url: w.flyer_url || "" });
  }

  async function saveEdit(e) {
    e.preventDefault();
    await api.updateWorkshop(editingId, editForm);
    setEditingId(null);
    setEditForm(null);
    load();
  }

  async function del(id) {
    if (!window.confirm("Delete this workshop? This cannot be undone.")) return;
    await api.deleteWorkshop(id);
    load();
  }

  return (
    <div>
      <h2>Workshop Manager</h2>

      <div className="card" style={{ marginBottom: "1.5rem", maxWidth: 520 }}>
        <h3 style={{ fontSize: "1rem", marginTop: 0 }}>Add a new workshop</h3>
        <WorkshopForm value={form} onChange={setForm} onSubmit={add} submitLabel="Post workshop" />
      </div>

      {workshops.length === 0 && <p style={{ color: "var(--gray)" }}>No workshops yet.</p>}

      {workshops.map(w => (
        <div key={w.id} className="card" style={{ marginBottom: "0.7rem" }}>
          {editingId === w.id ? (
            <>
              <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.8rem" }}>Editing: {w.title}</p>
              <WorkshopForm value={editForm} onChange={setEditForm} onSubmit={saveEdit} submitLabel="Save changes" onCancel={() => setEditingId(null)} />
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <div>
                  <strong>{w.title}</strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--gray-soft)", marginLeft: "0.5rem" }}>
                    {w.date}{w.time ? ` · ${w.time}` : ""} · {w.format === "virtual" ? "Virtual" : "In-person"}
                  </span>
                  {w.description && <p style={{ fontSize: "0.83rem", color: "var(--gray)", margin: "0.3rem 0 0" }}>{w.description}</p>}
                  {w.location_or_link && <p style={{ fontSize: "0.82rem", margin: "0.2rem 0 0" }}><a href={w.location_or_link} target="_blank" rel="noreferrer">Link →</a></p>}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button className="btn-ghost btn" style={{ fontSize: "0.78rem" }} onClick={() => loadRsvps(w.id)}>
                    {expandedRsvps === w.id ? "Hide sign-ups" : "See sign-ups"}
                  </button>
                  <button className="btn-ghost btn" style={{ fontSize: "0.78rem" }} onClick={() => startEdit(w)}>Edit</button>
                  <button className="btn-ghost btn" style={{ fontSize: "0.78rem", color: "#C0392B" }} onClick={() => del(w.id)}>Delete</button>
                </div>
              </div>

              {expandedRsvps === w.id && (
                <div style={{ marginTop: "0.8rem", borderTop: "1px solid var(--lavender-soft)", paddingTop: "0.8rem" }}>
                  {(rsvps[w.id] || []).length === 0 ? (
                    <p style={{ fontSize: "0.85rem", color: "var(--gray)", margin: 0 }}>No sign-ups yet.</p>
                  ) : (
                    <>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--purple-deep)" }}>
                        {rsvps[w.id].length} {rsvps[w.id].length === 1 ? "person" : "people"} signed up
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 1rem" }}>
                        {rsvps[w.id].map(r => (
                          <div key={r.id} style={{ fontSize: "0.83rem", padding: "0.3rem 0", borderBottom: "1px solid var(--lavender-soft)" }}>
                            <strong>{r.name}</strong> · <span style={{ color: "var(--gray-soft)" }}>{r.email}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
