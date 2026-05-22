# Backend Setup Quick Start

Get the APS token backend running in 5 minutes.

## Local Development (for testing)

### 1. Install dependencies
```bash
npm install
```

This installs `wrangler` (Cloudflare CLI) and other dev tools.

### 2. Start the worker
```bash
npm run dev:worker
```

The worker runs at `http://localhost:8787`. Your `.env.local` already points to it.

### 3. In another terminal, start the frontend
```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 4. Test the CAD viewer
- Open http://localhost:5173
- Go to the mechanical section
- The CAD viewer should load (watch the Network tab for `/aps/token` requests)

**What's happening:**
1. React app loads and needs a CAD viewer
2. CAD viewer needs an APS token
3. Frontend calls `http://localhost:8787/aps/token`
4. Wrangler worker responds with a fresh token
5. CAD viewer loads your model

If it doesn't work:
- Check `.env.local` has `VITE_APS_TOKEN_ENDPOINT=http://localhost:8787`
- Check both terminals are running (one for `dev`, one for `dev:worker`)
- Check browser console for error messages

## Production Deployment

### 1. Deploy the worker to Cloudflare

```bash
npm run deploy:worker
```

This:
- Builds the worker
- Uploads to Cloudflare
- Outputs your worker URL: `https://team5000-aps-token.workers.dev`

### 2. Add your secrets to Cloudflare

```bash
wrangler secret put APS_CLIENT_ID
# Paste your Autodesk app ID

wrangler secret put APS_CLIENT_SECRET
# Paste your Autodesk app secret
```

### 3. Update your site's environment

In your GitHub Actions workflow (`.github/workflows/build-and-deploy.yml`):

```yaml
VITE_APS_TOKEN_ENDPOINT: https://team5000-aps-token.workers.dev
```

### 4. Push to GitHub

```bash
git add .
git commit -m "Add Cloudflare Worker for APS tokens"
git push origin main
```

GitHub Actions will:
1. Build your site
2. Deploy to GitHub Pages
3. Deploy the worker to Cloudflare (if you added the secret)

## File Structure

```
.
├── worker/                    # Cloudflare Worker code
│   └── src/
│       └── index.ts          # Token endpoint handler
├── wrangler.toml             # Worker config
├── WORKER_SETUP.md           # Detailed worker guide
└── GITHUB_PAGES_SETUP.md     # Full deployment guide
```

## What Gets Deployed Where

| Code | Deployed To | Updated By |
|------|------------|-----------|
| `src/` + `dist/` | GitHub Pages | `npm run build` + git push |
| `worker/src/` | Cloudflare Workers | `npm run deploy:worker` + wrangler |
| Secrets | Cloudflare | `wrangler secret put` |

## Next Steps

1. **Local testing**: `npm run dev:worker` + `npm run dev`
2. **Deploy worker**: `npm run deploy:worker` (requires Cloudflare account)
3. **Deploy site**: Push to `main` branch (GitHub Actions handles it)

Need help? See the detailed guides:
- [WORKER_SETUP.md](./WORKER_SETUP.md) - Cloudflare Worker details
- [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) - GitHub Pages + custom domain
