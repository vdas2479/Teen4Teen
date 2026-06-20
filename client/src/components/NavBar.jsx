import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header style={{
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid rgba(233, 213, 255, 0.6)"
    }}>
      <nav style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <span style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem"
          }}>
            T4T
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)" }}>
            Teen4Teen
          </span>
        </Link>

        <div style={{ display: "flex", gap: "1.6rem", alignItems: "center", flexWrap: "wrap" }}>
          {[
            ["/community", "Community"],
            ["/podcast", "Podcast"],
            ["/volunteer", "Volunteer"],
            ["/help", "Help"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? "var(--pink-deep)" : "var(--ink)",
                fontWeight: isActive ? 700 : 600,
                fontSize: "0.95rem",
                textDecoration: "none"
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <select aria-label="Language" defaultValue="en" style={{
            border: "1.5px solid var(--lavender)",
            borderRadius: 999,
            padding: "0.4em 0.8em",
            fontSize: "0.82rem",
            color: "var(--gray)",
            background: "white",
            fontFamily: "var(--font-body)"
          }}>
            <option value="en">English</option>
          </select>
          <Link to="/help" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.6em 1.3em" }}>
            Request support
          </Link>
        </div>
      </nav>
    </header>
  );
}
