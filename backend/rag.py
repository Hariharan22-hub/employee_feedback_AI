"""
Knowledge Base / RAG (Phase 8)
===============================
Lightweight, offline retrieval-augmented answering over HR policy docs
using TF-IDF + cosine similarity (scikit-learn) — no external LLM/API
key required, so the project runs out of the box.

Flow: question -> vectorize -> cosine similarity vs. doc chunks
      -> best-matching chunk(s) -> extractive answer + source doc

To upgrade: replace `answer_question()`'s final step with a call to an
LLM, passing the retrieved chunks as context ("stuff" RAG pattern).
The retrieval plumbing (chunking, vectorizing, ranking) stays the same.
"""
import os
import re
from typing import List, Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

KB_DIR = os.path.join(os.path.dirname(__file__), "knowledge_base")


class KnowledgeBase:
    def __init__(self, kb_dir: str = KB_DIR):
        self.kb_dir = kb_dir
        self.chunks: List[str] = []
        self.sources: List[str] = []
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = None
        self._load()

    def _load(self):
        self.chunks, self.sources = [], []
        if not os.path.isdir(self.kb_dir):
            return
        for fname in sorted(os.listdir(self.kb_dir)):
            if not fname.endswith(".txt"):
                continue
            path = os.path.join(self.kb_dir, fname)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            # chunk by paragraph/line for finer-grained retrieval
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            for line in lines:
                if len(line) < 20:  # skip short headers
                    continue
                self.chunks.append(line)
                self.sources.append(fname)

        if self.chunks:
            self.matrix = self.vectorizer.fit_transform(self.chunks)

    def search(self, query: str, top_k: int = 3) -> List[Tuple[str, str, float]]:
        if not self.chunks or self.matrix is None:
            return []
        q_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(q_vec, self.matrix).flatten()
        top_idx = sims.argsort()[::-1][:top_k]
        return [(self.chunks[i], self.sources[i], float(sims[i])) for i in top_idx if sims[i] > 0]


_kb = KnowledgeBase()


def answer_question(question: str) -> dict:
    results = _kb.search(question, top_k=3)
    if not results:
        return {
            "answer": "I couldn't find a relevant policy for that question. Please check with HR directly.",
            "source_doc": "none",
            "confidence": 0.0,
        }

    best_chunk, best_source, best_score = results[0]
    # Combine top matching lines from the same source for a fuller answer
    supporting = [c for c, s, _ in results if s == best_source]
    answer = " ".join(dict.fromkeys(supporting))  # dedupe, preserve order

    return {
        "answer": answer,
        "source_doc": best_source,
        "confidence": round(min(best_score, 1.0), 3),
    }
