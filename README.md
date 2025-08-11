# Grok Imagine Best

Best of Grok generated images/videos feed with uploads, voting, and a buttery-smooth infinite scroll — built with Next.js, Tailwind + shadcn/ui, TanStack Query, MongoDB, and Cloudflare R2.

[Website](https://grokimagine.best) · [Issues](https://github.com/iamsrikanthnani/grokimagine.best/issues) · [Repo](https://github.com/iamsrikanthnani/grokimagine.best)

</div>

---

## Features

- Upload images/videos to Cloudflare R2 via S3-compatible SDK
- One-per-hour submission (DB check + httpOnly cookie cooldown)
- Infinite scroll feed (TanStack Query useInfiniteQuery)
- Optimistic like/dislike with rollback
- Light/Dark theme via shadcn/ui tokens
- Detail view with randomized feed section
- Fully typed (TypeScript), ESLint configured

## Tech Stack

- Next.js App Router, React 19, TypeScript
- Tailwind CSS + shadcn/ui
- TanStack React Query v5
- MongoDB (Mongoose)
- Cloudflare R2 (S3 compatible via @aws-sdk/client-s3)

## Getting Started

1. Clone and install

```bash
git clone https://github.com/iamsrikanthnani/grokimagine.best
cd grokimagine.best
npm i
```

2. Configure environment

- Copy `.env.example` to `.env.local` and fill the values
- Required: `MONGO_DB_HOST`, `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

3. Run

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

- `src/app` — App Router pages and API routes
  - `api/create` — multipart form upload → R2 → create imagine + set cooldown cookie
  - `api/get-all` — list with pagination and sorting (likes/new/old)
  - `api/get-imagine` — fetch single imagine by id
  - `api/like` / `api/dislike` — update reactions
- `src/lib/db` — Mongoose config, models, actions
- `src/lib/r2` — R2 upload client, key generation
- `src/lib/query` — Fetch helpers, query/mutation hooks, provider
- `src/components` — UI (cards, skeletons, `FeedView`)

## API Summary

- POST `/api/create` (multipart: xHandle, prompt, file)
  - Infers mediaType, uploads to R2, stores document
  - Sets `imagine_cooldown` httpOnly cookie for 1 hour
- GET `/api/get-all?limit=&skip=&xHandle=&prompt=&mediaType=&since=&until=&sort=(likes|new|old)`
- GET `/api/get-imagine?id=`
- POST `/api/like` `{ id }`
- POST `/api/dislike` `{ id }`

## Frontend

- `FeedView` component powers the home feed and is reused on detail page with `random` mode
- Infinite scroll uses IntersectionObserver + `useInfiniteQuery`
- Likes are optimistic; toasts kept minimal and unobtrusive

## Deployment

- Domain: `grokimagine.best`
- Recommended hosting: Vercel or similar Node 18+ environment
- Ensure env vars are set in the hosting provider

## Open Source

- License: MIT (see `LICENSE`)
- Repo: https://github.com/iamsrikanthnani/grokimagine.best

## Community

Built with love by the community. Contributions of all kinds are welcome — from bug reports and docs tweaks to new features.

- Create issues for bugs and feature ideas
- Open pull requests to improve code, docs, and UX
- Star the repo if you find it useful and share feedback
