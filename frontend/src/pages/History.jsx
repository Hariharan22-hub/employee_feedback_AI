import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function History() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  async function loadFeedbacks() {
    try {
      const res = await api.get("/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Helper to determine sentiment badge class
  function getSentimentBadge(sentiment) {
    const s = sentiment?.toLowerCase();
    if (s === "positive") return "badge badge-success";
    if (s === "negative") return "badge badge-danger";
    return "badge badge-warning";
  }

  // Helper to determine urgency badge class
  function getUrgencyBadge(urgency) {
    const u = urgency?.toLowerCase();
    if (u === "critical" || u === "high") return "badge badge-danger";
    if (u === "medium") return "badge badge-warning";
    return "badge badge-success";
  }

  // Helper to determine emotion badge class
  function getEmotionBadge(emotion) {
    return "badge badge-info";
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
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Feedback History & Insights</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary btn-sm" style={{ padding: "8px 16px", borderRadius: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Feedback History Card */}
        <div className="glass-card p-4 fade-in">
          <div className="mb-4">
            <h2 className="fw-bold mb-2">Submitted Feedback Directory</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
              Below is the ledger of all submitted employee feedback entries processed by our sentiment analysis engine.
            </p>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th style={{ minWidth: "200px" }}>Feedback</th>
                  <th>Sentiment</th>
                  <th>Emotion</th>
                  <th>Topic</th>
                  <th>Urgency</th>
                  <th style={{ minWidth: "180px" }}>Summary</th>
                  <th style={{ minWidth: "180px" }}>Recommendation</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length > 0 ? (
                  feedbacks.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.employee_name || <span className="text-muted">Anonymous</span>}</td>
                      <td>{item.department}</td>
                      <td style={{ fontSize: "0.88rem", whiteSpace: "normal" }}>{item.text}</td>
                      <td>
                        <span className={getSentimentBadge(item.sentiment)}>
                          {item.sentiment}
                        </span>
                      </td>
                      <td>
                        <span className={getEmotionBadge(item.emotion)}>
                          {item.emotion}
                        </span>
                      </td>
                      <td><span className="badge" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>{item.topic}</span></td>
                      <td>
                        <span className={getUrgencyBadge(item.urgency)}>
                          {item.urgency}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{item.summary}</td>
                      <td style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{item.recommendation}</td>
                      <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-muted">
                      No feedback entries found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}