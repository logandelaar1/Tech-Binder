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
- Convex
- Zustand for ephemeral UI state
- next-themes
- shadcn Sonner
- Lucide icons

## Local Development

```bash
bun install
bun run convex:dev
bun run convex:seed
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

1. Deploy Convex and keep APS secrets in Convex, not in GitHub Pages.
2. In GitHub, go to `Settings -> Secrets and variables -> Actions` and add:
   - `VITE_CONVEX_URL`: your deployed Convex URL.
3. In GitHub, go to `Settings -> Pages` and set the source to `GitHub Actions`.

The Pages build uses `/Tech-Binder/` as the Vite base path and writes a `404.html`
fallback so `/print` and other SPA routes survive refreshes.

## Content

Binder domain content lives in Convex through `convex/binder.ts` and `convex/fixtures.ts`. The frontend reads it with live Convex queries and only uses Zustand for local UI state such as selected tabs and dialog state.
