import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("/register", {
        username,
        email,
        password,
      });

      alert("Registration Successful! Please log in.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration Failed");
      console.log(err);
    }
  }

  return (
    <div className="page-container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="glass-card p-5 fade-in" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Company Logo / Icon Placeholder */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.25)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "1.6rem" }}>Create Account</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>Join the Feedback AI Enterprise Platform</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group mb-3 text-start">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control w-100"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3 text-start">
            <label className="form-label">Corporate Email</label>
            <input
              type="email"
              className="form-control w-100"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control w-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Already have an account? </span>
          <Link to="/" style={{ color: "var(--primary-blue)", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}