import { useEffect, useState } from "react";
import { api } from "../../api";

const STATUSES = ["Pending", "In Review", "Awaiting Mock Session", "Flagged for Interview", "Approved", "Declined"];

export default function ApplicationInbox() {
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  function load() { api.listVolunteers(filter || undefined).then(d => setVolunteers(d.volunteers)); }
  useEffect(load, [filter]);

  async function setStatus(id, status) {
    await api.updateVolunteer(id, { status });
    load();
  }

  return (
    <div>
      <h2>Application Inbox</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button className={`btn ${filter === "" ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter("")} style={{ fontSize: "0.8rem" }}>All</button>
        {STATUSES.map(s => (
          <button key={s} className={`btn ${filter === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(s)} style={{ fontSize: "0.8rem" }}>{s}</button>
        ))}
      </div>

      {volunteers.length === 0 && <p style={{ color: "var(--gray)" }}>No applications match this filter.</p>}

      {volunteers.map(v => (
        <div key={v.id} className="card" style={{ marginBottom: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <strong>{v.name}</strong> · {v.email} ·{" "}
              <span className="tag">{v.volunteer_tier === "Young" ? "Young Responder" : "Verified Responder"}</span>{" "}
              <span className="tag" style={{ background: "var(--lavender)", color: "var(--purple)" }}>{v.status}</span>
            </div>
            <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="btn-ghost btn" style={{ fontSize: "0.78rem" }}>
              {expanded === v.id ? "Collapse" : "View details"}
            </button>
          </div>

          {expanded === v.id && (
            <div style={{ marginTop: "0.8rem", fontSize: "0.9rem" }}>
              <p><strong>Country:</strong> {v.country || "—"}</p>
              <p><strong>Therapist / professional:</strong> {v.is_therapist ? "Yes" : "No"}</p>
              <p><strong>Open to peer support:</strong> {v.is_peer_supporter ? "Yes" : "No"}</p>
              <p><strong>Languages:</strong> {v.languages || "—"}</p>
              <p><strong>Availability:</strong> {v.availability_hours || "—"} hrs/wk, {v.timezone || "—"}</p>
              <p><strong>Motivation:</strong> {v.motivation || "—"}</p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.8rem" }}>
                {v.status === "Pending" && (
                  <>
                    <button className="btn btn-primary" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Awaiting Mock Session")}>
                      Approve for onboarding →
                    </button>
                    <button className="btn btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Flagged for Interview")}>Flag for interview</button>
                    <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Declined")}>Decline</button>
                  </>
                )}

                {(v.status === "Awaiting Mock Session" || v.status === "In Review") && (
                  <>
                    <button className="btn btn-primary" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Approved")}>
                      Final approve ✓
                    </button>
                    <button className="btn btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Flagged for Interview")}>Flag for interview</button>
                    <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Declined")}>Decline</button>
                  </>
                )}

                {(v.status === "Approved" || v.status === "Declined" || v.status === "Flagged for Interview") && (
                  <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Pending")}>
                    Reset to Pending
                  </button>
                )}
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--gray)", marginTop: "0.6rem" }}>
                {v.status === "Pending" && "This volunteer can't access onboarding (checklist/mock session) until you approve them for it."}
                {(v.status === "Awaiting Mock Session" || v.status === "In Review") && "This volunteer can now access onboarding. \"Final approve\" should happen after you've reviewed their mock session transcript in Onboarding Tracker."}
                {v.status === "Approved" && "This volunteer is fully approved and can appear in match suggestions."}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
