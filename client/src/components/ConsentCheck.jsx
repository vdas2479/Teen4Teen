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
