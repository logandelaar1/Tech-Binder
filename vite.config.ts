import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import type { Connect, Plugin } from "vite"
import { defineConfig, loadEnv } from "vite"

function apsTokenProxy(clientId?: string, clientSecret?: string): Plugin {
  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.url !== "/_api/aps/token") {
      next()
      return
    }

    if (!clientId || !clientSecret) {
      res.statusCode = 503
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({ error: "APS_CLIENT_ID or APS_CLIENT_SECRET not set in .env.local" }))
      return
    }

    try {
      const response = await fetch(
        "https://developer.api.autodesk.com/authentication/v2/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            scope: "data:read",
            client_id: clientId,
            client_secret: clientSecret,
          }),
        }
      )

      const data = await response.json()
      res.setHeader("Content-Type", "application/json")
      res.setHeader("Cache-Control", "no-store")
      res.end(JSON.stringify(data))
    } catch {
      res.statusCode = 500
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({ error: "APS token request failed" }))
    }
  }

  return {
    name: "aps-token-proxy",
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv with an empty prefix also reads non-VITE_ vars (e.g. APS secrets)
  // from .env.local — Vite does not put those on process.env automatically.
  const env = loadEnv(mode, process.cwd(), "")

  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1]
  const githubPagesBase =
    process.env.GITHUB_ACTIONS === "true" && repositoryName
      ? `/${repositoryName}/`
      : "/"
  const base = env.VITE_BASE_PATH || githubPagesBase

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      apsTokenProxy(env.APS_CLIENT_ID, env.APS_CLIENT_SECRET),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
