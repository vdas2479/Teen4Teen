import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const SiteSettingsContext = createContext(null);

const DEFAULTS = {
  logo_url: "",
  instagram_url: "https://www.instagram.com/t4t.international?igsh=ZXh5NnhleTl3ejVo&utm_source=qr",
  tiktok_url: "https://www.tiktok.com/@t4t.international",
  discord_url: "https://discord.gg/3WRC3AauS",
  youtube_url: "https://youtube.com/@t4t.international?si=uBrld5cex-HaGEGE"
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  async function refresh() {
    try {
      const data = await api.getSettings();
      setSettings({ ...DEFAULTS, ...data });
    } catch (_) {}
  }

  useEffect(() => { refresh(); }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
