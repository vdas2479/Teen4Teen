// ─────────────────────────────────────────────────────────────────────────
// Volunteer matching algorithm (spec section 8).
// Automated suggestion, never final without admin approval.
//
// Priority order: support type match > language > timezone proximity > availability
// ─────────────────────────────────────────────────────────────────────────

function timezoneOverlapScore(seekerTz, volunteerTz) {
  if (!seekerTz || !volunteerTz) return 0;
  // crude offset-distance heuristic — replace with a real tz library if needed later
  const diff = Math.abs(parseInt(seekerTz) - parseInt(volunteerTz)) || 0;
  return Math.max(0, 12 - diff); // closer offsets score higher
}

export function rankVolunteers(meetingRequest, volunteers) {
  const wantsTherapy = meetingRequest.preferred_responder_type === "therapy" || meetingRequest.preferred_responder_type === "either";
  const wantsPeer = meetingRequest.preferred_responder_type === "peer" || meetingRequest.preferred_responder_type === "either";

  const scored = volunteers
    .filter(v => v.status === "Approved")
    .map(v => {
      let score = 0;
      const reasons = [];

      const typeMatch = (wantsTherapy && v.is_therapist) || (wantsPeer && v.is_peer_supporter);
      if (typeMatch) {
        score += 50;
        reasons.push(`Type match: ${v.is_therapist ? "Therapy volunteer" : "Peer supporter"}`);
      }

      if (meetingRequest.language && v.languages && v.languages.toLowerCase().includes(meetingRequest.language.toLowerCase())) {
        score += 30;
        reasons.push(`Language match: ${meetingRequest.language}`);
      }

      const tzScore = timezoneOverlapScore(meetingRequest.availability, v.timezone);
      score += tzScore;
      if (tzScore > 6) reasons.push(`Timezone overlap`);

      if (v.availability_hours && parseInt(v.availability_hours) > 0) {
        score += 10;
        reasons.push(`Currently available (${v.availability_hours} hrs/wk)`);
      }

      return { volunteer: v, score, rationale: reasons.join(". ") };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored;
}
