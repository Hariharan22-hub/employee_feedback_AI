from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class FeedbackIn(BaseModel):
    employee_name: Optional[str] = Field(None, description="Leave empty for anonymous feedback")
    department: str = "Unspecified"
    text: str = Field(..., min_length=3)


class FeedbackOut(BaseModel):
    id: int
    employee_name: Optional[str]
    department: str
    text: str
    sentiment: str
    sentiment_score: float
    emotion: str
    intent: str
    topic: str
    urgency: str
    summary: str
    recommendation: str
    created_at: datetime

    class Config:
        from_attributes = True


class AskIn(BaseModel):
    question: str = Field(..., min_length=3)


class AskOut(BaseModel):
    question: str
    answer: str
    source_doc: str
    confidence: float


class DashboardStats(BaseModel):
    total_feedback: int
    sentiment_distribution: dict
    topic_distribution: dict
    urgency_distribution: dict
    department_distribution: dict
    emotion_distribution: dict
    satisfaction_index: float
    high_risk_count: int


class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str