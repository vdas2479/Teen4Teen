import { useEffect, useState } from "react";
import { api } from "../api";

const TAGS = ["All", "Anxiety", "Self-Worth", "Grief", "Relationships", "Identity", "Healing", "General"];

function youtubeId(url) {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function Podcast() {
  const [videos, setVideos] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listVideos().then(d => setVideos(d.videos)).finally(() => setLoading(false));
  }, []);

  const filtered = activeTag === "All" ? videos : videos.filter(v => v.category_tag === activeTag);

  return (
    <div className="page">
      <span className="eyebrow">Podcast</span>
      <h1>A soft video library for mental health conversations.</h1>
      <p style={{ maxWidth: 560 }}>Browse admin-approved videos selected for supportive teen and women's mental health conversations.</p>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", margin: "1.4rem 0 2rem" }}>
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`btn ${activeTag === tag ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.82rem", padding: "0.5em 1.1em" }}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.4rem" }}>
          {!loading && filtered.length === 0 && <p style={{ color: "var(--gray)" }}>No videos in this category yet.</p>}
          {filtered.map(video => {
            const id = youtubeId(video.youtube_url);
            return (
              <div key={video.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                {id ? (
                  <iframe
                    width="100%" height="190"
                    src={`https://www.youtube.com/embed/${id}`}
                    title={video.title}
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                  />
                ) : (
                  <div style={{ height: 190, background: "var(--lavender-soft)" }} />
                )}
                <div style={{ padding: "1.1rem" }}>
                  <span className="tag">{video.category_tag}</span>
                  <h3 style={{ fontSize: "1.05rem", margin: "0.5rem 0 0.3rem" }}>{video.title}</h3>
                  <p style={{ fontSize: "0.88rem", margin: 0 }}>{video.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="note-lock">
          <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>🔒</div>
          <h3 style={{ fontSize: "1.1rem", color: "#5C4600" }}>Admin-managed videos</h3>
          <p style={{ fontSize: "0.88rem", color: "#6B5300", margin: 0 }}>
            Only Teen4Teen admins can add podcast videos, so the library stays
            safe, supportive, and relevant. No outside contributors can upload here.
          </p>
        </div>
      </div>
    </div>
  );
}
