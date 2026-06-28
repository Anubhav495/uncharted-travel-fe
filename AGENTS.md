# Repository Guidelines

## Project Structure & Module Organization

This Next.js 15 application uses the Pages Router. Routes live in `pages/`; server endpoints are under `pages/api/`. Reusable UI is organized in `src/components/` by role (`layout`, `sections`, `forms`, `modals`, `templates`, and `ui`). Shared contexts, types, integrations, and trek content belong in `src/context/`, `src/types/`, `src/lib/`, and `src/data/`. Static media is stored in `public/assets/`. Database definitions and incremental changes live in `supabase/schema.sql` and `supabase/migrations/`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts the local Next.js server at `http://localhost:3000`.
- `npm run build` creates a production build and catches integration errors.
- `npm start` serves the completed production build.
- `npm run lint` runs the configured Next.js ESLint rules.
- `npm test` runs the Jest and React Testing Library suites.

Use Node.js 18+. Build before opening a pull request.

## Coding Style & Naming Conventions

Write TypeScript and functional React components. Follow surrounding style: single quotes, semicolons, trailing commas in multiline configuration, and four-space indentation in component bodies. Name components and interfaces in PascalCase (`BookingModal`, `TrekCardProps`), functions and variables in camelCase, and route files according to Next.js conventions (`[slug].tsx`). Prefer the `@/` alias for imports from `src/`. Keep Tailwind utilities in JSX and global rules in `styles/globals.css` or `src/index.css`. ESLint enforces the configured Next.js rules; avoid unrelated formatting churn.

## Testing Guidelines

Place tests beside code as `ComponentName.test.tsx` or in a nearby `__tests__/` directory. Test user-visible behavior and API success/error paths. There is no coverage threshold; add regression coverage for every bug fix.

## Commit & Pull Request Guidelines

Recent commits use short, lowercase summaries such as `add cache and rupin pass`. Keep that compact style, but use a specific imperative subject (for example, `fix leaderboard tie ranking`). Keep each commit scoped to one logical change. Pull requests should explain the behavior change, list verification commands, link relevant issues, and include screenshots or recordings for UI changes. Call out database migrations and new environment variables explicitly.

## Security & Configuration

Keep credentials in local environment files and never commit them. Public browser configuration uses `NEXT_PUBLIC_SUPABASE_*`; service-role, Google OAuth, Gmail, Telegram, webhook, and NextAuth secrets must remain server-only.
