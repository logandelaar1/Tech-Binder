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

## Content

Binder domain content lives in Convex through `convex/binder.ts` and `convex/fixtures.ts`. The frontend reads it with live Convex queries and only uses Zustand for local UI state such as selected tabs and dialog state.
