import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

const CHECKLIST = [
  { title: "Active listening", body: "Your job is to hold space, not fix things." },
  { title: "Trauma-informed language", body: "A short list of what to say, and what never to say, will be shared with you by email." },
  { title: "Cultural humility", body: "You may be talking to someone from a very different background. Ask, don't assume." },
  { title: "Recognizing a crisis", body: "Know how to identify when something is beyond your scope, and redirect gently to professional resources." },
  { title: "Volunteer self-care", body: "You can't pour from an empty cup. Protect your own wellbeing too." },
];

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const [stage, setStage] = useState("lookup");
  const [volunteerId, setVolunteerId] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [tier, setTier] = useState("Verified");
  const [checked, setChecked] = useState([]);
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [autoLookupTried, setAutoLookupTried] = useState(false);

  useEffect(() => {
    const emailFromLink = searchParams.get("email");
    if (emailFromLink && !autoLookupTried) {
      setAutoLookupTried(true);
      lookupByEmail(emailFromLink);
    }
  }, []);

  async function lookupByEmail(emailToFind) {
    const { volunteers } = await api.listVolunteers();
    const match = volunteers.find(v => v.email === emailToFind);
    if (!match) {
      alert("We couldn't find an application with that email. Make sure you've submitted the Volunteer Interest Form first.");
      return;
    }

    if (match.status === "Pending") {
      alert("Thanks for applying! Your application is still being reviewed by an admin. We'll let you know by email once you're approved to start onboarding.");
      return;
    }
    if (match.status === "Declined") {
      alert("It looks like this application wasn't approved to move forward. If you think this is a mistake, please reach out via the Help tab.");
      return;
    }
    if (match.status === "Flagged for Interview") {
      alert("Your application needs a quick conversation with an admin before continuing. They'll be in touch to schedule that.");
      return;
    }

    setVolunteerId(match.id);
    setTier(match.volunteer_tier);
    setStage("checklist");
  }

  async function findApplication(e) {
    e.preventDefault();
    await lookupByEmail(email);
  }

  async function finishChecklist() {
    await api.completeChecklist(volunteerId);
    const { opening_message, notice } = await api.startMockSession({ volunteer_id: volunteerId, tier });
    alert(notice);
    setHistory([{ role: "persona", content: opening_message }]);
    setStage("session");
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const newHistory = [...history, { role: "volunteer", content: draft.trim() }];
    setHistory(newHistory);
    setDraft("");
    setSending(true);
    try {
      const { reply } = await api.sendMockMessage({ tier, history: newHistory, message: draft.trim() });
      setHistory([...newHistory, { role: "persona", content: reply }]);
    } finally {
      setSending(false);
    }
  }

  async function finishSession() {
    await api.completeMockSession(volunteerId, history);
    setStage("done");
  }

  return (
    <div className="page-narrow">
      <h1>Volunteer Onboarding</h1>

      {stage === "lookup" && (
        <form onSubmit={findApplication} className="card">
          <p>Enter the email you used on the Volunteer Interest Form to continue your onboarding.</p>
          <div className="field">
            <label>Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit">Continue</button>
        </form>
      )}

      {stage === "checklist" && (
        <div className="card">
          <h2>Orientation Checklist</h2>
          <p style={{ color: "var(--gray)" }}>Short, scannable, practical. Not a course.</p>
          {CHECKLIST.map((item, i) => (
            <label key={item.title} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", margin: "0.8rem 0" }}>
              <input
                type="checkbox"
                style={{ marginTop: "0.3rem", width: "auto" }}
                checked={checked.includes(i)}
                onChange={() => setChecked(checked.includes(i) ? checked.filter(c => c !== i) : [...checked, i])}
              />
              <span><strong>{item.title}.</strong> {item.body}</span>
            </label>
          ))}
          <button
            className="btn btn-primary"
            disabled={checked.length < CHECKLIST.length}
            onClick={finishChecklist}
            style={{ marginTop: "1rem", opacity: checked.length < CHECKLIST.length ? 0.5 : 1 }}
          >
            I've read this — start the practice session
          </button>
        </div>
      )}

      {stage === "session" && (
        <div className="card">
          <h2>AI Mock Session</h2>
          <p className="note-soft">
            This is a simulated conversation with an AI designed to reflect real
            interactions on Teen4Teen. Your responses will be reviewed by an
            admin as part of your application. Please engage as you would in a
            real session — honestly and with care.
          </p>
          <div style={{ maxHeight: 360, overflowY: "auto", margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {history.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "volunteer" ? "flex-end" : "flex-start",
                background: m.role === "volunteer" ? "var(--pink)" : "var(--lavender)",
                color: m.role === "volunteer" ? "white" : "var(--purple-deep)",
                borderRadius: 14, padding: "0.6em 1em", maxWidth: "75%"
              }}>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Type your response..."
              style={{ flex: 1, padding: "0.6em 0.9em", borderRadius: 10, border: "1.5px solid var(--lavender)" }}
            />
            <button className="btn btn-primary" type="submit" disabled={sending}>Send</button>
          </form>
          {history.filter(m => m.role === "volunteer").length >= 4 && (
            <button onClick={finishSession} className="btn btn-secondary" style={{ marginTop: "1rem" }}>
              End session and submit for review
            </button>
          )}
        </div>
      )}

      {stage === "done" && (
        <div className="note-soft">
          Thank you — your transcript has been submitted for admin review. We'll
          email you once a decision has been made.
        </div>
      )}
    </div>
  );
}