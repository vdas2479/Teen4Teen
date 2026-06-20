// ─────────────────────────────────────────────────────────────────────────
// Email notifications (spec section 7.2, "Notification Settings").
// Uses Resend if RESEND_API_KEY is set. Otherwise just logs to the console
// so nothing breaks while you're still in prototype mode without an email
// provider connected.
// ─────────────────────────────────────────────────────────────────────────

export async function notifyAdmin(subject, message) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!process.env.RESEND_API_KEY || !to) {
    console.log(`[notify] (no email provider configured) ${subject}: ${message}`);
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
        from: "Teen4Teen <notifications@teen4teen.org>",
        to,
        subject: `Teen4Teen: ${subject}`,
        text: message
      })
    });
    return { sent: res.ok };
  } catch (err) {
    console.error("[notify] failed to send email:", err.message);
    return { sent: false, reason: err.message };
  }
}
