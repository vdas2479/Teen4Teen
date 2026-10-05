import { useEffect } from "react";
import { Link } from "react-router-dom";

// Renders a value from legalConfig, or a visible yellow placeholder when it
// hasn't been filled in yet, so unfinished blanks are obvious on the live page.
export function Fill({ value, label }) {
  if (value) return <>{value}</>;
  return (
    <mark style={{
      background: "var(--amber-bg)",
      color: "#92400E",
      padding: "0.05em 0.45em",
      borderRadius: 5,
      fontWeight: 700,
      fontSize: "0.92em"
    }}>
      [{label}]
    </mark>
  );
}

export function Section({ number, title, children }) {
  return (
    <section style={{ marginTop: "2.2rem" }}>
      <h2 style={{ fontSize: "1.18rem", marginBottom: "0.7rem" }}>
        {number != null && (
          <span style={{ color: "var(--purple)", marginRight: "0.45rem" }}>{number}.</span>
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Clause({ children }) {
  return <p style={{ fontSize: "0.95rem", marginBottom: "0.9rem" }}>{children}</p>;
}

export function Bullets({ items }) {
  return (
    <ul style={{ paddingLeft: "1.2rem", margin: "0 0 1rem 0" }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: "var(--gray)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function LegalPage({ eyebrow, title, intro, effectiveDate, children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page-narrow">
      <span className="eyebrow">{eyebrow}</span>
      <h1 style={{ fontSize: "2.1rem" }}>{title}</h1>

      <p style={{ fontSize: "0.9rem", color: "var(--gray-soft)", marginTop: "-0.2rem" }}>
        Effective date: {effectiveDate} · Please read carefully before using the platform.
      </p>

      {intro && (
        <p style={{ fontSize: "0.95rem" }}>{intro}</p>
      )}

      <div className="card" style={{ marginTop: "1.6rem", padding: "1.8rem" }}>
        {children}
      </div>

      <div style={{
        display: "flex", gap: "0.8rem", flexWrap: "wrap",
        marginTop: "1.6rem", alignItems: "center"
      }}>
        <Link to="/terms" className="btn btn-secondary" style={{ fontSize: "0.85rem" }}>
          Terms of Service
        </Link>
        <Link to="/privacy" className="btn btn-secondary" style={{ fontSize: "0.85rem" }}>
          Privacy Policy
        </Link>
        <Link to="/help" className="crisis-line" style={{ marginLeft: "auto" }}>
          Need help right now? →
        </Link>
      </div>
    </div>
  );
}
