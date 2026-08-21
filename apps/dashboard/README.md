# @gavikina/dashboard

The Gavikina Energy admin dashboard — a single-page app built on
[TanStack Router](https://tanstack.com/router) (file-based routing, no SSR)
with [TanStack Table](https://tanstack.com/table), [TanStack Store](https://tanstack.com/store),
[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/),
and [Tailwind CSS](https://tailwindcss.com/). Part of the
`gavikina-monorepo` workspace — see the [root README](../../README.md) for
the overall structure.

Used internally to review enquiries (customers, agents, investors, job
applicants, contact form) and manage the past-projects list shown on the
marketing site. Data is currently mocked and persisted to `localStorage` —
there is no real backend yet.

## Development

From the repo root:

```bash
npm install
npm run dev:dashboard   # http://localhost:3001
```

Or from this directory: `npm run dev`.

## Building

```bash
npm run build     # vite build — outputs a static SPA to dist/
npm run preview   # preview the production build locally
```

## Routing

Routes are file-based under `src/routes`, using
[TanStack Router](https://tanstack.com/router)'s dot-separated nesting
convention (e.g. `enquiries.$view.$id.tsx` nests under
`enquiries.$view.tsx`). The shared layout (auth gate, sidebar) lives in
`src/routes/__root.tsx`.

## Shared packages

- `@gavikina/engine` — solar sizing logic and seed project data (used by
  the projects manager)
- `@gavikina/schemas` — Zod schemas for the login and project forms
- `@gavikina/ui` — Tailwind theme tokens and shared Radix-based components

## Linting & formatting

Configured with [eslint](https://eslint.org/) via
[`@tanstack/eslint-config`](https://tanstack.com/config/latest/docs/eslint)
and [prettier](https://prettier.io/):

```bash
npm run lint
npm run format
npm run check
```

## Deployment

This is a static SPA. `vercel.json` rewrites all routes to `index.html` so
client-side routing works on refresh/deep links. Deploy as its own Vercel
project with the root directory set to `apps/dashboard`.
