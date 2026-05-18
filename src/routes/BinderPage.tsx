import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import { useQuery } from "convex/react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Camera,
  ChevronDown,
  ChevronRight,
  Factory,
  Gauge,
  GitPullRequest,
  HeartHandshake,
  Menu,
  Moon,
  Network,
  Printer,
  Route,
  ScanSearch,
  Sun,
  Wrench,
  Zap,
} from "lucide-react"
import { useTheme } from "next-themes"

import { api } from "../../convex/_generated/api"
import { ApsCadViewer } from "@/components/cad/ApsCadViewer"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type {
  BinderContent,
  ResourceLink,
  SeasonEvent,
  SoftwareSystem,
} from "@/lib/binder-types"
import { assetPath } from "@/lib/assets"
import {
  deepDiveTabs,
  fullRobotDeepDive,
  glossaryEntries,
  loganFieldNotes,
  mechanismDeepDives,
  mechanismPanelNotes,
  type DetailSection,
  type GlossaryEntry,
  type MechanismDeepDive,
} from "@/lib/robot-notes"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/store/ui-store"

const softwareIcons = {
  route: Route,
  scan: ScanSearch,
  network: Network,
} satisfies Record<SoftwareSystem["icon"], typeof Route>

type HeroPanelPosition = "left" | "right"

const preferredNavItems = [
  { label: "Mechanical", href: "#hero" },
  { label: "Software", href: "#software" },
  { label: "Manufacturing", href: "#manufacturing" },
  { label: "Season Results", href: "#season-results" },
  { label: "Open Alliance", href: "#open-alliance" },
  { label: "Thanks", href: "#thanks" },
]

const seasonPerformanceStats = [
  { label: "Total EPA", value: "235.8", detail: "Statbotics total", accent: "red" },
  { label: "Auto EPA", value: "46.0", detail: "Autonomous contribution", accent: "blue" },
  { label: "Teleop EPA", value: "128.4", detail: "Teleop contribution", accent: "orange" },
  { label: "Endgame EPA", value: "61.4", detail: "Endgame contribution", accent: "green" },
]

const seasonRankStats = [
  { label: "World EPA Rank", rank: 34, total: 3724, accent: "blue" },
  { label: "United States Rank", rank: 28, total: 2944, accent: "orange" },
  { label: "New England Rank", rank: 6, total: 200, accent: "green" },
  { label: "Massachusetts Rank", rank: 3, total: 71, accent: "red" },
] as const

const seasonPhaseBreakdown = [
  { label: "Auto EPA", value: "46.0", share: "20%", accent: "blue" },
  { label: "Teleop EPA", value: "128.4", share: "54%", accent: "orange" },
  { label: "Endgame EPA", value: "61.4", share: "26%", accent: "green" },
]

const seasonTrajectory = [
  {
    label: "Start EPA",
    value: "56.24",
    body: "The early baseline left room for a major rebuild and subsystem retune.",
  },
  {
    label: "Pre-Champs EPA",
    value: "204.44",
    body: "By the end of the district season, the robot had become a high-throughput scorer.",
  },
  {
    label: "Max EPA",
    value: "239.74",
    body: "Peak form landed Icarus 2.0 inside the top tier of the 2026 field.",
  },
]

const accentCycle = ["blue", "orange", "green", "red"] as const

function getTopPercent(rank: number, total: number) {
  const percent = (rank / total) * 100
  return `${percent < 1 ? percent.toFixed(2) : percent.toFixed(1)}%`
}

const softwareVisuals: Record<
  string,
  {
    image: string
    caption: string
    snippet: string
  }
> = {
  Autonomous: {
    image: "/media/icarus-version-2.png",
    caption: "Shot pipeline model: path state, turret target, rotor timing, release window.",
    snippet: `if (turret.atSetpoint() && rotor.readyToFeed()) {
  shooter.requestShot(pathPlanner.velocity());
  rotor.syncToShooter(shooter.surfaceSpeed());
}`,
  },
  Vision: {
    image: "/media/turret-teaser.png",
    caption: "AprilTag localization and turret tracking data are fused before shot release.",
    snippet: `const target = vision.bestFieldTarget();
turret.track(target, drivetrain.fieldVelocity());
driverAssist.publishShotConfidence(turret.error());`,
  },
  Architecture: {
    image: "/media/frame-cad.png",
    caption: "Subsystem boundaries keep logging, replay, sim, and tuning hooks inspectable.",
    snippet: `new Trigger(scoreCommand::isScheduled)
  .whileTrue(logShotState())
  .onFalse(replay.markCycleComplete());`,
  },
}

const deepDiveImageRequests: Record<string, string[]> = {
  full: [
    "Full robot CAD render in final configuration",
    "Final pit photo with bumpers installed",
    "Annotated underside or electronics access photo",
  ],
  "super-structure": [
    "Side plate V1 vs V2 comparison",
    "Welded bumper backer and bumper pan underside",
    "Bellypan pocket / electronics mounting reference",
    "LED holder and diffuser close-up",
  ],
  "dual-intake": [
    "SRPP rack lamination close-up",
    "Dead-axle roller and stub axle detail",
    "Final SRPP hopper wall installed",
    "Sewn half-box hopper net filled with fuel",
  ],
  "dye-rotor": [
    "Top PETG-CF dye rotor print",
    "Under-rotor chain drive layout",
    "X-contact bearing stack",
    "C-shaped feed path sketch or CAD section",
  ],
  turret: [
    "18 inch turret ring gear detail",
    "Cable sleeve path inside the turret",
    "Hood rack and 6.4-48 degree travel reference",
    "Shooter wheel / sushi roller stack",
  ],
}

const developmentStories: Record<
  string,
  {
    compare: {
      before: string
      beforeAlt: string
      beforeLabel: string
      after: string
      afterAlt: string
      afterLabel: string
    }
    versions: Array<{
      label: string
      title: string
      body: string
      image: string
      imageAlt: string
      features: string[]
    }>
  }
> = {
  full: {
    compare: {
      before: "/media/icarus-version-1.png",
      beforeAlt: "Icarus version 1 CAD render",
      beforeLabel: "Version 1",
      after: "/media/icarus-version-2.png",
      afterAlt: "Icarus version 2 CAD render",
      afterLabel: "Version 2",
    },
    versions: [
      {
        label: "V1",
        title: "Version 1",
        body: "Early complete-package CAD with the turret, indexer, and side acquisition architecture still exposed for fast iteration.",
        image: "/media/icarus-version-1.png",
        imageAlt: "Icarus version 1 CAD render",
        features: [
          "Open access around the turret and dye rotor",
          "Early side intake and hopper packaging",
          "Architecture still flexible enough for major rebuild choices",
        ],
      },
      {
        label: "Rebuild",
        title: "Scoring architecture",
        body: "Dual intakes, compact indexer, and turret packaged as one scoring path.",
        image: "/media/prototype-drive.jpeg",
        imageAlt: "Prototype build placeholder",
        features: [
          "Remove low-value climb complexity",
          "Keep internal volume focused on fuel handling",
          "Make service paths more obvious",
        ],
      },
      {
        label: "V2",
        title: "Version 2",
        body: "Final scoring-first package with the finished top plate, compact turret/indexer stack, and refined side structure.",
        image: "/media/icarus-version-2.png",
        imageAlt: "Icarus version 2 CAD render",
        features: [
          "Compact coaxial dye rotor indexer",
          "Inverted pancake turret",
          "Final side structure and bumper package",
        ],
      },
    ],
  },
  "super-structure": {
    compare: {
      before: "/media/frame-cad.png",
      beforeAlt: "Superstructure V1 side plate placeholder",
      beforeLabel: "CNC V1",
      after: "/media/final-icarus-starting-config.png",
      afterAlt: "Superstructure V2 placeholder",
      afterLabel: "Waterjet V2",
    },
    versions: [
      {
        label: "V1",
        title: "CNC side plates",
        body: "Initial 1/4 inch plates took about 4.5 hours each to machine.",
        image: "/media/frame-cad.png",
        imageAlt: "CNC side plate placeholder",
        features: [
          "Heavy structure for intakes and climber-era loads",
          "Supported turret mounting plate",
          "Time-intensive machining cycle",
        ],
      },
      {
        label: "V2",
        title: "Waterjet structure",
        body: "Water-jetted side plates saved fabrication time while preserving the load path.",
        image: "/media/final-icarus-starting-config.png",
        imageAlt: "Waterjet side plate placeholder",
        features: [
          "Final plates a little over 4 lb each",
          "Bumper pan helped make weight",
          "Bumpers became structural packaging",
        ],
      },
    ],
  },
  "dual-intake": {
    compare: {
      before: "/media/prototype-drive.jpeg",
      beforeAlt: "Prototype intake wall placeholder",
      beforeLabel: "Poly wall",
      after: "/media/icarus-version-2.png",
      afterAlt: "Final SRPP intake placeholder",
      afterLabel: "SRPP wall",
    },
    versions: [
      {
        label: "Prototype",
        title: "Bent polycarbonate",
        body: "1/16 inch bent walls were light but too flexible and cracked too easily.",
        image: "/media/prototype-drive.jpeg",
        imageAlt: "Bent polycarbonate wall placeholder",
        features: [
          "Caught on the other intake",
          "Too flimsy under fuel load",
          "Fast to prototype but not reliable enough",
        ],
      },
      {
        label: "Final",
        title: "SRPP hopper walls",
        body: "1/8 inch SRPP fixed the stiffness and interference problems.",
        image: "/media/icarus-version-2.png",
        imageAlt: "Final intake placeholder",
        features: [
          "Rack-and-pinion impact compliance",
          "Half-box sewn net for capacity",
          "Same four plates ran all four competitions",
        ],
      },
    ],
  },
  "dye-rotor": {
    compare: {
      before: "/media/frame-cad.png",
      beforeAlt: "Dye rotor early package placeholder",
      beforeLabel: "Layout",
      after: "/media/final-icarus-starting-config.png",
      afterAlt: "Dye rotor final package placeholder",
      afterLabel: "Final indexer",
    },
    versions: [
      {
        label: "Packaging",
        title: "Low bowl target",
        body: "The rotor package was pushed low, with the bowl base about 1.3 inches above the robot bottom.",
        image: "/media/frame-cad.png",
        imageAlt: "Low bowl package placeholder",
        features: [
          "Compact vertical stack",
          "Under-rotor chain drive",
          "Three WCP 4.5 inch x-contact bearings",
        ],
      },
      {
        label: "Feed",
        title: "C-shaped path",
        body: "The horizontal wheel path was shaped to keep fuel in contact longer before entering the rotor.",
        image: "/media/final-icarus-starting-config.png",
        imageAlt: "Final dye rotor placeholder",
        features: [
          "Separate hook and feed power",
          "Cut-down WCP compliant wheels",
          "Two-piece removable polycarbonate bowl",
        ],
      },
    ],
  },
  turret: {
    compare: {
      before: "/media/frame-cad.png",
      beforeAlt: "Turret early concept placeholder",
      beforeLabel: "Concept",
      after: "/media/turret-teaser.png",
      afterAlt: "Final turret placeholder",
      afterLabel: "Final turret",
    },
    versions: [
      {
        label: "Concept",
        title: "Coaxial idea",
        body: "Earlier turret thinking gave way to a lower, more package-friendly architecture.",
        image: "/media/frame-cad.png",
        imageAlt: "Early turret concept placeholder",
        features: [
          "Keep shooter aim independent",
          "Protect hopper volume",
          "Reduce package height",
        ],
      },
      {
        label: "Final",
        title: "Inverted pancake",
        body: "The final turret uses an 18 inch ring gear, 420 degrees of travel, and a 6.4-48 degree hood.",
        image: "/media/turret-teaser.png",
        imageAlt: "Final turret placeholder",
        features: [
          "45:1 turret reduction",
          "Compact cable sleeve path",
          "SRPP hood with aluminum rack reinforcement",
        ],
      },
    ],
  },
}

const manufacturingCapabilities = [
  {
    material: "SRPP",
    source: "West Coast Products SRPP sheet",
    tool: "CNC router",
    notes: [
      "Purchased from WCP and CNC machined for racks, intake plates, hopper walls, hood parts, and contact-prone mechanism parts.",
      "Light sanding with 80 grit and acetone cleaning worked before 3M 8005 bonding.",
      "SRPP was preferred over polycarbonate when impact toughness, Loctite resistance, and low friction mattered.",
    ],
    imageRequest: "Photo of SRPP sheet on the router, rack teeth after cutting, and final installed SRPP wall.",
  },
  {
    material: "Polycarbonate",
    source: "WCP smoked sheet + McMaster tube",
    tool: "CNC / bend / table fixtures",
    notes: [
      "Used for bowls, bumper pan, covers, and tube rollers where transparency, flexibility, or round tube stock helped.",
      "The 1/16 inch bent intake wall prototype was too flimsy; the final solution moved to 1/8 inch SRPP.",
      "The dye rotor bowl stayed as two removable 1/8 inch polycarbonate pieces.",
    ],
    imageRequest: "Photo of the failed bent wall, final dye rotor bowl, and bumper pan underside.",
  },
  {
    material: "6061 aluminum",
    source: "Metal Supermarkets",
    tool: "CNC router / waterjet",
    notes: [
      "Default aluminum for robot structure unless a note calls out another alloy.",
      "Pocketed and half-pocketed plates kept stiffness while chasing ounces.",
      "Version 2 side plates moved to waterjet to save time compared with the 4.5-hour CNC V1 plates.",
    ],
    imageRequest: "Photo of side plates on the waterjet/CNC, pocketed turret gear plate, and bellypan detail.",
  },
]

const manufacturingTools = [
  "CNC router",
  "Waterjet access",
  "Manual lathe for stub axles",
  "3D printers: Bambu FDM + Formlabs SLA",
  "Sewing for hopper net and reinforced zip-tie points",
  "Crimping, solder-seal, hot glue, and strain-relief wiring station",
]

const seasonRecapStats = [
  { label: "Record", value: "41-23-0", body: "Official 2026 Statbotics record." },
  { label: "World EPA", value: "#34", body: "Out of 3,724 teams." },
  { label: "USA EPA", value: "#28", body: "Out of 2,944 teams." },
  { label: "New England", value: "#6", body: "Out of 200 teams." },
  { label: "Massachusetts", value: "#3", body: "Out of 71 teams." },
  { label: "Peak EPA", value: "239.74", body: "Maximum EPA during the season." },
]

const thanksGroups = [
  {
    title: "Teams and Open Alliance",
    body:
      "For public CAD, code, build thread feedback, match discussion, and the binder culture this project is trying to live up to.",
    slots: ["Team 4414 Hightide inspiration", "Chief Delphi / Open Alliance community", "Teams that shared CAD, code, and testing ideas"],
  },
  {
    title: "Mentors and students",
    body:
      "For the late nights, machining help, wiring standards, code iteration, inspection habits, and the willingness to rebuild when the robot needed it.",
    slots: ["Mechanical mentors", "Software mentors", "Fabrication helpers", "Drive team and pit crew"],
  },
  {
    title: "Sponsors",
    body:
      "A restrained sponsor area that can hold logos and short thank-you notes without turning the binder into an ad wall.",
    slots: ["Sponsor logo slot", "Sponsor logo slot", "Sponsor logo slot", "Sponsor logo slot"],
  },
]

function getSystemPanelText({
  content,
  system,
}: {
  content: BinderContent
  system: BinderContent["mechanicalSystems"][number] | undefined
}) {
  if (system && mechanismPanelNotes[system.id]) {
    return mechanismPanelNotes[system.id]
  }

  return [
    content.hero.deck.replace(/dye rotor buffering/gi, "dye rotor indexing"),
  ]
}

function useBinderContent() {
  return useQuery(api.binder.get) as BinderContent | undefined
}

export function BinderPage() {
  const content = useBinderContent()
  const setActiveSection = useUiStore((state) => state.setActiveSection)

  useEffect(() => {
    const sectionIds = [
      "hero",
      "software",
      "manufacturing",
      "season-results",
      "open-alliance",
      "thanks",
    ]
    let animationFrame = 0

    function syncActiveSection() {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const headerOffset = 88
        const scrollPosition = scrollTop + headerOffset
        let activeId = "hero"

        for (const id of sectionIds) {
          const section = document.getElementById(id)
          if (!section) continue

          if (scrollPosition >= section.offsetTop) {
            activeId = id
          }
        }

        if (scrollTop < 8) {
          activeId = "hero"
        }

        setActiveSection(activeId)
        const nextHash = `#${activeId}`
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, "", nextHash)
        }
      })
    }

    syncActiveSection()
    window.addEventListener("scroll", syncActiveSection, { passive: true })
    window.addEventListener("resize", syncActiveSection)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("scroll", syncActiveSection)
      window.removeEventListener("resize", syncActiveSection)
    }
  }, [setActiveSection])

  if (!content) {
    return <LoadingShell />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader navItems={content.navItems} />
      <main>
        <HeroSection content={content} />
        <SoftwareSection systems={content.softwareSystems} />
        <ManufacturingSection />
        <SeasonSection
          stats={content.seasonStats}
          events={content.seasonEvents}
        />
        <OpenAllianceSection resources={content.resources} />
        <ThanksSection />
      </main>
      <SelectionReferencePopup />
    </div>
  )
}

function SiteHeader({
  navItems,
}: {
  navItems: BinderContent["navItems"]
}) {
  const activeSection = useUiStore((state) => state.activeSection)
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const setActiveSection = useUiStore((state) => state.setActiveSection)
  const primaryNavItems = useMemo(
    () => {
      const navByLabel = new Map(navItems.map((item) => [item.label, item]))
      return preferredNavItems.map((item) => navByLabel.get(item.label) ?? item)
    },
    [navItems]
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#hero" className="flex min-w-fit items-center gap-3">
          <span className="site-logo-mark">
            <img
              src={assetPath("/brand/hammerheads-logo.svg")}
              alt="Hammerheads logo"
              className="size-full object-contain"
            />
          </span>
          <span className="hidden leading-none sm:block">
            <span className="team-display block text-lg">5000</span>
            <span className="block text-xs text-muted-foreground">
              Tech Binder
            </span>
          </span>
        </a>

        <ScrollArea className="hidden flex-1 md:block">
          <nav className="flex min-w-max items-center justify-center gap-1 px-2">
            {primaryNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                active={item.href === `#${activeSection}`}
                onNavigate={(href) => setActiveSection(scrollToSection(href))}
              />
            ))}
          </nav>
        </ScrollArea>

        <div className="ml-auto flex items-center gap-2">
          <ThemeMenu />
          <Link
            to="/print"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden border-foreground/20 bg-transparent md:inline-flex"
            )}
          >
            <Printer className="size-3.5" />
            Print
          </Link>
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="border-foreground/20 bg-transparent md:hidden"
                />
              }
            >
              <Menu className="size-4" />
              <span className="sr-only">Open navigation</span>
            </SheetTrigger>
            <SheetContent className="border-foreground/10 bg-background" side="right">
              <SheetHeader>
                <SheetTitle>Team 5000 Binder</SheetTitle>
                <SheetDescription>
                  Mechanical CAD, software notes, manufacturing, season
                  performance, Open Alliance resources, and thanks.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-1 px-4">
                {primaryNavItems.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    onNavigate={(href) => {
                      setActiveSection(scrollToSection(href))
                      setMobileNavOpen(false)
                    }}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavItem({
  item,
  active,
  onNavigate,
}: {
  item: { label: string; href: string }
  active: boolean
  onNavigate: (href: string) => void
}) {
  const className = cn(
    "inline-flex h-9 items-center border border-transparent px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/15 hover:text-foreground",
    active && "border-foreground/20 bg-foreground/5 text-foreground"
  )

  if (item.href.startsWith("/")) {
    return (
      <Link to={item.href} className={className}>
        {item.label}
      </Link>
    )
  }

  return (
    <a
      href={item.href}
      className={className}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(item.href)
      }}
    >
      {item.label}
    </a>
  )
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: { label: string; href: string }
  onNavigate: (href: string) => void
}) {
  const className =
    "flex min-h-11 items-center justify-between border-b border-border px-1 text-sm font-medium"

  if (item.href.startsWith("/")) {
    return (
      <Link
        to={item.href}
        className={className}
        onClick={() => onNavigate(item.href)}
      >
        {item.label}
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    )
  }

  return (
    <a
      href={item.href}
      className={className}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(item.href)
      }}
    >
      {item.label}
      <ChevronRight className="size-4 text-muted-foreground" />
    </a>
  )
}

function scrollToSection(href: string) {
  if (!href.startsWith("#")) return href

  const id = href.replace("#", "")
  const section = document.getElementById(id)

  if (id === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" })
  } else {
    window.scrollTo({
      top: Math.max(0, (section?.offsetTop ?? 0) - 64),
      behavior: "smooth",
    })
  }

  window.history.replaceState(null, "", href)
  return id
}

function ThemeMenu() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="border border-transparent"
          />
        }
      >
        <Sun className="size-4 dark:hidden" />
        <Moon className="hidden size-4 dark:block" />
        <span className="sr-only">Theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="size-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Gauge className="size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeroSection({ content }: { content: BinderContent }) {
  const selectedCadSubsystem = useUiStore(
    (state) => state.selectedCadSubsystem
  )
  const selectedSystem = useUiStore((state) => state.selectedSystem)
  const [panelPosition, setPanelPosition] =
    useState<HeroPanelPosition>("left")
  const [deepDiveOpen, setDeepDiveOpen] = useState(false)
  const selectedMechanical =
    selectedCadSubsystem === "full"
      ? undefined
      : content.mechanicalSystems.find((system) => system.id === selectedSystem)
  const activeDeepDive = selectedMechanical
    ? mechanismDeepDives[selectedMechanical.id] ?? fullRobotDeepDive
    : fullRobotDeepDive
  const panelText = getSystemPanelText({
    content,
    system: selectedMechanical,
  })
  const visiblePanelText = panelText.slice(0, selectedMechanical ? 3 : 1)
  const panelKicker = selectedMechanical ? activeDeepDive.kicker : content.hero.headline

  return (
    <section
      id="hero"
      className="technical-grid hero-stage relative isolate overflow-hidden border-b border-border"
    >
      <div className="hero-stage-inner mx-auto min-h-[calc(100svh-4rem)] max-w-[1640px] px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="hero-copy-panel relative z-10 min-w-0"
          data-panel-position={panelPosition}
        >
          <div className="hero-panel-toolbar">
            <Button
              type="button"
              variant="outline"
              className="hero-panel-action"
              onClick={() => setDeepDiveOpen(true)}
            >
              <ArrowUpRight className="size-3.5" />
              {selectedMechanical ? "Build notes" : "Robot notes"}
            </Button>
            <div className="hero-panel-movers" aria-label="Information panel controls">
              <button
                type="button"
                aria-label="Swap information panel side"
                onClick={() =>
                  setPanelPosition((position) =>
                    position === "left" ? "right" : "left"
                  )
                }
              >
                {panelPosition === "left" ? (
                  <ArrowRight className="size-3.5" />
                ) : (
                  <ArrowLeft className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {selectedCadSubsystem === "full" && (
            <h1 className="team-display max-w-4xl text-5xl leading-[0.95] md:text-6xl">
              {content.hero.robotName}
            </h1>
          )}
          <p
            className={cn(
              "max-w-xl text-xl font-semibold text-foreground",
              selectedCadSubsystem === "full" ? "mt-6" : "mt-0"
            )}
          >
            {panelKicker}
          </p>

          <ul className="mt-5 grid max-w-xl gap-3 text-sm leading-6 text-muted-foreground">
            {visiblePanelText.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span className="mt-2 h-px w-6 shrink-0 bg-[var(--team-steel)]" />
                <AnnotatedText text={detail} />
              </li>
            ))}
          </ul>
        </div>

        <ApsCadViewer
          panelPosition={panelPosition}
          onFocusChange={() => undefined}
        />
        <a href="#software" className="hero-scroll-bar">
          <ChevronDown className="size-5" />
          Continue to binder
        </a>
      </div>
      <MechanismDeepDiveDialog
        dive={activeDeepDive}
        onOpenChange={setDeepDiveOpen}
        open={deepDiveOpen}
      />
    </section>
  )
}

function MechanismDeepDiveDialog({
  dive,
  onOpenChange,
  open,
}: {
  dive: MechanismDeepDive
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const visibleTabs = deepDiveTabs.filter(
    (tab) => (dive.tabs[tab.id]?.length ?? 0) > 0
  )
  const imageRequests = deepDiveImageRequests[dive.id] ?? deepDiveImageRequests.full

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="deep-dive-dialog" showCloseButton>
        <DialogTitle className="sr-only">{dive.title}</DialogTitle>
        <DialogDescription className="sr-only">{dive.kicker}</DialogDescription>

        <Tabs defaultValue="overview" className="deep-dive-tabs">
          <TabsList className="deep-dive-tab-list">
            {visibleTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="deep-dive-tab-trigger"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {visibleTabs.map((tab) => {
            const sections = dive.tabs[tab.id] ?? []

            if (tab.id === "development") {
              return (
                <TabsContent key={tab.id} value={tab.id}>
                  <ScrollArea className="deep-dive-scroll">
                    <DevelopmentStoryPanel
                      dive={dive}
                      imageRequests={imageRequests}
                      sections={sections}
                    />
                  </ScrollArea>
                </TabsContent>
              )
            }

            return (
              <TabsContent key={tab.id} value={tab.id}>
                <ScrollArea className="deep-dive-scroll">
                  <div className="deep-dive-content-layout" data-tab={tab.id}>
                    <section className="deep-dive-summary-strip">
                      <div className="deep-dive-summary-copy">
                        <p>{tab.label}</p>
                        <h2 className="team-display deep-dive-title">
                          {dive.title}
                        </h2>
                        <div className="deep-dive-kicker">
                          <AnnotatedText text={dive.kicker} />
                        </div>
                      </div>
                      <div className="deep-dive-stats">
                        {dive.stats.map((stat) => (
                          <div key={stat.label}>
                            <p>{stat.label}</p>
                            <strong>{stat.value}</strong>
                          </div>
                        ))}
                      </div>
                    </section>

                    {tab.id === "leds" && <LedPatternShowcase />}

                    {dive.id === "full" &&
                      (tab.id === "overview" || tab.id === "build") && (
                        <section className="deep-dive-compare-block">
                          <div>
                            <p>Version comparison</p>
                            <h3>Version 1 / Version 2</h3>
                          </div>
                          <ImageComparisonSlider
                            compare={developmentStories.full.compare}
                          />
                        </section>
                      )}

                    <div className="deep-dive-section-grid">
                      {sections.map((section, index) => (
                        <section
                          key={section.title}
                          className="deep-dive-section"
                          data-section-index={index + 1}
                        >
                          <div className="deep-dive-section-visual">
                            <Camera className="size-4" />
                            <span>
                              {imageRequests[index % imageRequests.length] ??
                                `${section.title} build reference`}
                            </span>
                          </div>
                          <div className="deep-dive-section-copy">
                            <p>{String(index + 1).padStart(2, "0")}</p>
                            <h3>{section.title}</h3>
                            <ul>
                              {section.bullets.map((bullet) => (
                                <li key={bullet}>
                                  <AnnotatedText text={bullet} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </section>
                      ))}
                    </div>

                    <div className="deep-dive-image-requests">
                      <p>Needed pictures</p>
                      <div>
                        {imageRequests.map((request) => (
                          <span key={request}>
                            <Camera className="size-3.5" />
                            {request}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            )
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function ImageComparisonSlider({
  compare,
}: {
  compare: {
    before: string
    beforeAlt: string
    beforeLabel: string
    after: string
    afterAlt: string
    afterLabel: string
  }
}) {
  const [position, setPosition] = useState(48)

  return (
    <figure className="image-compare">
      <img
        className="image-compare-after"
        src={assetPath(compare.after)}
        alt={compare.afterAlt}
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      />
      <div
        className="image-compare-before"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={assetPath(compare.before)} alt={compare.beforeAlt} />
      </div>
      <span className="image-compare-line" style={{ left: `${position}%` }}>
        <span />
      </span>
      <input
        aria-label="Compare block CAD and final CAD"
        max="100"
        min="0"
        type="range"
        value={position}
        onChange={(event) => setPosition(Number(event.currentTarget.value))}
      />
      <figcaption>
        <span>{compare.beforeLabel}</span>
        <span>{compare.afterLabel}</span>
      </figcaption>
    </figure>
  )
}

function DevelopmentStoryPanel({
  dive,
  imageRequests,
  sections,
}: {
  dive: MechanismDeepDive
  imageRequests: string[]
  sections: DetailSection[]
}) {
  const story = developmentStories[dive.id] ?? developmentStories.full
  const [versionSelection, setVersionSelection] = useState({
    diveId: dive.id,
    index: 0,
  })
  const versionIndex =
    versionSelection.diveId === dive.id ? versionSelection.index : 0
  const setVersionIndex = (index: number) =>
    setVersionSelection({ diveId: dive.id, index })
  const activeVersion = story.versions[
    Math.min(versionIndex, story.versions.length - 1)
  ]

  return (
    <div className="development-story-panel">
      <ImageComparisonSlider compare={story.compare} />

      <aside className="development-story-copy">
        <p>Development / {activeVersion.label}</p>
        <h3>{activeVersion.title}</h3>
        <span>{activeVersion.body}</span>
        <div className="development-version-control">
          <div>
            {story.versions.map((version, index) => (
              <button
                key={version.label}
                type="button"
                className={cn(index === versionIndex && "is-active")}
                onClick={() => setVersionIndex(index)}
              >
                {version.label}
              </button>
            ))}
          </div>
          <input
            aria-label={`${dive.title} development version`}
            max={story.versions.length - 1}
            min="0"
            step="1"
            type="range"
            value={versionIndex}
            onChange={(event) =>
              setVersionIndex(Number(event.currentTarget.value))
            }
          />
        </div>
        <ul>
          {activeVersion.features.map((feature) => (
            <li key={feature}>
              <AnnotatedText text={feature} />
            </li>
          ))}
        </ul>
      </aside>

      <div className="development-version-strip">
        {story.versions.map((version, index) => (
          <button
            key={version.label}
            type="button"
            className={cn(index === versionIndex && "is-active")}
            onClick={() => setVersionIndex(index)}
          >
            <img src={assetPath(version.image)} alt={version.imageAlt} />
            <span>{version.label}</span>
            <strong>{version.title}</strong>
          </button>
        ))}
      </div>

      <div className="development-notes-board">
        {sections.map((section, index) => (
          <section key={section.title} data-section-index={index + 1}>
            <div className="deep-dive-section-visual">
              <Camera className="size-4" />
              <span>
                {imageRequests[index % imageRequests.length] ??
                  `${section.title} development reference`}
              </span>
            </div>
            <div className="deep-dive-section-copy">
              <p>{String(index + 1).padStart(2, "0")}</p>
              <h3>{section.title}</h3>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <AnnotatedText text={bullet} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <div className="development-picture-requests">
        <p>Pictures needed</p>
        {imageRequests.map((request) => (
          <span key={request}>
            <Camera className="size-3.5" />
            {request}
          </span>
        ))}
      </div>
    </div>
  )
}

function LedPatternShowcase() {
  const patterns = [
    {
      state: "rainbow",
      label: "Disabled healthy",
      trigger: "Robot disabled, all systems good",
      meaning: "Rainbow sweep",
      className: "led-rainbow",
    },
    {
      state: "low",
      label: "Low battery",
      trigger: "Disabled below 12.4 V at comp / 12.1 V testing",
      meaning: "Flashing red",
      className: "led-low-battery",
    },
    {
      state: "auto",
      label: "Auto enabled",
      trigger: "Robot enabled in autonomous",
      meaning: "Scanning Cylon bar",
      className: "led-cylon",
    },
    {
      state: "teleop",
      label: "Teleop shifts",
      trigger: "Teleop active, transition, inactive, and endgame periods",
      meaning: "Progress bars with flash warning",
      className: "led-shifts",
    },
  ]

  return (
    <section className="led-pattern-showcase" aria-label="LED pattern preview">
      <div className="led-pattern-header">
        <div>
          <p>Status language</p>
          <h3>Competition-readable LEDs</h3>
        </div>
        <Zap className="size-5" />
      </div>
      <div className="led-pattern-rig">
        <div className="led-strip led-rainbow" />
        <div className="led-strip led-low-battery" />
        <div className="led-strip led-cylon">
          <span />
        </div>
        <div className="led-strip led-shifts">
          <span data-state="transition" />
          <span data-state="active" />
          <span data-state="inactive" />
          <span data-state="active" />
        </div>
      </div>
      <div className="led-pattern-grid">
        {patterns.map((pattern) => (
          <article key={pattern.state} className="led-pattern-card">
            <div className={cn("led-mini-strip", pattern.className)}>
              {pattern.state === "auto" && <span />}
              {pattern.state === "teleop" && (
                <>
                  <span data-state="transition" />
                  <span data-state="active" />
                  <span data-state="inactive" />
                  <span data-state="active" />
                </>
              )}
            </div>
            <div>
              <h3>{pattern.label}</h3>
              <p>{pattern.trigger}</p>
              <strong>{pattern.meaning}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const glossaryTerms = glossaryEntries
  .flatMap((entry) => entry.terms.map((term) => ({ entry, term })))
  .sort((a, b) => b.term.length - a.term.length)

type GlossaryMatch = {
  entry: GlossaryEntry
  terms: string[]
}

function AnnotatedText({ text }: { text: string }) {
  return <>{text}</>
}

function normalizeSelectionText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

function findGlossaryMatches(selection: string): GlossaryMatch[] {
  const normalized = selection.trim().replace(/\s+/g, " ").toLowerCase()
  if (normalized.length < 2 || normalized.length > 1800) return []

  const matches = new Map<
    string,
    {
      entry: GlossaryEntry
      terms: Set<string>
    }
  >()

  for (const { entry, term } of glossaryTerms) {
    const normalizedTerm = normalizeSelectionText(term)
    if (normalizedTerm.length < 2) continue

    const isExact = normalized === normalizedTerm
    const containsTerm = normalized.includes(normalizedTerm)
    const partialTerm =
      normalized.length <= 44 && normalizedTerm.includes(normalized)

    if (!isExact && !containsTerm && !partialTerm) continue

    const current = matches.get(entry.title) ?? {
      entry,
      terms: new Set<string>(),
    }
    current.terms.add(term)
    matches.set(entry.title, current)
  }

  return Array.from(matches.values())
    .map((match) => ({
      entry: match.entry,
      terms: Array.from(match.terms).sort((a, b) => b.length - a.length),
    }))
    .sort((a, b) => {
      const exactA = a.terms.some((term) => normalizeSelectionText(term) === normalized)
      const exactB = b.terms.some((term) => normalizeSelectionText(term) === normalized)
      if (exactA !== exactB) return exactA ? -1 : 1
      return b.terms[0].length - a.terms[0].length
    })
    .slice(0, 10)
}

function SelectionReferencePopup() {
  const [selection, setSelection] = useState<{
    left: number
    matches: GlossaryMatch[]
    side: "above" | "below"
    text: string
    top: number
  } | null>(null)

  useEffect(() => {
    let timeout: number | undefined

    const updateSelection = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        const activeSelection = window.getSelection()
        const selectedText = activeSelection?.toString().trim() ?? ""

        if (!activeSelection || !selectedText || activeSelection.rangeCount === 0) {
          setSelection(null)
          return
        }

        const matches = findGlossaryMatches(selectedText)
        if (matches.length === 0) {
          setSelection(null)
          return
        }

        const range = activeSelection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) {
          setSelection(null)
          return
        }

        const popupWidth = 320
        const left = Math.min(
          window.innerWidth - popupWidth / 2 - 12,
          Math.max(popupWidth / 2 + 12, rect.left + rect.width / 2)
        )
        const above = rect.bottom > window.innerHeight - 280

        setSelection({
          left,
          matches,
          side: above ? "above" : "below",
          text: selectedText.replace(/\s+/g, " "),
          top: above ? Math.max(12, rect.top - 12) : rect.bottom + 12,
        })
      }, 20)
    }

    document.addEventListener("selectionchange", updateSelection)
    window.addEventListener("resize", updateSelection)
    window.addEventListener("scroll", updateSelection, true)

    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener("selectionchange", updateSelection)
      window.removeEventListener("resize", updateSelection)
      window.removeEventListener("scroll", updateSelection, true)
    }
  }, [])

  if (!selection) return null
  const primaryMatch = selection.matches[0]
  const matchCount = selection.matches.length

  return (
    <aside
      className="selection-reference-popover"
      data-side={selection.side}
      style={{ left: selection.left, top: selection.top }}
      onMouseDown={(event) => event.preventDefault()}
    >
      <p className="selection-reference-label">
        {matchCount === 1 ? "Reference match" : `${matchCount} reference matches`}
      </p>
      <strong>{primaryMatch.entry.title}</strong>
      <p>{primaryMatch.entry.body}</p>
      {primaryMatch.entry.process && <p>{primaryMatch.entry.process}</p>}
      {matchCount > 1 && (
        <p className="selection-reference-summary">
          Matched terms:{" "}
          {selection.matches
            .flatMap((match) => match.terms.slice(0, 2))
            .slice(0, 8)
            .join(", ")}
        </p>
      )}
      <div className="selection-reference-list">
        {selection.matches.map((match) => (
          <article key={match.entry.title} className="selection-reference-item">
            <div>
              <strong>{match.entry.title}</strong>
              <small>{match.terms.slice(0, 3).join(", ")}</small>
            </div>
            {match.entry.href && (
              <a href={match.entry.href} target="_blank" rel="noreferrer">
                Link
                <ArrowUpRight className="size-3" />
              </a>
            )}
          </article>
        ))}
      </div>
      <span>{selection.text}</span>
    </aside>
  )
}

function SectionIntro({
  eyebrow,
  title,
  body,
  icon: Icon,
}: {
  eyebrow: string
  title: string
  body: string
  icon: typeof Boxes
}) {
  return (
    <div className="section-intro mb-10 grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
      <div>
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase text-muted-foreground">
          <Icon className="size-4" />
          {eyebrow}
        </p>
        <h2 className="team-display text-4xl leading-none md:text-6xl">
          {title}
        </h2>
      </div>
      <p className="max-w-3xl self-end text-base leading-7 text-muted-foreground md:text-lg">
        {body}
      </p>
    </div>
  )
}

function SoftwareSection({ systems }: { systems: SoftwareSystem[] }) {
  const defaultSystem = systems[0]?.name

  return (
    <section id="software" className="section-shell border-t border-border">
      <SectionIntro
        eyebrow="Software"
        title="Software"
        body="Autonomous paths, vision, turret targeting, and rotor timing for moving shots."
        icon={Zap}
      />
      <Tabs defaultValue={defaultSystem} className="software-tabs">
        <TabsList className="software-tab-list">
          {systems.map((system) => (
            <TabsTrigger
              key={system.name}
              value={system.name}
              className="software-tab-trigger"
            >
              {system.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {systems.map((system) => {
          const Icon = softwareIcons[system.icon]
          const visual = softwareVisuals[system.name] ?? softwareVisuals.Architecture

          return (
            <TabsContent key={system.name} value={system.name}>
              <article className="software-panel">
                <div className="software-visual">
                  <img
                    src={assetPath(visual.image)}
                    alt={`${system.name} software reference`}
                  />
                  <p>{visual.caption}</p>
                </div>
                <div className="software-copy">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center border border-foreground/20">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase text-muted-foreground">
                        Scoring control layer
                      </p>
                      <h3 className="mt-1 text-3xl font-black">{system.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">
                    {system.description}
                  </p>
                  <ul className="mt-5 grid gap-3">
                    {system.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <span className="mt-2 h-px w-6 shrink-0 bg-[var(--team-accent)]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="software-code">
                    <p>Control sketch</p>
                    <pre><code>{visual.snippet}</code></pre>
                  </div>
                </div>
              </article>
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}

function ManufacturingSection() {
  return (
    <section id="manufacturing" className="section-shell manufacturing-section border-t border-border">
      <SectionIntro
        eyebrow="Manufacturing"
        title="Manufacturing"
        body="Materials, processes, and shop notes from the final robot."
        icon={Factory}
      />

      <div className="manufacturing-tool-strip">
        {manufacturingTools.map((tool) => (
          <span key={tool}>
            <Wrench className="size-3.5" />
            {tool}
          </span>
        ))}
      </div>

      <div className="manufacturing-grid">
        {manufacturingCapabilities.map((capability) => (
          <article key={capability.material} className="manufacturing-card">
            <div className="manufacturing-card-header">
              <p>{capability.tool}</p>
              <h3>{capability.material}</h3>
              <span>{capability.source}</span>
            </div>
            <ul>
              {capability.notes.map((note) => (
                <li key={note}>
                  <AnnotatedText text={note} />
                </li>
              ))}
            </ul>
            <div className="manufacturing-picture-slot">
              <Camera className="size-4" />
              <span>{capability.imageRequest}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="feeds-speeds-panel">
        <div>
          <p className="text-xs font-black uppercase text-muted-foreground">
            Feeds and speeds notebook
          </p>
          <h3 className="mt-2 text-2xl font-black">Cutting data placeholders</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This area is reserved for the actual cutter, chipload, feed, speed,
            depth of cut, hold-down, and cleanup notes for SRPP, polycarbonate,
            and 6061 aluminum.
          </p>
        </div>
        <div className="feeds-speeds-grid">
          {["SRPP", "Polycarbonate", "6061 aluminum"].map((material) => (
            <div key={material}>
              <strong>{material}</strong>
              <span>Tool / RPM / feed / DOC / notes TBD</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SeasonSection({
  stats,
  events,
}: {
  stats: BinderContent["seasonStats"]
  events: SeasonEvent[]
}) {
  const summaryStats = [
    ...stats.filter((stat) => stat.label !== "Win Percentage"),
    { label: "Win Percentage", value: "64.1%" },
  ]
  const epaStats = seasonPerformanceStats.slice(0, 4)

  return (
    <section
      id="season-results"
      className="season-section section-shell border-t border-border"
    >
      <SectionIntro
        eyebrow="2026 Season Performance"
        title="Season"
        body="EPA, rankings, event outcomes, and the robot's competitive arc."
        icon={Gauge}
      />

      <div className="season-performance-hero">
        <div>
          <p className="text-xs font-black uppercase text-muted-foreground">
            Statbotics competitive snapshot
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-2">
            <span className="team-display text-7xl leading-none md:text-8xl">
              #34
            </span>
            <div className="pb-2">
              <p className="text-xl font-black">world EPA rank</p>
              <p className="text-sm text-muted-foreground">
                235.8 EPA | 41-23-0 record | 3,724-team field
              </p>
            </div>
          </div>
        </div>
        <a
          href="https://www.statbotics.io/team/5000"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-foreground/20 bg-transparent"
          )}
        >
          <ArrowUpRight className="size-3.5" />
          Source data
        </a>
      </div>

      <Tabs defaultValue="overview" className="season-tabs">
        <TabsList className="season-tab-list">
          <TabsTrigger value="overview" className="season-tab-trigger">
            Overview
          </TabsTrigger>
          <TabsTrigger value="epa" className="season-tab-trigger">
            EPA profile
          </TabsTrigger>
          <TabsTrigger value="events" className="season-tab-trigger">
            Event timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="season-tab-panel">
          <div className="season-recap-grid">
            {seasonRecapStats.map((stat, index) => (
              <article
                key={stat.label}
                className="season-recap-card"
                data-accent={accentCycle[index % accentCycle.length]}
              >
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
                <span>{stat.body}</span>
              </article>
            ))}
          </div>
          <div className="season-dashboard-grid">
            <div className="season-stat-grid">
              {epaStats.map((stat) => (
                <div
                  key={stat.label}
                  className="season-stat-card"
                  data-accent={stat.accent}
                >
                  <p className="text-xs uppercase text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-2xl font-black">{stat.value}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="season-rank-board">
              <p className="text-xs font-black uppercase text-muted-foreground">
                Ranking map
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Markers show rank position across each field; closer to the
                left edge means closer to #1.
              </p>
              <div className="mt-4 grid gap-3">
                {seasonRankStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="season-rank-row"
                    data-accent={stat.accent}
                  >
                    <div>
                      <p>{stat.label}</p>
                      <strong>#{stat.rank}</strong>
                    </div>
                    <div className="season-rank-meter">
                      <span
                        style={{
                          left: `${Math.max(
                            0.6,
                            Math.min(99.4, (stat.rank / stat.total) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <small>
                      top {getTopPercent(stat.rank, stat.total)} of{" "}
                      {stat.total.toLocaleString()} teams
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="season-summary-grid mt-5">
            {summaryStats.map((stat, index) => (
              <div
                key={stat.label}
                className="season-summary-card"
                data-accent={accentCycle[index % accentCycle.length]}
              >
                <p className="text-xs uppercase text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-3 text-xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="epa" className="season-tab-panel">
          <div className="grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
            <div className="season-panel">
              <p className="text-xs font-black uppercase text-muted-foreground">
                EPA scoring profile
              </p>
              <div className="mt-5 grid gap-4">
                {seasonPhaseBreakdown.map((phase) => (
                  <div
                    key={phase.label}
                    className="season-phase-row"
                    data-accent={phase.accent}
                  >
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold">{phase.label}</span>
                      <span className="font-black">{phase.value}</span>
                    </div>
                    <div className="season-bar mt-2">
                      <span style={{ width: phase.share }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="season-panel">
              <p className="text-xs font-black uppercase text-muted-foreground">
                EPA trajectory
              </p>
              <div className="mt-4 grid gap-3">
                {seasonTrajectory.map((point) => (
                  <div key={point.label} className="season-trajectory-row">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        {point.label}
                      </p>
                      <p className="text-2xl font-black">{point.value}</p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {point.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="season-tab-panel">
          <div className="grid gap-5">
            {events.map((event, index) => (
              <SeasonEventCard
                key={`${event.week}-${event.event}`}
                event={event}
                accent={accentCycle[index % accentCycle.length]}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function SeasonEventCard({
  event,
  accent,
}: {
  event: SeasonEvent
  accent: (typeof accentCycle)[number]
}) {
  return (
    <article
      className="season-event-card grid gap-4 border border-border p-4 md:grid-cols-[0.28fr_0.72fr] md:p-6"
      data-accent={accent}
    >
      <div className="border-b border-border pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
        <p className="text-xs uppercase text-muted-foreground">{event.week}</p>
        <h3 className="mt-3 text-2xl font-black">{event.event}</h3>
        <div className="mt-8 flex items-end gap-3">
          <span className="text-6xl font-black leading-none">
            {event.rank}
          </span>
          <span className="pb-2 text-sm text-muted-foreground">rank</span>
        </div>
        <div className="mt-4 h-1 w-full bg-muted">
          <span
            className="block h-full bg-foreground"
            style={{ width: `${Math.max(16, 100 - Number(event.rank) * 6)}%` }}
          />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="grid gap-3 text-sm">
          <InfoRow label="Record" value={event.record} />
          <InfoRow label="Role" value={event.role} />
          <InfoRow label="Partner" value={event.partner} />
          <div>
            <p className="text-xs uppercase text-muted-foreground">Awards</p>
            {event.awards.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {event.awards.map((award) => (
                  <span
                    key={award}
                    className="border border-foreground/20 px-2.5 py-1 text-xs font-semibold"
                  >
                    {award}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-muted-foreground">None recorded</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Engineering notes
          </p>
          <ul className="mt-3 grid gap-3">
            {event.notes.map((note) => (
              <li key={note} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <span className="mt-2 h-px w-5 shrink-0 bg-[var(--team-accent)]" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function OpenAllianceSection({
  resources,
}: {
  resources: ResourceLink[]
}) {
  const [fieldNotesOpen, setFieldNotesOpen] = useState(false)

  return (
    <section id="open-alliance" className="section-shell border-t border-border">
      <SectionIntro
        eyebrow="Open Alliance"
        title="Open Alliance"
        body="Build thread, CAD, code, and public references."
        icon={GitPullRequest}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <a
            key={resource.href}
            href={resource.href}
            target="_blank"
            rel="noreferrer"
            className="resource-card group border border-border p-5 transition-colors hover:border-foreground/30 hover:bg-foreground/5"
            data-accent={
              resource.kind === "CAD"
                ? "blue"
                : resource.kind === "Code" || resource.kind === "Robot code"
                  ? "green"
                  : resource.kind === "Open Alliance"
                    ? "orange"
                    : "red"
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  {resource.kind}
                </p>
                <h3 className="mt-2 text-xl font-black">{resource.label}</h3>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {resource.description}
            </p>
          </a>
        ))}
      </div>
      <div className="field-notes-entry">
        <div>
          <p className="text-xs font-black uppercase text-muted-foreground">
            Shop notebook
          </p>
          <h3 className="mt-2 text-2xl font-black">Logan's field notes</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Four years of hard-earned fabrication, wiring, reliability, and
            competition lessons tucked behind the public resource links.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="field-notes-button"
          onClick={() => setFieldNotesOpen(true)}
        >
          <ArrowUpRight className="size-3.5" />
          Open notes
        </Button>
      </div>
      <LoganFieldNotesDialog
        onOpenChange={setFieldNotesOpen}
        open={fieldNotesOpen}
      />
    </section>
  )
}

function LoganFieldNotesDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="deep-dive-dialog field-notes-dialog" showCloseButton>
        <DialogHeader className="deep-dive-header">
          <p className="text-xs font-black uppercase text-muted-foreground">
            Private-but-useful shop wisdom
          </p>
          <DialogTitle className="team-display deep-dive-title">
            Logan's field notes
          </DialogTitle>
          <DialogDescription className="max-w-3xl text-base leading-7">
            A condensed notebook of design rules, manufacturing preferences,
            electrical practices, and competition habits from the last four
            seasons.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="deep-dive-scroll">
          <div className="field-notes-grid">
            {loganFieldNotes.map((section) => (
              <section key={section.title} className="deep-dive-section">
                <h3>{section.title}</h3>
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>
                      <AnnotatedText text={bullet} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function ThanksSection() {
  return (
    <section id="thanks" className="section-shell thanks-section border-t border-border">
      <SectionIntro
        eyebrow="Thank you"
        title="Thanks"
        body="Mentors, teams, sponsors, and public resources behind the project."
        icon={HeartHandshake}
      />

      <div className="thanks-grid">
        {thanksGroups.map((group) => (
          <article key={group.title} className="thanks-card">
            <div className="flex items-start gap-3">
              <span className="thanks-icon">
                <BadgeCheck className="size-4" />
              </span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.body}</p>
              </div>
            </div>
            <div className="thanks-slot-grid">
              {group.slots.map((slot, index) => (
                <span key={`${group.title}-${slot}-${index}`}>{slot}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function LoadingShell() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="w-full max-w-xl border border-border p-8">
        <p className="text-xs uppercase text-muted-foreground">
          Team 5000 Tech Binder
        </p>
        <h1 className="mt-3 text-4xl font-black">Loading Convex content</h1>
        <div className="mt-8 grid gap-3">
          <div className="h-3 animate-pulse bg-muted" />
          <div className="h-3 w-4/5 animate-pulse bg-muted" />
          <div className="h-3 w-2/3 animate-pulse bg-muted" />
        </div>
      </div>
    </div>
  )
}
