# Team 5000 Tech Binder

Digital engineering binder for Team 5000 Hammerheads' 2026 robot.

## Stack

- Bun
- Vite
- React
- React Router 7 in SPA mode
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui with Base UI
- Zustand for ephemeral UI state
- next-themes
- shadcn Sonner
- Lucide icons

## Local Development

```bash
bun install
bun run dev
```

The local Vite app runs at `http://127.0.0.1:5173/`.

## Checks

```bash
bun run typecheck
bun run lint
bun run build
```

## GitHub Pages Deployment

The site deploys from `.github/workflows/deploy-pages.yml` whenever `main` is pushed.

Before the first deploy:

1. In GitHub, go to `Settings -> Pages` and set the source to `GitHub Actions`.
2. Push to `main`.

The Pages build uses `/Tech-Binder/` as the Vite base path and writes a `404.html`
fallback so `/print` and other SPA routes survive refreshes.

## APS / CAD Tokens

Do not store APS client secrets or viewer tokens in GitHub Pages build secrets for
this static site. Any value exposed through a `VITE_*` variable is bundled into
the public JavaScript, and APS viewer tokens are meant to be short-lived anyway.

Live APS viewing needs a separate token service such as a small serverless
function, Cloudflare Worker, Netlify/Vercel function, or Autodesk public-share
embed. The static binder build intentionally uses local CAD imagery and fallback
views without requiring APS secrets.

## Content

Binder domain content is local and data-driven. Robot systems, build notes,
manufacturing settings, season results, resources, glossary entries, media, and
thank-you sections live in `src/lib/binder-content.ts` with shared types in
`src/lib/binder-types.ts`. Zustand is only used for local UI state such as
selected tabs, dialogs, and CAD controls.
