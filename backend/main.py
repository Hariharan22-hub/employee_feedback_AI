"""
Employee Feedback AI Agent — Backend
======================================
FastAPI app tying together: database (Phase 4), AI agent pipeline
(Phase 6+7), RAG knowledge base (Phase 8), and analytics (Phase 9).

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Docs:
    http://localhost:8000/docs  (Swagger UI, auto-generated)
"""
from collections import Counter
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session

import ai_agent
import rag
from database import Feedback, KBQuery, User, SessionLocal, get_db, init_db
from schemas import (
    AskIn,
    AskOut,
    DashboardStats,
    FeedbackIn,
    FeedbackOut,
    UserRegister,
    UserLogin,
    Token,
)
from users import create_user, authenticate_user
from security import create_access_token
from auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from feedback import FeedbackCreate, add_feedback, get_feedback

app = FastAPI(
    title="Employee Feedback AI Agent",
    description="AI-powered employee feedback analysis, HR policy Q&A, and analytics.",
    version="1.0.0",
)

import os

# Secure CORS configurations for production deployments
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Match Vercel deployment URLs and Render URLs dynamically
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()

# ---------------------------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------------------------

@app.post("/api/register")
def register(payload: UserRegister, db: Session = Depends(get_db)):
    user = create_user(
        db=db,
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message": "User registered successfully"
    }


@app.post("/api/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    print("=" * 50)
    print("USERNAME:", form_data.username)
    print("PASSWORD:", form_data.password)
    print("=" * 50)

    user = authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

# ---------------------------------------------------------------------------
# Feedback endpoints (Phase 3 + 6 + 7)
# ---------------------------------------------------------------------------

@app.post("/api/feedback", response_model=FeedbackOut)
def submit_feedback(
    payload: FeedbackIn,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    analysis = ai_agent.analyze_feedback(payload.text)

    record = Feedback(
        employee_name=payload.employee_name,
        department=payload.department or "Unspecified",
        text=payload.text,
        **analysis,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/api/feedback", response_model=List[FeedbackOut])
def list_feedback(
    department: str | None = None,
    urgency: str | None = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(Feedback)
    if department:
        query = query.filter(Feedback.department == department)
    if urgency:
        query = query.filter(Feedback.urgency == urgency)
    return query.order_by(Feedback.created_at.desc()).limit(limit).all()


@app.get("/api/feedback/{feedback_id}", response_model=FeedbackOut)
def get_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return record


@app.delete("/api/feedback/{feedback_id}")
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(record)
    db.commit()
    return {"detail": "deleted"}


# ---------------------------------------------------------------------------
# RAG / Knowledge Base endpoint (Phase 8)
# ---------------------------------------------------------------------------

@app.post("/api/ask", response_model=AskOut)
def ask_policy_question(payload: AskIn, db: Session = Depends(get_db)):
    result = rag.answer_question(payload.question)

    db.add(KBQuery(question=payload.question, answer=result["answer"], source_doc=result["source_doc"]))
    db.commit()

    return AskOut(question=payload.question, **result)


# ---------------------------------------------------------------------------
# Dashboard / Analytics (Phase 9)
# ---------------------------------------------------------------------------

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    records = db.query(Feedback).all()
    total = len(records)

    sentiment_dist = Counter(r.sentiment for r in records)
    topic_dist = Counter(r.topic for r in records)
    urgency_dist = Counter(r.urgency for r in records)
    dept_dist = Counter(r.department for r in records)
    emotion_dist = Counter(r.emotion for r in records)

    if total:
        avg_score = sum(r.sentiment_score for r in records) / total
        satisfaction_index = round((avg_score + 1) / 2 * 100, 1)  # map [-1,1] -> [0,100]
    else:
        satisfaction_index = 0.0

    high_risk = sum(1 for r in records if r.urgency in ("High", "Critical"))

    return DashboardStats(
        total_feedback=total,
        sentiment_distribution=dict(sentiment_dist),
        topic_distribution=dict(topic_dist),
        urgency_distribution=dict(urgency_dist),
        department_distribution=dict(dept_dist),
        emotion_distribution=dict(emotion_dist),
        satisfaction_index=satisfaction_index,
        high_risk_count=high_risk,
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Define a custom SPA StaticFiles handler to allow React SPA routing to function on page refresh
class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            response = await super().get_response(path, scope)
            if response.status_code == 404:
                if not (path.startswith("api") or path.startswith("docs") or path.startswith("openapi.json") or path.startswith("redoc")):
                    return FileResponse(os.path.join(self.directory, "index.html"))
            return response
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                if path.startswith("api") or path.startswith("docs") or path.startswith("openapi.json") or path.startswith("redoc"):
                    raise ex
                return FileResponse(os.path.join(self.directory, "index.html"))
            raise ex

# Resolve absolute path to the frontend build directory relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

if os.path.exists(FRONTEND_DIR):
    app.mount("/", SPAStaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
else:
    # Fallback to local source directory for development if build folder does not exist
    LOCAL_FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")
    app.mount("/", SPAStaticFiles(directory=LOCAL_FRONTEND_DIR, html=True), name="frontend")

# Trigger reload comment to pick up frontend/dist after build
