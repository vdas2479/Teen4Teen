import { useEffect, useState } from "react";
import { api } from "../../api";

const STATUSES = ["Pending", "In Review", "Awaiting Mock Session", "Flagged for Interview", "Approved", "Declined"];
const EMPTY_INTERVIEW = { date: "", time: "", format: "virtual", link_or_location: "", notes: "" };

export default function ApplicationInbox() {
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [scheduleFor, setScheduleFor] = useState(null);
  const [interviewForm, setInterviewForm] = useState(EMPTY_INTERVIEW);
  const [scheduling, setScheduling] = useState(false);

  function load() { api.listVolunteers(filter || undefined).then(d => setVolunteers(d.volunteers)); }
  useEffect(load, [filter]);

  async function setStatus(id, status) {
    await api.updateVolunteer(id, { status });
    load();
  }

  async function finalApprove(v) {
    await api.approveVolunteer(v.id);
    load();
    alert(`${v.name} has been approved. A confirmation email has been sent to ${v.email}.`);
  }

  function openScheduler(id) {
    setScheduleFor(scheduleFor === id ? null : id);
    setInterviewForm(EMPTY_INTERVIEW);
  }

  async function submitInterview(e, v) {
    e.preventDefault();
    if (scheduling) return;
    setScheduling(true);
    try {
      await api.scheduleInterview(v.id, interviewForm);
      alert(`Interview scheduled. An email with the details has been sent to ${v.email}.`);
      setScheduleFor(null);
      setInterviewForm(EMPTY_INTERVIEW);
    } catch (err) {
      alert(err.message);
    } finally {
      setScheduling(false);
    }
  }

  function updateForm(field, value) {
    setInterviewForm(prev => ({ ...prev, [field]: value }));
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
                    <button className="btn btn-primary" style={{ fontSize: "0.8rem" }} onClick={() => finalApprove(v)}>
                      Final approve ✓ (sends email)
                    </button>
                    <button className="btn btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Flagged for Interview")}>Flag for interview</button>
                    <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Declined")}>Decline</button>
                  </>
                )}

                {v.status === "Flagged for Interview" && (
                  <>
                    <button className="btn btn-primary" style={{ fontSize: "0.8rem" }} onClick={() => openScheduler(v.id)}>
                      {scheduleFor === v.id ? "Cancel scheduling" : "Schedule interview →"}
                    </button>
                    <button className="btn btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => finalApprove(v)}>
                      Final approve ✓ (sends email)
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Declined")}>Decline</button>
                  </>
                )}

                {(v.status === "Approved" || v.status === "Declined") && (
                  <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => setStatus(v.id, "Pending")}>
                    Reset to Pending
                  </button>
                )}
              </div>

              {scheduleFor === v.id && (
                <form onSubmit={(e) => submitInterview(e, v)} style={{ marginTop: "1rem", borderTop: "1px solid var(--lavender-soft)", paddingTop: "1rem" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)", margin: "0 0 0.8rem" }}>
                    Schedule interview with {v.name}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                    <div className="field">
                      <label>Date</label>
                      <input required type="date" value={interviewForm.date} onChange={e => updateForm("date", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Time</label>
                      <input required type="time" value={interviewForm.time} onChange={e => updateForm("time", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Format</label>
                      <select value={interviewForm.format} onChange={e => updateForm("format", e.target.value)}>
                        <option value="virtual">Virtual</option>
                        <option value="in-person">In person</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>{interviewForm.format === "in-person" ? "Location" : "Meeting link"}</label>
                      <input
                        value={interviewForm.link_or_location}
                        onChange={e => updateForm("link_or_location", e.target.value)}
                        placeholder={interviewForm.format === "in-person" ? "e.g. Room 4, Building B" : "e.g. https://meet.google.com/..."}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Message to volunteer <span style={{ fontWeight: 400, color: "var(--gray)" }}>(optional)</span></label>
                    <textarea
                      rows={2}
                      value={interviewForm.notes}
                      onChange={e => updateForm("notes", e.target.value)}
                      placeholder="Topics to cover, things to prepare, etc."
                    />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={scheduling} style={{ fontSize: "0.85rem" }}>
                    {scheduling ? "Sending…" : "Send interview invite →"}
                  </button>
                </form>
              )}

              <p style={{ fontSize: "0.78rem", color: "var(--gray)", marginTop: "0.8rem" }}>
                {v.status === "Pending" && "This volunteer can't access onboarding until you approve them for it."}
                {(v.status === "Awaiting Mock Session" || v.status === "In Review") && "\"Final approve\" emails the volunteer and marks them fully approved. Review their mock session transcript in Onboarding Tracker first."}
                {v.status === "Flagged for Interview" && "Schedule the interview to send them an email with date, time, and link. \"Final approve\" is still available if you want to skip the interview."}
                {v.status === "Approved" && "This volunteer is fully approved and will appear in match suggestions."}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
