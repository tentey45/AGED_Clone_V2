# ✍️ AI Assistant - AGED Document Generator

A high-fidelity AI assistant that understands user intent and generates adaptive responses for software development, academia, and professional services. Built with **React + Vite** and **FastAPI**, powered by **Groq LLM**.

---

## 🚀 Quick Start (Local Clone)

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+) 
- **Groq API Key** ([Get it here](https://console.groq.com/keys))

### 2. Setup (Run from root)
```bash
# Install all dependencies (Frontend & Backend)
npm run setup

# Configure environment
cp .env.example .env
# Edit .env and paste your GROQ_API_KEY
```

### 3. Start Development (Open Two Terminals)

**Terminal 1 (Backend):**
```bash
npm run backend:dev
```

**Terminal 2 (Frontend):**
```bash
npm run frontend:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Features

- **🧠 Smart Intent Detection**: Automatically routes requests to the best AI persona.
- **⚡️ 6 Response Modes**: 
  - `chat_guidance`: General assistance.
  - `code_documentation`: Professional code analysis.
  - `document_generation`: Structural reports and papers.
  - `code_generation`: Technical building.
  - `website_generation`: High-fidelity UI layouts.
  - `rewrite_improve`: Refactoring and editing.
- **✨ Claude-like UX**: Clean sidebar, persona switching, and markdown rendering.
- **🔗 Context-Aware**: Optimized for Developers and Students.

---

## 📁 Project Structure

```
├── backend/            # FastAPI (Python) Logic
│   ├── main.py        # Entry point & CORS
│   └── ai_service.py  # Intent Routing & Groq Integration
├── frontend/           # Vite (React) Frontend
│   ├── src/           # UI Components & Logic
│   └── package.json
├── package.json        # Root script manager 🚀
├── .env.example       # Template for API keys
└── vercel.json         # Vercel Deployment config
```

---

## 🌐 Deployment (Vercel)

The project is already pre-configured for Vercel Serverless Functions.

1. Connect this repo to Vercel.
2. Add your `GROQ_API_KEY` to **System Environment Variables**.
3. Deploy! (Vercel uses the root `api/` directory).

---

## ⚖️ License
MIT
