"""
AI Foundation (Phase 6) + AI Agent (Phase 7)
=============================================
A lightweight, dependency-friendly NLP pipeline that runs fully offline
(no external LLM API key required) so this project works out of the box.

Pipeline:
  text -> clean -> sentiment (VADER) -> emotion (lexicon)
       -> intent (rules) -> topic (keyword classifier)
       -> urgency (rules + sentiment) -> summary -> recommendation

To upgrade quality later: swap `analyze_feedback()` internals to call an
LLM (OpenAI/Anthropic/Ollama) with a structured-JSON prompt — the function
signature and output shape stay the same, so nothing downstream changes.
"""
import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_vader = SentimentIntensityAnalyzer()

# ---------------------------------------------------------------------------
# Lexicons / rule tables
# ---------------------------------------------------------------------------

EMOTION_KEYWORDS = {
    "Anger": ["angry", "furious", "unfair", "ridiculous", "outrageous", "sick of", "fed up", "disrespect"],
    "Frustration": ["frustrated", "annoying", "again and again", "still not fixed", "waste of time", "tired of"],
    "Sadness": ["sad", "disappointed", "let down", "demotivated", "unappreciated", "undervalued"],
    "Fear": ["worried", "afraid", "anxious", "scared", "unsafe", "nervous", "uncertain about my job"],
    "Joy": ["happy", "great", "excellent", "love", "amazing", "thankful", "grateful", "appreciate", "proud"],
}

INTENT_KEYWORDS = {
    "Complaint": ["complain", "issue", "problem", "unfair", "bad", "worst", "broken", "never works", "harassment"],
    "Suggestion": ["suggest", "recommend", "it would be great if", "could we", "propose", "idea", "what if"],
    "Appreciation": ["thank", "great job", "appreciate", "love working", "proud", "grateful", "excellent team"],
    "Question": ["?", "how do i", "what is", "when will", "can you explain"],
}

TOPIC_KEYWORDS = {
    "Compensation": ["salary", "pay", "bonus", "raise", "compensation", "wage", "paycheck"],
    "Workload": ["workload", "overtime", "burnout", "too much work", "understaffed", "deadline", "overwhelmed"],
    "Management": ["manager", "management", "supervisor", "leadership", "boss"],
    "Work-Life Balance": ["work-life", "work life", "family time", "burnout", "overworked", "personal time"],
    "Culture": ["culture", "team spirit", "inclusion", "diversity", "toxic", "respect", "morale"],
    "Career Growth": ["promotion", "growth", "career", "training", "skill development", "learning opportunities"],
    "Communication": ["communication", "transparency", "information", "updates", "kept in the dark"],
    "Facilities": ["office", "facilities", "equipment", "desk", "internet", "wifi", "cafeteria"],
    "Safety/Harassment": ["harassment", "unsafe", "bully", "discrimination", "abuse", "threat"],
}

URGENT_KEYWORDS = [
    "harassment", "discrimination", "unsafe", "threat", "abuse", "immediately",
    "urgent", "legal", "quit", "resign", "hostile",
]

RECOMMENDATION_TEMPLATES = {
    "Safety/Harassment": "Escalate to HR leadership immediately for confidential investigation; this falls under a protected-category concern.",
    "Compensation": "Route to Compensation & Benefits team for a pay-equity review within the current cycle.",
    "Workload": "Flag to department manager for a workload/staffing review; consider redistributing tasks.",
    "Management": "Schedule a 1:1 skip-level conversation; consider anonymized 360 feedback for the manager involved.",
    "Work-Life Balance": "Review team scheduling norms and after-hours expectations with the department lead.",
    "Culture": "Include in next culture/engagement survey follow-up; consider a team retrospective session.",
    "Career Growth": "Forward to L&D team to evaluate training budget and internal mobility options for this employee/team.",
    "Communication": "Recommend more frequent town-halls or written updates from leadership to close the info gap.",
    "Facilities": "Route to Facilities/IT ops as a standard ticket.",
    "General": "Log for trend analysis; no immediate action required unless it recurs.",
}


def _clean_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def _classify_sentiment(text: str):
    scores = _vader.polarity_scores(text)
    compound = scores["compound"]
    if compound >= 0.25:
        label = "Positive"
    elif compound <= -0.25:
        label = "Negative"
    else:
        label = "Neutral"
    return label, round(compound, 3)


def _classify_emotion(text: str, sentiment_score: float) -> str:
    lower = text.lower()
    best_emotion, best_hits = "Neutral", 0
    for emotion, keywords in EMOTION_KEYWORDS.items():
        hits = sum(1 for kw in keywords if kw in lower)
        if hits > best_hits:
            best_emotion, best_hits = emotion, hits
    if best_hits == 0:
        if sentiment_score >= 0.4:
            return "Joy"
        if sentiment_score <= -0.4:
            return "Frustration"
        return "Neutral"
    return best_emotion


def _classify_intent(text: str) -> str:
    lower = text.lower()
    scores = {intent: sum(1 for kw in kws if kw in lower) for intent, kws in INTENT_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "General"


def _classify_topic(text: str) -> str:
    lower = text.lower()
    scores = {topic: sum(1 for kw in kws if kw in lower) for topic, kws in TOPIC_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "General"


def _classify_urgency(text: str, sentiment_score: float, topic: str) -> str:
    lower = text.lower()
    urgent_hits = sum(1 for kw in URGENT_KEYWORDS if kw in lower)
    if topic == "Safety/Harassment" or urgent_hits >= 2:
        return "Critical"
    if urgent_hits == 1 or sentiment_score <= -0.6:
        return "High"
    if sentiment_score <= -0.25:
        return "Medium"
    return "Low"


def _summarize(text: str, max_len: int = 140) -> str:
    text = _clean_text(text)
    if len(text) <= max_len:
        return text
    # naive extractive summary: first sentence, else truncate
    first_sentence = re.split(r"(?<=[.!?])\s", text)[0]
    if len(first_sentence) <= max_len:
        return first_sentence
    return text[:max_len].rsplit(" ", 1)[0] + "…"


def _recommend(topic: str, urgency: str, intent: str) -> str:
    base = RECOMMENDATION_TEMPLATES.get(topic, RECOMMENDATION_TEMPLATES["General"])
    if urgency == "Critical":
        return f"⚠ CRITICAL: {base}"
    if intent == "Appreciation":
        return "Share with the relevant team/manager as positive recognition; no action required."
    return base


def analyze_feedback(raw_text: str) -> dict:
    """Run the feedback analysis using Google Gemini."""
    from gemini_ai import analyze_feedback as gemini_analyze_feedback
    return gemini_analyze_feedback(raw_text)

