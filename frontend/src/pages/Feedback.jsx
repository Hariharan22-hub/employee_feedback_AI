import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Feedback() {

  const [employee_name, setEmployee] = useState("");
  const [department, setDepartment] = useState("");
  const [text, setText] = useState("");

  async function submitFeedback(e) {

    e.preventDefault();

    try {

      await api.post("/feedback", {
        employee_name,
        department,
        text
      });

      alert("Feedback Submitted Successfully");

      setEmployee("");
      setDepartment("");
      setText("");

    } catch (err) {

      console.log(err);

      alert("Submission Failed");

    }

  }

  return (
    <div className="page-container fade-in" style={{ minHeight: "100vh" }}>
      <div className="container py-4">
        {/* Top Navbar */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              <h1 className="h3 m-0 fw-bold" style={{ letterSpacing: "-0.03em" }}>Feedback AI</h1>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Submit Employee Feedback</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary btn-sm" style={{ padding: "8px 16px", borderRadius: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass-card p-5 mx-auto fade-in" style={{ maxWidth: "680px" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Submit Feedback</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Provide constructive employee feedback. AI will automatically evaluate sentiment, intent, emotion, and urgency.
            </p>
          </div>

          <form onSubmit={submitFeedback}>
            <div className="form-group mb-3 text-start">
              <label className="form-label">Employee Name</label>
              <input
                type="text"
                className="form-control w-100"
                placeholder="Leave blank for anonymous or enter name"
                value={employee_name}
                onChange={(e) => setEmployee(e.target.value)}
              />
            </div>

            <div className="form-group mb-3 text-start">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control w-100"
                placeholder="e.g. Engineering, Sales, HR"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4 text-start">
              <label className="form-label">Feedback</label>
              <textarea
                className="form-control w-100"
                rows="6"
                placeholder="Describe the employee feedback in detail (minimum 3 characters)..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Feedback Analysis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}