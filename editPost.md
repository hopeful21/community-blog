I have a Next.js App Router + TypeScript + Supabase community blog project.

I need to revise my Edit Post system so that ONLY the original author of a post can:

* see the Edit button
* open the edit page
* update the post
* access protected edit routes

Current stack:

* Next.js App Router
* Supabase Auth
* Supabase PostgreSQL
* TailwindCSS
* posts.user_id references profiles.id
* profiles.id references auth.users.id

Please help me implement a secure production-style ownership system.

Requirements:

1. Frontend UI protection

* Only show Edit/Delete buttons if:
  user.id === post.user_id

2. Route protection
   If another logged-in user manually visits:
   /posts/[id]/edit

they should:

* be redirected away
  OR
* see "Unauthorized"

3. Server-side ownership verification
   Do not trust only frontend checks.

4. Supabase RLS policies
   Ensure users can only:

* UPDATE their own posts
* DELETE their own posts

using:
auth.uid() = user_id

5. Generate:

* complete EditPost page example
* protected route example
* ownership check example
* secure update query
* delete query
* recommended folder structure

6. Include:

* loading state
* unauthorized state
* redirect example using Next.js navigation
* clean modern TypeScript code

7. Use App Router best practices:

* Server Components where appropriate
* Client Components only when necessary

8. Also explain:

* why frontend-only protection is not enough
* how RLS protects the database
* how production community platforms handle ownership

9. Include an example of:

* fetching current session
* comparing session user with post.user_id
* conditional rendering of Edit button

10. Keep compatibility with:

* Supabase realtime
* profiles relation
* App Router
* TailwindCSS

Use modern production-ready architecture and avoid deprecated patterns.
