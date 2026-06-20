const SOCIALS = [
  { label: "Instagram", handle: "@teen4teen", url: "https://instagram.com/teen4teen" },
  { label: "TikTok", handle: "@teen4teen", url: "https://tiktok.com/@teen4teen" },
  { label: "Discord", handle: "Teen4Teen community", url: "https://discord.gg/teen4teen" },
  { label: "YouTube", handle: "Teen4Teen", url: "https://youtube.com/@teen4teen" },
];

export default function Footer() {
  return (
    <footer style={{
      marginTop: "3rem",
      padding: "2.2rem 1.5rem",
      borderTop: "1px solid rgba(233, 213, 255, 0.6)",
      background: "rgba(255,255,255,0.5)"
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "1rem", marginBottom: "1.4rem"
        }}>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ink)" }}>
              Mental health support, without the barriers.
            </p>
            <p style={{ margin: "0.4em 0 0 0" }}>
              <a href="/help" className="crisis-line">If you need immediate help, find support here →</a>
            </p>
          </div>
        </div>

        <p style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "0.7rem", fontSize: "0.92rem" }}>
          Follow Teen4Teen
        </p>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="chip" style={{ textDecoration: "none" }}>
              {s.label}: {s.handle}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
