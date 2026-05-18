import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  siteContent: defineTable({
    key: v.string(),
    content: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
  engineeringNotes: defineTable({
    author: v.string(),
    title: v.string(),
    tag: v.string(),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
  apsModels: defineTable({
    key: v.string(),
    name: v.string(),
    urn: v.string(),
    objectId: v.string(),
    objectKey: v.string(),
    bucketKey: v.string(),
    rootFilename: v.optional(v.string()),
    status: v.string(),
    progress: v.optional(v.string()),
    subsystemDbIds: v.optional(v.any()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
})
