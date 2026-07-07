import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Assistant() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function askQuestion() {

    if (!question) return;

    try {

      const res = await api.post("/ask", {
        question: question,
      });

      setAnswer(res.data.answer);

    } catch (err) {

      console.log(err);

      alert("Unable to get answer");

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
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Corporate HR AI Knowledge Assistant</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary btn-sm" style={{ padding: "8px 16px", borderRadius: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* AI Chat Area */}
        <div className="glass-card p-5 mx-auto fade-in" style={{ maxWidth: "720px" }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <h2 className="fw-bold mb-2">HR AI Policy Assistant</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
              Query corporate policy documents, holiday guidelines, benefits, and conduct codes powered by RAG AI.
            </p>
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-start d-block">Your Question</label>
            <input
              type="text"
              className="form-control w-100"
              placeholder="e.g. What is the parental leave policy?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') askQuestion(); }}
            />
          </div>

          <button className="btn btn-primary w-100 mb-5 py-3" onClick={askQuestion}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            Ask Assistant
          </button>

          <h3 className="h6 text-start fw-bold mb-3" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            AI Response
          </h3>

          <div
            className="p-4 text-start"
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              minHeight: "140px",
              fontSize: "0.95rem",
              color: answer ? "var(--text-main)" : "rgba(255,255,255,0.4)"
            }}
          >
            {answer ? (
              <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted" style={{ minHeight: "90px" }}>
                <span>Ask a question above to receive an instant policy evaluation.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}