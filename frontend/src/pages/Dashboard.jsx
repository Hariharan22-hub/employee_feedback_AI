import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="page-container fade-in" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="container py-4">
        {/* Top Navbar */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              <h1 className="h3 m-0 fw-bold" style={{ letterSpacing: "-0.03em" }}>Feedback AI</h1>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Enterprise HR Control Panel</p>
          </div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="btn btn-danger btn-sm" style={{ padding: "8px 16px", borderRadius: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Logout
            </button>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="row g-4 justify-content-center">
          {/* Card 1: HR Assistant */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                </div>
                <h3 className="h5 fw-bold mb-2">🤖 HR Assistant</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", minHeight: "44px", margin: 0 }}>
                  Ask company HR policies using AI
                </p>
              </div>
              <Link to="/assistant" className="mt-4" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary w-100">Ask AI</button>
              </Link>
            </div>
          </div>

          {/* Card 2: Submit Feedback */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </div>
                <h3 className="h5 fw-bold mb-2">📝 Submit Feedback</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", minHeight: "44px", margin: 0 }}>
                  Submit employee feedback for AI analysis
                </p>
              </div>
              <Link to="/feedback" className="mt-4" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary w-100">Submit Feedback</button>
              </Link>
            </div>
          </div>

          {/* Card 3: Feedback History */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </div>
                <h3 className="h5 fw-bold mb-2">📋 Feedback History</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", minHeight: "44px", margin: 0 }}>
                  View previous employee feedback and AI analysis
                </p>
              </div>
              <Link to="/history" className="mt-4" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary w-100">Feedback History</button>
              </Link>
            </div>
          </div>

          {/* Card 4: Analytics */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                </div>
                <h3 className="h5 fw-bold mb-2">📊 Analytics</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", minHeight: "44px", margin: 0 }}>
                  View employee sentiment analytics
                </p>
              </div>
              <Link to="/analytics" className="mt-4" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary w-100">Analytics</button>
              </Link>
            </div>
          </div>

          {/* Card 5: Logout */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between" style={{ border: "1px dashed rgba(239, 68, 68, 0.3)" }}>
              <div>
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </div>
                <h3 className="h5 fw-bold mb-2" style={{ color: "var(--danger)" }}>🚪 Logout</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", minHeight: "44px", margin: 0 }}>
                  Securely terminate your current agent dashboard session
                </p>
              </div>
              <Link to="/" className="mt-4" style={{ textDecoration: "none" }}>
                <button className="btn btn-danger w-100">Logout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}