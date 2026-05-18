import { useEffect, useMemo, useRef, useState } from "react"
import { Boxes, Crosshair, Focus, RotateCcw } from "lucide-react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { Button } from "@/components/ui/button"
import type { HeroCallout } from "@/lib/binder-types"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/store/ui-store"

type CadSubsystemId =
  | "dual-intake"
  | "dye-rotor"
  | "turret-shooter"
  | "powertrain"
  | "shoot-on-the-move"

type CadSubsystem = {
  id: CadSubsystemId
  label: string
  fallbackDetail: string
  anchor: [number, number, number]
  labelOffset: [number, number]
}

type LabelPosition = {
  id: CadSubsystemId
  x: number
  y: number
  visible: boolean
}

type CadExplorerProps = {
  callouts: HeroCallout[]
}

const CAD_SUBSYSTEMS: CadSubsystem[] = [
  {
    id: "dual-intake",
    label: "Dual intake system",
    fallbackDetail: "Wide acquisition windows feed the center path from either side.",
    anchor: [-2.82, 0.72, 0.2],
    labelOffset: [-150, -78],
  },
  {
    id: "dye-rotor",
    label: "Dye rotor",
    fallbackDetail: "Central buffer controls feed rate and staging before the turret.",
    anchor: [-0.15, 1.05, 0],
    labelOffset: [78, -72],
  },
  {
    id: "turret-shooter",
    label: "Turret shooter",
    fallbackDetail: "Inverted pancake package keeps aim independent from chassis heading.",
    anchor: [1.35, 1.42, -0.52],
    labelOffset: [100, -36],
  },
  {
    id: "powertrain",
    label: "Lightweight chassis",
    fallbackDetail: "Open center layout preserves hopper volume and service access.",
    anchor: [1.96, 0.55, 1.24],
    labelOffset: [88, 76],
  },
  {
    id: "shoot-on-the-move",
    label: "Shoot on the move",
    fallbackDetail: "Turret tracking and synchronized indexing keep cycles flowing.",
    anchor: [0.92, 1.78, 0.58],
    labelOffset: [-78, -130],
  },
]

const labelToSubsystem = new Map(
  CAD_SUBSYSTEMS.map((subsystem) => [
    subsystem.label.toLowerCase(),
    subsystem.id,
  ])
)

export function CadExplorer({ callouts }: CadExplorerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const rootRef = useRef<THREE.Group | null>(null)
  const meshesRef = useRef<THREE.Mesh[]>([])
  const renderSceneRef = useRef<() => void>(() => undefined)
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null)
  const setSelectedCadSubsystem = useUiStore(
    (state) => state.setSelectedCadSubsystem
  )
  const setCadViewMode = useUiStore((state) => state.setCadViewMode)
  const selectedCadSubsystem = useUiStore(
    (state) => state.selectedCadSubsystem
  )
  const cadViewMode = useUiStore((state) => state.cadViewMode)
  const [labels, setLabels] = useState<LabelPosition[]>([])

  const calloutMap = useMemo(() => {
    const map = new Map<CadSubsystemId, HeroCallout>()

    for (const callout of callouts) {
      const id = labelToSubsystem.get(callout.label.toLowerCase())
      if (id) map.set(id, callout)
    }

    return map
  }, [callouts])

  useEffect(() => {
    const mount = mountRef.current
    const canvas = canvasRef.current
    if (!mount || !canvas) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x070707, 7, 14)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80)
    camera.position.set(5.6, 3.3, 5.6)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = false
    controls.enablePan = true
    controls.minDistance = 3.5
    controls.maxDistance = 11
    controls.maxPolarAngle = Math.PI * 0.48
    controls.target.set(0, 0.45, 0)

    const root = buildRobotModel()
    scene.add(root)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.35))

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
    keyLight.position.set(4, 7, 3)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xa7a9ac, 1.4)
    rimLight.position.set(-5, 3, -4)
    scene.add(rimLight)

    const grid = new THREE.GridHelper(8, 24, 0x555555, 0x242424)
    grid.position.y = -0.03
    scene.add(grid)

    const meshes: THREE.Mesh[] = []
    root.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshes.push(object)
      }
    })

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls
    rootRef.current = root
    meshesRef.current = meshes

    const updateLabelsAndRender = () => {
      const width = renderer.domElement.clientWidth
      const height = renderer.domElement.clientHeight
      const nextLabels = CAD_SUBSYSTEMS.map((subsystem) => {
        const projected = new THREE.Vector3(...subsystem.anchor).project(camera)
        const visible = projected.z > -1 && projected.z < 1
        const rawX = (projected.x * 0.5 + 0.5) * width + subsystem.labelOffset[0]
        const rawY = (-projected.y * 0.5 + 0.5) * height + subsystem.labelOffset[1]

        return {
          id: subsystem.id,
          x: clamp(rawX, 32, width - 232),
          y: clamp(rawY, 72, height - 124),
          visible,
        }
      })

      setLabels(nextLabels)
      renderer.render(scene, camera)
    }

    renderSceneRef.current = updateLabelsAndRender

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      const safeHeight = Math.max(height, 360)
      camera.aspect = width / safeHeight
      camera.updateProjectionMatrix()
      renderer.setSize(width, safeHeight, false)
      updateLabelsAndRender()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()
    controls.addEventListener("change", updateLabelsAndRender)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const handlePointerDown = (event: PointerEvent) => {
      pointerDownRef.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerUp = (event: PointerEvent) => {
      const start = pointerDownRef.current
      pointerDownRef.current = null
      if (!start) return

      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
      if (moved > 6) return

      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const hit = raycaster.intersectObjects(meshes, false)[0]
      const subsystem = hit?.object.userData.subsystem as CadSubsystemId | undefined
      if (subsystem) {
        setSelectedCadSubsystem(subsystem)
        setCadViewMode(subsystem === "powertrain" ? "powertrain" : "full")
      }
    }

    renderer.domElement.addEventListener("pointerdown", handlePointerDown)
    renderer.domElement.addEventListener("pointerup", handlePointerUp)

    return () => {
      resizeObserver.disconnect()
      controls.removeEventListener("change", updateLabelsAndRender)
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown)
      renderer.domElement.removeEventListener("pointerup", handlePointerUp)
      controls.dispose()
      renderer.dispose()
      root.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          disposeMaterial(object.material)
        }
      })
    }
  }, [setCadViewMode, setSelectedCadSubsystem])

  useEffect(() => {
    applyFocus(meshesRef.current, selectedCadSubsystem, cadViewMode)
    renderSceneRef.current()
  }, [cadViewMode, selectedCadSubsystem])

  function resetCamera() {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return

    camera.position.set(5.6, 3.3, 5.6)
    controls.target.set(0, 0.45, 0)
    controls.update()
    renderSceneRef.current()
  }

  function selectSubsystem(id: CadSubsystemId) {
    setSelectedCadSubsystem(id)
    setCadViewMode(id === "powertrain" ? "powertrain" : "full")
  }

  function showFullRobot() {
    setSelectedCadSubsystem("full")
    setCadViewMode("full")
  }

  function showPowertrain() {
    setSelectedCadSubsystem("powertrain")
    setCadViewMode("powertrain")
  }

  const selected = CAD_SUBSYSTEMS.find(
    (subsystem) => subsystem.id === selectedCadSubsystem
  )
  const focusTitle = selected
    ? calloutMap.get(selected.id)?.label ?? selected.label
    : "Full robot assembly"
  const focusDetail = selected
    ? calloutMap.get(selected.id)?.detail ?? selected.fallbackDetail
    : "Dual intake, dye rotor, turret shooter, powertrain, and moving-shot systems shown as one compact packaging study."

  return (
    <div ref={mountRef} className="cad-explorer">
      <canvas
        ref={canvasRef}
        className="cad-explorer-canvas"
        aria-label="Interactive Team 5000 CAD model viewer"
      />
      <div className="pointer-events-none absolute inset-0 scanline opacity-50" />

      <div className="cad-view-toolbar">
        <Button
          type="button"
          variant={cadViewMode === "full" ? "default" : "outline"}
          size="sm"
          className={cn(
            "border-foreground/20",
            cadViewMode !== "full" && "bg-background/70"
          )}
          onClick={showFullRobot}
        >
          <Boxes className="size-3.5" />
          Full Robot
        </Button>
        <Button
          type="button"
          variant={cadViewMode === "powertrain" ? "default" : "outline"}
          size="sm"
          className={cn(
            "border-foreground/20",
            cadViewMode !== "powertrain" && "bg-background/70"
          )}
          onClick={showPowertrain}
        >
          <Focus className="size-3.5" />
          Powertrain
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="border-foreground/20 bg-background/70"
          onClick={resetCamera}
        >
          <RotateCcw className="size-3.5" />
          <span className="sr-only">Reset CAD camera</span>
        </Button>
      </div>

      <div className="cad-label-layer">
        {CAD_SUBSYSTEMS.map((subsystem, index) => {
          const position = labels.find((label) => label.id === subsystem.id)
          const callout = calloutMap.get(subsystem.id)
          const active =
            selectedCadSubsystem === subsystem.id ||
            (cadViewMode === "powertrain" && subsystem.id === "powertrain")

          return (
            <button
              key={subsystem.id}
              type="button"
              className={cn("cad-pin", active && "cad-pin-active")}
              style={{
                left: `${position?.x ?? 0}px`,
                top: `${position?.y ?? 0}px`,
                opacity: position?.visible ? 1 : 0,
                animationDelay: `${index * 90}ms`,
              }}
              onClick={() => selectSubsystem(subsystem.id)}
            >
              <span className="cad-pin-dot">
                <Crosshair className="size-3" />
              </span>
              <span className="cad-pin-card">
                <strong>{callout?.label ?? subsystem.label}</strong>
                <span>{callout?.detail ?? subsystem.fallbackDetail}</span>
              </span>
            </button>
          )
        })}
      </div>

      <aside className="cad-focus-panel">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Subsystem focus
        </p>
        <h2 className="mt-2 text-xl font-black">{focusTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {focusDetail}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-foreground/20 bg-background/70"
            onClick={showFullRobot}
          >
            Entire thing
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-foreground/20 bg-background/70"
            onClick={showPowertrain}
          >
            Power train
          </Button>
        </div>
      </aside>
    </div>
  )
}

function buildRobotModel() {
  const root = new THREE.Group()
  root.rotation.y = -0.18

  const addBox = (
    subsystem: CadSubsystemId,
    size: [number, number, number],
    position: [number, number, number],
    color: string,
    name: string
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(...size),
      makeMaterial(color)
    )
    mesh.position.set(...position)
    mesh.name = name
    mesh.userData.subsystem = subsystem
    mesh.userData.baseColor = color
    root.add(mesh)
    return mesh
  }

  const addCylinder = (
    subsystem: CadSubsystemId,
    radiusTop: number,
    radiusBottom: number,
    height: number,
    position: [number, number, number],
    color: string,
    name: string,
    rotation: [number, number, number] = [0, 0, 0],
    segments = 32
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
      makeMaterial(color)
    )
    mesh.position.set(...position)
    mesh.rotation.set(...rotation)
    mesh.name = name
    mesh.userData.subsystem = subsystem
    mesh.userData.baseColor = color
    root.add(mesh)
    return mesh
  }

  const addTorus = (
    subsystem: CadSubsystemId,
    radius: number,
    tube: number,
    position: [number, number, number],
    color: string,
    name: string
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 12, 56),
      makeMaterial(color)
    )
    mesh.position.set(...position)
    mesh.rotation.x = Math.PI / 2
    mesh.name = name
    mesh.userData.subsystem = subsystem
    mesh.userData.baseColor = color
    root.add(mesh)
    return mesh
  }

  addBox("powertrain", [5.3, 0.08, 3.25], [0, 0.16, 0], "#d4d4d4", "bellypan")
  addBox("powertrain", [5.5, 0.32, 0.18], [0, 0.38, 1.72], "#6f7174", "front rail")
  addBox("powertrain", [5.5, 0.32, 0.18], [0, 0.38, -1.72], "#6f7174", "back rail")
  addBox("powertrain", [0.18, 0.32, 3.25], [-2.72, 0.38, 0], "#6f7174", "left rail")
  addBox("powertrain", [0.18, 0.32, 3.25], [2.72, 0.38, 0], "#6f7174", "right rail")

  for (const x of [-2.16, 2.16]) {
    for (const z of [-1.24, 1.24]) {
      addBox("powertrain", [0.78, 0.22, 0.78], [x, 0.32, z], "#1f2021", "swerve module")
      addCylinder(
        "powertrain",
        0.34,
        0.34,
        0.28,
        [x, 0.14, z],
        "#101010",
        "swerve wheel",
        [Math.PI / 2, 0, 0],
        40
      )
      addCylinder(
        "powertrain",
        0.12,
        0.12,
        0.32,
        [x, 0.58, z],
        "#a7a9ac",
        "azimuth column",
        [0, 0, 0],
        28
      )
    }
  }

  for (const x of [-2.9, 2.9]) {
    addBox("dual-intake", [0.16, 0.22, 2.6], [x, 0.46, 0], "#8c8e91", "intake side plate")
    for (const z of [-0.82, 0, 0.82]) {
      addCylinder(
        "dual-intake",
        0.1,
        0.1,
        2.02,
        [x, 0.68, z],
        "#c6c8ca",
        "intake roller",
        [0, 0, Math.PI / 2],
        24
      )
    }
  }

  addCylinder("dye-rotor", 0.92, 0.92, 0.18, [-0.1, 0.72, 0], "#202124", "rotor floor")
  addTorus("dye-rotor", 0.72, 0.05, [-0.1, 0.85, 0], "#bfc1c3", "rotor ring")
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8
    const x = -0.1 + Math.cos(angle) * 0.5
    const z = Math.sin(angle) * 0.5
    const vane = addBox(
      "dye-rotor",
      [0.12, 0.12, 0.62],
      [x, 0.9, z],
      "#909296",
      "rotor vane"
    )
    vane.rotation.y = -angle
  }

  addCylinder("turret-shooter", 0.82, 0.82, 0.16, [1.05, 1.02, -0.25], "#d8d8d8", "turret plate")
  addTorus("turret-shooter", 0.86, 0.05, [1.05, 1.11, -0.25], "#77797c", "turret gear")
  addBox("turret-shooter", [1.25, 0.28, 0.72], [1.05, 1.33, -0.25], "#2b2c2e", "shooter body")
  addBox("turret-shooter", [1.18, 0.1, 0.34], [1.2, 1.58, -0.46], "#bfc1c3", "shooter hood")
  addCylinder(
    "turret-shooter",
    0.18,
    0.18,
    0.78,
    [0.68, 1.38, -0.62],
    "#f1f1f1",
    "left flywheel",
    [Math.PI / 2, 0, 0],
    32
  )
  addCylinder(
    "turret-shooter",
    0.18,
    0.18,
    0.78,
    [1.42, 1.38, -0.62],
    "#f1f1f1",
    "right flywheel",
    [Math.PI / 2, 0, 0],
    32
  )

  addBox("shoot-on-the-move", [0.16, 0.72, 0.16], [0.52, 1.42, 0.66], "#a7a9ac", "vision mast")
  addBox("shoot-on-the-move", [0.48, 0.22, 0.2], [0.62, 1.84, 0.64], "#f5f5f5", "vision camera")

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.18, 1.5, -0.62),
    new THREE.Vector3(1.8, 2.06, -1.05),
    new THREE.Vector3(2.64, 2.2, -1.42),
  ])
  const points = curve.getPoints(28)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0xa7a9ac, transparent: true, opacity: 0.8 })
  )
  line.userData.subsystem = "shoot-on-the-move"
  root.add(line)

  return root
}

function makeMaterial(color: string) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.55,
    roughness: 0.42,
    transparent: true,
  })
}

function applyFocus(
  meshes: THREE.Mesh[],
  selectedSubsystem: string,
  viewMode: "full" | "powertrain"
) {
  for (const mesh of meshes) {
    const material = mesh.material as THREE.MeshStandardMaterial
    const subsystem = mesh.userData.subsystem as CadSubsystemId | undefined
    const baseColor = mesh.userData.baseColor as string | undefined
    const selected =
      selectedSubsystem !== "full" && subsystem === selectedSubsystem
    const focusedPowertrain = viewMode === "powertrain" && subsystem === "powertrain"
    const dimmed =
      (viewMode === "powertrain" && subsystem !== "powertrain") ||
      (selectedSubsystem !== "full" && subsystem !== selectedSubsystem)

    material.color.set(selected || focusedPowertrain ? "#f7f7f7" : baseColor ?? "#9b9b9b")
    material.emissive.set(selected || focusedPowertrain ? "#4d4d4d" : "#000000")
    material.opacity = dimmed ? 0.16 : 1
    material.needsUpdate = true
  }
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    for (const entry of material) entry.dispose()
    return
  }

  material.dispose()
}

function clamp(value: number, min: number, max: number) {
  const safeMax = Math.max(min, max)
  return Math.min(Math.max(value, min), safeMax)
}
