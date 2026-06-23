import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function NavBar({ volunteerInfo, onVolunteerLogout }) {
  const [logoOpen, setLogoOpen] = useState(false);

  return (
    <>
      {logoOpen && (
        <div
          onClick={() => setLogoOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(36,20,51,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out"
          }}
        >
          <img
            src="/logo.png"
            alt="Teen4Teen logo"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "min(420px, 90vw)",
              maxHeight: "90vh",
              borderRadius: "50%",
              objectFit: "cover",
              width: "min(420px, 90vw)",
              height: "min(420px, 90vw)",
              boxShadow: "0 24px 80px rgba(219,39,119,0.35)",
              cursor: "default"
            }}
          />
        </div>
      )}

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            onClick={() => setLogoOpen(true)}
            title="View logo"
            style={{
              background: "none", border: "none", padding: 0, cursor: "zoom-in",
              width: 42, height: 42, borderRadius: "50%", overflow: "hidden",
              flexShrink: 0, boxShadow: "0 2px 8px rgba(219,39,119,0.25)"
            }}
          >
            <img src="/logo.png" alt="Teen4Teen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
          <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
            Teen4Teen
          </Link>
        </div>

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

          {volunteerInfo ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Link to="/volunteer-dashboard" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--purple-deep)", textDecoration: "none" }}>
                {volunteerInfo.name}
              </Link>
              <span className={`tag ${volunteerInfo.tier === "Young" ? "badge-young" : "badge-verified"}`} style={{ fontSize: "0.72rem" }}>
                {volunteerInfo.tier === "Young" ? "Young Responder" : "Verified Responder"}
              </span>
              <button
                onClick={onVolunteerLogout}
                style={{ background: "none", border: "none", color: "var(--gray)", fontSize: "0.8rem", cursor: "pointer", padding: 0 }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/volunteer-login" className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "0.6em 1.1em" }}>
              Volunteer sign-in
            </Link>
          )}

          <Link to="/help" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.6em 1.3em" }}>
            Request support
          </Link>
        </div>
      </nav>
    </header>
    </>
  );
}
