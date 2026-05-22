# Cloudflare Worker Setup for APS Token Proxy

This Cloudflare Worker handles securely generating Autodesk Platform Services (APS) access tokens for the CAD viewer. It keeps your APS credentials out of the browser bundle.

## Local Development

### Prerequisites

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Ensure your `.env.local` has:
   - `APS_CLIENT_ID` - Your APS app ID
   - `APS_CLIENT_SECRET` - Your APS app secret
   - `VITE_APS_TOKEN_ENDPOINT=http://localhost:8787`

### Running Locally

Start the worker in development mode:
```bash
wrangler dev
```

The worker will be available at `http://localhost:8787`. The frontend will automatically call `http://localhost:8787/aps/token` when the CAD viewer loads.

## Production Deployment

### 1. Create a Cloudflare Account

Sign up at [https://dash.cloudflare.com](https://dash.cloudflare.com) (free tier available).

### 2. Deploy the Worker

```bash
wrangler deploy
```

This will:
- Bundle and deploy the worker code
- Output your worker URL (e.g., `https://team5000-aps-token.workers.dev`)

### 3. Configure Secrets

Add your APS credentials as Cloudflare secrets:

```bash
wrangler secret put APS_CLIENT_ID
# Paste your client ID when prompted

wrangler secret put APS_CLIENT_SECRET
# Paste your client secret when prompted
```

Secrets are encrypted and never exposed in logs or to the browser.

### 4. Update Your Site

Update your GitHub Pages site's environment to use the production worker URL:

Set `VITE_APS_TOKEN_ENDPOINT` to your worker URL in your build environment:
- For GitHub Actions: Add a secret in your repo settings
- For local builds: Update `.env.local`

Example:
```
VITE_APS_TOKEN_ENDPOINT=https://team5000-aps-token.workers.dev
```

## Custom Domain (Optional)

If you have a custom domain, you can route requests through Cloudflare:

1. Add your domain to Cloudflare (migrate nameservers)
2. Create a route in your worker:
   - Pattern: `yoursite.com/api/aps/*`
   - Worker: `team5000-aps-token`

Then use `https://yoursite.com/api/aps/token` as your endpoint.

## Monitoring & Debugging

Check logs for your deployed worker:

```bash
wrangler tail
```

## Rate Limiting

The free tier allows 100,000 requests/day. Tokens are cached by the APS API for their lifetime (typically 1 hour), so actual requests to Autodesk are minimal.
