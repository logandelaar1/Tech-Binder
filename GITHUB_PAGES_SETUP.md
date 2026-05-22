# GitHub Pages Deployment Guide

This guide explains how to deploy your tech binder to GitHub Pages with a Cloudflare Worker backend for APS token generation.

## Architecture Overview

```
GitHub Pages (Static Site) ← requests APS token from → Cloudflare Worker ← requests token from → Autodesk APS API
github.com/your-org/repo        (yourdomain.com)            (worker.dev)                      (api.autodesk.com)
```

## Step 1: Setup GitHub Pages

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** (left sidebar)
3. Select **Deploy from a branch**
4. Choose branch: `main`
5. Choose folder: `/` (root)
6. Click **Save**

GitHub will now deploy the `dist/` folder (built output) automatically on every push.

### 2. Configure Build Settings

Create or update `.github/workflows/build-and-deploy.yml`:

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build
        env:
          VITE_APS_TOKEN_ENDPOINT: https://team5000-aps-token.workers.dev
          VITE_APS_MODEL_URN: ${{ secrets.APS_MODEL_URN }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Replace `team5000-aps-token.workers.dev` with your actual worker URL.

## Step 2: Deploy Cloudflare Worker

See [WORKER_SETUP.md](./WORKER_SETUP.md) for detailed worker deployment instructions.

Quick version:

1. Install Wrangler: `npm install -g wrangler`
2. Deploy: `wrangler deploy`
3. Add secrets:
   ```bash
   wrangler secret put APS_CLIENT_ID
   wrangler secret put APS_CLIENT_SECRET
   ```

## Step 3: Configure Secrets

In your GitHub repository settings (**Settings** → **Secrets and variables** → **Actions**):

Add these secrets:

- `CLOUDFLARE_API_TOKEN` - From Cloudflare dashboard
- `CLOUDFLARE_ACCOUNT_ID` - From Cloudflare dashboard
- `APS_CLIENT_ID` - Your Autodesk app ID
- `APS_CLIENT_SECRET` - Your Autodesk app secret
- `APS_MODEL_URN` - Your APS model URN (base64-encoded)

The worker deployment workflow (`.github/workflows/deploy-worker.yml`) will use these to deploy updates.

## Step 4: Custom Domain (Optional)

### Option A: Using Cloudflare

If using Cloudflare for your domain:

1. Add your domain to Cloudflare (migrate nameservers from your registrar)
2. Add a CNAME record:
   - Name: `@` (or your subdomain)
   - Content: `your-username.github.io`
   - Proxy: Cloudflare (orange cloud)

3. Update GitHub Pages custom domain:
   - Settings → Pages → Custom domain
   - Enter your domain
   - Enforce HTTPS (check box)

4. Create a worker route:
   - Cloudflare Dashboard → Workers & Pages → Routes
   - Pattern: `yoursite.com/api/aps/*`
   - Worker: `team5000-aps-token`
   - Update `VITE_APS_TOKEN_ENDPOINT` to `https://yoursite.com/api/aps`

### Option B: Using GitHub-Provided Domain

GitHub will provide a domain like `your-username.github.io`. Use that directly.

Update your environment:
```yaml
VITE_APS_TOKEN_ENDPOINT: https://team5000-aps-token.workers.dev
```

## Step 5: Environment Variables

Your build needs:

- `VITE_APS_TOKEN_ENDPOINT` - Worker URL (public, used by browser)
- `VITE_APS_MODEL_URN` - Model URN (public, base64-encoded)

The worker needs (in Cloudflare secrets):

- `APS_CLIENT_ID` - Never exposed to browser
- `APS_CLIENT_SECRET` - Never exposed to browser

## Step 6: Verification

After deployment:

1. Navigate to your GitHub Pages URL
2. The CAD viewer should load
3. Check browser DevTools → Network:
   - See requests to your worker endpoint
   - Verify no requests to `api.autodesk.com` from the browser

## Troubleshooting

### Worker not responding

- Check Cloudflare dashboard for worker status
- Verify secrets are set: `wrangler secret list`
- Check logs: `wrangler tail`

### CAD viewer not loading

- Check VITE_APS_TOKEN_ENDPOINT is correct
- Check VITE_APS_MODEL_URN is valid
- Check browser console for error messages
- Verify worker endpoint is accessible (try `/aps/token` in browser)

### CORS errors

- Worker sets CORS headers automatically
- Verify worker is responding with 200 status
- Check `Access-Control-Allow-Origin` header includes your site

## Security Notes

✅ **Public (safe to commit):**
- `VITE_APS_MODEL_URN` - Base64-encoded object ID

✅ **Secrets (never commit):**
- `APS_CLIENT_ID` - Never exposed to browser
- `APS_CLIENT_SECRET` - Never exposed to browser
- Stored only in Cloudflare and GitHub secrets

Never hardcode credentials in client code or environment files.

## Cost

- **GitHub Pages** - Free
- **Cloudflare Workers** - Free tier (100k requests/day)
- **Autodesk APS** - Only charged for heavy usage; viewer tokens are free

Total cost: $0/month for typical usage
