const SOCIALS = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/t4t.international?igsh=ZXh5NnhleTl3ejVo&utm_source=qr",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@t4t.international",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: "Discord",
    url: "https://discord.gg/3WRC3AauS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8.5 14.5s-.5 1 1.5 1 2-1 2-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M20 7s-2-2-5-2.5l-.5 1S12 5 10 5.5L9.5 4.5C6.5 5 4.5 7 4.5 7S2.5 10.5 3 15c0 0 1.5 2 4 2.5l.8-1.5S7 16 7 15.5c.5.2 1.2.5 2 .5h2c1.5 0 2.5-.5 2.5-.5 0 .5-.3 1-.3 1s.5-.2 1-.5l1-1.5c2.5-.5 4-2.5 4-2.5.5-4.5-1.2-8-1.2-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="9.5" cy="12" r="1" fill="currentColor"/>
        <circle cx="14.5" cy="12" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@t4t.international?si=uBrld5cex-HaGEGE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 9.5l5 2.5-5 2.5V9.5Z" fill="currentColor"/>
      </svg>
    )
  },
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

        <p style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "0.9rem", fontSize: "0.92rem" }}>
          Follow Teen4Teen
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Teen4Teen on ${s.label}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                padding: "0.55em 1.1em",
                borderRadius: 999,
                background: "white",
                border: "1.5px solid #ECDCFB",
                color: "var(--purple-deep)",
                textDecoration: "none",
                fontSize: "0.82rem",
                fontWeight: 600,
                transition: "background 0.15s, border-color 0.15s, transform 0.15s",
                boxShadow: "0 2px 8px rgba(147,51,234,0.07)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--lavender-soft)"; e.currentTarget.style.borderColor = "var(--pink)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#ECDCFB"; e.currentTarget.style.transform = "none"; }}
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
