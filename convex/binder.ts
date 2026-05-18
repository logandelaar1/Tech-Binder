import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { binderContent, initialNotes, SITE_KEY } from "./fixtures"

export const get = query({
  args: {},
  handler: async (ctx) => {
    const site = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", SITE_KEY))
      .unique()

    const liveNotes = await ctx.db
      .query("engineeringNotes")
      .withIndex("by_createdAt")
      .order("desc")
      .take(8)

    return {
      ...(site?.content ?? binderContent),
      liveNotes,
    }
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const site = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", SITE_KEY))
      .unique()

    if (site) {
      await ctx.db.patch(site._id, {
        content: binderContent,
        updatedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("siteContent", {
        key: SITE_KEY,
        content: binderContent,
        updatedAt: Date.now(),
      })
    }

    const existingNotes = await ctx.db.query("engineeringNotes").collect()
    for (const note of existingNotes) {
      await ctx.db.delete(note._id)
    }

    for (const note of initialNotes) {
      await ctx.db.insert("engineeringNotes", note)
    }

    return { seeded: true }
  },
})

export const addNote = mutation({
  args: {
    author: v.string(),
    title: v.string(),
    tag: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const author = args.author.trim().slice(0, 64) || "Team 5000"
    const title = args.title.trim().slice(0, 96)
    const tag = args.tag.trim().slice(0, 32) || "Engineering"
    const body = args.body.trim().slice(0, 500)

    if (title.length < 3 || body.length < 12) {
      throw new Error("Add a title and a short engineering note.")
    }

    return await ctx.db.insert("engineeringNotes", {
      author,
      title,
      tag,
      body,
      createdAt: Date.now(),
    })
  },
})
