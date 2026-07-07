"""
Database layer — SQLAlchemy models + session management.
Uses SQLite for zero-config local/demo use. Swap SQLALCHEMY_DATABASE_URL
for a Postgres DSN in production (see docs/README.md).
"""
from datetime import datetime

from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./feedback_agent.db")

# Standardize deprecated postgres:// scheme to postgresql:// for SQLAlchemy compatibility
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, nullable=True)       # nullable -> supports anonymous
    department = Column(String, index=True, default="Unspecified")
    text = Column(Text, nullable=False)

    # AI Agent outputs (Phase 7)
    sentiment = Column(String)          # Positive / Negative / Neutral
    sentiment_score = Column(Float)     # -1.0 .. 1.0
    emotion = Column(String)            # Joy / Anger / Sadness / Fear / Frustration / Neutral
    intent = Column(String)             # Complaint / Suggestion / Appreciation / Question / General
    topic = Column(String)              # Management / Compensation / Workload / etc.
    urgency = Column(String)            # Low / Medium / High / Critical
    summary = Column(Text)
    recommendation = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="employee")    


class KBQuery(Base):
    """Log of RAG (Phase 8) policy questions, useful for later analytics."""
    __tablename__ = "kb_queries"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text)
    source_doc = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
