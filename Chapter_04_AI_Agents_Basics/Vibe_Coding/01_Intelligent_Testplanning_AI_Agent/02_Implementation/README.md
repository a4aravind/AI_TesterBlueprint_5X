# Jira Test Plan Generator

## Prerequisites
- Node.js 20 or newer
- npm
- Jira Cloud credentials
- Optional Groq API key

## Setup
```bash
cd 02_Implementation
npm run install:all
npm run dev
```

Open `http://localhost:5173`.

The backend automatically reads `.env` from the parent project folder
(`01_Intelligent_Testplanning_AI_Agent`). Supported keys are:

- `JIRA_URL`
- `JIRA_EMAIL`
- `JIRA_TOKEN`
- `GROQ_API_KEY`

Existing environment variables override values from `.env`. Do not commit
the `.env` file or expose credentials in frontend code.

## Use
1. Enter a Jira issue ID such as `KAN-123`.
2. Submit it with **Prompt (JIRA Ticket)**.
3. Review the generated DRAFT test plan.
4. Open **Settings** to test the Jira and Groq connections.

The backend retrieves Jira issue descriptions and custom text fields. The
Groq-backed plan uses the supplied test-plan template and temperature zero
when available. If Groq is absent or fails, the app uses a deterministic
template fallback. Missing details use the exact required text:
**Insufficient information to determine.**

## Verification
- Frontend and backend source is present under `src/frontend` and
  `src/backend`.
- Run `npm run build --prefix src/frontend` to verify the frontend build.
- Run `npm start --prefix src/backend` to verify backend startup.
- Jira and Groq live calls require valid credentials and network access.
- The settings buttons perform safe read-only connection checks.

## Limitations
- No `config.md` was present; the existing parent `.env` is used instead.
- Jira acceptance criteria depend on which Jira fields contain them.
- Live Jira retrieval and Groq generation are not verified without a test issue.
- The application only reads Jira data and never modifies Jira issues.
