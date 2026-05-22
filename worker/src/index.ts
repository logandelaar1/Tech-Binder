interface Env {
  APS_CLIENT_ID: string
  APS_CLIENT_SECRET: string
  ENVIRONMENT: string
}

interface ApsTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

const APS_AUTH_URL = "https://developer.api.autodesk.com/authentication/v2/token"
const APS_SCOPES = "data:read"

async function getApsToken(env: Env): Promise<ApsTokenResponse> {
  const params = new URLSearchParams()
  params.append("client_id", env.APS_CLIENT_ID)
  params.append("client_secret", env.APS_CLIENT_SECRET)
  params.append("grant_type", "client_credentials")
  params.append("scope", APS_SCOPES)

  const response = await fetch(APS_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`APS auth failed: ${response.status} ${text}`)
  }

  const data = (await response.json()) as ApsTokenResponse
  return data
}

function createCorsHeaders(origin: string | null | undefined): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  }
}

async function handleToken(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const token = await getApsToken(env)
    const origin = request.headers.get("Origin")
    const headers = {
      "Content-Type": "application/json",
      ...createCorsHeaders(origin),
    }

    return new Response(
      JSON.stringify({
        access_token: token.access_token,
        expires_in: token.expires_in,
      }),
      {
        status: 200,
        headers,
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const origin = request.headers.get("Origin")
    const headers = {
      "Content-Type": "application/json",
      ...createCorsHeaders(origin),
    }

    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 500,
        headers,
      }
    )
  }
}

function handleOptions(request: Request): Response {
  const origin = request.headers.get("Origin")
  return new Response(null, {
    status: 204,
    headers: createCorsHeaders(origin),
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname === "/aps/token") {
      if (request.method === "OPTIONS") {
        return handleOptions(request)
      }
      if (request.method === "GET" || request.method === "POST") {
        return handleToken(request, env)
      }
      return new Response("Method not allowed", { status: 405 })
    }

    return new Response("Not found", { status: 404 })
  },
} satisfies ExportedHandler<Env>
