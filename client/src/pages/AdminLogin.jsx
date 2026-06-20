import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Footer from "../components/Footer";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { token, email: userEmail } = await api.login(email, password);
      onLogin(token, userEmail);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "2.5rem", alignItems: "center", paddingTop: "3.5rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Teen4Teen admin access.</h1>
          <p>
            Only admins can upload podcast videos, review volunteer forms,
            guide onboarding, and moderate community conversations.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem" }}>
            <span className="icon-circle">🔒</span>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Admin login</h2>
          </div>
          <form onSubmit={submit}>
            {error && <p style={{ color: "var(--pink-deep)" }}>{error}</p>}
            <div className="field"><label>Admin email</label><input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Password</label><input required type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>Log in</button>
          </form>
          <p style={{ fontSize: "0.78rem", color: "var(--gray-soft)", textAlign: "center", marginTop: "1rem" }}>
            Admin accounts are created by the super admin only — there's no public signup, by design.
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--gray-soft)", textAlign: "center", marginTop: "0.4rem" }}>
            Dev mode default: admin@teen4teen.org / changeme123 (set in server/.env)
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
