import { useEffect, useLayoutEffect, useMemo, useState } from "react"
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
  thankYouCards,
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
      <ThanksSection />
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
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#mechanical" aria-label="Team 5000 Tech Binder">
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
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="header-actions">
        <ThemeButton />
        <button
          type="button"
          className="icon-button manufacturing-header-button"
          aria-label="Open manufacturing archive"
          onClick={onManufacturingOpen}
        >
          <Factory className="size-4" />
          <span>Manufacturing archive</span>
        </button>
        <a className="icon-button" href={assetPath("/print")} aria-label="Print binder">
          <Printer className="size-4" />
          <span>Print</span>
        </a>
        <button
          type="button"
          className="icon-button mobile-menu-button"
          aria-label="Open navigation"
          onClick={() => onMobileOpenChange(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => onMobileOpenChange(false)}
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
          <button
            type="button"
            className="panel-collapse-toggle"
            aria-label={panelCollapsed ? "Expand notes panel" : "Collapse notes panel"}
            onClick={() => setPanelCollapsed((collapsed) => !collapsed)}
          >
            {panelCollapsed ? (
              <ChevronRight className="size-5" />
            ) : (
              <ChevronLeft className="size-5" />
            )}
          </button>
          {!panelCollapsed && (
            <>
              <PillTabs
                tabs={system.tabs}
                activeId={activeTab.id}
                onSelect={(nextTab) =>
                  setTabBySystem((current) => ({ ...current, [system.id]: nextTab }))
                }
              />
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
          <div>
            <p className="eyebrow">{system.label} CAD preview</p>
            <strong>CAD preview is optimized for compact screens.</strong>
            <p>
              Use the image preview for a cleaner mobile read, or open the larger
              CAD stage if you want to inspect the robot anyway.
            </p>
            <button type="button" className="mobile-cad-toggle" onClick={onShowCad}>
              Show CAD view
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
  if (["shooting", "zones", "cameras", "fuelsim", "architecture"].includes(tab.id)) {
    return <SoftwareVisualStage tab={tab} />
  }

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
      {tab.id === "leds" && <LedPatternShowcase />}
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
          <DialogTitle>Fusion 360 CNC Settings Archive</DialogTitle>
          <DialogDescription>
            Router feeds, speeds, tooling notes, and setup references for 6061,
            polycarbonate, and SRPP.
          </DialogDescription>
        </DialogHeader>
        <ManufacturingArchive />
      </DialogContent>
    </Dialog>
  )
}

function ComparisonSlider({ iterations }: { iterations: Iteration[] }) {
  const [position, setPosition] = useState(50)
  const before = iterations[0]
  const after = iterations[1]

  return (
    <div className="comparison-module">
      <div className="comparison-stage">
        <img src={assetPath(after.image)} alt={after.alt} className="comparison-img" />
        <img
          src={assetPath(before.image)}
          alt={before.alt}
          className="comparison-img comparison-before"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <div className="comparison-handle" style={{ left: `${position}%` }} />
        <input
          aria-label="Compare robot versions"
          min="0"
          max="100"
          value={position}
          type="range"
          onChange={(event) => setPosition(Number(event.currentTarget.value))}
        />
      </div>
      <div className="comparison-labels">
        <span>{before.label}</span>
        <span>{after.label}</span>
      </div>
      <p>{position < 50 ? before.body : after.body}</p>
    </div>
  )
}

function IterationSlider({ iterations }: { iterations: Iteration[] }) {
  const [index, setIndex] = useState(0)
  const iteration = iterations[index] ?? iterations[0]

  return (
    <div className="iteration-module">
      <figure key={iteration.image} className="media-frame iteration-visual">
        <img src={assetPath(iteration.image)} alt={iteration.alt} />
        <figcaption>
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
      <p>{iteration.body}</p>
    </div>
  )
}

function LedPatternShowcase() {
  const patterns = [
    {
      className: "rainbow",
      label: "Disabled + healthy",
      description: "Rainbow confirms the robot is disabled and checks are normal.",
    },
    {
      className: "low-battery",
      label: "Low battery",
      description: "Flashing red flags voltage below the event or testing threshold.",
    },
    {
      className: "cylon",
      label: "Autonomous enabled",
      description: "A scanning sweep makes autonomous state obvious from the glass.",
    },
    {
      className: "teleop",
      label: "Teleop shifts",
      description: "Segmented progress bars show active, inactive, and transition windows.",
    },
  ]

  return (
    <div className="led-pattern-grid" aria-label="LED pattern animations">
      {patterns.map((pattern) => (
        <article key={pattern.className} className="led-pattern-card">
          <div className={cn("led-strip", pattern.className)} aria-hidden="true">
            <span />
          </div>
          <h4>{pattern.label}</h4>
          <p>{pattern.description}</p>
        </article>
      ))}
    </div>
  )
}

function LedVisualStage() {
  const patterns = [
    { label: "Disabled", className: "rainbow", detail: "Healthy / ready" },
    { label: "Low battery", className: "low-battery", detail: "Voltage warning" },
    { label: "Auto", className: "cylon", detail: "Enabled autonomous" },
    { label: "Teleop", className: "teleop", detail: "Shift timing" },
  ]

  return (
    <div className="led-visual-stage">
      <div className="led-robot-silhouette" aria-hidden="true">
        <div className="led-robot-frame">
          <span className="led-edge top" />
          <span className="led-edge right" />
          <span className="led-edge bottom" />
          <span className="led-edge left" />
          <span className="led-turret-ring" />
        </div>
      </div>
      <div className="led-visual-patterns">
        {patterns.map((pattern) => (
          <article key={pattern.label}>
            <div className={cn("led-strip", pattern.className)} aria-hidden="true">
              <span />
            </div>
            <strong>{pattern.label}</strong>
            <small>{pattern.detail}</small>
          </article>
        ))}
      </div>
    </div>
  )
}

function SoftwareSection() {
  const [activeTab, setActiveTab] = useState(softwareTabs[0].id)
  const tab = softwareTabs.find((item) => item.id === activeTab) ?? softwareTabs[0]

  return (
    <BinderSection
      id="software"
      eyebrow="Software"
      title="Aiming while moving."
      deck="The software stack turns a mechanically complex robot into a continuous scoring system: simulation, predictive zones, turret compensation, and timing-aware shots."
    >
      <section className="feature-panel">
        <div className="panel-media">
          <TabMedia tab={tab} fallback={mechanicalSystems[0]} />
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
      title="Consistency became the story."
      deck="The season combined mechanical iteration, software maturity, public documentation, and the strongest awards run in Team 5000 history."
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
      eyebrow="Open Alliance"
      title="Built in public by default."
      deck="CAD links, code references, build notes, and public recap material keep the binder aligned with Open Alliance culture."
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

function ThanksSection() {
  return (
    <BinderSection
      id="thanks"
      eyebrow="Thank You"
      title="Robots are not solo projects."
      deck="This season was carried by mentors, parents, partners, volunteers, public feedback, and teams willing to share what they know."
    >
      <div className="thanks-grid">
        {thankYouCards.map((card) => (
          <article key={card.name} className="thanks-card">
            <h3>{card.name}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </BinderSection>
  )
}

function BinderSection({
  id,
  children,
}: {
  id: string
  eyebrow?: string
  title?: string
  deck?: string
  children: React.ReactNode
}) {
  return <section id={id} className="binder-section">{children}</section>
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
