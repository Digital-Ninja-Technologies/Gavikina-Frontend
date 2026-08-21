# @gavikina/website

The Gavikina Energy marketing site, built on [TanStack Start](https://tanstack.com/start)
(SSR) with file-based routing, [TanStack Query](https://tanstack.com/query),
[TanStack Store](https://tanstack.com/store), [React Hook Form](https://react-hook-form.com/)
+ [Zod](https://zod.dev/), and [Tailwind CSS](https://tailwindcss.com/). Part
of the `gavikina-monorepo` workspace — see the [root README](../../README.md)
for the overall structure.

## Development

From the repo root:

```bash
npm install
npm run dev:website   # http://localhost:3000
```

Or from this directory: `npm run dev`.

## Building

```bash
npm run build     # vite build — outputs .vercel/output via the Nitro vercel preset
npm run preview   # preview the production build locally
```

## Routing

Routes are file-based under `src/routes`, using
[TanStack Router](https://tanstack.com/router)'s dot-separated nesting
convention. The shared layout (header, footer, modal, meta tags) lives in
`src/routes/__root.tsx`.

## Shared packages

- `@gavikina/engine` — solar sizing logic and seed project data
- `@gavikina/schemas` — Zod schemas for every form on the site
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

This app builds to Vercel-native output via Nitro's `vercel` preset
(`.vercel/output/functions/__server.func` + `.vercel/output/static`) — no
`vercel.json` is needed. Deploy as its own Vercel project with the root
directory set to `apps/website`.

For other hosts, see [Nitro's deployment docs](https://v3.nitro.build/deploy).
