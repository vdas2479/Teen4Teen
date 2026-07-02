import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function WorkshopDetail() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const rsvpRef = useRef(null);

  useEffect(() => {
    api.listWorkshops().then(d => {
      const w = d.workshops.find(w => w.id === id);
      if (w) setWorkshop(w);
      else setNotFound(true);
    });
  }, [id]);

  async function handleRsvp(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.rsvpWorkshop(id, form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (notFound) {
    return (
      <div className="page-narrow" style={{ textAlign: "center", paddingTop: "3rem" }}>
        <p style={{ color: "var(--gray)" }}>This workshop couldn't be found.</p>
        <Link to="/volunteer" className="btn btn-secondary" style={{ display: "inline-block", marginTop: "1rem" }}>← Back to Volunteer Resources</Link>
      </div>
    );
  }

  if (!workshop) {
    return <div className="page-narrow"><p style={{ color: "var(--gray)" }}>Loading…</p></div>;
  }

  const isVirtual = workshop.format === "virtual";

  return (
    <div className="page-narrow" style={{ maxWidth: 680 }}>
      <Link to="/volunteer" style={{ fontSize: "0.88rem", color: "var(--gray-soft)", textDecoration: "none", display: "inline-block", marginBottom: "1.2rem" }}>
        ← Back to Volunteer Resources
      </Link>

      {/* CTA button — scrolls to RSVP form */}
      <button
        className="btn btn-primary"
        style={{ display: "flex", width: "100%", justifyContent: "center", marginBottom: "1.5rem", fontSize: "1rem" }}
        onClick={() => rsvpRef.current?.scrollIntoView({ behavior: "smooth" })}
      >
        {isVirtual ? "Register to attend online →" : "Sign up to attend in person →"}
      </button>

      {/* Flyer image */}
      {workshop.flyer_url && (
        <img
          src={workshop.flyer_url}
          alt={`${workshop.title} flyer`}
          style={{ width: "100%", borderRadius: 14, marginBottom: "1.8rem", objectFit: "contain", maxHeight: 500, background: "var(--lavender-soft)" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}

      {/* Event details card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <span className="eyebrow">{isVirtual ? "Virtual workshop" : "In-person event"}</span>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{workshop.title}</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem 2rem", marginBottom: workshop.description ? "1.2rem" : 0 }}>
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gray-soft)", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</p>
            <p style={{ margin: 0, fontWeight: 600 }}>{workshop.date}</p>
          </div>
          {workshop.time && (
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gray-soft)", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Time</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{workshop.time}</p>
            </div>
          )}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gray-soft)", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Format</p>
            <p style={{ margin: 0, fontWeight: 600 }}>{isVirtual ? "Virtual (online)" : "In-person"}</p>
          </div>
          {workshop.location_or_link && (
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gray-soft)", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {isVirtual ? "Meeting link" : "Location"}
              </p>
              {isVirtual ? (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--gray)" }}>Shared after registration</p>
              ) : (
                <p style={{ margin: 0, fontSize: "0.88rem" }}>{workshop.location_or_link}</p>
              )}
            </div>
          )}
        </div>

        {workshop.description && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid var(--lavender-soft)", margin: "1rem 0" }} />
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{workshop.description}</p>
          </>
        )}
      </div>

      {/* RSVP form */}
      <div ref={rsvpRef} className="card">
        <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>
          {isVirtual ? "Register for this workshop" : "Sign up to attend"}
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--gray)", marginTop: "-0.4rem" }}>
          {isVirtual
            ? "Register below and we'll send you the link to join."
            : "Let us know you're coming so we can plan for your attendance."}
        </p>

        {submitted ? (
          <div className="note-soft">
            <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>You're registered! 🎉</p>
            {isVirtual && workshop.location_or_link ? (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Here's your link to join on the day:{" "}
                <a href={workshop.location_or_link} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
                  Click to join →
                </a>
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>We look forward to seeing you there.</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleRsvp}>
            {error && (
              <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 8, padding: "0.6em 0.9em", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <div className="field">
                <label>Your name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="First name or nickname" />
              </div>
              <div className="field">
                <label>Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="we'll only use this for this event" />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: "100%", justifyContent: "center" }}>
              {submitting ? "Registering…" : isVirtual ? "Register & get the link →" : "Sign me up →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
