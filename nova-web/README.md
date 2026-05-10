# N.O.V.A Web

Next.js App Router web interface for the N.O.V.A assistant platform.

## Getting started

```bash
cd nova-web
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

**Credentials:** `operator@nova.ai` / `nova2025`

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|---|---|
| `NOVA_OPENAI_KEY` | OpenAI API key for live Jarvis. Optional — falls back to demo mode if not set. |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `NOVA_OPENAI_KEY` in Vercel project settings under **Environment Variables**.

## Project structure

```
nova-web/
├── src/
│   ├── app/
│   │   ├── api/          # REST + streaming API routes
│   │   ├── abyss/        # Memory management
│   │   ├── chats/        # Conversation history
│   │   ├── jarvis/       # AI chat interface
│   │   ├── login/        # Auth page
│   │   ├── media/        # Media library
│   │   ├── premium/      # Plan management
│   │   ├── settings/     # User preferences
│   │   ├── watch/        # Watch list
│   │   └── page.tsx      # Home dashboard
│   ├── components/
│   │   └── layout-shell.tsx  # Three-panel shell
│   ├── data/
│   │   └── abyss.json    # Persisted memories
│   └── lib/
│       └── abyss-store.ts  # File-based store
├── .env.example
├── middleware.ts
└── vercel.json
```
