# ElectionGuide AI

> An interactive, politically neutral educational platform that helps Indian citizens — especially first-time voters — understand the election process, their voter rights, and how to prepare to vote.

**Author:** Rishi Kalantri  
**Stack:** React 19 · Vite · Tailwind CSS v4 · Node.js · Express 5 · Google Gemini API  
**Ports:** Frontend `5173` · Backend `5000`

---

## 1. Problem Statement

First-time voters in India face a fragmented information landscape. Official sources exist but are spread across multiple portals and are often written in bureaucratic language. There is no single, accessible, politically neutral tool that:

- Walks a citizen step-by-step through the full election process
- Answers procedural questions in plain language
- Keeps voter-readiness checklists
- Tests and reinforces civic knowledge
- Refuses to make partisan recommendations under any framing

This project addresses all five gaps in one locally-runnable, container-ready web application.

---

## 2. Solution Overview

ElectionGuide AI is a full-stack web application with a React frontend and an Express backend. The backend acts as a secure proxy to Google's AI and Cloud services — no API key is ever exposed to the browser.

The application has six distinct sections, each solving a specific part of the problem:

| Section | What it does |
|---|---|
| **Ask a Question** | Gemini-powered chat panel with political neutrality guardrails |
| **Election Journey** | Interactive 10-step timeline of the full Indian election process |
| **Voter Checklist** | 5-item readiness checklist with live progress tracking |
| **Know Your Rights** | Educational reference covering NOTA, Rule 49-P, VVPAT, MCC |
| **Take a Quiz** | 10-question scored quiz on election procedures |
| **Language Selector** | UI ready for 5 languages; backend Translation proxy implemented |

---

## 3. Feature-to-Problem Mapping

| Problem Requirement | Feature Implemented | Status |
|:---|:---|:---:|
| Explain the election process interactively | 10-step Election Journey timeline with animated step-by-step detail view | ✅ Works |
| Help citizens prepare to vote | Voter Checklist with per-item toggle and percentage progress bar | ✅ Works |
| Answer dynamic procedural questions | AI chat panel (`/ask`) backed by Gemini 2.5 Flash | ✅ Works |
| Enforce political neutrality absolutely | Strict `SYSTEM_INSTRUCTION` in backend + keyword guardrail in frontend | ✅ Works |
| Educate on voter rights | Know Your Rights page (NOTA, 49-P, VVPAT, EVM, MCC) | ✅ Works |
| Test and reinforce civic knowledge | 10-question quiz with score calculation and result screen | ✅ Works |
| Multi-language support | Language context + backend `/api/tools/translate` proxy (Google Cloud Translation v2) | ⚠️ Requires GCP credentials; falls back to mock |
| Text-to-speech for accessibility | Backend `/api/tools/tts` proxy (Google Cloud TTS) | ⚠️ Requires GCP credentials; returns 503 without them |
| Persist quiz scores | Backend `/api/quiz/score` → Firestore `quiz_scores` collection | ⚠️ Requires GCP credentials; falls back to mock log |
| Prevent API abuse | `express-rate-limit`: 100 requests per IP per 15 minutes | ✅ Works |

---

## 4. Google Services Used

### Fully operational (requires only `GEMINI_API_KEY`)
| Service | SDK / Model | How it is used |
|---|---|---|
| **Google Gemini API** | `@google/generative-ai` · `gemini-2.5-flash` | Powers the `/api/chat` chatbot. A `SYSTEM_INSTRUCTION` block is injected server-side at model initialisation to enforce topic scope and neutrality. Temperature is set to `0.2` for factual, deterministic answers. |

### Operational with GCP service account (`GOOGLE_APPLICATION_CREDENTIALS`)
| Service | SDK | How it is used |
|---|---|---|
| **Google Cloud Translation API v2** | `@google-cloud/translate` | `/api/tools/translate` — translates UI strings to Hindi, Tamil, Telugu, Marathi, Bengali. Falls back to a labelled mock string if credentials are absent. |
| **Google Cloud Text-to-Speech API** | `@google-cloud/text-to-speech` | `/api/tools/tts` — synthesises MP3 audio for page content. Returns HTTP 503 with a clear error message if credentials are absent. |
| **Firebase Admin SDK (Firestore)** | `firebase-admin` | `/api/quiz/score` and `/api/quiz/leaderboard` — stores and retrieves quiz session scores. Falls back to a console log mock if credentials are absent. |

---

## 5. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (React 19 / Vite / Tailwind CSS v4)                    │
│                                                                  │
│  /           → Home page + feature card grid                    │
│  /ask        → Home page + AskAi chat panel (side-by-side)      │
│  /journey    → 10-step Election Journey timeline                 │
│  /checklist  → Voter Checklist with progress                     │
│  /rights     → Know Your Rights reference page                  │
│  /quiz       → 10-question scored quiz                          │
└────────────────────────┬────────────────────────────────────────┘
                         │  REST (axios, port 5001 in dev)
┌────────────────────────▼────────────────────────────────────────┐
│  Express 5 Backend (Node.js)                                     │
│                                                                  │
│  Middleware: helmet · cors · express-rate-limit                  │
│  Validation: express-validator (trims + rejects empty inputs)    │
│                                                                  │
│  POST /api/chat            → chatController  → Gemini 2.5 Flash │
│  POST /api/tools/translate → toolsController → Cloud Translation│
│  POST /api/tools/tts       → toolsController → Cloud TTS        │
│  POST /api/quiz/score      → quizController  → Firestore        │
│  GET  /api/quiz/leaderboard→ quizController  → Firestore        │
│  GET  /health              → 200 OK status check                │
└──────────┬───────────────────────────┬──────────────────────────┘
           │                           │
    ┌──────▼──────┐          ┌─────────▼──────────────┐
    │ Gemini API  │          │ Google Cloud Platform   │
    │ (Gemini     │          │  · Translation API v2   │
    │  2.5 Flash) │          │  · Text-to-Speech API   │
    └─────────────┘          │  · Firestore (Firebase) │
                             └────────────────────────┘
```

**Key design decisions:**
- All API keys live exclusively in the backend `.env` file — the frontend never touches them.
- The Gemini `SYSTEM_INSTRUCTION` is a server-side constant compiled into the backend binary at startup. It cannot be overridden by any user input.
- Google Cloud services use Application Default Credentials (`GOOGLE_APPLICATION_CREDENTIALS`). If credentials are absent, all three services degrade gracefully to mock responses rather than crashing.

---

## 6. Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- Docker + Docker Compose (optional, for containerised run)

### 6.1 Clone and install dependencies

```bash
git clone <repo-url>
cd ElectionGuide-AI

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 6.2 Configure environment variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=5000

# Required — chatbot will not work without this
GEMINI_API_KEY=your_gemini_api_key_here

# Optional — enables real Translation, TTS, and Firestore
GOOGLE_CLOUD_PROJECT_ID=your_gcp_project_id
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
FIRESTORE_DATABASE_ID=(default)
TRANSLATE_ENABLED=true
TTS_ENABLED=true
```

> Without `GEMINI_API_KEY`, the chat endpoint will fail.  
> Without `GOOGLE_APPLICATION_CREDENTIALS`, Translation returns mock text, TTS returns HTTP 503, and quiz scores are logged to console instead of Firestore. All other features work normally.

---

## 7. Local Run Instructions

### Option A — Manual (recommended for development)

**Terminal 1 — Backend:**
```bash
cd backend
npm install
node src/index.js
# Server running on http://localhost:5000
```

> Note: The frontend is configured to call `http://localhost:5001`. If you run the backend on port 5000, update `VITE_API_URL` or update the axios base URL in `AskAi.jsx` to match.  
> Or simply run the backend with `PORT=5001` in your `.env`.

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

### Option B — Docker Compose

```bash
# From the project root
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend (Nginx) | http://localhost:5173 |
| Backend (Node.js) | http://localhost:5000 |

> To pass Google Cloud credentials into the Docker container, uncomment the `volumes` section in `docker-compose.yml` and mount your `credentials.json` file.

---

## 8. Testing Instructions

### Frontend tests — Vitest + React Testing Library

```bash
cd frontend
npm test
```

**What is tested (23 tests across 4 files):**

| File | Tests | Coverage |
|---|---|---|
| `AskAi.test.jsx` | 18 | Political neutrality guardrail (unit + UI), empty input, whitespace-only input, API error handling, input re-enabled after error, structured voter-registration answer, helpful links section, successful API response display, suggested question flow |
| `Quiz.test.jsx` | 2 | First question rendering, score calculation (answers 2/10 correctly → expects score `2`) |
| `Checklist.test.jsx` | 2 | All 5 checklist items render, progress updates from 0% to 20% on first item check |
| `Journey.test.jsx` | 1 | Timeline title, step labels (Registration, Electoral Roll, Results), active step description render |

Expected output:
```
 Test Files  4 passed (4)
      Tests  23 passed (23)
```

### Backend tests — Jest + Supertest

```bash
cd backend
npm test
```

**What is tested (2 files):**

| File | Tests | Coverage |
|---|---|---|
| `chat.test.js` | 4 | Empty/whitespace input → HTTP 400 with validation error, valid input → 200 with reply, Gemini API failure → HTTP 500 with user-friendly message, system instruction contains `STRICTLY politically neutral` |
| `chat_guardrails.test.js` | 1 | System instruction contains exact refusal phrase and known political trigger phrases |

---

## 9. Security Checklist

- [x] `backend/.env` is listed in `backend/.gitignore` — no secrets in version control
- [x] All API keys and system instructions are server-side only — never sent to the browser
- [x] `helmet` sets secure HTTP response headers on every request
- [x] `cors` is configured on the Express app (restrict to your domain in production)
- [x] `express-rate-limit` limits each IP to **100 requests per 15 minutes** on all `/api/` routes
- [x] `express-validator` trims and validates the `message` field — empty or whitespace-only strings return HTTP 400 before reaching Gemini
- [x] Gemini model temperature is set to `0.2` to discourage hallucination and creative political framing
- [x] Google Cloud services use Application Default Credentials (service account) — not hardcoded keys
- [x] Docker containers run with minimal images (Node alpine, Nginx alpine)

---

## 10. Accessibility Checklist

- [x] `<a href="#main-content">Skip to main content</a>` link at top of every page (visible on focus)
- [x] Semantic HTML5 elements: `<header>`, `<main id="main-content">`, `<nav>`, `<aside>`, `<h1>`–`<h3>`
- [x] Single `<h1>` per page — heading hierarchy is not skipped
- [x] All icon-only buttons have `aria-label` attributes (e.g., Send button: `aria-label="Send message"`)
- [x] All interactive elements have visible `focus:ring` states via Tailwind
- [x] Chat input has `aria-label="Chat input"`
- [x] `data-testid` attributes on all key interactive elements (enables programmatic testing)
- [x] Inter font loaded via `<link rel="preconnect">` in `index.html` for fast rendering
- [x] Colour contrast: body text `#1e293b` on `#f8fafc` background exceeds WCAG AA ratio
- [x] Responsive layout: mobile shows full-screen chat overlay; desktop shows side-by-side split panel

---

## 11. Official Sources

All educational content in this application is derived exclusively from Election Commission of India (ECI) official sources:

| Source | URL |
|---|---|
| Voters' Service Portal (Form 6, Form 7, Form 8) | https://voters.eci.gov.in/ |
| Electoral Roll Search | https://electoralsearch.eci.gov.in/ |
| EVM and VVPAT information | https://www.eci.gov.in/evm-vvpat |
| Model Code of Conduct | https://www.eci.gov.in/mcc |
| Citizen complaint portal (cVIGIL) | https://cvigil.eci.gov.in/ |

> **Disclaimer:** ElectionGuide AI is an educational tool built for civic awareness. All personal voter registration status and official dates must be verified directly on official ECI portals. This application is not affiliated with the Election Commission of India.

---

## 12. Deployment

### Container architecture

The project ships with two Dockerfiles:

| File | Base image | What it produces |
|---|---|---|
| `frontend/Dockerfile` | Multi-stage: Node (build) → `nginx:alpine` (serve) | Static React app served by Nginx on port 80 |
| `backend/Dockerfile` | `node:18-alpine` | Express API server on port 5000 |

### Deploying to Google Cloud Run

```bash
# Build and push backend image
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/electionguide-backend

# Deploy backend to Cloud Run
gcloud run deploy electionguide-backend \
  --image gcr.io/YOUR_PROJECT_ID/electionguide-backend \
  --platform managed \
  --set-env-vars GEMINI_API_KEY=your_key \
  --allow-unauthenticated

# Build and push frontend image
cd ../frontend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/electionguide-frontend

# Deploy frontend to Cloud Run
gcloud run deploy electionguide-frontend \
  --image gcr.io/YOUR_PROJECT_ID/electionguide-frontend \
  --platform managed \
  --allow-unauthenticated
```

> For GCP services (Translation, TTS, Firestore), attach a service account with the appropriate IAM roles to the Cloud Run service instead of mounting a credentials file.

---

## 13. Prompt Strategy and Build Process

This application was built iteratively using an AI coding assistant (Antigravity / Gemini). The following describes the actual sequence used.

### Phase 1 — Architecture
The AI was prompted to generate a monorepo structure separating a Vite frontend from an Express backend, with clear API boundaries so no secrets touch the client.

### Phase 2 — Backend and System Prompt Engineering
The most critical prompt in the project was the `SYSTEM_INSTRUCTION` constant in `chatController.js`. It was engineered to:
- Enumerate **allowed topics** explicitly (voter registration, EVM/VVPAT, MCC, electoral roll, etc.)
- Enumerate **refused topics** explicitly (party recommendations, candidate comparisons, campaign strategy)
- Specify the **exact refusal phrase** the model must use: `"I can help explain the election process, but I cannot recommend parties, candidates, or voting choices."`
- Specify a **mandatory answer format**: brief answer → step-by-step numbered list → ECI links → verification reminder
- Set `temperature: 0.2` to minimise creative deviation from the above structure

### Phase 3 — Frontend Components
Components were built page-by-page: Layout shell → Home (split-panel) → Journey (timeline) → Checklist → Rights → Quiz. Each component was prompted with explicit design requirements (Tailwind v4 utility classes, Framer Motion animations, responsive breakpoints).

### Phase 4 — Chat Panel UI
The `AskAi` component was redesigned to match a reference UI showing: section title and subtitle, user/bot message bubbles, numbered step format, a Helpful Links section, suggested follow-up pill buttons, a text input with send button, and a neutrality disclaimer. A client-side `isPoliticalQuery()` function was added as a first-line guardrail before any API call is made.

### Phase 5 — Testing
Unit tests were written explicitly for:
- Score calculation correctness (Quiz)
- Political keyword detection (AskAi `isPoliticalQuery`)
- Empty input rejection (both frontend and backend)
- API error recovery (chat returns error bubble, input re-enabled)
- System instruction content (backend verifies guardrail text is present at model init)
- Timeline and checklist rendering

### Phase 6 — CSS Root Cause Fix
The application's Tailwind v4 CSS was not rendering due to a missing `@import "tailwindcss"` directive in `index.css`. The root cause was diagnosed (Vite plugin requires the directive to trigger utility class generation), the stale Vite cache was cleared, and the Google Fonts `@import url()` ordering conflict with PostCSS was resolved by moving font loading to `index.html` `<link>` tags.

---

## Project Structure

```
ElectionGuide-AI/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json              # jest, supertest, express, helmet, ...
│   ├── src/
│   │   ├── index.js              # Express app, middleware, route mount
│   │   ├── controllers/
│   │   │   ├── chatController.js   # Gemini 2.5 Flash + SYSTEM_INSTRUCTION
│   │   │   ├── quizController.js   # Firestore score save/leaderboard
│   │   │   └── toolsController.js  # Cloud Translation + Cloud TTS
│   │   └── routes/
│   │       ├── chatRoutes.js
│   │       ├── quizRoutes.js
│   │       └── toolsRoutes.js
│   └── tests/
│       ├── chat.test.js            # 4 tests: validation, success, error, guardrail
│       └── chat_guardrails.test.js # 1 test: system instruction content
└── frontend/
    ├── Dockerfile
    ├── index.html                  # Google Fonts preconnect + link tags
    ├── package.json                # react 19, vite, tailwind v4, vitest, ...
    ├── vitest.config.js
    └── src/
        ├── main.jsx
        ├── index.css               # @import "tailwindcss" + custom utilities
        ├── App.jsx                 # Router + LanguageProvider
        ├── components/
        │   └── Layout.jsx          # Header, left nav sidebar, Outlet
        ├── context/
        │   └── LanguageContext.jsx
        └── pages/
            ├── Home.jsx            # Split-panel dashboard + chat mount
            ├── AskAi.jsx           # Chat panel + isPoliticalQuery guardrail
            ├── AskAi.test.jsx      # 18 frontend tests
            ├── Journey.jsx         # 10-step interactive timeline
            ├── Journey.test.jsx    # 1 test
            ├── Checklist.jsx       # 5-item voter checklist
            ├── Checklist.test.jsx  # 2 tests
            ├── Quiz.jsx            # 10-question scored quiz
            ├── Quiz.test.jsx       # 2 tests
            ├── Rights.jsx
            └── About.jsx
```
