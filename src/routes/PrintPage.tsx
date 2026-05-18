import { Link } from "react-router"
import { useQuery } from "convex/react"
import { ArrowLeft, Printer } from "lucide-react"
import type { ReactNode } from "react"

import { api } from "../../convex/_generated/api"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { BinderContent } from "@/lib/binder-types"
import { assetPath } from "@/lib/assets"
import {
  fullRobotDeepDive,
  loganFieldNotes,
  mechanismDeepDives,
  type MechanismDeepDive,
} from "@/lib/robot-notes"
import { cn } from "@/lib/utils"

const printImageRequests: Record<string, string[]> = {
  full: [
    "Full robot CAD render in final configuration",
    "Final pit photo with bumpers installed",
    "Annotated underside or electronics access photo",
  ],
  "super-structure": [
    "Side plate V1 vs V2 comparison",
    "Welded bumper backer and bumper pan underside",
    "LED holder and diffuser close-up",
  ],
  "dual-intake": [
    "SRPP rack lamination close-up",
    "Dead-axle roller and stub axle detail",
    "Final SRPP hopper wall and sewn hopper net",
  ],
  "dye-rotor": [
    "Top PETG-CF dye rotor print",
    "Under-rotor chain drive layout",
    "X-contact bearing stack and C-shaped feed path",
  ],
  turret: [
    "18 inch turret ring gear detail",
    "Cable sleeve path inside the turret",
    "Hood rack and shooter wheel stack",
  ],
}

const printManufacturingRows = [
  {
    material: "SRPP",
    source: "West Coast Products",
    notes: "CNC routed for racks, plates, hopper walls, hood parts, and impact-prone details.",
  },
  {
    material: "Polycarbonate",
    source: "WCP smoked sheet + McMaster tube",
    notes: "Used for tube rollers, dye rotor bowl, covers, and bumper pan details.",
  },
  {
    material: "6061 aluminum",
    source: "Metal Supermarkets",
    notes: "Default aluminum alloy for structure, pocketed plates, racks, and turret gear features.",
  },
]

export function PrintPage() {
  const content = useQuery(api.binder.get) as BinderContent | undefined

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-8">
        <p className="text-muted-foreground">Loading print version...</p>
      </main>
    )
  }

  return (
    <main className="bg-background text-foreground">
      <div className="print:hidden sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-foreground/20 bg-transparent"
            )}
          >
            <ArrowLeft className="size-4" />
            Binder
          </Link>
          <Button onClick={() => window.print()}>
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      <article className="mx-auto max-w-[1100px] px-5 py-10 print:max-w-none print:px-0">
        <header className="border-b border-border pb-8">
          <p className="text-sm uppercase text-muted-foreground">
            {content.hero.team}
          </p>
          <h1 className="mt-3 text-5xl font-black">{content.hero.robotName}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {content.hero.deck}
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 py-6 md:grid-cols-4">
          {content.hero.metrics.map((metric) => (
            <div key={metric.label} className="border border-border p-3">
              <p className="text-xs uppercase text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-2 font-black">{metric.value}</p>
            </div>
          ))}
        </section>

        <PrintSection title="Mechanical">
          <PrintDeepDive dive={fullRobotDeepDive} />
          {content.mechanicalSystems.map((system) => {
            const dive = mechanismDeepDives[system.id]
            if (!dive) return null

            return <PrintDeepDive key={system.id} dive={dive} />
          })}
        </PrintSection>

        <PrintSection title="Software">
          {content.softwareSystems.map((system) => (
            <div key={system.name} className="break-inside-avoid border-b border-border py-5">
              <h3 className="text-xl font-black">{system.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {system.description}
              </p>
            </div>
          ))}
        </PrintSection>

        <PrintSection title="Manufacturing Capabilities">
          <div className="grid gap-3 md:grid-cols-3">
            {printManufacturingRows.map((row) => (
              <div key={row.material} className="break-inside-avoid border border-border p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  {row.source}
                </p>
                <h3 className="mt-2 text-xl font-black">{row.material}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {row.notes}
                </p>
                <div className="mt-4 border border-dashed border-border p-3 text-xs text-muted-foreground">
                  Picture needed: machine setup, cut part, and installed robot reference.
                </div>
              </div>
            ))}
          </div>
        </PrintSection>

        <PrintSection title="Season Results">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {content.seasonStats.map((stat) => (
              <div key={stat.label} className="border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-black">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4">
            {content.seasonEvents.map((event) => (
              <div key={`${event.week}-${event.event}`} className="break-inside-avoid border border-border p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  {event.week}
                </p>
                <h3 className="mt-2 text-xl font-black">{event.event}</h3>
                <p className="mt-2 text-sm">
                  Rank {event.rank} | {event.record} | {event.role}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Partner: {event.partner}
                </p>
                {event.awards.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Awards: {event.awards.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PrintSection>

        <PrintSection title="Logan's Field Notes">
          <div className="grid gap-4 md:grid-cols-2">
            {loganFieldNotes.map((section) => (
              <div key={section.title} className="break-inside-avoid border border-border p-4">
                <h3 className="text-xl font-black">{section.title}</h3>
                <ul className="mt-3 grid gap-1 text-sm text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PrintSection>

        <PrintSection title="Thank You">
          <div className="grid gap-3 md:grid-cols-3">
            {["Teams and Open Alliance", "Mentors and students", "Sponsors"].map((group) => (
              <div key={group} className="break-inside-avoid border border-border p-4">
                <h3 className="text-xl font-black">{group}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reserved for names, logos, and short thank-you notes.
                </p>
              </div>
            ))}
          </div>
        </PrintSection>
      </article>
    </main>
  )
}

function PrintDeepDive({ dive }: { dive: MechanismDeepDive }) {
  const sections = [
    ...dive.tabs.overview,
    ...dive.tabs.materials,
    ...dive.tabs.build,
    ...(dive.tabs.development ?? []),
  ]
  const imageRequests = printImageRequests[dive.id] ?? printImageRequests.full

  return (
    <div className="grid break-inside-avoid gap-4 border-b border-border py-5 md:grid-cols-[0.34fr_0.66fr]">
      <figure className="overflow-hidden border border-border bg-muted/30">
        <img
          src={assetPath(dive.image)}
          alt={dive.imageAlt}
          className="aspect-[4/3] w-full object-cover"
        />
        <figcaption className="border-t border-border px-3 py-2 text-xs uppercase text-muted-foreground">
          CAD still | {dive.title}
        </figcaption>
      </figure>
      <div>
        <h3 className="text-2xl font-black">{dive.title}</h3>
        <p className="mt-2 font-semibold">{dive.kicker}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {dive.stats.map((metric) => (
            <div key={metric.label} className="border border-border p-2">
              <p className="text-[0.65rem] uppercase text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-1 text-sm font-black">{metric.value}</p>
            </div>
          ))}
        </div>
        <ul className="mt-3 grid gap-1 text-sm text-muted-foreground">
          {dive.panelBullets.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
        <div className="mt-3 grid gap-2 border border-dashed border-border p-3 text-xs text-muted-foreground md:grid-cols-2">
          {imageRequests.map((request) => (
            <span key={request}>Picture needed: {request}</span>
          ))}
        </div>
        <div className="mt-4 grid gap-3">
          {sections.map((section) => (
            <section key={`${dive.id}-${section.title}`} className="break-inside-avoid border border-border p-3">
              <h4 className="font-black">{section.title}</h4>
              <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function PrintSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="py-8">
      <Separator className="mb-6" />
      <h2 className="text-3xl font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
