# Community Blog

A modern community blogging platform built with Next.js App Router, Supabase, TypeScript, and TailwindCSS. The app supports authentication, post publishing, secure author-only editing, realtime comments, and a responsive UI with a mobile burger menu.

## Features

- Supabase email/password authentication
- Create and publish blog posts
- Author-only edit and delete controls
- Server-side ownership checks for protected post mutations
- Supabase RLS-ready data model for posts, comments, and profiles
- Realtime comments with optimistic UI
- Responsive landing page and mobile navbar menu
- Protected edit route at `/posts/[id]/edit`
- Legacy edit route redirect from `/posts/edit/[id]`

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- TailwindCSS 4
- Supabase Auth
- Supabase PostgreSQL
- Supabase Realtime
- `@supabase/ssr`

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Supabase Setup

This project expects these public tables:

- `profiles`
- `posts`
- `comments`

The recommended SQL schema and RLS policies are documented in [supabasePlan.md](./supabasePlan.md).

Important ownership rules:

- `posts.user_id` should reference `profiles.id`
- `profiles.id` should reference `auth.users.id`
- Users can update/delete only posts where `auth.uid() = user_id`
- Users can create comments only with their own `user_id`

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/
  auth/
    login/
    signup/
  posts/
    [id]/
      edit/
      page.tsx
    actions.ts
    create/
components/
  Comments.tsx
  Navbar.tsx
  HeroSection.tsx
  PostsSection.tsx
contexts/
  AuthContext.tsx
lib/
  supabase/
    client.ts
    server.ts
```

## Security Notes

Frontend checks are used only to improve user experience. Real authorization is enforced in two places:

- Server Actions verify the current user before update/delete operations.
- Supabase RLS should reject unauthorized database writes even if someone bypasses the UI.

## Author

fitrah maulana malik ai engineer 2026  
GitHub: [hopeful21](https://github.com/hopeful21)
