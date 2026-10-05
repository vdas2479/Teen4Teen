import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

const PAGES = {
  terms: { path: "/terms", label: "Terms of Service", settingKey: "terms_url" },
  privacy: { path: "/privacy", label: "Privacy Policy", settingKey: "privacy_url" },
};

const linkStyle = { color: "var(--pink-deep)", fontWeight: 600 };

// Links to the on-site policy page, unless an admin has pasted an external
// document URL in Site Settings — then that takes over.
export default function PolicyLink({ doc }) {
  const { settings } = useSiteSettings();
  const { path, label, settingKey } = PAGES[doc];
  const override = settings[settingKey];

  if (override) {
    return <a href={override} target="_blank" rel="noreferrer" style={linkStyle}>{label}</a>;
  }

  return <Link to={path} target="_blank" rel="noreferrer" style={linkStyle}>{label}</Link>;
}
