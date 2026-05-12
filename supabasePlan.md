# Supabase schema and RLS revision plan

This file replaces the previous draft and intentionally does not store project
URLs, database passwords, account emails, or raw connection strings. Keep those
values in `.env.local` or the Supabase dashboard only.

Important: the previous draft contained a Postgres connection string and account
details. Rotate the database password in Supabase before treating this project
as safe.

## Goal

Build a secure community blog schema for:

- `profiles`
- `posts`
- `comments`

Access rules:

- Public visitors can read posts, comments, and public profile fields.
- Only signed-in, non-anonymous users can create posts and comments.
- Users can update or delete only their own posts.
- Users can update or delete only their own comments.
- Users can create or update only their own profile.
- RLS uses `auth.uid()` and role-scoped policies.
- Comments can join profiles with Supabase nested selects.

## Production SQL

Run this in the Supabase SQL editor after backing up existing data. If the
current tables already contain data or incompatible constraints, migrate the
data first instead of dropping tables.

```sql
begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 3 and 32),
  constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_title_not_blank check (length(btrim(title)) > 0),
  constraint posts_content_not_blank check (length(btrim(content)) > 0)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_content_not_blank check (length(btrim(content)) > 0)
);

create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists comments_post_id_created_at_idx on public.comments(post_id, created_at desc);
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists profiles_username_idx on public.profiles(username);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_comments_updated_at on public.comments;
create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'posts', 'comments')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end;
$$;

create policy "profiles are readable by everyone"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and id = (select auth.uid())
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) is not null
  and id = (select auth.uid())
)
with check (
  id = (select auth.uid())
);

create policy "users can delete their own profile"
on public.profiles
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and id = (select auth.uid())
);

create policy "posts are readable by everyone"
on public.posts
for select
to anon, authenticated
using (true);

create policy "users can insert their own posts"
on public.posts
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "users can update their own posts"
on public.posts
for update
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);

create policy "users can delete their own posts"
on public.posts
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy "comments are readable by everyone"
on public.comments
for select
to anon, authenticated
using (true);

create policy "users can insert their own comments"
on public.comments
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "users can update their own comments"
on public.comments
for update
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);

create policy "users can delete their own comments"
on public.comments
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(
    regexp_replace(
      coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1), 'user'),
      '[^a-zA-Z0-9_]',
      '_',
      'g'
    )
  );

  if length(base_username) < 3 then
    base_username := 'user';
  end if;

  final_username := left(base_username, 23) || '_' || left(replace(new.id::text, '-', ''), 8);

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    final_username,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'comments'
  ) then
    alter publication supabase_realtime add table public.comments;
  end if;
end;
$$;

commit;
```

## Comments query with profile join

This works because `comments.user_id` references `profiles.id`.

```ts
const { data, error } = await supabase
  .from("comments")
  .select(`
    *,
    profiles (
      username,
      avatar_url
    )
  `)
  .eq("post_id", postId)
  .order("created_at", { ascending: false });
```

## Why each policy exists

- Public `select` policies allow visitors to read public community content.
- Authenticated `insert` policies require the row owner to match `auth.uid()`.
- `with check` prevents a signed-in user from creating rows for another user.
- `update` policies use both `using` and `with check` so users cannot edit
  another user's row or change ownership during the update.
- `delete` policies restrict deletion to the row owner.
- Role-scoped `to anon, authenticated` / `to authenticated` policies avoid
  evaluating owner checks for public requests.
- The `is_anonymous` JWT check blocks Supabase anonymous-auth users from
  writing content while still allowing normal signed-in users.

## Architecture notes for Next.js App Router

- Keep Supabase URL and publishable key in `.env.local` as public client values.
- Never expose the service role key or database password to Client Components.
- Use RLS as the final authorization boundary even if the UI hides actions.
- For server-side mutations, re-check the user inside the Server Action or data
  access function. Do not rely only on page-level redirects.
- Return only the fields the UI needs from server code.
- The signup page should stop inserting into `profiles` from the browser after
  the `handle_new_user` trigger is installed. Let the database create the
  profile row automatically.

## Optimistic UI compatibility

- Client code can optimistically render a temporary comment immediately.
- On successful insert, refetch comments or replace the temporary item with the
  returned database row.
- On insert error, remove the temporary item and show the error.
- Always send `user_id: user.id` for inserts, but trust RLS to enforce that the
  value matches the current session.

## Supabase best practices used

- `profiles.id` references the primary key of `auth.users` with
  `on delete cascade`.
- Content tables reference `profiles(id)` so profile joins are direct and users
  must have a profile before writing content.
- RLS is enabled on every exposed public table.
- Policies use `(select auth.uid())` so Postgres can evaluate the current user
  once per statement.
- Columns used in owner checks and filters are indexed.
- User-editable metadata is used only for initial profile display fields, not
  for authorization decisions.
.com
vvuxonwqotdfzecmfpko
https://supabase.com/dashboard/org/salcsxchrppmuccvypwk