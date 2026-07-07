from pydantic import BaseModel
from typing import Optional


class FeedbackCreate(BaseModel):
    employee_name: str
    department: str
    rating: int
    feedback: str


feedback_db = []


def add_feedback(data: FeedbackCreate):
    feedback_db.append(data.dict())
    return {"message": "Feedback submitted successfully"}


def get_feedback():
    return feedback_db