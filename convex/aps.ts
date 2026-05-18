import { action, mutation, query } from "./_generated/server"
import { v } from "convex/values"

declare const process: {
  env: Record<string, string | undefined>
}

const DEFAULT_MODEL_KEY = "team5000-final-icarus"
const APS_AUTH_URL = "https://developer.api.autodesk.com/authentication/v2/token"
const APS_MANIFEST_URL =
  "https://developer.api.autodesk.com/modelderivative/v2/designdata"

type ManifestMessage = {
  type?: string
  message?: string
  code?: string
}

function getApsCredentials() {
  const clientId = process.env.APS_CLIENT_ID
  const clientSecret = process.env.APS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Missing APS_CLIENT_ID or APS_CLIENT_SECRET.")
  }

  return { clientId, clientSecret }
}

async function getApsToken(scopes: string[]) {
  const { clientId, clientSecret } = getApsCredentials()
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: scopes.join(" "),
  })

  const response = await fetch(APS_AUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`APS token request failed: ${response.status}`)
  }

  return (await response.json()) as {
    access_token: string
    expires_in: number
  }
}

function collectManifestMessages(manifest: {
  derivatives?: Array<{
    messages?: ManifestMessage[]
    children?: Array<{ messages?: ManifestMessage[] }>
  }>
}) {
  const messages: ManifestMessage[] = []

  for (const derivative of manifest.derivatives ?? []) {
    messages.push(...(derivative.messages ?? []))
    for (const child of derivative.children ?? []) {
      messages.push(...(child.messages ?? []))
    }
  }

  return messages
}

export const viewerModel = query({
  args: {
    key: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apsModels")
      .withIndex("by_key", (q) => q.eq("key", args.key ?? DEFAULT_MODEL_KEY))
      .unique()
  },
})

export const upsertModel = mutation({
  args: {
    key: v.optional(v.string()),
    name: v.string(),
    urn: v.string(),
    objectId: v.string(),
    objectKey: v.string(),
    bucketKey: v.string(),
    rootFilename: v.optional(v.string()),
    status: v.string(),
    progress: v.optional(v.string()),
    subsystemDbIds: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const key = args.key ?? DEFAULT_MODEL_KEY
    const existing = await ctx.db
      .query("apsModels")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique()

    const model: {
      key: string
      name: string
      urn: string
      objectId: string
      objectKey: string
      bucketKey: string
      rootFilename?: string
      status: string
      progress?: string
      subsystemDbIds?: unknown
      updatedAt: number
    } = {
      key,
      name: args.name,
      urn: args.urn,
      objectId: args.objectId,
      objectKey: args.objectKey,
      bucketKey: args.bucketKey,
      status: args.status,
      updatedAt: Date.now(),
    }

    if (args.rootFilename !== undefined) {
      model.rootFilename = args.rootFilename
    }
    if (args.progress !== undefined) {
      model.progress = args.progress
    }
    if (args.subsystemDbIds !== undefined) {
      model.subsystemDbIds = args.subsystemDbIds
    }

    if (existing) {
      await ctx.db.patch(existing._id, model)
      return existing._id
    }

    return await ctx.db.insert("apsModels", model)
  },
})

export const updateModelStatus = mutation({
  args: {
    key: v.optional(v.string()),
    status: v.string(),
    progress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const model = await ctx.db
      .query("apsModels")
      .withIndex("by_key", (q) => q.eq("key", args.key ?? DEFAULT_MODEL_KEY))
      .unique()

    if (!model) return null

    const patch: { status: string; progress?: string; updatedAt: number } = {
      status: args.status,
      updatedAt: Date.now(),
    }

    if (args.progress !== undefined) {
      patch.progress = args.progress
    }

    await ctx.db.patch(model._id, patch)

    return model._id
  },
})

export const getViewerToken = action({
  args: {},
  handler: async () => {
    return await getApsToken(["viewables:read"])
  },
})

export const getManifest = action({
  args: {
    urn: v.string(),
  },
  handler: async (_ctx, args) => {
    const token = await getApsToken(["data:read", "viewables:read"])
    const response = await fetch(`${APS_MANIFEST_URL}/${args.urn}/manifest`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    })

    if (response.status === 404) {
      return { status: "n/a", progress: "", messages: [] }
    }

    if (!response.ok) {
      throw new Error(`APS manifest request failed: ${response.status}`)
    }

    const manifest = (await response.json()) as {
      status?: string
      progress?: string
      derivatives?: Array<{
        messages?: ManifestMessage[]
        children?: Array<{ messages?: ManifestMessage[] }>
      }>
    }

    return {
      status: manifest.status ?? "unknown",
      progress: manifest.progress ?? "",
      messages: collectManifestMessages(manifest),
    }
  },
})
