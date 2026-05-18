import { execFileSync } from "node:child_process"
import { basename, extname, resolve } from "node:path"
import { open, stat } from "node:fs/promises"

import { AuthenticationClient, Scopes } from "@aps_sdk/authentication"
import {
  ModelDerivativeClient,
  OutputType,
  Region as DerivativeRegion,
  View,
  type JobPayload,
  type Manifest,
} from "@aps_sdk/model-derivative"
import {
  OssClient,
  PolicyKey,
  Region as OssRegion,
  type ObjectDetails,
} from "@aps_sdk/oss"
import { ConvexHttpClient } from "convex/browser"

import { api } from "../convex/_generated/api"

const DEFAULT_MODEL_KEY = "team5000-final-icarus"
const UPLOAD_CHUNK_SIZE = 16 * 1024 * 1024

type UploadOptions = {
  filePath: string
  bucketKey: string
  objectKey: string
  modelKey: string
  modelName: string
  rootFilename?: string
  wait: boolean
  skipUpload: boolean
}

function argValue(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function hasArg(name: string) {
  return process.argv.includes(name)
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function toBucketKey(clientId: string) {
  return `team5000-tech-binder-${clientId.slice(0, 18)}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 128)
}

function toObjectKey(filePath: string) {
  const extension = extname(filePath).toLowerCase() || ".f3z"
  return `final-icarus-${new Date().toISOString().slice(0, 10)}${extension}`
}

function toUrlSafeBase64(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function readF3zRootFilename(filePath: string) {
  if (extname(filePath).toLowerCase() !== ".f3z") return undefined

  const manifest = execFileSync("unzip", ["-p", filePath, "Manifest.json"], {
    encoding: "utf8",
  })
  const parsed = JSON.parse(manifest) as { root?: string }

  return parsed.root
}

function getErrorStatus(error: unknown) {
  const candidate = error as {
    status?: number
    statusCode?: number
    response?: { status?: number }
    axiosError?: { response?: { status?: number } }
  }

  return (
    candidate.status ??
    candidate.statusCode ??
    candidate.response?.status ??
    candidate.axiosError?.response?.status
  )
}

async function ensureBucket(
  oss: OssClient,
  bucketKey: string,
  accessToken: string
) {
  try {
    await oss.getBucketDetails(bucketKey, { accessToken })
    console.log(`Using existing APS bucket: ${bucketKey}`)
  } catch (error) {
    if (getErrorStatus(error) !== 404) throw error

    console.log(`Creating APS bucket: ${bucketKey}`)
    await oss.createBucket(
      OssRegion.Us,
      { bucketKey, policyKey: PolicyKey.Persistent },
      { accessToken }
    )
  }
}

async function pollManifest(
  derivative: ModelDerivativeClient,
  urn: string,
  accessToken: string,
  maxMinutes: number
) {
  const startedAt = Date.now()
  const maxMs = maxMinutes * 60 * 1000

  while (Date.now() - startedAt < maxMs) {
    try {
      const manifest = await derivative.getManifest(urn, {
        accessToken,
        region: DerivativeRegion.Us,
      })
      console.log(
        `Translation status: ${manifest.status} (${manifest.progress})`
      )

      if (["success", "failed", "timeout"].includes(manifest.status)) {
        return manifest
      }
    } catch (error) {
      if (getErrorStatus(error) !== 404) throw error
      console.log("Translation manifest not ready yet.")
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 20_000))
  }

  throw new Error(`Timed out waiting ${maxMinutes} minutes for translation.`)
}

async function uploadLargeObject(
  oss: OssClient,
  options: UploadOptions,
  accessToken: string,
  fileSize: number
): Promise<ObjectDetails> {
  const numberOfParts = Math.ceil(fileSize / UPLOAD_CHUNK_SIZE)
  let uploadKey: string | undefined
  let uploadedParts = 0
  const file = await open(options.filePath, "r")

  try {
    for (let firstPart = 1; firstPart <= numberOfParts; ) {
      const parts = Math.min(25, numberOfParts - firstPart + 1)
      const signed = await oss.signedS3Upload(
        options.bucketKey,
        options.objectKey,
        {
          accessToken,
          firstPart,
          parts,
          uploadKey,
          minutesExpiration: 60,
          useAcceleration: false,
        }
      )
      uploadKey = signed.uploadKey

      for (let index = 0; index < signed.urls.length; index += 1) {
        const partNumber = firstPart + index
        const start = (partNumber - 1) * UPLOAD_CHUNK_SIZE
        const size = Math.min(UPLOAD_CHUNK_SIZE, fileSize - start)
        const buffer = Buffer.allocUnsafe(size)
        const { bytesRead } = await file.read(buffer, 0, size, start)
        const body = bytesRead === size ? buffer : buffer.subarray(0, bytesRead)
        let response: Response | undefined

        for (let attempt = 1; attempt <= 3; attempt += 1) {
          response = await fetch(signed.urls[index], {
            method: "PUT",
            body,
          })

          if (response.ok) break
          if (attempt === 3) {
            throw new Error(
              `Part ${partNumber} upload failed: ${response.status}`
            )
          }
        }

        uploadedParts += 1

        const progress = Math.floor((uploadedParts / numberOfParts) * 100)
        if (progress % 5 === 0 || progress === 100) {
          console.log(`Upload progress: ${progress}%`)
        }
      }

      firstPart += parts
    }
  } finally {
    await file.close()
  }

  if (!uploadKey) {
    throw new Error("APS did not return an upload key.")
  }

  const complete = await oss.completeSignedS3Upload(
    options.bucketKey,
    options.objectKey,
    "application/json",
    {
      uploadKey,
      size: fileSize,
    },
    {
      accessToken,
      xAdsMetaContentType: "application/octet-stream",
    }
  )

  return {
    bucketKey: options.bucketKey,
    objectKey: options.objectKey,
    objectId: `urn:adsk.objects:os.object:${options.bucketKey}/${options.objectKey}`,
    size: fileSize,
    contentType: "application/octet-stream",
    ...(complete.content as Partial<ObjectDetails> | undefined),
  }
}

function parseOptions(): UploadOptions {
  const fileArg = argValue("--file") ?? process.argv[2]
  if (!fileArg || fileArg.startsWith("--")) {
    throw new Error(
      "Usage: bun run aps:upload -- --file /path/to/model.f3z [--wait]"
    )
  }

  const filePath = resolve(fileArg)
  const clientId = requiredEnv("APS_CLIENT_ID")
  const rootFilename = argValue("--root") ?? readF3zRootFilename(filePath)

  return {
    filePath,
    bucketKey: argValue("--bucket") ?? toBucketKey(clientId),
    objectKey: argValue("--object") ?? toObjectKey(filePath),
    modelKey: argValue("--model-key") ?? DEFAULT_MODEL_KEY,
    modelName: argValue("--name") ?? basename(filePath),
    rootFilename,
    wait: hasArg("--wait"),
    skipUpload: hasArg("--skip-upload"),
  }
}

async function main() {
  const options = parseOptions()
  const clientId = requiredEnv("APS_CLIENT_ID")
  const clientSecret = requiredEnv("APS_CLIENT_SECRET")
  const convexUrl = requiredEnv("VITE_CONVEX_URL")
  const fileStats = await stat(options.filePath)

  console.log(`Preparing ${options.modelName}`)
  console.log(`File size: ${(fileStats.size / 1024 / 1024).toFixed(1)} MB`)
  if (options.rootFilename) {
    console.log(`Root file: ${options.rootFilename}`)
  }

  const auth = new AuthenticationClient()
  const token = await auth.getTwoLeggedToken(clientId, clientSecret, [
    Scopes.BucketCreate,
    Scopes.BucketRead,
    Scopes.DataCreate,
    Scopes.DataRead,
    Scopes.DataWrite,
    Scopes.ViewablesRead,
  ])
  const accessToken = token.access_token

  const oss = new OssClient()
  await ensureBucket(oss, options.bucketKey, accessToken)

  let objectDetails: ObjectDetails
  if (options.skipUpload) {
    console.log(`Reusing uploaded object ${options.objectKey}`)
    objectDetails = await oss.getObjectDetails(options.bucketKey, options.objectKey, {
      accessToken,
    })
  } else {
    console.log(`Uploading as ${options.objectKey}`)
    objectDetails = await uploadLargeObject(
      oss,
      options,
      accessToken,
      fileStats.size
    )
  }

  if (!objectDetails.objectId) {
    throw new Error("APS upload did not return an objectId.")
  }

  const objectId = objectDetails.objectId
  const urn = toUrlSafeBase64(objectId)
  const derivative = new ModelDerivativeClient()
  const job: JobPayload = {
    input: {
      urn,
      compressedUrn: Boolean(options.rootFilename),
      rootFilename: options.rootFilename,
    },
    output: {
      formats: [{ type: OutputType.Svf2, views: [View._2d, View._3d] }],
    },
  }

  console.log("Starting SVF2 translation")
  await derivative.startJob(job, {
    accessToken,
    xAdsForce: true,
    region: DerivativeRegion.Us,
  })

  const convex = new ConvexHttpClient(convexUrl)
  async function storeModelStatus(status: string, progress?: string) {
    await convex.mutation(api.aps.upsertModel, {
      key: options.modelKey,
      name: options.modelName,
      urn,
      objectId,
      objectKey: options.objectKey,
      bucketKey: options.bucketKey,
      rootFilename: options.rootFilename,
      status,
      progress,
    })
  }

  await storeModelStatus("inprogress", "0% complete")

  let manifest: Manifest | undefined
  if (options.wait) {
    manifest = await pollManifest(derivative, urn, accessToken, 45)
  }

  const status = manifest?.status ?? "inprogress"
  const progress = manifest?.progress ?? "0%"
  await storeModelStatus(status, progress)

  console.log("Stored APS model metadata in Convex.")
  console.log(`URN: ${urn}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
