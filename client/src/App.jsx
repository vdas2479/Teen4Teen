import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Podcast from "./pages/Podcast";
import VolunteerResources from "./pages/VolunteerResources";
import Help from "./pages/Help";
import Onboarding from "./pages/Onboarding";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [adminToken, setAdminToken] = useState(sessionStorage.getItem("t4t_admin_token"));
  const [adminEmail, setAdminEmail] = useState(sessionStorage.getItem("t4t_admin_email"));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  function handleLogin(token, email) {
    sessionStorage.setItem("t4t_admin_token", token);
    sessionStorage.setItem("t4t_admin_email", email);
    setAdminToken(token);
    setAdminEmail(email);
  }

  function handleLogout() {
    sessionStorage.removeItem("t4t_admin_token");
    sessionStorage.removeItem("t4t_admin_email");
    setAdminToken(null);
    setAdminEmail(null);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!isAdminRoute && <NavBar />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/volunteer" element={<VolunteerResources />} />
          <Route path="/help" element={<Help />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Unlisted admin routes — never linked from public nav, per spec */}
          <Route path="/admin" element={adminToken ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />} />
          <Route
            path="/admin/dashboard"
            element={adminToken ? <AdminDashboard adminEmail={adminEmail} onLogout={handleLogout} /> : <Navigate to="/admin" />}
          />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
