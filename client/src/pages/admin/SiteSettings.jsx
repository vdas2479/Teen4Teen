import { useState } from "react";
import { api } from "../../api";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const FIELD_META = [
  {
    key: "logo_url",
    label: "Logo image URL",
    hint: "Paste a direct image link (e.g. from Imgur or Google Drive). Leave blank to keep the default logo.",
    placeholder: "https://i.imgur.com/your-logo.png",
    type: "url",
  },
  {
    key: "instagram_url",
    label: "Instagram link",
    placeholder: "https://www.instagram.com/yourhandle",
    type: "url",
  },
  {
    key: "tiktok_url",
    label: "TikTok link",
    placeholder: "https://www.tiktok.com/@yourhandle",
    type: "url",
  },
  {
    key: "discord_url",
    label: "Discord invite link",
    placeholder: "https://discord.gg/yourcode",
    type: "url",
  },
  {
    key: "youtube_url",
    label: "YouTube channel link",
    placeholder: "https://youtube.com/@yourchannel",
    type: "url",
  },
  {
    key: "terms_url",
    label: "Terms of Service document URL",
    hint: "Paste a link to your Terms of Service PDF (e.g. a Google Drive or Dropbox link). This will appear as a clickable link in all consent checkboxes across the site.",
    placeholder: "https://drive.google.com/file/d/your-terms.pdf",
    type: "url",
  },
  {
    key: "privacy_url",
    label: "Privacy Policy document URL",
    hint: "Paste a link to your Privacy Policy PDF. Appears in consent checkboxes wherever personal data is collected.",
    placeholder: "https://drive.google.com/file/d/your-privacy.pdf",
    type: "url",
  },
];

export default function SiteSettings() {
  const { settings, refresh } = useSiteSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const values = form || settings;

  function handleChange(key, val) {
    setForm(prev => ({ ...(prev || settings), [key]: val }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      await api.updateSettings(form);
      await refresh();
      setSaved(true);
      setForm(null);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const logoPreview = values.logo_url || "/logo.png";

  return (
    <div>
      <h2>Site Settings</h2>
      <p style={{ fontSize: "0.88rem", color: "var(--gray)", marginTop: "-0.3rem", marginBottom: "1.5rem" }}>
        Change the website logo and social media links. Updates appear live for all visitors immediately after saving.
      </p>

      <form onSubmit={handleSave} style={{ maxWidth: 560 }}>

        {/* Logo preview */}
        <div style={{ marginBottom: "1.8rem" }}>
          <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.6rem" }}>Current logo</p>
          <img
            src={logoPreview}
            alt="Logo preview"
            onError={e => { e.currentTarget.src = "/logo.png"; }}
            style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--lavender)", boxShadow: "0 4px 16px rgba(219,39,119,0.15)" }}
          />
        </div>

        {FIELD_META.map(f => (
          <div key={f.key} style={{ marginBottom: "1.1rem" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.3rem" }}>
              {f.label}
            </label>
            {f.hint && <p style={{ fontSize: "0.78rem", color: "var(--gray-soft)", margin: "0 0 0.35rem" }}>{f.hint}</p>}
            <input
              type={f.type || "text"}
              value={values[f.key] || ""}
              onChange={e => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: "100%",
                padding: "0.65em 1em",
                borderRadius: 10,
                border: "1.5px solid var(--lavender)",
                fontSize: "0.88rem",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box"
              }}
            />
          </div>
        ))}

        {error && (
          <p style={{ color: "#C0392B", fontSize: "0.85rem", marginBottom: "0.8rem" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginTop: "1.4rem" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !form}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span style={{ fontSize: "0.85rem", color: "var(--purple-deep)", fontWeight: 600 }}>
              ✓ Saved! Changes are live.
            </span>
          )}
        </div>
      </form>

      <div style={{ marginTop: "2rem", padding: "1rem 1.2rem", background: "rgba(255,255,255,0.6)", borderRadius: 12, border: "1px solid var(--lavender)", maxWidth: 560 }}>
        <p style={{ fontWeight: 700, fontSize: "0.88rem", margin: "0 0 0.4rem" }}>Tip: how to get a logo URL</p>
        <p style={{ fontSize: "0.82rem", color: "var(--gray)", margin: 0, lineHeight: 1.6 }}>
          Upload your logo image to <strong>Imgur</strong> (imgur.com) — it's free and no account needed.
          Right-click the uploaded image → "Copy image address" → paste it in the Logo URL field above.
          The image should end in <code>.png</code>, <code>.jpg</code>, or <code>.webp</code>.
        </p>
      </div>
    </div>
  );
}
