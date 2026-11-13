export default function Chapter() {
  return (
    <div className="page">
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <span className="eyebrow">Chapter</span>
        <h1>Start a Teen4Teen chapter at your school.</h1>
        <p style={{ fontSize: "1.05rem", maxWidth: "720px" }}>
          Are you a teenager seeking to start a Teen4Teen chapter at your own school? ALL the information you will need is below!
        </p>

        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.9rem" }}>
            <span className="icon-circle">📘</span>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Chapter guide</h2>
          </div>

          <p style={{ margin: "0 0 1rem 0" }}>
            This guide walks through how to build a Teen4Teen chapter, recruit volunteers, and launch a school-based support circle in a thoughtful, safe way.
          </p>

          <a
            href="https://docs.google.com/document/d/1A5yPfKGdBaH1-qkbzfQdYauspT_T7tliiMk_mF8KTZQ/edit?tab=t.0"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            Open the chapter guide →
          </a>
        </div>

        <div className="note-soft" style={{ marginTop: "1.5rem" }}>
          If you're dreaming up a Teen4Teen chapter, this resource is meant to give you the foundation, structure, and next steps to get started.
        </div>
      </div>
    </div>
  );
}
