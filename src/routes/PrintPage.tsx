import { Link } from "react-router"
import { ArrowLeft, Printer } from "lucide-react"
import type { ReactNode } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { assetPath } from "@/lib/assets"
import {
  cncGeneralNotes,
  cncOperations,
  manufacturingCapabilities,
  mechanicalSystems,
  robotSpecs,
  seasonEvents,
  seasonStats,
  softwareTabs,
} from "@/lib/binder-content"
import { cn } from "@/lib/utils"

export function PrintPage() {
  return (
    <main className="print-page">
      <div className="print-toolbar">
        <Link
          to="/"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <ArrowLeft className="size-4" />
          Binder
        </Link>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          Print
        </Button>
      </div>

      <article className="print-document">
        <header className="print-hero">
          <p>Team 5000 Technical Binder</p>
          <h1>Icarus 2.0</h1>
          <h2>Mechanical systems, code architecture, manufacturing notes, and season results.</h2>
        </header>

        <PrintSection title="Robot Specs">
          <PrintMetricGrid metrics={robotSpecs} />
        </PrintSection>

        <PrintSection title="Mechanical">
          {mechanicalSystems.map((system) => (
            <section key={system.id} className="print-system">
              <figure>
                <img src={assetPath(system.image)} alt={system.imageAlt} />
                <figcaption>{system.label}</figcaption>
              </figure>
              <div>
                <h3>{system.title}</h3>
                <p>{system.summary}</p>
                <PrintMetricGrid metrics={system.metrics} />
                {system.tabs.map((tab) => (
                  <div key={tab.id} className="print-tab">
                    <h4>{tab.label}</h4>
                    {tab.body && <p>{tab.body}</p>}
                    {tab.bullets && (
                      <ul>
                        {tab.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </PrintSection>

        <PrintSection title="Software">
          {softwareTabs.map((tab) => (
            <article key={tab.id} className={tab.id === "cameras" ? "print-software-cameras" : "print-software-text"}>
              {tab.id === "cameras" && tab.media && (
                <figure>
                  <img src={assetPath(tab.media.src)} alt={tab.media.alt} />
                  {tab.media.caption && <figcaption>{tab.media.caption}</figcaption>}
                </figure>
              )}
              <div>
                <h3>{tab.title}</h3>
                {tab.body && <p>{tab.body}</p>}
                {tab.bullets && (
                  <ul>
                    {tab.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </PrintSection>

        <PrintSection title="Manufacturing">
          <div className="print-card-grid">
            {manufacturingCapabilities.map((capability) => (
              <article key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
          <h3>Fusion 360 CNC Settings Archive</h3>
          <PrintMetricGrid metrics={cncGeneralNotes} />
          {cncOperations.map((operation) => (
            <article key={operation.id} className="print-cnc-operation">
              <h4>
                {operation.material} | {operation.title}
              </h4>
              <p>{operation.tool.join(", ")}</p>
              {operation.groups.map((group) => (
                <div key={group.title}>
                  <h5>{group.title}</h5>
                  <PrintMetricGrid metrics={group.rows} />
                </div>
              ))}
            </article>
          ))}
        </PrintSection>

        <PrintSection title="Season Recap">
          <PrintMetricGrid metrics={seasonStats} />
          {seasonEvents.map((event) => (
            <article key={`${event.week}-${event.event}`} className="print-event">
              <h3>
                {event.week} | {event.event}
              </h3>
              <p>
                Rank {event.rank}. Record {event.record}. {event.role} with{" "}
                {event.partner}.
              </p>
              {event.awards.length > 0 && <p>Awards: {event.awards.join(", ")}</p>}
            </article>
          ))}
        </PrintSection>
      </article>
    </main>
  )
}

function PrintMetricGrid({ metrics }: { metrics: Array<{ label: string; value: string; detail?: string }> }) {
  return (
    <dl className="print-metric-grid">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
          {metric.detail && <small>{metric.detail}</small>}
        </div>
      ))}
    </dl>
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
    <section className="print-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
