import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from fastapi import HTTPException

# Load environment variables from standard locations (CWD, backend dir, or root dir)
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Define the Pydantic schema for structured output to ensure Gemini returns the exact required format
class FeedbackAnalysisResponse(BaseModel):
    sentiment: str = Field(description="Must be one of: Positive, Neutral, Negative")
    sentiment_score: float = Field(description="A float between -1.0 and 1.0 representing sentiment polarity")
    emotion: str = Field(description="A single word representing the dominant emotion (e.g., Joy, Anger, Sadness, Fear, Frustration, Neutral)")
    intent: str = Field(description="Must be one of: Complaint, Suggestion, Appreciation, Question, General")
    topic: str = Field(description="Must be one of: Compensation, Workload, Management, Work-Life Balance, Culture, Career Growth, Communication, Facilities, Safety/Harassment, General")
    urgency: str = Field(description="Must be one of: Low, Medium, High, Critical")
    summary: str = Field(description="A concise summary of the feedback, maximum 25 words")
    recommendation: str = Field(description="One HR recommendation based on the feedback")

# Cache the Gemini client
_client = None

def get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API Key is not configured. Please set GEMINI_API_KEY in the environment or .env file."
            )
        _client = genai.Client(api_key=api_key)
    return _client

PROMPT = """
You are an expert HR AI analyst.
Analyze the employee feedback and extract structured analysis fields.
Return ONLY valid JSON matching the schema. No markdown, no conversational text.
"""

def analyze_feedback(text: str) -> dict:
    try:
        client = get_client()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[PROMPT, f"Feedback: {text}"],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=FeedbackAnalysisResponse,
                temperature=0.1,
            )
        )
        
        # Parse the JSON response
        data = json.loads(response.text)
        
        # Verify that all keys are present
        required_keys = [
            "sentiment", "sentiment_score", "emotion", "intent", 
            "topic", "urgency", "summary", "recommendation"
        ]
        
        result = {}
        for key in required_keys:
            if key not in data:
                raise ValueError(f"Missing key in Gemini response: {key}")
            result[key] = data[key]
            
        return result
        
    except Exception as e:
        print(f"Error during Gemini analysis: {e}")
        # Raise HTTP 500 error to return backend error instead of crashing
        raise HTTPException(
            status_code=500,
            detail=f"Gemini AI Feedback analysis failed: {str(e)}"
        )