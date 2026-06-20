import { useEffect, useState } from "react";
import { api } from "../../api";

export default function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.overview().then(setStats); }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    ["Pending Applications", stats.pending_applications],
    ["New Meeting Requests", stats.new_meeting_requests],
    ["Flagged Posts", stats.flagged_posts],
    ["Total Volunteers", stats.total_volunteers],
  ];

  return (
    <div>
      <h2>Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {cards.map(([label, value]) => (
          <div key={label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--rose)" }}>{value}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--gray)" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
