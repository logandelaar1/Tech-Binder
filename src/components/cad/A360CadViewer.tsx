import { Boxes, ExternalLink, Focus, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { HeroCallout } from "@/lib/binder-types"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/store/ui-store"

type A360CadViewerProps = {
  callouts: HeroCallout[]
}

type ViewerSubsystem = {
  id: string
  label: string
  match: string
  description: string
  focusClass: string
}

const A360_SHARE_URL = "https://a360.co/4djCqZF"
const A360_EMBED_URL =
  "https://gmail2245660.autodesk360.com/g/shares/SH90d2dQT28d5b60281135d95c4fd971baf6?mode=embed&width=100%25&height=900px"

const viewerSubsystems: ViewerSubsystem[] = [
  {
    id: "intakes",
    label: "Intakes",
    match: "Dual intake system",
    description: "Dual acquisition paths and deployed roller geometry.",
    focusClass: "focus-intakes",
  },
  {
    id: "dye-rotor",
    label: "Dye rotor",
    match: "Dye rotor",
    description: "Central buffer and feed-rate control path.",
    focusClass: "focus-dye-rotor",
  },
  {
    id: "turret",
    label: "Turret",
    match: "Turret shooter",
    description: "Independent aiming package and shooter hood.",
    focusClass: "focus-turret",
  },
  {
    id: "powertrain",
    label: "Powertrain",
    match: "Lightweight chassis",
    description: "Swerve modules, frame rails, and open-center structure.",
    focusClass: "focus-powertrain",
  },
]

export function A360CadViewer({ callouts }: A360CadViewerProps) {
  const selectedCadSubsystem = useUiStore(
    (state) => state.selectedCadSubsystem
  )
  const setSelectedCadSubsystem = useUiStore(
    (state) => state.setSelectedCadSubsystem
  )
  const setCadViewMode = useUiStore((state) => state.setCadViewMode)

  const selected = viewerSubsystems.find(
    (subsystem) => subsystem.id === selectedCadSubsystem
  )
  const selectedCallout = selected
    ? callouts.find((callout) => callout.label === selected.match)
    : undefined
  const focusTitle =
    selectedCallout?.label ?? selected?.label ?? "Live Fusion model"
  const focusDetail =
    selectedCallout?.detail ??
    "This is the live Autodesk web viewer. Updating the shared Fusion design updates the model here without re-exporting GLB."

  function selectSubsystem(subsystem: ViewerSubsystem) {
    setSelectedCadSubsystem(subsystem.id)
    setCadViewMode(subsystem.id === "powertrain" ? "powertrain" : "full")
  }

  function showFullAssembly() {
    setSelectedCadSubsystem("full")
    setCadViewMode("full")
  }

  function showPowertrain() {
    const powertrain = viewerSubsystems.find(
      (subsystem) => subsystem.id === "powertrain"
    )
    if (powertrain) {
      selectSubsystem(powertrain)
    }
  }

  return (
    <div
      className={cn(
        "a360-viewer",
        selected?.focusClass,
        selected && "has-focus"
      )}
    >
      <aside className="a360-control-panel">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Live CAD controls
          </p>
          <h2 className="mt-2 text-2xl font-black">Subsystem focus</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Select a system to bring it forward in the viewer context and dim
            the surrounding assembly.
          </p>
        </div>

        <div className="a360-subsystem-list">
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
                <small>{subsystem.description}</small>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-foreground/20 bg-transparent"
            onClick={showFullAssembly}
          >
            <Boxes className="size-3.5" />
            Full
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-foreground/20 bg-transparent"
            onClick={showPowertrain}
          >
            <Focus className="size-3.5" />
            Drive
          </Button>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Viewer focus
          </p>
          <h3 className="mt-2 text-xl font-black">{focusTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {focusDetail}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full border-foreground/20 bg-transparent"
            onClick={showFullAssembly}
          >
            <RotateCcw className="size-3.5" />
            Clear focus
          </Button>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Public A360 embeds are cross-origin, so these controls mark and
          describe subsystems on the binder layer. Native geometry isolation
          needs APS Viewer component IDs.
        </p>
      </aside>

      <div className="a360-viewer-stage">
        <iframe
          title="Team 5000 live Fusion CAD model"
          src={A360_EMBED_URL}
          className="a360-viewer-frame"
          allow="fullscreen; clipboard-read; clipboard-write"
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <div className="a360-viewer-toolbar">
          <a
            href={A360_SHARE_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "border-foreground/20 bg-background/80",
              "group/button inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[min(var(--radius-md),12px)] border px-2.5 text-sm font-medium transition-all hover:bg-muted"
            )}
          >
            <ExternalLink className="size-3.5" />
            Open in Fusion
          </a>
        </div>

        <div className="a360-focus-window" aria-hidden="true" />
      </div>
    </div>
  )
}
