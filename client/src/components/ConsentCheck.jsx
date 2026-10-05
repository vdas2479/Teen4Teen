// Shown when a form is blocked because required consent boxes are unticked.
export function ConsentHint({ show }) {
  if (!show) return null;
  return (
    <p style={{
      fontSize: "0.82rem",
      color: "var(--amber)",
      fontWeight: 600,
      margin: "0.1rem 0 0.7rem 0"
    }}>
      Please tick every box above to continue.
    </p>
  );
}

export default function ConsentCheck({ checked, onChange, children }) {
  return (
    <label style={{
      display: "flex",
      gap: "0.65rem",
      alignItems: "flex-start",
      cursor: "pointer",
      padding: "0.55rem 0.7rem",
      borderRadius: 8,
      background: checked ? "rgba(233,213,255,0.25)" : "transparent",
      border: `1.5px solid ${checked ? "var(--lavender)" : "#E5E7EB"}`,
      marginBottom: "0.55rem",
      fontSize: "0.87rem",
      lineHeight: 1.5,
      color: "var(--ink)",
      transition: "background 0.15s, border-color 0.15s"
    }}>
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: "auto", marginTop: "0.15rem", flexShrink: 0, accentColor: "var(--pink-deep)" }}
      />
      <span>{children}</span>
    </label>
  );
}
