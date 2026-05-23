import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Factory,
  Menu,
  Moon,
  Printer,
  Sun,
  X,
} from "lucide-react"

import { ApsCadViewer } from "@/components/cad/ApsCadViewer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { assetPath } from "@/lib/assets"
import {
  cncGeneralNotes,
  cncOperations,
  manufacturingCapabilities,
  mechanicalSystems,
  navItems,
  resources,
  seasonEvents,
  seasonStats,
  softwareTabs,
  type BinderTab,
  type CncOperation,
  type Iteration,
  type MechanicalSystem,
} from "@/lib/binder-content"
import { glossaryEntries, type GlossaryEntry } from "@/lib/robot-notes"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/store/ui-store"

const sectionIds = navItems.map((item) => item.href.replace("#", ""))
const cadSubsystemByMechanicalSystem: Record<string, string> = {
  full: "full",
  "super-structure": "super-structure",
  "dual-intake": "dual-intake",
  "dye-rotor": "dye-rotor",
  turret: "turret",
}

export function BinderPage() {
  const [activeSection, setActiveSection] = useState(() => {
    const initial = window.location.hash.replace("#", "")
    return sectionIds.includes(initial) ? initial : "mechanical"
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [manufacturingOpen, setManufacturingOpen] = useState(false)

  useLayoutEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.replace("#", "")
      if (!id) return

      const scrollToTarget = () => {
        const target = document.getElementById(id)
        if (!target) return

        const headerHeight =
          document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight
        const root = document.documentElement
        const previousScrollBehavior = root.style.scrollBehavior

        root.style.scrollBehavior = "auto"
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" })
        window.requestAnimationFrame(() => {
          root.style.scrollBehavior = previousScrollBehavior
        })
      }

      window.requestAnimationFrame(scrollToTarget)
      window.setTimeout(scrollToTarget, 120)
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)

    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [])

  useEffect(() => {
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible?.target.id) return

        const id = visible.target.id
        setActiveSection(id)

        if (window.location.hash !== `#${id}`) {
          window.history.replaceState(null, "", `#${id}`)
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.05, 0.2, 0.45],
      }
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="binder-page">
      <TopNav
        activeSection={activeSection}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        onManufacturingOpen={() => setManufacturingOpen(true)}
      />
      <MechanicalSection />
      <SoftwareSection />
      <SeasonSection />
      <OpenAllianceSection />
      <SelectionGlossary />
      <ManufacturingModal
        open={manufacturingOpen}
        onOpenChange={setManufacturingOpen}
      />
    </main>
  )
}

function TopNav({
  activeSection,
  mobileOpen,
  onMobileOpenChange,
  onManufacturingOpen,
}: {
  activeSection: string
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
  onManufacturingOpen: () => void
}) {
  const scrollToSection = (href: string) => {
    const id = href.replace("#", "")
    const target = document.getElementById(id)
    if (!target) return

    const headerHeight =
      document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight

    window.history.pushState(null, "", href)
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
  }

  return (
    <header className="site-header">
      <a
        className="brand-lockup"
        href="#mechanical"
        aria-label="Team 5000 Tech Binder"
        onClick={(event) => {
          event.preventDefault()
          scrollToSection("#mechanical")
        }}
      >
        <img
          src={assetPath("/brand/hammerheads-logo.svg")}
          alt=""
          className="brand-mark"
        />
        <span>
          <strong className="team-display">5000</strong>
          <small>Tech Binder</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const id = item.href.replace("#", "")
          return (
            <a
              key={item.href}
              className={cn("nav-link", activeSection === id && "is-active")}
              href={item.href}
              onClick={(event) => {
                event.preventDefault()
                scrollToSection(item.href)
              }}
            >
              {item.label}
            </a>
          )
        })}
      </nav>


      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault()
                scrollToSection(item.href)
                onMobileOpenChange(false)
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="mobile-nav-action"
            onClick={() => {
              onManufacturingOpen()
              onMobileOpenChange(false)
            }}
          >
            Manufacturing archive
          </button>
        </nav>
      )}
    </header>
  )
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      className="icon-button icon-only"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

function MechanicalSection() {
  const [systemId, setSystemId] = useState("full")
  const [tabBySystem, setTabBySystem] = useState<Record<string, string>>({})
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [mobileCadVisible, setMobileCadVisible] = useState(false)
  const setSelectedCadSubsystem = useUiStore(
    (state) => state.setSelectedCadSubsystem
  )
  const setSelectedSystem = useUiStore((state) => state.setSelectedSystem)
  const system =
    mechanicalSystems.find((item) => item.id === systemId) ?? mechanicalSystems[0]
  const activeTabId = tabBySystem[system.id] ?? system.tabs[0]?.id
  const activeTab =
    system.tabs.find((tab) => tab.id === activeTabId) ?? system.tabs[0]
  const showCadStage = activeTab.id === "cad" || activeTab.id === "overview"
  const showMediaStage = !showCadStage
  const systemControls = (
    <SystemSelector
      systems={mechanicalSystems}
      activeId={system.id}
      onSelect={(nextId) => {
        setSystemId(nextId)
        setSelectedCadSubsystem(cadSubsystemByMechanicalSystem[nextId] ?? "full")
        setSelectedSystem(nextId)
        setTabBySystem((current) => ({
          ...current,
          [nextId]:
            mechanicalSystems.find((item) => item.id === nextId)?.tabs[0]?.id ??
            "overview",
        }))
      }}
    />
  )

  useEffect(() => {
    setSelectedCadSubsystem(cadSubsystemByMechanicalSystem[system.id] ?? "full")
    setSelectedSystem(system.id)
  }, [setSelectedCadSubsystem, setSelectedSystem, system.id])

  return (
    <section id="mechanical" className="binder-section mechanical-workbench">
      <section
        className="mechanical-feature mechanical-cad-workbench"
        data-panel-collapsed={panelCollapsed ? "true" : "false"}
        data-stage-mode={showCadStage ? "cad" : "media"}
        data-mobile-cad-visible={mobileCadVisible ? "true" : "false"}
      >
        <ApsCadViewer
          className={cn(
            "mechanical-aps-viewer",
            !showCadStage && "is-viewer-hidden",
            !mobileCadVisible && "is-mobile-hidden"
          )}
          panelPosition="left"
          showSubsystemControls={false}
          systemControls={systemControls}
          onFocusChange={(subsystemId) => {
            const matchedSystem =
              Object.entries(cadSubsystemByMechanicalSystem).find(
                ([, cadSubsystem]) => cadSubsystem === subsystemId
              )?.[0] ?? "full"

            setSystemId(matchedSystem)
          }}
        />
        {showCadStage && (
          <MobileCadFallback
            system={system}
            isCadVisible={mobileCadVisible}
            onShowCad={() => setMobileCadVisible(true)}
            onHideCad={() => setMobileCadVisible(false)}
          />
        )}
        {showMediaStage && (
          <div className="mechanical-reference-stage" aria-label={`${activeTab.label} visual`}>
            <TabMedia tab={activeTab} fallback={system} />
          </div>
        )}
        <div
          className={cn(
            "mechanical-copy mechanical-floating-panel",
            panelCollapsed && "is-collapsed"
          )}
        >
          {panelCollapsed ? (
            <button
              type="button"
              className="panel-collapse-toggle"
              aria-label="Expand notes panel"
              onClick={() => setPanelCollapsed(false)}
            >
              <ChevronRight className="size-5" />
            </button>
          ) : (
            <>
              <div className="floating-panel-tabbar">
                <PillTabs
                  tabs={system.tabs}
                  activeId={activeTab.id}
                  onSelect={(nextTab) =>
                    setTabBySystem((current) => ({
                      ...current,
                      [system.id]: nextTab,
                    }))
                  }
                />
                <button
                  type="button"
                  className="panel-collapse-toggle"
                  aria-label="Collapse notes panel"
                  onClick={() => setPanelCollapsed(true)}
                >
                  <ChevronLeft className="size-5" />
                </button>
              </div>
              <TabContent tab={activeTab} system={system} />
            </>
          )}
        </div>
      </section>
    </section>
  )
}

function MobileCadFallback({
  system,
  isCadVisible,
  onShowCad,
  onHideCad,
}: {
  system: MechanicalSystem
  isCadVisible: boolean
  onShowCad: () => void
  onHideCad: () => void
}) {
  return (
    <aside className={cn("mobile-cad-fallback", isCadVisible && "is-cad-visible")}>
      {!isCadVisible && (
        <>
          <figure>
            <img src={assetPath(system.image)} alt={system.imageAlt} />
          </figure>
          <div className="mobile-cad-banner">
            <div>
              <p>Viewing image. Open CAD stage to inspect the model.</p>
            </div>
            <button type="button" className="mobile-cad-toggle" onClick={onShowCad}>
              Show CAD
            </button>
          </div>
        </>
      )}
      {isCadVisible && (
        <button type="button" className="mobile-cad-toggle mobile-cad-hide" onClick={onHideCad}>
          Hide CAD viewer
        </button>
      )}
    </aside>
  )
}

function SystemSelector({
  systems,
  activeId,
  onSelect,
}: {
  systems: MechanicalSystem[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="system-selector" aria-label="Mechanical systems">
      {systems.map((system) => (
        <button
          key={system.id}
          type="button"
          className={cn("system-tab", activeId === system.id && "is-active")}
          onClick={() => onSelect(system.id)}
        >
          {system.label}
        </button>
      ))}
    </div>
  )
}

function PillTabs({
  tabs,
  activeId,
  onSelect,
}: {
  tabs: BinderTab[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="pill-tabs" aria-label="Section tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={cn("pill-tab", activeId === tab.id && "is-active")}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function TabMedia({
  tab,
  fallback,
}: {
  tab: BinderTab
  fallback: MechanicalSystem
}) {
  if (tab.id === "leds") {
    return <LedVisualStage />
  }

  if (tab.iterations && tab.iterations.length > 0) {
    if (tab.iterations.length === 2 && tab.id === "version") {
      return <ComparisonSlider iterations={tab.iterations} />
    }

    return <IterationSlider iterations={tab.iterations} />
  }

  const media = tab.media ?? {
    src: fallback.image,
    alt: fallback.imageAlt,
    caption: fallback.label,
  }

  return (
    <figure className="media-frame">
      <img src={assetPath(media.src)} alt={media.alt} />
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  )
}

function SoftwareVisualStage({ tab }: { tab: BinderTab }) {
  const rowsByTab: Record<string, string[]> = {
    shooting: ["Lookup tables", "Time of flight", "Velocity compensation", "Release window"],
    zones: ["Current pose", "Predictive zones", "Trench align", "Hood duck"],
    cameras: ["Six cameras", "AprilTag updates", "Odometry correction", "Pose confidence"],
    fuelsim: ["Fuel physics", "Drag model", "Collisions", "Auto intake"],
    architecture: ["Commands", "Telemetry", "Simulation", "Replay"],
  }

  const rows = rowsByTab[tab.id] ?? rowsByTab.architecture

  return (
    <div className="software-visual-stage" aria-label={`${tab.label} software diagram`}>
      <div className="software-visual-header">
        <span>{tab.eyebrow ?? "Software"}</span>
        <strong>{tab.label}</strong>
      </div>
      <div className="software-flow">
        {rows.map((row, index) => (
          <div key={row} className="software-flow-row">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{row}</strong>
          </div>
        ))}
      </div>
      <pre className="software-code-card" aria-label="Representative software logic">
        {`if (turret.atSetpoint() && rotor.indexed()) {
  shooter.requestShot(pathPlanner.velocity());
  hood.trackDistance(target.distance());
}`}
      </pre>
    </div>
  )
}

function TabContent({
  tab,
  system,
}: {
  tab: BinderTab
  system: MechanicalSystem
}) {
  return (
    <div className="tab-copy-stack">
      <p className="eyebrow">{tab.eyebrow ?? system.label}</p>
      <h3>{tab.title}</h3>
      {tab.body && <p className="lead-copy">{tab.body}</p>}
      {tab.bullets && <BulletList bullets={tab.bullets} />}
      {tab.blocks && (
        <div className="compact-card-grid">
          {tab.blocks.map((block) => (
            <article key={block.title} className="compact-card">
              <h4>{block.title}</h4>
              {block.body && <p>{block.body}</p>}
              {block.bullets && <BulletList bullets={block.bullets} />}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function ManufacturingModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="manufacturing-modal" showCloseButton>
        <DialogHeader className="manufacturing-modal-header">
          <div>
            <DialogTitle>Fusion 360 CNC Settings Archive</DialogTitle>
            <DialogDescription>
              Router feeds, speeds, tooling notes, and setup references for 6061,
              polycarbonate, and SRPP.
            </DialogDescription>
          </div>
          <a href="/manufacturing-print" className="binder-button secondary">
            <Printer className="size-4" />
            Print
          </a>
        </DialogHeader>
        <ManufacturingArchive />
      </DialogContent>
    </Dialog>
  )
}

function ComparisonSlider({ iterations }: { iterations: Iteration[] }) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const before = iterations[0]
  const after = iterations[1]

  const handleMouseDown = () => setIsDragging(true)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = stageRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      setPosition(percent)
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="comparison-module">
      <div
        ref={stageRef}
        className="comparison-stage"
        role="img"
        aria-label={`Compare ${before.label} and ${after.label}`}
      >
        <img
          src={assetPath(after.image)}
          alt={after.alt}
          className="comparison-img comparison-after"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        />
        <img
          src={assetPath(before.image)}
          alt={before.alt}
          className="comparison-img comparison-before"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <div
          className="comparison-handle"
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
          role="slider"
          aria-label="Drag to compare versions"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        />
      </div>
      <div className="comparison-labels">
        <span>{before.label}</span>
        <span>{after.label}</span>
      </div>
      <p className="comparison-copy">{position < 50 ? before.body : after.body}</p>
    </div>
  )
}

function IterationSlider({ iterations }: { iterations: Iteration[] }) {
  const [index, setIndex] = useState(0)
  const iteration = iterations[index] ?? iterations[0]

  return (
    <div className="iteration-module">
      <figure className="media-frame iteration-visual">
        <div className="iteration-frame-stack">
          {iterations.map((item, itemIndex) => (
            <img
              key={item.image}
              src={assetPath(item.image)}
              alt={item.alt}
              className={cn(
                "iteration-frame-img",
                itemIndex === index && "is-active"
              )}
            />
          ))}
        </div>
        <figcaption key={iteration.image}>
          {iteration.label} | {iteration.title}
        </figcaption>
      </figure>
      <input
        aria-label="Select mechanism iteration"
        min="0"
        max={Math.max(iterations.length - 1, 0)}
        step="1"
        value={index}
        type="range"
        onChange={(event) => setIndex(Number(event.currentTarget.value))}
      />
      <div className="iteration-label-row">
        {iterations.map((item, itemIndex) => (
          <button
            key={item.label}
            type="button"
            className={cn(itemIndex === index && "is-active")}
            onClick={() => setIndex(itemIndex)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p key={iteration.body} className="iteration-body">
        {iteration.body}
      </p>
    </div>
  )
}

function LedVisualStage() {
  const [teleopTime, setTeleopTime] = useState(0)
  const teleopDuration = 10 + 25 + 25 + 25 + 55

  useEffect(() => {
    const interval = setInterval(() => {
      setTeleopTime((t) => (t + 0.05) % teleopDuration)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const getTeleopStage = () => {
    if (teleopTime < 10) return {
      label: "Transition Shift",
      color: "#aa44ff",
      time: teleopTime,
      duration: 10,
      strobeAt: 3
    }
    if (teleopTime < 35) return {
      label: "Inactive Shift 1",
      color: "#ff3333",
      time: teleopTime - 10,
      duration: 25,
      strobeAt: 3
    }
    if (teleopTime < 60) return {
      label: "Active Shift 1",
      color: "#1e5a96",
      time: teleopTime - 35,
      duration: 25,
      strobeAt: 3
    }
    if (teleopTime < 85) return {
      label: "Inactive Shift 2",
      color: "#ff3333",
      time: teleopTime - 60,
      duration: 25,
      strobeAt: 3
    }
    return {
      label: "Active Shift 2 & Endgame",
      color: "#aa44ff",
      time: teleopTime - 85,
      duration: 55,
      strobeAt: 3
    }
  }

  const stage = getTeleopStage()
  const timeRemaining = Math.max(0, stage.duration - stage.time)
  const isStrobing = timeRemaining <= stage.strobeAt
  const remainingPercent = (timeRemaining / stage.duration) * 100
  const strobeOpacity = isStrobing && Math.floor(teleopTime * 2) % 2 === 0 ? 0.15 : 1

  const patterns = [
    {
      label: "Disabled",
      className: "rainbow",
      detail: "Rainbow confirms the robot is disabled and checks are normal.",
    },
    {
      label: "Low battery",
      className: "low-battery",
      detail: "Red LED fades on and off once every second.",
    },
    {
      label: "Autonomous",
      className: "cylon",
      detail: "A red scanning sweep makes autonomous state obvious from the glass.",
    },
  ]

  return (
    <div className="led-visual-stage">
      <div className="led-visual-patterns" aria-label="LED pattern animations">
        {patterns.map((pattern) => (
          <article key={pattern.label}>
            <div className={cn("led-strip", pattern.className)} aria-hidden="true">
              <span />
            </div>
            <strong>{pattern.label}</strong>
            <small>{pattern.detail}</small>
          </article>
        ))}

        <article>
          <div
            className="led-strip led-teleop-timer"
            aria-hidden="true"
            style={{
              background: `linear-gradient(90deg, white 0%, white ${100 - remainingPercent}%, ${stage.color} ${100 - remainingPercent}%, ${stage.color} 100%)`,
              opacity: strobeOpacity,
            }}
          >
            <span />
          </div>
          <strong>
            {stage.label} – {timeRemaining.toFixed(1)}s
          </strong>
          <small>Match timer: Transition (10s) → Inactive 1 (25s) → Active 1 (25s) → Inactive 2 (25s) → Active & Endgame (55s). Strobes when ≤3s.</small>
        </article>
      </div>
    </div>
  )
}

function SoftwareSection() {
  const [activeTab, setActiveTab] = useState("shooting")
  const tab = softwareTabs.find((item) => item.id === activeTab) ?? softwareTabs[0]

  return (
    <BinderSection
      id="software"
      eyebrow="Software"
    >
      <section className="feature-panel">
        <div className="panel-media">
          {tab.media ? (
            <TabMedia tab={tab} fallback={mechanicalSystems[0]} />
          ) : (
            <SoftwareVisualStage tab={tab} />
          )}
        </div>
        <div className="panel-copy">
          <PillTabs tabs={softwareTabs} activeId={tab.id} onSelect={setActiveTab} />
          <TabContent tab={tab} system={mechanicalSystems[0]} />
        </div>
      </section>
    </BinderSection>
  )
}

function ManufacturingArchive() {
  const materials = useMemo(
    () => ["All", ...Array.from(new Set(cncOperations.map((operation) => operation.material)))],
    []
  )
  const [activeMaterial, setActiveMaterial] = useState("All")
  const visibleOperations =
    activeMaterial === "All"
      ? cncOperations
      : cncOperations.filter((operation) => operation.material === activeMaterial)

  return (
    <>
      <div className="capability-grid">
        {manufacturingCapabilities.map((capability) => (
          <article key={capability.title} className="compact-card">
            <h3>{capability.title}</h3>
            <p>{capability.body}</p>
          </article>
        ))}
      </div>

      <section className="archive-panel">
        <div className="archive-header">
          <div>
            <p className="eyebrow">Fusion 360 CNC Settings Archive</p>
            <h3>Feeds, speeds, tools, and setup notes.</h3>
          </div>
          <a
            className="binder-button secondary"
            href={cncGeneralNotes[2].detail}
            target="_blank"
            rel="noreferrer"
          >
            Preferred cutter source
            <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="general-note-row">
          {cncGeneralNotes.map((note) => (
            <article key={note.label} className="note-chip">
              <span>{note.label}</span>
              <strong>{note.value}</strong>
            </article>
          ))}
        </div>

        <div className="filter-tabs">
          {materials.map((material) => (
            <button
              key={material}
              type="button"
              className={cn(activeMaterial === material && "is-active")}
              onClick={() => setActiveMaterial(material)}
            >
              {material}
            </button>
          ))}
        </div>

        <div className="cnc-grid">
          {visibleOperations.map((operation) => (
            <CncOperationCard key={operation.id} operation={operation} />
          ))}
        </div>
      </section>
    </>
  )
}

function CncOperationCard({ operation }: { operation: CncOperation }) {
  return (
    <article className="cnc-card">
      <div className="cnc-card-header">
        <p className="eyebrow">{operation.material}</p>
        <h4>{operation.title}</h4>
      </div>
      <div className="tool-list">
        {operation.tool.map((tool) => (
          <span key={tool}>{tool}</span>
        ))}
      </div>
      <div className="cnc-groups">
        {operation.groups.map((group) => (
          <details key={group.title} open={operation.groups.length <= 2}>
            <summary>{group.title}</summary>
            <dl>
              {group.rows.map((row) => (
                <div key={`${group.title}-${row.label}`}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>
    </article>
  )
}

function SeasonSection() {
  return (
    <BinderSection
      id="season"
      eyebrow="Season Recap"
    >
      <div className="season-stats">
        {seasonStats.map((stat) => (
          <article key={stat.label} className="season-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            {stat.detail && <small>{stat.detail}</small>}
          </article>
        ))}
      </div>

      <div className="event-timeline">
        {seasonEvents.map((event) => (
          <article key={`${event.week}-${event.event}`} className="event-card">
            <div>
              <p className="eyebrow">{event.week}</p>
              <h3>{event.event}</h3>
              <p>
                {event.role} with {event.partner}
              </p>
            </div>
            <div className="event-record">
              <strong>Rank {event.rank}</strong>
              <span>{event.record}</span>
            </div>
            {event.awards.length > 0 && (
              <ul>
                {event.awards.map((award) => (
                  <li key={award}>{award}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </BinderSection>
  )
}

function OpenAllianceSection() {
  return (
    <BinderSection
      id="open-alliance"
    >
      <div className="resource-grid">
        {resources.map((resource) => (
          <a
            key={resource.label}
            className="resource-card"
            href={resource.href}
            target="_blank"
            rel="noreferrer"
          >
            <span>{resource.kind}</span>
            <strong>{resource.label}</strong>
            <p>{resource.description}</p>
            <ArrowUpRight className="size-5" />
          </a>
        ))}
      </div>
    </BinderSection>
  )
}

function BinderSection({
  id,
  eyebrow,
  title,
  deck,
  children,
}: {
  id: string
  eyebrow?: string
  title?: string
  deck?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="binder-section">
      {(eyebrow || title || deck) && (
        <div className="section-label">
          <div className="section-heading">
            {title && <h2>{title}</h2>}
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {deck && <p>{deck}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  )
}

type GlossaryState = {
  text: string
  matches: GlossaryEntry[]
  x: number
  y: number
  placement: "above" | "below"
}

function SelectionGlossary() {
  const [state, setState] = useState<GlossaryState | null>(null)

  useEffect(() => {
    const updateSelection = () => {
      const selection = window.getSelection()
      const text = selection?.toString().replace(/\s+/g, " ").trim() ?? ""

      if (!selection || selection.rangeCount === 0 || text.length < 3) {
        setState(null)
        return
      }

      const lowerText = text.toLowerCase()
      const matches = glossaryEntries
        .filter((entry) =>
          entry.terms.some((term) => lowerText.includes(term.toLowerCase()))
        )
        .slice(0, 5)

      if (matches.length === 0) {
        setState(null)
        return
      }

      const rect = selection.getRangeAt(0).getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) {
        setState(null)
        return
      }

      const halfWidth = Math.min(190, Math.max(140, (window.innerWidth - 32) / 2))
      const x = Math.min(
        Math.max(rect.left + rect.width / 2, halfWidth),
        window.innerWidth - halfWidth
      )
      const placement = rect.top > 260 ? "above" : "below"
      const y =
        placement === "above"
          ? rect.top - 12
          : Math.min(rect.bottom + 14, window.innerHeight - 24)

      setState({ text, matches, x, y, placement })
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.getSelection()?.removeAllRanges()
        setState(null)
      }
    }

    document.addEventListener("selectionchange", updateSelection)
    window.addEventListener("mouseup", updateSelection)
    window.addEventListener("keyup", updateSelection)
    window.addEventListener("keydown", handleKeydown)

    return () => {
      document.removeEventListener("selectionchange", updateSelection)
      window.removeEventListener("mouseup", updateSelection)
      window.removeEventListener("keyup", updateSelection)
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  if (!state) return null

  return (
    <aside
      className={cn(
        "selection-glossary",
        state.placement === "below" && "is-below"
      )}
      style={{ left: state.x, top: state.y }}
      aria-live="polite"
    >
      <p className="eyebrow">Selection glossary</p>
      <strong>{state.text}</strong>
      <div className="selection-glossary-list">
        {state.matches.map((entry) => (
          <article key={entry.title}>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
            {entry.process && <small>{entry.process}</small>}
            {entry.href && (
              <a href={entry.href} target="_blank" rel="noreferrer">
                Source
                <ExternalLink className="size-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </aside>
  )
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="technical-list">
      {bullets.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  )
}
