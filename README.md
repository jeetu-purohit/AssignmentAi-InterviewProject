# AssignmentAI – AI Assessment Creator

An AI-powered assessment generation platform built for the **AssignmentAI Engineering Assignment**.

Teachers can configure exam details such as marks, question types, and due dates. The system generates structured question papers asynchronously using an LLM and delivers results in real time.

Live link : https://assignment-ai-interview-project-web.vercel.app/

## Tech Stack

### Frontend (`/apps/web`)
- Next.js (App Router) + TypeScript
- Zustand
- Tailwind CSS
- Zod

### Backend (`/apps/api`)
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- BullMQ + Redis (Upstash)
- Socket.IO
- OpenRouter

### Shared (`/packages/shared-types`)
Shared Zod schemas and TypeScript types used across frontend and backend.

---

## Why This Architecture?

- **BullMQ + Redis** → AI generation can take time, so jobs run in the background instead of blocking API requests.
- **WebSockets (Socket.IO)** → Real-time updates without polling.
- **Print CSS for PDF Export** → Uses browser print styles for clean A4 exports without heavy PDF libraries.

---

## Project Structure

```text
Assignment-ai-assessment/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express backend + worker
├── packages/
│   └── shared-types/     # Shared schemas & types
└── turbo.json
```

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/jeetu-purohit/AssignmentAi-InterviewProject.git

cd AssignmentAi-InterviewProject
npm install
```

### 2. Add Environment Variables (`apps/api/.env`)

```env
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=meta-llama/llama-3-8b-instruct
PORT=5000
```

### 3. Run the project

```bash
npm run dev
```

- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000`

## Features

- AI-generated assessments
- Real-time updates with WebSockets
- Background job queue using BullMQ
- Shared validation with Zod
- PDF export support
- Assignment history persistence