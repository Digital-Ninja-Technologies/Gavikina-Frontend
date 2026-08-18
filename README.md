# Gavikina Energy Website

The Gavikina Energy marketing site — a React + TypeScript rebuild of the
Claude Design mockup, built with Vite and ready for one-click deployment to
Vercel.

## Stack

- React 19 + TypeScript
- React Router (client-side routing across 12 pages)
- Vite (build tooling)
- Plain CSS with responsive breakpoints (no framework dependency)

## Pages

Home, About, Past projects, Product catalogue, How it works, Become an
agent, Careers, Investors guide, FAQ, Contact, Solar calculator, and Full
assessment — plus a solar calculator and full assessment wizard available
both as dedicated pages and as modals from anywhere on the site.

The sizing logic (appliance wattages, system tiers, pricing, backup/fuel
calculations) lives in `src/lib/engine.ts` as the single source of truth,
shared by the calculator, the assessment wizard, and the catalogue.

## Development

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

## Deployment

This project is Vercel-ready out of the box:

- `vercel.json` rewrites all routes to `index.html` so client-side routing
  (React Router) works on refresh/deep links.
- Vercel auto-detects the Vite framework preset (`vite build`, output
  directory `dist`) — no further configuration is required.

To deploy: import this repository in Vercel and deploy, or run `vercel`
from the project root.
