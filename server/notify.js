// ─────────────────────────────────────────────────────────────────────────
// Email notifications (spec section 7.2, "Notification Settings").
// Uses Resend if RESEND_API_KEY is set. Otherwise just logs to the console
// so nothing breaks while you're still in prototype mode without an email
// provider connected.
// ─────────────────────────────────────────────────────────────────────────

async function sendEmail(to, subject, message) {
  if (!process.env.RESEND_API_KEY || !to) {
    console.log(`[notify] (no email provider configured) to ${to}: ${subject}: ${message}`);
    return { sent: false, reason: "no provider configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Teen4Teen <onboarding@resend.dev>",
        to,
        subject: `Teen4Teen: ${subject}`,
        text: message
      })
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(`[notify] Resend rejected the email (${res.status}): ${errBody}`);
    }
    return { sent: res.ok };
  } catch (err) {
    console.error("[notify] failed to send email:", err.message);
    return { sent: false, reason: err.message };
  }
}

export async function notifyAdmin(subject, message) {
  return sendEmail(process.env.ADMIN_NOTIFICATION_EMAIL, subject, message);
}

export async function notifyVolunteer(email, subject, message) {
  return sendEmail(email, subject, message);
}