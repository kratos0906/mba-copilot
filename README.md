# MBA CoPilot – AI-Powered MBA Schedule Keeper

This is a Next.js app that helps MBA students manage academics, career prep, case competitions, and personal tasks, with AI-powered planning.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Supabase (Auth + Database)
- Google Gemini (AI planning endpoint)
- Deployed on Vercel

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_ai_api_key
# Optional: override the model (defaults to gemini-flash-latest)
# GEMINI_MODEL=gemini-2.5-flash
```

3. Run the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Schema

Create the following table in Supabase:

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  category text check (category in ('academics','career','case_competition','personal')) not null,
  deadline date,
  effort_hours integer,
  status text check (status in ('not_started','in_progress','completed')) default 'not_started',
  created_at timestamp with time zone default now()
);

alter table public.tasks
  add constraint fk_tasks_user
  foreign key (user_id) references auth.users(id)
  on delete cascade;
```

Enable Row Level Security and add a policy to allow each user to access only their own rows.

## Gemini setup

- Create a key in [Google AI Studio](https://aistudio.google.com/) and set it as `GEMINI_API_KEY` in `.env.local`.
- The app calls `gemini-flash-latest` via the server route at `/api/ai-plan`. To switch models, set `GEMINI_MODEL` in `.env.local` to one of the models listed by the API (e.g., `gemini-2.5-flash`), or edit `app/api/ai-plan/route.js`.

## Deployment

- Push this folder to a GitHub repository.
- Import the repo into Vercel.
- Make sure the environment variables are set in Vercel project settings.
