# Architecture

## Request flow — submitting feedback

```
Browser (frontend/app.js)
   │  POST /api/feedback  { employee_name, department, text }
   ▼
FastAPI route (backend/main.py: submit_feedback)
   │
   ▼
ai_agent.analyze_feedback(text)          # Phase 6 + 7
   │  clean → sentiment (VADER) → emotion (lexicon)
   │  → intent (rules) → topic (keyword classifier)
   │  → urgency (rules) → summary → recommendation
   ▼
SQLAlchemy Feedback record persisted (backend/database.py)   # Phase 4
   │
   ▼
JSON response → rendered in the "Submit Feedback" result box
```

## Request flow — HR policy question (RAG)

```
Browser                      POST /api/ask { question }
   ▼
FastAPI route (ask_policy_question)
   ▼
rag.answer_question(question)             # Phase 8
   │  TF-IDF vectorize question
   │  → cosine similarity vs. pre-indexed policy chunks
   │  → top matching chunk(s) + source document
   ▼
KBQuery logged to DB (for future analytics)
   ▼
JSON { answer, source_doc, confidence } → rendered in "Ask HR Policy" tab
```

## Dashboard (Phase 9)

`GET /api/dashboard/stats` aggregates all stored `Feedback` rows in-process
(Python `Counter`) and returns distributions for sentiment, topic, urgency,
department, and emotion, plus a derived `satisfaction_index` (0-100, mapped
from average sentiment score) and `high_risk_count` (High + Critical urgency
records). The frontend renders these as Chart.js doughnut charts.

## Why rule-based NLP instead of an LLM?

This project is meant to run immediately, without requiring anyone to bring
an API key or GPU. VADER + keyword classifiers give reasonable, explainable
results for short feedback text and are fast/free/offline. The code is
structured so `ai_agent.analyze_feedback()` and `rag.answer_question()` are
the only two functions you'd need to change to plug in a real LLM — see the
docstrings at the top of `backend/ai_agent.py` and `backend/rag.py`.

## Data model

```
Feedback
├── id, employee_name (nullable), department, text, created_at
└── AI outputs: sentiment, sentiment_score, emotion, intent,
                topic, urgency, summary, recommendation

KBQuery (RAG query log)
├── id, question, answer, source_doc, created_at
```

## Known limitations of this prototype

- Rule-based NLP is less nuanced than an LLM — e.g. sarcasm or mixed
  sentiment in one message can be misclassified.
- TF-IDF retrieval is keyword-based, not semantic — a question phrased very
  differently from the policy wording may not match well. Swapping in
  sentence-transformer embeddings (noted in the README) fixes this.
- No authentication yet — anyone with network access to the API can submit
  or read feedback. Add auth before exposing this beyond a local demo.
- SQLite is fine for a demo/small team; move to Postgres for concurrent
  production use (see README).
