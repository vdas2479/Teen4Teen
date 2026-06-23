import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function VolunteerLogin({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function switchMode(next) {
    setMode(next);
    setError("");
    setPassword("");
    setPassword2("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (mode === "register" && password !== password2) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const data = mode === "login"
        ? await api.volunteerLogin({ email, password })
        : await api.volunteerRegister({ email, password });
      onLogin(data.token, {
        volunteer_id: data.volunteer_id,
        name: data.name,
        tier: data.tier,
        status: data.status
      });
      navigate("/volunteer-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <span className="eyebrow">Volunteer Area</span>
      <h1>{mode === "login" ? "Sign in to your volunteer account" : "Create your volunteer account"}</h1>

      {mode === "register" && (
        <div className="note-soft" style={{ marginBottom: "1.5rem" }}>
          You can create an account once your application has been approved for onboarding.
          Use the same email address you applied with.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: "1rem" }}>
        {error && (
          <p style={{ color: "var(--pink-deep)", background: "#FEE2E2", borderRadius: 8, padding: "0.6em 0.9em", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}

        <div className="field">
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="The email you applied with"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={mode === "register" ? "Choose a password (at least 8 characters)" : "Your password"}
            minLength={mode === "register" ? 8 : 1}
          />
        </div>

        {mode === "register" && (
          <div className="field">
            <label>Confirm password</label>
            <input
              required
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: "0.4rem" }}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
        </button>

        <div style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.9rem", color: "var(--gray)" }}>
          {mode === "login" ? (
            <>
              First time?{" "}
              <button type="button" style={{ background: "none", border: "none", color: "var(--pink-deep)", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "0.9rem" }} onClick={() => switchMode("register")}>
                Create your account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" style={{ background: "none", border: "none", color: "var(--pink-deep)", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "0.9rem" }} onClick={() => switchMode("login")}>
                Sign in
              </button>
            </>
          )}
        </div>
      </form>

      <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--gray-soft)", textAlign: "center" }}>
        Haven't applied yet? <Link to="/volunteer">Apply to volunteer →</Link>
      </p>
    </div>
  );
}
