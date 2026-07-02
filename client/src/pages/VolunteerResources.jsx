import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import ConsentCheck from "../components/ConsentCheck";
import { useSiteSettings } from "../context/SiteSettingsContext";

const initialForm = {
  name: "", email: "", country: "", age_range: "18_plus",
  is_therapist: "no", is_peer_supporter: false,
  availability_hours: "", timezone: "", languages: "", motivation: ""
};

export default function VolunteerResources() {
  const [workshops, setWorkshops] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState({ age: false, peer: false, ai: false, terms: false, privacy: false });
  const { settings } = useSiteSettings();

  function setC(key, val) { setConsent(c => ({ ...c, [key]: val })); }

  useEffect(() => { api.listWorkshops().then(d => setWorkshops(d.workshops)); }, []);

  function update(field, value) { setForm({ ...form, [field]: value }); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.submitVolunteerForm({ ...form, is_therapist: form.is_therapist === "yes" });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <span className="eyebrow">Volunteer Resources</span>
      <h1>Help create a wider circle of care.</h1>
      <p style={{ maxWidth: 600 }}>
        Post workshop links, volunteer opportunities, and apply to support
        women and teens looking for mental health access.
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/volunteer-dashboard" className="btn btn-secondary" style={{ fontSize: "0.88rem" }}>
          Already a volunteer? View your dashboard →
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem", marginTop: "2rem", alignItems: "flex-start" }}>
        {/* Workshops */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem" }}>
            <span className="icon-circle">🗓️</span>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Workshops</h2>
          </div>
          {workshops.length === 0 && <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>No workshops scheduled right now — check back soon.</p>}
          {workshops.map(w => (
            <div key={w.id} style={{ borderTop: "1px solid var(--lavender-soft)", padding: "0.9rem 0" }}>
              {w.flyer_url && (
                <img
                  src={w.flyer_url}
                  alt={`${w.title} flyer`}
                  style={{ width: "100%", borderRadius: 10, marginBottom: "0.7rem", objectFit: "cover", maxHeight: 220 }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              )}
              <h3 style={{ fontSize: "1rem", margin: 0 }}>{w.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--gray-soft)", margin: "0.2rem 0" }}>
                {w.date} · {w.time} · {w.format === "virtual" ? "Virtual" : "In-person"}
              </p>
              <p style={{ fontSize: "0.88rem", margin: "0.3rem 0" }}>{w.description}</p>
              <Link to={`/workshop/${w.id}`} style={{ fontSize: "0.88rem", fontWeight: 600 }}>View details & link →</Link>
            </div>
          ))}
        </div>

        {/* Volunteer interest form */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem" }}>Volunteer interest form</h2>

          {submitted ? (
            <div className="note-soft">
              <p style={{ margin: "0 0 0.8rem 0" }}>
                Thank you — your application is in! An admin will review it
                shortly. Once approved, you'll be able to start your short
                orientation checklist and practice conversation.
              </p>
              <Link
                to={`/onboarding?email=${encodeURIComponent(form.email)}`}
                className="btn btn-secondary"
                style={{ display: "inline-block" }}
              >
                Check your onboarding status →
              </Link>
              <p style={{ margin: "0.8rem 0 0 0", fontSize: "0.85rem" }}>
                Save this link or just come back to this page and click it
                again later — it'll let you in as soon as you're approved.
              </p>  
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && <p style={{ color: "var(--pink-deep)" }}>{error}</p>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                <div className="field"><label>Full name</label><input required value={form.name} onChange={e => update("name", e.target.value)} /></div>
                <div className="field"><label>Email</label><input required type="email" value={form.email} onChange={e => update("email", e.target.value)} /></div>
                <div className="field"><label>Country or region</label><input value={form.country} onChange={e => update("country", e.target.value)} /></div>
                <div className="field">
                  <label>Age range</label>
                  <select value={form.age_range} onChange={e => update("age_range", e.target.value)}>
                    <option value="13_17">13–17 (Young Responder)</option>
                    <option value="18_plus">18+ (Verified Responder)</option>
                  </select>
                </div>
              </div>
              <span className="field-hint" style={{ display: "block", marginTop: "-0.6rem", marginBottom: "1rem" }}>
                Volunteers must be 13 or older. No exceptions below that age.
              </span>

              <div className="field">
                <label>Are you a licensed therapist, mental health professional, or currently in training?</label>
                <select value={form.is_therapist} onChange={e => update("is_therapist", e.target.value)}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="in_training">In training</option>
                </select>
              </div>

              <label className="choice-card" style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={form.is_peer_supporter} onChange={e => update("is_peer_supporter", e.target.checked)} style={{ width: "auto" }} />
                I'm open to being a teen peer supporter, in addition to or instead of therapy volunteering
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem", marginTop: "0.6rem" }}>
                <div className="field"><label>Availability (hrs/week)</label><input value={form.availability_hours} onChange={e => update("availability_hours", e.target.value)} placeholder="e.g. 3" /></div>
                <div className="field"><label>Time zone</label><input value={form.timezone} onChange={e => update("timezone", e.target.value)} placeholder="e.g. GMT+3" /></div>
              </div>
              <div className="field"><label>Languages spoken</label><input value={form.languages} onChange={e => update("languages", e.target.value)} placeholder="e.g. English, Spanish" /></div>
              <div className="field"><label>Why do you want to volunteer with Teen4Teen?</label><textarea rows={3} value={form.motivation} onChange={e => update("motivation", e.target.value)} /></div>

              <div style={{ marginTop: "1.2rem", marginBottom: "0.5rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.6rem" }}>Before you apply, please confirm:</p>
                <ConsentCheck checked={consent.age} onChange={v => setC("age", v)}>
                  I confirm I am {form.age_range === "13_17" ? "13 years of age or older" : "18 years of age or older"}.
                </ConsentCheck>
                <ConsentCheck checked={consent.peer} onChange={v => setC("peer", v)}>
                  I understand Teen4Teen is a peer support platform, not a clinical or crisis service.
                </ConsentCheck>
                <ConsentCheck checked={consent.ai} onChange={v => setC("ai", v)}>
                  I understand my application may include an AI-powered practice session for evaluation purposes.
                </ConsentCheck>
                <ConsentCheck checked={consent.terms} onChange={v => setC("terms", v)}>
                  I agree to the{" "}
                  {settings.terms_url
                    ? <a href={settings.terms_url} target="_blank" rel="noreferrer" style={{ color: "var(--pink-deep)", fontWeight: 600 }}>Terms of Service</a>
                    : <span style={{ color: "var(--gray)" }}>Terms of Service <em>(coming soon)</em></span>}.
                </ConsentCheck>
                <ConsentCheck checked={consent.privacy} onChange={v => setC("privacy", v)}>
                  I agree to the{" "}
                  {settings.privacy_url
                    ? <a href={settings.privacy_url} target="_blank" rel="noreferrer" style={{ color: "var(--pink-deep)", fontWeight: 600 }}>Privacy Policy</a>
                    : <span style={{ color: "var(--gray)" }}>Privacy Policy <em>(coming soon)</em></span>}.
                </ConsentCheck>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Submit application</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
