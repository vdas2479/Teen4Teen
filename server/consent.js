// ─────────────────────────────────────────────────────────────────────────
// Consent audit trail.
//
// The consent tickboxes on the public forms are enforced in the browser, which
// means that on their own they leave no evidence behind: once the page reloads,
// there is no record that anyone agreed to anything. This records it.
//
// We store the wording VERBATIM rather than a list of checkbox ids, so the
// exact text a person saw stays recoverable years later even after the forms
// have been reworded. terms_version pins which Terms were in force at the time.
//
// Note: this records consent, it does not yet enforce it server-side. A crafted
// request that skips the tickboxes is still accepted (and simply recorded with
// no consent). Enforcing it is a deliberate separate step — turning it on
// requires the client and server to be deployed together, or every submission
// would be rejected by a newer server talking to an older built frontend.
// ─────────────────────────────────────────────────────────────────────────

import * as db from "./db.js";

// Cap on stored wording. The real forms are well under this; the limit only
// stops an untrusted client from stuffing the database with a huge payload.
const MAX_CONSENT_TEXT = 4000;

// Returns a trimmed, length-capped string, or null if the value is unusable.
function cleanString(value, max) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

// Stores one consent record for a submission, or returns null if the request
// carried no consent wording (e.g. an approved volunteer, who is never asked).
export async function recordConsent(req, { subject_type, subject_id, email }) {
  const consent_text = cleanString(req.body?.consent_text, MAX_CONSENT_TEXT);
  if (!consent_text) return null;

  return db.insert("consent_records", {
    subject_type,
    subject_id: subject_id || null,
    email: email || null,
    consent_text,
    terms_version: cleanString(req.body?.terms_version, 100),
    ip_address: req.ip || null,
    user_agent: cleanString(req.headers["user-agent"], 500)
  });
}
