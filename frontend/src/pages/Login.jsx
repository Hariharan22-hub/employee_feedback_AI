import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);

      alert("Login Successful");

      navigate("/dashboard");

    } catch (err) {

      alert("Invalid Email or Password");

      console.log(err);

    }
  }

  return (
    <div className="page-container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="glass-card p-5 fade-in" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Company Logo / Icon Placeholder */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.25)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "1.6rem" }}>Feedback AI</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>Enterprise Employee Sentiment Analytics</p>
        </div>

        <form onSubmit={login}>
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
            Sign In
          </button>
        </form>

        <div className="text-center mt-3">
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Don't have an account? </span>
          <Link to="/register" style={{ color: "var(--primary-blue)", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}