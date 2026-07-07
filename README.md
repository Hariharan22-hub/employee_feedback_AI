# Employee Feedback AI Agent

A working prototype of an AI-powered employee feedback system: submit feedback,
get instant AI analysis (sentiment, emotion, intent, topic, urgency,
recommendation), ask HR-policy questions via retrieval (RAG), and view a
live analytics dashboard.

This implements **Phases 1–9** of the 12-phase roadmap end-to-end and
functionally, with **Phases 10–12** (enterprise security hardening, load
testing, Kubernetes deployment) included as a starter Dockerfile / notes
rather than a live production cluster — those are infrastructure choices
that depend on your actual hosting environment.

## What's inside

```
employee-feedback-agent/
├── backend/
│   ├── main.py            # FastAPI app — all API routes
│   ├── ai_agent.py         # Phase 6+7: sentiment/emotion/intent/topic/urgency pipeline
│   ├── rag.py               # Phase 8: TF-IDF retrieval over HR policy docs
│   ├── database.py          # Phase 4: SQLAlchemy models (SQLite by default)
│   ├── schemas.py           # Pydantic request/response models
│   ├── knowledge_base/      # Sample HR policy documents used by RAG
│   └── requirements.txt
├── frontend/
│   ├── index.html            # Submit / History / Dashboard / Ask HR tabs
│   ├── style.css
│   └── app.js                 # Vanilla JS, talks to the API via fetch()
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── docs/
    └── ARCHITECTURE.md
```

## How the AI actually works (no API key needed)

This build runs **fully offline** — no OpenAI/Anthropic API key required —
so it works immediately after `pip install`:

- **Sentiment**: VADER (rule-based, tuned for short informal text)
- **Emotion / Intent / Topic / Urgency**: keyword + heuristic classifiers
  (`backend/ai_agent.py`)
- **RAG / policy Q&A**: TF-IDF + cosine similarity retrieval over the
  `.txt` policy documents in `backend/knowledge_base/`, with extractive
  answers (`backend/rag.py`)

Both modules are written so you can swap the internals for a real LLM call
(OpenAI, Anthropic, local Ollama model) later — the function signatures
and output shape (`analyze_feedback()` → dict, `answer_question()` → dict)
stay the same, so nothing downstream (API routes, frontend) needs to change.
See the docstrings at the top of each file.

## Quick start (local, no Docker)

```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then open **http://localhost:8000** in your browser — the FastAPI app
serves the frontend directly. API docs (Swagger UI) are at
**http://localhost:8000/docs**.

## Quick start (Docker)

```bash
cd docker
docker compose up --build
```

Then open **http://localhost:8000**.

## Production Deployment

This project is configured for easy and automated deployments.

### Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your Git repository.
3. Configure the following settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set the following **Environment Variables** in Render:
   - `GEMINI_API_KEY`: Your official Google Gemini API Key.
   - `DATABASE_URL`: (Optional) PostgreSQL DSN (e.g., `postgresql://...`). If not provided, it falls back to a persistent SQLite file.
   - `ALLOWED_ORIGINS`: (Optional) Comma-separated list of CORS origins (e.g., `https://your-frontend.vercel.app`).
   - `JWT_SECRET_KEY`: (Optional) A custom secure string for JWT generation.

### Frontend Deployment (Vercel)

1. Create a new **Project** on [Vercel](https://vercel.com/).
2. Connect your Git repository.
3. Configure the following settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variable** in Vercel:
   - `VITE_API_URL`: The URL of your deployed Render backend (e.g., `https://your-backend.onrender.com/api`).
5. Vercel will automatically detect `frontend/vercel.json` and enable SPA routes (preventing 404 on page refreshes).

## API summary

| Method | Route                     | Purpose                                   |
|--------|----------------------------|--------------------------------------------|
| POST   | `/api/feedback`            | Submit feedback → runs AI pipeline, stores result |
| GET    | `/api/feedback`             | List feedback (filter by `department`, `urgency`) |
| GET    | `/api/feedback/{id}`        | Get one feedback record                    |
| DELETE | `/api/feedback/{id}`        | Delete a record                            |
| POST   | `/api/ask`                  | Ask an HR policy question (RAG)            |
| GET    | `/api/dashboard/stats`      | Aggregated analytics for the dashboard     |
| GET    | `/api/health`               | Health check                               |

## Extending this toward the full 12-phase roadmap

- **Phase 4 (Database)**: swap `SQLALCHEMY_DATABASE_URL` in
  `backend/database.py` for a Postgres DSN; the docker-compose file has a
  commented-out Postgres service to start from.
- **Phase 6/7 (AI quality)**: replace the rule-based classifiers in
  `ai_agent.py` with an LLM call (see docstring) for more nuanced analysis,
  or fine-tune a small classifier on real labeled feedback.
- **Phase 8 (RAG quality)**: swap TF-IDF for real embeddings
  (e.g. `sentence-transformers`) + a vector DB (Chroma, pgvector, Pinecone)
  for semantic (not just keyword) retrieval.
- **Phase 10 (Security)**: add JWT auth + RBAC (e.g. `fastapi-users` or
  a custom auth dependency), rate limiting (`slowapi`), and audit logging
  on top of the existing routes.
- **Phase 11 (Testing)**: add `pytest` + `httpx.AsyncClient` tests against
  the FastAPI routes; the pure-function design of `ai_agent.py`/`rag.py`
  makes them easy to unit test directly.
- **Phase 12 (Deployment)**: the provided Dockerfile is a starting point
  for a Kubernetes Deployment + Service manifest, or any container hosting
  platform (Fly.io, Render, ECS, Cloud Run, etc).

## Sample data

The `knowledge_base/` folder ships with five sample HR policy documents
(leave, benefits, compensation, code of conduct, general handbook) so the
"Ask HR Policy" tab works out of the box. Replace these with your real
company policies.
