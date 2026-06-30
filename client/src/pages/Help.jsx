import { useState } from "react";
import { api } from "../api";

const initialForm = {
  display_name: "", email: "", support_type: "not_sure",
  preferred_responder_type: "either", meeting_format: "chat", notes: "", availability: ""
};

export default function Help() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) { setForm({ ...form, [field]: value }); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.submitMeetingRequest(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2.5rem", alignItems: "flex-start" }}>
        {/* Left column */}
        <div>
          <span className="eyebrow">Help</span>
          <h1>Request a supportive meeting.</h1>
          <p>This page keeps contact details and meeting requests in one gentle, accessible place.</p>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
              <span className="icon-circle">✉️</span>
              <h3 style={{ fontSize: "1.05rem", margin: 0 }}>Contact email</h3>
            </div>
            <a href="mailto:hello@teen4teen.org">hello@teen4teen.org</a>
            <p style={{ fontSize: "0.78rem", color: "var(--gray-soft)", margin: "0.4rem 0 0 0" }}>(placeholder — update before live launch)</p>
          </div>

          <div className="note-lock" style={{ marginTop: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "1.4rem" }}>🛡️</span>
              <h3 style={{ fontSize: "1.05rem", margin: 0, color: "#5C4600" }}>Support note</h3>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#6B5300", margin: 0 }}>
              Meeting requests are designed for volunteer-led peer or therapy
              support. If you need immediate help, please{" "}
              <a href="https://www.crisistextline.org/" target="_blank" rel="noreferrer" style={{ color: "#6B5300", textDecoration: "underline" }}>
                find support here
              </a> — we care about your safety first.
            </p>
          </div>
        </div>

        {/* Right column — form */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem" }}>
            <span className="icon-circle">💌</span>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Meeting request form</h2>
          </div>

          {submitted ? (
            <div className="note-soft">
              We've got your request. Someone from our team will be in touch
              by email once we've found the right match for you.
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && <p style={{ color: "var(--pink-deep)" }}>{error}</p>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                <div className="field"><label>Display name (optional)</label><input value={form.display_name} onChange={e => update("display_name", e.target.value)} /></div>
                <div className="field"><label>Email</label><input required type="email" value={form.email} onChange={e => update("email", e.target.value)} /></div>
              </div>

              <div className="field">
                <label>What kind of support are you looking for?</label>
                <select value={form.support_type} onChange={e => update("support_type", e.target.value)}>
                  <option value="not_sure">I'm not sure yet</option>
                  <option value="someone_to_talk_to">Someone to talk to</option>
                  <option value="ongoing_support">Ongoing support</option>
                  <option value="specific_issue">Help with something specific</option>
                </select>
              </div>

              <label style={{ fontWeight: 700, fontSize: "0.88rem", display: "block", marginBottom: "0.5rem" }}>I would like to meet with:</label>
              {[
                ["therapy", "A therapy volunteer"],
                ["peer", "A teen peer supporter"],
                ["either", "Either — I'm not sure yet"],
              ].map(([val, label]) => (
                <label key={val} className={`choice-card ${form.preferred_responder_type === val ? "selected" : ""}`}>
                  <input
                    type="radio" name="responder_type" value={val}
                    checked={form.preferred_responder_type === val}
                    onChange={() => update("preferred_responder_type", val)}
                    style={{ width: "auto" }}
                  />
                  {label}
                </label>
              ))}

              <div style={{ marginTop: "0.9rem", marginBottom: "0.2rem" }}>
                <label style={{ fontWeight: 700, fontSize: "0.88rem", display: "block", marginBottom: "0.5rem" }}>How would you prefer to meet?</label>
                {[
                  ["chat", "💬 Chat — written messages at our own pace"],
                  ["call", "📞 Call — a video or phone call with my volunteer"],
                ].map(([val, label]) => (
                  <label key={val} className={`choice-card ${form.meeting_format === val ? "selected" : ""}`}>
                    <input
                      type="radio" name="meeting_format" value={val}
                      checked={form.meeting_format === val}
                      onChange={() => update("meeting_format", val)}
                      style={{ width: "auto" }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="field" style={{ marginTop: "0.8rem" }}>
                <label>Anything you'd like us to know before we match you? (optional)</label>
                <textarea rows={3} value={form.notes} onChange={e => update("notes", e.target.value)} />
              </div>
              <div className="field">
                <label>Preferred contact method and general availability</label>
                <input value={form.availability} onChange={e => update("availability", e.target.value)} placeholder="e.g. email, evenings GMT+3" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Send request</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
