import { Link } from "react-router-dom";
import Decor from "../components/Decor";

const HERO_IMAGE = "https://t3.ftcdn.net/jpg/03/40/51/60/360_F_340516098_Uu3oFe0ccMaefp1pTAJsUg0KyEBKH4ub.jpg";

const TILES = [
  { to: "/community", emoji: "💬", title: "Community", desc: "A shared space to ask, listen, and be heard — from people who get it." },
  { to: "/podcast", emoji: "🎧", title: "Podcast", desc: "Short videos on anxiety, grief, identity, and everything in between." },
  { to: "/volunteer", emoji: "🤝", title: "Volunteer Resources", desc: "Give your time. Workshops, opportunities, and how to get started." },
  { to: "/help", emoji: "💌", title: "Help", desc: "Ready to talk to someone? Tell us a little, and we'll find the right person." },
];

const RESOURCES = [
  { name: "Crisis Text Line (US/UK)", url: "https://www.crisistextline.org/" },
  { name: "iCall (India)", url: "https://icallhelpline.org/" },
  { name: "7 Cups", url: "https://www.7cups.com/" },
  { name: "WHO Mental Health Atlas", url: "https://www.who.int/teams/mental-health-and-substance-use/data-research/mental-health-atlas" },
  { name: "Open Counseling", url: "https://www.opencounseling.com/" },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="page" style={{ paddingTop: "3rem", overflow: "hidden" }}>
        <Decor variant="hero" />
        <div style={{
          position: "relative", zIndex: 1,
          display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "3rem", alignItems: "center"
        }}>
          <div>
            <span className="chip">🌍 Women supporting women across borders</span>
            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", marginTop: "1rem" }}>
              Gentle mental health support for young women who deserve care now.
            </h1>
            <p style={{ fontSize: "1.05rem", maxWidth: 480 }}>
              Teen4Teen connects under-resourced young women and teen girls with
              compassionate volunteer supporters for honest, judgment-free conversations.
            </p>
            <div style={{ display: "flex", gap: "0.9rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <Link to="/help" className="btn btn-primary">Request support →</Link>
              <Link to="/community" className="btn btn-secondary">Join the community</Link>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "var(--radius-lg)", overflow: "hidden",
              border: "6px solid white", boxShadow: "var(--shadow-soft)"
            }}>
              <img
                src={HERO_IMAGE}
                alt="Diverse women from different cultures, representing cross-border sisterhood"
                style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "1rem 1.2rem", background: "white" }}>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
                  Safe, warm, and volunteer-led.
                </strong>
                <p style={{ margin: "0.3em 0 0 0", fontSize: "0.88rem" }}>
                  Built to grow into resources, matching, and partner workshops over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 0 }}>
        {/* About */}
        <section style={{ marginTop: "1rem", maxWidth: 680 }}>
          <span className="eyebrow">Who we are</span>
          <h2>What Teen4Teen is</h2>
          <p>
            A free space for women and teen girls who have never had an easy way
            to talk to someone about how they're really doing. Maybe therapy was
            never affordable. Maybe it was never available where you live. Maybe
            nobody ever told you it was okay to ask.
          </p>
          <p>
            Here, you can read, watch, post, or request a one-on-one conversation
            with a volunteer who's been trained to listen well — a licensed
            professional donating their time, or a fellow teen trained as a peer
            supporter. There's no pressure to know exactly what you need before
            you show up.
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Teen4Teen isn't a crisis line or a replacement for emergency care.
            If you're in immediate danger, please use the resources below — we
            want you safe first, always.
          </p>
        </section>

        {/* Quick access tiles */}
        <section style={{ marginTop: "2.8rem" }}>
          <span className="eyebrow">Find your way around</span>
          <h2 style={{ marginBottom: "1.2rem" }}>Where would you like to go?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.1rem" }}>
            {TILES.map(tile => (
              <div key={tile.to} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <span className="icon-circle">{tile.emoji}</span>
                <h3 style={{ fontSize: "1.15rem", margin: 0 }}>{tile.title}</h3>
                <p style={{ margin: 0, fontSize: "0.92rem", flexGrow: 1 }}>{tile.desc}</p>
                <Link to={tile.to} className="btn btn-secondary" style={{ alignSelf: "flex-start", fontSize: "0.82rem", padding: "0.5em 1.1em" }}>
                  Go there →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Resources panel */}
        <section style={{ marginTop: "2.8rem" }}>
          <span className="eyebrow">Right now</span>
          <h2 style={{ marginBottom: "1.2rem" }}>A few places that can help today</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.9rem" }}>
            {RESOURCES.map(r => (
              <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="card" style={{ textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)" }}>
                {r.name}
              </a>
            ))}
          </div>
        </section>

        {/* Age notice */}
        <section style={{ marginTop: "2.8rem" }}>
          <div className="note-soft">
            This platform is designed for ages 13 and up. If you're under 13,
            please talk to a trusted adult, or visit a{" "}
            <a href="https://kidshelpphone.ca/" target="_blank" rel="noreferrer" style={{ color: "#6B5300", textDecoration: "underline" }}>
              child-appropriate support resource
            </a>.
          </div>
        </section>
      </div>
    </div>
  );
}
