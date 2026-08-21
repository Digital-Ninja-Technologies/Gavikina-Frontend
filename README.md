# Gavikina Energy

Monorepo for the Gavikina Energy marketing site and admin dashboard, built
on the TanStack stack and managed as npm workspaces.

## Structure

```
apps/
  website/    Marketing site — TanStack Start (SSR), deployed to Vercel
  dashboard/  Admin dashboard — TanStack Router (SPA) + TanStack Table
packages/
  engine/     Shared solar sizing engine + seed project data
  schemas/    Shared Zod schemas for all forms
  ui/         Shared Tailwind theme + Radix-based UI components
```

Both apps share TanStack Query (data fetching), TanStack Store (global UI
state), and React Hook Form + Zod (forms and validation), wired through the
`packages/*` workspaces above. Internal packages are consumed directly as
TypeScript source — no build step required.

## Development

```bash
npm install              # installs all workspaces
npm run dev:website      # marketing site — http://localhost:3000
npm run dev:dashboard    # admin dashboard — http://localhost:3001
```

## Building

```bash
npm run build             # build both apps
npm run build:website     # marketing site only
npm run build:dashboard   # admin dashboard only
```

## Linting

```bash
npm run lint               # lint both apps
npm run lint -w apps/website
npm run lint -w apps/dashboard
```

## The marketing site

Twelve routes — Home, About, Past projects, Product catalogue, How it
works, Become an agent, Careers, Investors guide, FAQ, Contact, Solar
calculator, and Full assessment — plus a solar calculator and full
assessment wizard available both as dedicated pages and as modals from
anywhere on the site.

The sizing logic (appliance wattages, system tiers, pricing, backup/fuel
calculations) lives in `packages/engine/src/sizing.ts` as the single
source of truth, shared by the calculator, the assessment wizard, the
catalogue, and the dashboard's projects tooling.

## The admin dashboard

An internal tool for reviewing enquiries (customers, agents, investors,
job applicants, contact form) and managing the past-projects list shown on
the marketing site. Data is currently mocked and persisted to
`localStorage`, matching the original prototype's behavior — there is no
real backend yet.

## Deployment

- `apps/website` builds via Nitro's `vercel` preset, generating a native
  `.vercel/output` directory (SSR function + static assets) — no
  `vercel.json` required.
- `apps/dashboard` is a static SPA; `apps/dashboard/vercel.json` rewrites
  all routes to `index.html` so client-side routing works on refresh/deep
  links.

Deploy each app as its own Vercel project with its root directory set to
`apps/website` or `apps/dashboard` respectively.
