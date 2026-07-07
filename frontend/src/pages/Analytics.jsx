import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Analytics() {

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await api.get("/feedback");
    setFeedbacks(res.data);
  }

  const positive = feedbacks.filter(
    f => f.sentiment === "Positive"
  ).length;

  const negative = feedbacks.filter(
    f => f.sentiment === "Negative"
  ).length;

  const neutral = feedbacks.filter(
    f => f.sentiment === "Neutral"
  ).length;

  const critical = feedbacks.filter(
    f => f.urgency === "Critical"
  ).length;

  const high = feedbacks.filter(
    f => f.urgency === "High"
  ).length;

  const medium = feedbacks.filter(
    f => f.urgency === "Medium"
  ).length;

  const low = feedbacks.filter(
    f => f.urgency === "Low"
  ).length;

  const total = feedbacks.length;

  // Percentage calculations helper
  function getPercent(value) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
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
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Executive Analytics & Sentiment Trends</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary btn-sm" style={{ padding: "8px 16px", borderRadius: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Statistic Cards Grid */}
        <div className="row g-4 mb-5">
          {/* Card 1: Total Feedback */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Total Feedback</p>
                  <h3 className="display-6 fw-bold mt-1 mb-0">{total}</h3>
                </div>
                <div className="d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>Aggregated organization entries</p>
            </div>
          </div>

          {/* Card 2: Positive Sentiment */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>😊 Positive</p>
                  <h3 className="display-6 fw-bold mt-1 mb-0" style={{ color: "var(--success)" }}>{positive}</h3>
                </div>
                <div className="d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(34, 197, 94, 0.1)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                </div>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{getPercent(positive)}% of total responses</p>
            </div>
          </div>

          {/* Card 3: Neutral Sentiment */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>😐 Neutral</p>
                  <h3 className="display-6 fw-bold mt-1 mb-0" style={{ color: "var(--warning)" }}>{neutral}</h3>
                </div>
                <div className="d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{getPercent(neutral)}% of total responses</p>
            </div>
          </div>

          {/* Card 4: Negative Sentiment */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>😡 Negative</p>
                  <h3 className="display-6 fw-bold mt-1 mb-0" style={{ color: "var(--danger)" }}>{negative}</h3>
                </div>
                <div className="d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.1)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
                </div>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{getPercent(negative)}% of total responses</p>
            </div>
          </div>
        </div>

        {/* Breakdown Panels */}
        <div className="row g-4">
          {/* Sentiment Analysis Panel */}
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 h-100">
              <h3 className="h5 fw-bold mb-4">Sentiment Breakdown</h3>
              
              {/* Positive progress */}
              <div className="mb-3 text-start">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.9rem" }}>
                  <span>Positive Sentiment</span>
                  <span className="fw-bold">{getPercent(positive)}%</span>
                </div>
                <div className="progress" style={{ height: "10px", background: "var(--input-bg)", borderRadius: "10px", overflow: "hidden" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${getPercent(positive)}%`, 
                      background: "var(--success)", 
                      height: "100%", 
                      borderRadius: "10px",
                      transition: "width 0.6s ease" 
                    }}
                  />
                </div>
              </div>

              {/* Neutral progress */}
              <div className="mb-3 text-start">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.9rem" }}>
                  <span>Neutral Sentiment</span>
                  <span className="fw-bold">{getPercent(neutral)}%</span>
                </div>
                <div className="progress" style={{ height: "10px", background: "var(--input-bg)", borderRadius: "10px", overflow: "hidden" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${getPercent(neutral)}%`, 
                      background: "var(--warning)", 
                      height: "100%", 
                      borderRadius: "10px",
                      transition: "width 0.6s ease" 
                    }}
                  />
                </div>
              </div>

              {/* Negative progress */}
              <div className="mb-3 text-start">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.9rem" }}>
                  <span>Negative Sentiment</span>
                  <span className="fw-bold">{getPercent(negative)}%</span>
                </div>
                <div className="progress" style={{ height: "10px", background: "var(--input-bg)", borderRadius: "10px", overflow: "hidden" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${getPercent(negative)}%`, 
                      background: "var(--danger)", 
                      height: "100%", 
                      borderRadius: "10px",
                      transition: "width 0.6s ease" 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Urgency Panel */}
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 h-100">
              <h3 className="h5 fw-bold mb-4">Urgency Levels</h3>
              
              <div className="d-flex flex-column gap-3">
                {/* Low urgency */}
                <div className="d-flex justify-content-between align-items-center p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge badge-success" style={{ width: "24px", height: "24px", padding: 0, justifyContent: "center", borderRadius: "50%" }}>L</span>
                    <span style={{ fontSize: "0.95rem" }}>Low Priority</span>
                  </div>
                  <span className="fw-bold h6 m-0">{low} entries</span>
                </div>

                {/* Medium urgency */}
                <div className="d-flex justify-content-between align-items-center p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge badge-warning" style={{ width: "24px", height: "24px", padding: 0, justifyContent: "center", borderRadius: "50%" }}>M</span>
                    <span style={{ fontSize: "0.95rem" }}>Medium Priority</span>
                  </div>
                  <span className="fw-bold h6 m-0">{medium} entries</span>
                </div>

                {/* High urgency */}
                <div className="d-flex justify-content-between align-items-center p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge badge-danger" style={{ width: "24px", height: "24px", padding: 0, justifyContent: "center", borderRadius: "50%" }}>H</span>
                    <span style={{ fontSize: "0.95rem" }}>High Priority</span>
                  </div>
                  <span className="fw-bold h6 m-0">{high} entries</span>
                </div>

                {/* Critical urgency */}
                <div className="d-flex justify-content-between align-items-center p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge badge-danger" style={{ width: "24px", height: "24px", padding: 0, justifyContent: "center", borderRadius: "50%", background: "var(--danger)", color: "white" }}>C</span>
                    <span style={{ fontSize: "0.95rem", color: "var(--danger)", fontWeight: "600" }}>🚨 Critical Alerts</span>
                  </div>
                  <span className="fw-bold h6 m-0" style={{ color: "var(--danger)" }}>{critical} entries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}