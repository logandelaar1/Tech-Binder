import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { MousePointer2, Move, RefreshCw, ZoomIn } from "lucide-react"

import { assetPath } from "@/lib/assets"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/store/ui-store"

type ViewerSubsystem = {
  id: string
  label: string
  match: string
  description: string
  mechanicalSystemId: string
  namePatterns: string[]
}

type ViewableOption = {
  id: string
  label: string
  node: Autodesk.Viewing.BubbleNode
}

const APS_MODEL_URN = import.meta.env.VITE_APS_MODEL_URN as string | undefined


const APS_TOKEN_ENDPOINT =

  import.meta.env.VITE_APS_TOKEN_ENDPOINT as string | undefined



type ViewerWindow = Window & {
  THREE?: {
    Box3: new (min?: THREE.Vector3, max?: THREE.Vector3) => THREE.Box3
    Vector3: new (x?: number, y?: number, z?: number) => THREE.Vector3
  }
}

type ViewerDebugWindow = Window & {
  __team5000ApsModel?: Autodesk.Viewing.Model
  __team5000ApsViewer?: Autodesk.Viewing.Viewer3D
}

type PanelPosition = "left" | "right"
type FocusMode = "isolate" | "ghost"
type ExplodeOptions = {
  depthDampening?: number
  magnitude?: number
}

type ApsCadViewerProps = {
  panelPosition?: PanelPosition
  onFocusChange?: (subsystemId: string) => void
  showSubsystemControls?: boolean
  systemControls?: ReactNode
  className?: string
}

const APS_VIEWER_ASSETS = [
  {
    script:
      "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.109/viewer3D.min.js",
    style:
      "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.109/style.min.css",
  },
  {
    script:
      "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.108/viewer3D.min.js",
    style:
      "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.108/style.min.css",
  },
]

const viewerSubsystems: ViewerSubsystem[] = [
  {
    id: "super-structure",
    label: "Superstructure",
    match: "Expandable hopper",
    description: "Frame:1, Bumpers:1, and Top Plate:1 package.",
    mechanicalSystemId: "super-structure",
    namePatterns: [
      "frame:1",
      "bumpers:1",
      "top plate:1",
      "frame",
      "bumpers",
      "top plate",
    ],
  },
  {
    id: "dual-intake",
    label: "Intakes",
    match: "Dual intake system",
    description: "Large Intake:1 and Small Intake:1.",
    mechanicalSystemId: "dual-intake",
    namePatterns: [
      "large intake:1",
      "small intake:1",
      "large intake",
      "small intake",
    ],
  },
  {
    id: "dye-rotor",
    label: "Dye rotor",
    match: "Dye rotor",
    description: "Dye Rotor Full assembly:1.",
    mechanicalSystemId: "dye-rotor",
    namePatterns: [
      "dye rotor full assembly:1",
      "dye rotor full assembly",
      "dye rotor",
    ],
  },
  {
    id: "turret",
    label: "Turret",
    match: "Inverted pancake turret",
    description: "Turret (1):1.",
    mechanicalSystemId: "turret",
    namePatterns: ["turret (1):1", "turret (1)", "turret"],
  },
]

async function apsTokenProvider(
  callback: (token: string, expiresIn: number) => void
) {
  const response = await fetch(APS_TOKEN_ENDPOINT ?? "/_api/aps/token")

  if (!response.ok) {
    throw new Error(
      `APS token endpoint returned ${response.status}. Run \`npm run dev\` to enable the live CAD viewer.`
    )
  }

  const data = await response.json() as {
    access_token?: string
    expires_in?: number
    error?: string
  }

  if (data.error || !data.access_token) {
    throw new Error(data.error ?? "APS token response missing access_token.")
  }

  callback(data.access_token, data.expires_in ?? 3_600)
}

let apsViewerAssetsPromise: Promise<void> | undefined

function loadApsViewerAssets() {
  if (apsViewerAssetsPromise) return apsViewerAssetsPromise

  apsViewerAssetsPromise = loadApsViewerAssetsFromNetwork().catch((error) => {
    apsViewerAssetsPromise = undefined
    throw error
  })

  return apsViewerAssetsPromise
}

async function loadApsViewerAssetsFromNetwork() {
  if (window.Autodesk?.Viewing) return

  let lastError: unknown

  for (const assets of APS_VIEWER_ASSETS) {
    removeStaleApsViewerAssets(assets)
    ensureApsViewerStyle(assets.style)

    try {
      await appendApsViewerScript(assets.script)

      if (window.Autodesk?.Viewing) return

      throw new Error("APS Viewer loaded without exposing Autodesk.Viewing.")
    } catch (error) {
      lastError = error
      removeApsViewerScript(assets.script)
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to load APS Viewer.")
}

function ensureApsViewerStyle(styleHref: string) {
  if (
    Array.from(document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']")).some(
      (link) => link.href === styleHref
    )
  ) {
    return
  }

  const link = document.createElement("link")
  link.dataset.team5000ApsAsset = "true"
  link.rel = "stylesheet"
  link.href = styleHref
  document.head.appendChild(link)
}

function appendApsViewerScript(scriptSrc: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.async = true
    script.dataset.team5000ApsAsset = "true"
    script.src = scriptSrc
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load APS Viewer."))
    document.head.appendChild(script)
  })
}

function removeApsViewerScript(scriptSrc: string) {
  for (const script of document.querySelectorAll<HTMLScriptElement>("script[src]")) {
    if (script.src === scriptSrc) script.remove()
  }
}

function removeStaleApsViewerAssets(activeAssets: {
  script: string
  style: string
}) {
  if (window.Autodesk?.Viewing) return

  for (const script of document.querySelectorAll<HTMLScriptElement>("script[src]")) {
    if (
      script.src.includes("/modelderivative/v2/viewers/") &&
      script.src !== activeAssets.script
    ) {
      script.remove()
    }
  }

  for (const link of document.querySelectorAll<HTMLLinkElement>("link[href]")) {
    if (
      link.href.includes("/modelderivative/v2/viewers/") &&
      link.href !== activeAssets.style
    ) {
      link.remove()
    }
  }
}


function normalizeNodeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}

function collectNodeWithDescendants(
  tree: Autodesk.Viewing.InstanceTree,
  rootDbId: number
) {
  const dbIds: number[] = []

  function visit(dbId: number) {
    dbIds.push(dbId)
    tree.enumNodeChildren(dbId, visit, false)
  }

  visit(rootDbId)

  return dbIds
}

function collectSubsystemDbIds(model: Autodesk.Viewing.Model) {
  const tree = model.getInstanceTree()
  const nextMatches: Record<string, number[]> = Object.fromEntries(
    viewerSubsystems.map((subsystem) => [subsystem.id, []])
  )

  if (!tree) return nextMatches

  function visit(dbId: number) {
    const nodeName = normalizeNodeName(tree.getNodeName(dbId) ?? "")

    for (const subsystem of viewerSubsystems) {
      if (
        subsystem.namePatterns.some((pattern) =>
          nodeName.includes(normalizeNodeName(pattern))
        )
      ) {
        nextMatches[subsystem.id].push(...collectNodeWithDescendants(tree, dbId))
      }
    }

    tree.enumNodeChildren(dbId, visit, false)
  }

  visit(tree.getRootId())

  for (const subsystem of viewerSubsystems) {
    nextMatches[subsystem.id] = [...new Set(nextMatches[subsystem.id])]
  }

  return nextMatches
}

function collectAllDbIds(model: Autodesk.Viewing.Model) {
  const tree = model.getInstanceTree()
  const dbIds: number[] = []

  if (!tree) return dbIds

  function visit(dbId: number) {
    dbIds.push(dbId)
    tree.enumNodeChildren(dbId, visit, false)
  }

  visit(tree.getRootId())

  return [...new Set(dbIds)]
}

function setNodesOff(
  viewer: Autodesk.Viewing.Viewer3D,
  model: Autodesk.Viewing.Model,
  dbIds: number[],
  off: boolean
) {
  const viewerImpl = viewer.impl as Autodesk.Viewing.Viewer3D["impl"] & {
    visibilityManager?: {
      setNodeOff?: (
        dbId: number,
        off: boolean,
        model?: Autodesk.Viewing.Model
      ) => void
    }
  }

  for (const dbId of dbIds) {
    viewerImpl.visibilityManager?.setNodeOff?.(dbId, off, model)
  }
}

function showCompleteAssembly(
  viewer: Autodesk.Viewing.Viewer3D,
  model: Autodesk.Viewing.Model
) {
  const allDbIds = collectAllDbIds(model)

  viewer.clearSelection()
  viewer.isolate([])
  viewer.showAll()
  setNodesOff(viewer, model, allDbIds, false)
  viewer.show(allDbIds, model)
  viewer.impl.invalidate(true, true, true)
}

function cleanViewableLabel(node: Autodesk.Viewing.BubbleNode, index: number) {
  const rawLabel = String(node.name() || node.getModelName() || "")

  try {
    const parsed = JSON.parse(rawLabel) as {
      name?: string
      type?: string
      asset?: string
    }
    if (parsed.name) return parsed.name
    if (parsed.type || parsed.asset) {
      return index === 0 ? "Default configuration" : `Configuration ${index + 1}`
    }
  } catch {
    // APS can expose Fusion config metadata as JSON strings; plain labels pass through.
  }

  if (!rawLabel || rawLabel.includes('"asset"') || rawLabel.includes("[object")) {
    return index === 0 ? "Default configuration" : `Configuration ${index + 1}`
  }

  return rawLabel
}

function getViewableOptions(document: Autodesk.Viewing.Document): ViewableOption[] {
  const nodes = document.getRoot().search({ type: "geometry", role: "3d" })
  const viewables = nodes.length > 0 ? nodes : [document.getRoot().getDefaultGeometry()]

  return viewables
    .filter(Boolean)
    .map((node, index) => {
      const label = cleanViewableLabel(node, index)
      return {
        id: label,
        label,
        node,
      }
    })
}

function syncViewerBackground(viewer: Autodesk.Viewing.Viewer3D) {
  const viewerWithBackground = viewer as Autodesk.Viewing.Viewer3D & {
    setEnvMapBackground?: (enabled: boolean) => void
    setGroundShadow?: (enabled: boolean) => void
    setGroundReflection?: (enabled: boolean) => void
    setBackgroundOpacity?: (opacity: number) => void
    setBackgroundColor?: (
      redTop: number,
      greenTop: number,
      blueTop: number,
      redBottom: number,
      greenBottom: number,
      blueBottom: number
    ) => void
  }

  viewerWithBackground.setEnvMapBackground?.(false)
  viewerWithBackground.setGroundShadow?.(false)
  viewerWithBackground.setGroundReflection?.(false)
  viewerWithBackground.setBackgroundOpacity?.(0)
  viewerWithBackground.setBackgroundColor?.(255, 255, 255, 255, 255, 255)

  const viewerImpl = viewer.impl as Autodesk.Viewing.Viewer3D["impl"] & {
    renderer?: () => {
      setClearAlpha?: (alpha: number) => void
      setClearColor?: (color: number | string, alpha?: number) => void
    }
    glrenderer?: () => {
      setClearAlpha?: (alpha: number) => void
      setClearColor?: (color: number | string, alpha?: number) => void
    }
  }

  const renderer = viewerImpl.renderer?.() ?? viewerImpl.glrenderer?.()
  renderer?.setClearAlpha?.(0)
  renderer?.setClearColor?.(0xffffff, 0)
  viewerImpl.glrenderer?.()?.setClearColor?.(0xffffff, 0)
}

function setViewerGhosting(
  viewer: Autodesk.Viewing.Viewer3D,
  enabled: boolean
) {
  const viewerWithGhosting = viewer as Autodesk.Viewing.Viewer3D & {
    setGhosting?: (enabled: boolean) => void
  }

  viewerWithGhosting.setGhosting?.(enabled)
}

function getDbIdsBounds(model: Autodesk.Viewing.Model, dbIds: number[]) {
  const tree = model.getInstanceTree()
  const fragments = model.getFragmentList()
  const Box = (window as ViewerWindow).THREE?.Box3

  if (!tree || !fragments || !Box || dbIds.length === 0) return null

  const bounds = new Box()
  const fragmentBounds = new Box()
  let hasBounds = false

  for (const dbId of dbIds) {
    tree.enumNodeFragments(
      dbId,
      (fragId) => {
        fragments.getWorldBounds(fragId, fragmentBounds)

        if (fragmentBounds.isEmpty()) return

        if (!hasBounds) {
          bounds.copy(fragmentBounds)
          hasBounds = true
        } else {
          bounds.union(fragmentBounds)
        }
      },
      true
    )
  }

  return hasBounds ? bounds : null
}

function setPivotToDbIds(
  viewer: Autodesk.Viewing.Viewer3D,
  model: Autodesk.Viewing.Model,
  dbIds: number[]
) {
  const Vector = (window as ViewerWindow).THREE?.Vector3
  const bounds = getDbIdsBounds(model, dbIds)

  if (!Vector || !bounds) return

  const center = new Vector()
  bounds.getCenter(center)
  viewer.navigation.setPivotPoint(center)
}

function frameDbIds(
  viewer: Autodesk.Viewing.Viewer3D,
  model: Autodesk.Viewing.Model,
  dbIds: number[]
) {
  setPivotToDbIds(viewer, model, dbIds)
  viewer.fitToView(dbIds, model, true)
  syncViewerBackground(viewer)
}

function applyViewerExplode(
  viewer: Autodesk.Viewing.Viewer3D,
  _model: Autodesk.Viewing.Model,
  scale: number,
  subsystemId: string,
  subsystemDbIds: Record<string, number[]>
) {
  const focusedDbIds =
    subsystemId === "full" ? [] : subsystemDbIds[subsystemId] ?? []
  const explodeOptions: ExplodeOptions =
    focusedDbIds.length > 0
      ? { depthDampening: 0, magnitude: 4 }
      : { depthDampening: 0, magnitude: 4 }
  const viewerWithOptions = viewer as Autodesk.Viewing.Viewer3D & {
    explode: (scale: number, options?: ExplodeOptions) => void
  }

  viewerWithOptions.explode(scale, explodeOptions)

  syncViewerBackground(viewer)
  viewer.impl.invalidate(true, true, true)
}

function tuneViewer(viewer: Autodesk.Viewing.Viewer3D, model: Autodesk.Viewing.Model) {
  const tunedViewer = viewer as Autodesk.Viewing.Viewer3D & {
    setQualityLevel?: (ambientShadows: boolean, antialiasing: boolean) => void
    setLightPreset?: (preset: number) => void
    setReverseZoomDirection?: (enabled: boolean) => void
    setZoomTowardsPivot?: (enabled: boolean) => void
    setUsePivotAlways?: (enabled: boolean) => void
    setOptimizeNavigation?: (enabled: boolean) => void
  }

  const frameModel = () => {
    const Vector = (window as ViewerWindow).THREE?.Vector3
    if (!Vector) return

    const bounds = model.getBoundingBox()
    const center = new Vector()
    const size = new Vector()
    bounds.getCenter(center)
    bounds.getSize(size)

    const radius = Math.max(size.length() / 2, 1)
    const direction = new Vector(1.15, -1.25, 0.72).normalize()
    const position = center.clone().add(direction.multiplyScalar(radius * 2.55))

    viewer.setFOV(32)
    viewer.navigation.setPivotPoint(center)
    viewer.navigation.setTarget(center)
    viewer.navigation.setView(position, center)
    viewer.impl.invalidate(true, true, true)
  }

  tunedViewer.setQualityLevel?.(true, true)
  tunedViewer.setLightPreset?.(1)
  syncViewerBackground(viewer)
  tunedViewer.setReverseZoomDirection?.(false)
  tunedViewer.setZoomTowardsPivot?.(true)
  tunedViewer.setUsePivotAlways?.(true)
  tunedViewer.setOptimizeNavigation?.(true)
  frameModel()
  window.setTimeout(frameModel, 250)
  window.setTimeout(frameModel, 1_500)
}

export function ApsCadViewer({
  panelPosition = "left",
  onFocusChange,
  showSubsystemControls = true,
  systemControls,
  className,
}: ApsCadViewerProps) {
  const selectedCadSubsystem = useUiStore(
    (state) => state.selectedCadSubsystem
  )
  const setSelectedCadSubsystem = useUiStore(
    (state) => state.setSelectedCadSubsystem
  )
  const setSelectedSystem = useUiStore((state) => state.setSelectedSystem)
  const setCadViewMode = useUiStore((state) => state.setCadViewMode)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Autodesk.Viewing.Viewer3D | null>(null)
  const loadedModelRef = useRef<Autodesk.Viewing.Model | null>(null)
  const documentRef = useRef<Autodesk.Viewing.Document | null>(null)
  const currentViewableIdRef = useRef<string>("")
  const focusGenerationRef = useRef(0)
  const [viewerReady, setViewerReady] = useState(false)
  const [geometryReady, setGeometryReady] = useState(false)
  const [viewerError, setViewerError] = useState<string | null>(null)
  const [viewables, setViewables] = useState<ViewableOption[]>([])
  const [activeViewableId, setActiveViewableId] = useState<string>("")
  const [explodeScale, setExplodeScale] = useState(0)
  const [focusMode, setFocusMode] = useState<FocusMode>("isolate")
  const [subsystemDbIds, setSubsystemDbIds] = useState<Record<string, number[]>>(
    () =>
      Object.fromEntries(
        viewerSubsystems.map((subsystem) => [subsystem.id, []])
      )
  )

  const selected = viewerSubsystems.find(
    (subsystem) => subsystem.id === selectedCadSubsystem
  )
  const loadable = Boolean(APS_MODEL_URN)

  const applyViewerFocus = useCallback(
    (subsystemId: string) => {
      const viewer = viewerRef.current
      const loadedModel = loadedModelRef.current
      if (!viewer) return

      const focusGeneration = ++focusGenerationRef.current

      if (subsystemId === "full") {
        setViewerGhosting(viewer, false)
        if (loadedModel) {
          showCompleteAssembly(viewer, loadedModel)
        } else {
          viewer.clearSelection()
          viewer.showAll()
        }
        window.setTimeout(() => {
          if (focusGeneration !== focusGenerationRef.current) return
          viewer.fitToView(null, loadedModelRef.current ?? undefined, true)
          syncViewerBackground(viewer)
        }, 60)
        return
      }

      const ids = subsystemDbIds[subsystemId] ?? []
      if (ids.length === 0) {
        viewer.clearSelection()
        return
      }

      setViewerGhosting(viewer, focusMode === "ghost")
      viewer.clearSelection()

      if (loadedModel) {
        viewer.isolate(ids, loadedModel)
        viewer.show(ids, loadedModel)
        setPivotToDbIds(viewer, loadedModel, ids)
      } else {
        viewer.isolate(ids)
      }

      syncViewerBackground(viewer)
      viewer.impl.invalidate(true, true, true)

      window.setTimeout(() => {
        if (focusGeneration !== focusGenerationRef.current) return
        const currentModel = loadedModelRef.current
        if (currentModel) {
          frameDbIds(viewer, currentModel, ids)
        } else {
          viewer.fitToView(ids, undefined, true)
        }
        syncViewerBackground(viewer)
      }, 60)
    },
    [focusMode, subsystemDbIds]
  )

  function selectSubsystem(subsystem: ViewerSubsystem) {
    setSelectedCadSubsystem(subsystem.id)
    setSelectedSystem(subsystem.mechanicalSystemId)
    setCadViewMode(subsystem.id === "super-structure" ? "powertrain" : "full")
    onFocusChange?.(subsystem.id)
  }

  function showFullAssembly() {
    setSelectedCadSubsystem("full")
    setCadViewMode("full")
    onFocusChange?.("full")
  }

  useEffect(() => {
    const knownSubsystem =
      selectedCadSubsystem === "full" ||
      viewerSubsystems.some((subsystem) => subsystem.id === selectedCadSubsystem)

    if (!knownSubsystem) {
      setSelectedCadSubsystem("full")
      setCadViewMode("full")
      onFocusChange?.("full")
    }
  }, [
    onFocusChange,
    selectedCadSubsystem,
    setCadViewMode,
    setSelectedCadSubsystem,
  ])

  useEffect(() => {
    if (!APS_MODEL_URN || !loadable || !containerRef.current) return

    let cancelled = false
    let viewer: Autodesk.Viewing.Viewer3D | null = null

    async function startViewer() {
      setViewerError(null)
      setViewerReady(false)
      setGeometryReady(false)
      await loadApsViewerAssets()

      if (cancelled || !containerRef.current) return

      const AutodeskWithPrivate = window.Autodesk as typeof window.Autodesk & {
        Viewing: typeof window.Autodesk.Viewing & {
          Private?: {
            InitParametersSetting?: {
              alpha?: boolean
            }
          }
        }
      }
      if (AutodeskWithPrivate.Viewing.Private?.InitParametersSetting) {
        AutodeskWithPrivate.Viewing.Private.InitParametersSetting.alpha = true
      }

      await new Promise<void>((resolve, reject) => {
        window.Autodesk.Viewing.Initializer(
          {
            env: "AutodeskProduction2",
            api: "streamingV2",
            getAccessToken: apsTokenProvider,
          },
          () => {
            if (cancelled || !containerRef.current) {
              resolve()
              return
            }

            viewer = new window.Autodesk.Viewing.Viewer3D(
              containerRef.current,
              {
                theme: "dark-theme",
              }
            )
            viewerRef.current = viewer
            if (import.meta.env.DEV) {
              const debugWindow = window as ViewerDebugWindow
              debugWindow.__team5000ApsViewer = viewer
            }

            const startCode = viewer.start()
            if (startCode > 0) {
              reject(new Error(`APS Viewer failed to start: ${startCode}`))
              return
            }

            window.Autodesk.Viewing.Document.load(
              `urn:${APS_MODEL_URN}`,
              (document) => {
                documentRef.current = document
                const options = getViewableOptions(document)
                setViewables(options)
                const viewable = options[0]?.node ?? document.getRoot().getDefaultGeometry()
                if (!viewable) {
                  reject(new Error("No default 3D viewable found."))
                  return
                }
                setActiveViewableId(options[0]?.id ?? "")

                const handleGeometryLoaded = () => {
                  if (cancelled) return
                  setGeometryReady(true)
                  if (viewer) {
                    syncViewerBackground(viewer)
                  }
                  viewer?.removeEventListener(
                    window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                    handleGeometryLoaded
                  )
                }

                viewer?.addEventListener(
                  window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                  handleGeometryLoaded
                )

                viewer
                  ?.loadDocumentNode(document, viewable)
                  .then((loadedModel) => {
                    if (cancelled) return

                    loadedModelRef.current = loadedModel
                    if (import.meta.env.DEV) {
                      const debugWindow = window as ViewerDebugWindow
                      debugWindow.__team5000ApsModel = loadedModel
                    }
                    currentViewableIdRef.current = options[0]?.id ?? ""
                    if (viewer) showCompleteAssembly(viewer, loadedModel)
                    if (viewer) tuneViewer(viewer, loadedModel)

                    const updateTreeMatches = () => {
                      if (cancelled) return

                      const matches = collectSubsystemDbIds(loadedModel)
                      setSubsystemDbIds(matches)
                      setViewerReady(true)
                      window.setTimeout(() => {
                        if (!cancelled && viewerRef.current === viewer) {
                          setGeometryReady(true)
                        }
                      }, 4_000)
                      resolve()
                    }

                    if (loadedModel.getInstanceTree()) {
                      updateTreeMatches()
                    } else {
                      const handleTreeCreated = () => {
                        viewer?.removeEventListener(
                          window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
                          handleTreeCreated
                        )
                        updateTreeMatches()
                      }

                      viewer?.addEventListener(
                        window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
                        handleTreeCreated
                      )
                    }
                  })
                  .catch((error: unknown) => {
                    viewer?.removeEventListener(
                      window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                      handleGeometryLoaded
                    )
                    reject(
                      error instanceof Error
                        ? error
                        : new Error("APS model load failed.")
                    )
                  })
              },
              (_errorCode, errorMessage) => {
                reject(
                  new Error(`APS document load failed: ${_errorCode} ${errorMessage ?? ""}`)
                )
              }
            )
          }
        )
      })
    }

    void startViewer().catch((error: unknown) => {
      if (!cancelled) {
        setViewerError(error instanceof Error ? error.message : "Viewer error")
      }
    })

    return () => {
      cancelled = true
      if (viewer) {
        viewer.finish()
      }
      if (viewerRef.current === viewer) {
        viewerRef.current = null
        loadedModelRef.current = null
        documentRef.current = null
      }
      if (import.meta.env.DEV) {
        const debugWindow = window as ViewerDebugWindow
        if (debugWindow.__team5000ApsViewer === viewer) {
          debugWindow.__team5000ApsViewer = undefined
          debugWindow.__team5000ApsModel = undefined
        }
      }
    }
  }, [loadable])

  useEffect(() => {
    const viewer = viewerRef.current
    const document = documentRef.current
    const viewable = viewables.find((option) => option.id === activeViewableId)
    if (!viewer || !document || !viewable || !viewerReady) return
    if (currentViewableIdRef.current === activeViewableId) return

    let cancelled = false

    async function switchViewable() {
      setViewerReady(false)
      setGeometryReady(false)
      setViewerError(null)

      if (loadedModelRef.current) {
        viewer!.unloadModel(loadedModelRef.current)
        loadedModelRef.current = null
      }

      const handleGeometryLoaded = () => {
        if (cancelled) return
        setGeometryReady(true)
        syncViewerBackground(viewer!)
        viewer!.removeEventListener(
          window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
          handleGeometryLoaded
        )
      }

      try {
        viewer!.addEventListener(
          window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
          handleGeometryLoaded
        )

        const loadedModel = await viewer!.loadDocumentNode(document!, viewable!.node)
        if (cancelled) return

        loadedModelRef.current = loadedModel
        if (import.meta.env.DEV) {
          const debugWindow = window as ViewerDebugWindow
          debugWindow.__team5000ApsModel = loadedModel
        }
        currentViewableIdRef.current = activeViewableId
        showCompleteAssembly(viewer!, loadedModel)
        tuneViewer(viewer!, loadedModel)

        const updateTreeMatches = () => {
          if (cancelled) return

          const matches = collectSubsystemDbIds(loadedModel)
          setSubsystemDbIds(matches)
          setViewerReady(true)
          window.setTimeout(() => {
            if (!cancelled && viewerRef.current === viewer) {
              setGeometryReady(true)
            }
          }, 4_000)
        }

        if (loadedModel.getInstanceTree()) {
          updateTreeMatches()
        } else {
          const handleTreeCreated = () => {
            viewer!.removeEventListener(
              window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
              handleTreeCreated
            )
            updateTreeMatches()
          }

          viewer!.addEventListener(
            window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            handleTreeCreated
          )
        }
      } catch (error) {
        viewer!.removeEventListener(
          window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
          handleGeometryLoaded
        )
        if (!cancelled) {
          setViewerError(
            error instanceof Error ? error.message : "Configuration load failed."
          )
        }
      }
    }

    void switchViewable()

    return () => {
      cancelled = true
    }
  }, [activeViewableId, viewerReady, viewables])

  useEffect(() => {
    if (!viewerReady) return

    applyViewerFocus(selectedCadSubsystem)
  }, [applyViewerFocus, focusMode, selectedCadSubsystem, viewerReady])

  useEffect(() => {
    if (!viewerReady) return

    const viewer = viewerRef.current
    const loadedModel = loadedModelRef.current
    if (!viewer || !loadedModel) return

    applyViewerExplode(
      viewer,
      loadedModel,
      explodeScale * 4,
      selectedCadSubsystem,
      subsystemDbIds
    )
  }, [
    activeViewableId,
    explodeScale,
    selectedCadSubsystem,
    subsystemDbIds,
    viewerReady,
  ])

  return (
    <div
      className={cn("aps-viewer-shell", className)}
      data-cad-focus={selectedCadSubsystem === "full" ? "full" : "subsystem"}
      data-geometry-ready={geometryReady ? "true" : "false"}
      data-panel-position={panelPosition}
      data-viewer-ready={viewerReady ? "true" : "false"}
      style={
        {
          "--aps-placeholder-image": `url("${assetPath("/media/icarus-version-2.png")}")`,
        } as CSSProperties
      }
    >
      <div
        className={cn(
          "aps-system-rail",
          !showSubsystemControls && !systemControls && "is-controls-only"
        )}
      >
        {systemControls}
        {showSubsystemControls && (
          <div className="a360-subsystem-list" aria-label="Subsystem isolation controls">
            <button
              type="button"
              className={cn(
                "a360-subsystem-row",
                selectedCadSubsystem === "full" && "is-active",
                selectedCadSubsystem !== "full" && "is-muted"
              )}
              onClick={showFullAssembly}
            >
              <span>Full assembly</span>
            </button>

            {viewerSubsystems.map((subsystem) => {
              const active = selectedCadSubsystem === subsystem.id

              return (
                <button
                  key={subsystem.id}
                  type="button"
                  className={cn(
                    "a360-subsystem-row",
                    active && "is-active",
                    selected && !active && "is-muted"
                  )}
                  onClick={() => selectSubsystem(subsystem)}
                >
                  <span>{subsystem.label}</span>
                </button>
              )
            })}
          </div>
        )}
        <div className="aps-explode-panel">
          {viewables.length > 1 && (
            <label className="aps-config-control" htmlFor="aps-config-select">
              <span>Configuration</span>
              <select
                id="aps-config-select"
                value={activeViewableId}
                onChange={(event) => {
                  setExplodeScale(0)
                  setActiveViewableId(event.currentTarget.value)
                }}
              >
                {viewables.map((viewable) => (
                  <option key={viewable.id} value={viewable.id}>
                    {viewable.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="aps-focus-mode-toggle" aria-label="Subsystem focus mode">
            <button
              type="button"
              className={cn(focusMode === "isolate" && "is-active")}
              onClick={() => setFocusMode("isolate")}
            >
              Isolate
            </button>
            <button
              type="button"
              className={cn(focusMode === "ghost" && "is-active")}
              onClick={() => setFocusMode("ghost")}
            >
              Ghost
            </button>
          </div>
          <label htmlFor="aps-explode-slider">
            <span>Explode view</span>
            <strong>{Math.round(explodeScale * 100)}%</strong>
          </label>
          <input
            id="aps-explode-slider"
            aria-label="Explode selected CAD view"
            max="1"
            min="0"
            step="0.01"
            type="range"
            value={explodeScale}
            onChange={(event) => setExplodeScale(Number(event.currentTarget.value))}
          />
        </div>
      </div>

      <div className="aps-viewer-stage">
        {!geometryReady && (
          <img
            src={assetPath("/media/icarus-version-2.png")}
            alt=""
            aria-hidden="true"
            className="aps-static-preview"
          />
        )}
        <div className="aps-cad-directions" aria-label="CAD navigation directions">
          <span>
            <MousePointer2 className="size-3.5" />
            Drag to orbit
          </span>
          <span>
            <ZoomIn className="size-3.5" />
            Scroll to zoom
          </span>
          <span>
            <Move className="size-3.5" />
            Shift-drag to pan
          </span>
        </div>
        <div ref={containerRef} className="aps-viewer-canvas" />

        {(!loadable || !viewerReady || !geometryReady || viewerError) && (
          <div className="aps-viewer-status">
            <RefreshCw
              className={cn(
                "size-5",
                !viewerError && loadable && "animate-spin"
              )}
            />
            <h3>
              {viewerError
                ? "Viewer error"
                : loadable
                  ? "Preparing APS model"
                  : "Static CAD preview"}
            </h3>
            <p>
              {viewerError ??
                (viewerReady && !geometryReady
                  ? "Loading model geometry..."
                  : loadable
                    ? "Fetching token and loading model..."
                    : "No APS model URN configured. Set VITE_APS_MODEL_URN in .env.local.")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
