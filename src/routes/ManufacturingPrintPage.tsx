import { Link } from "react-router"
import { ArrowLeft, Printer } from "lucide-react"
import { useMemo, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  cncGeneralNotes,
  cncOperations,
  manufacturingCapabilities,
} from "@/lib/binder-content"
import { cn } from "@/lib/utils"

export function ManufacturingPrintPage() {
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
          <h1>Manufacturing Archive</h1>
          <h2>Fusion 360 CNC settings, feeds, speeds, tools, and setup notes.</h2>
        </header>

        <PrintManufacturingSection />
      </article>
    </main>
  )
}

function PrintManufacturingSection() {
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
      <section className="print-section">
        <h2>Manufacturing Capabilities</h2>
        <div className="print-capability-grid">
          {manufacturingCapabilities.map((capability) => (
            <article key={capability.title} className="print-capability-card">
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="print-section">
        <h2>CNC Settings Archive</h2>

        <div className="print-general-notes">
          {cncGeneralNotes.map((note) => (
            <article key={note.label} className="print-note-chip">
              <span>{note.label}</span>
              <strong>{note.value}</strong>
            </article>
          ))}
        </div>

        <div className="print-cnc-operations">
          {visibleOperations.map((operation) => (
            <article key={operation.id} className="print-cnc-card">
              <h3>{operation.name}</h3>
              <div className="print-cnc-details">
                <span><strong>Material:</strong> {operation.material}</span>
                <span><strong>Tool:</strong> {operation.tool}</span>
                <span><strong>Speed:</strong> {operation.speed}</span>
                <span><strong>Feed:</strong> {operation.feed}</span>
              </div>
              {operation.notes && <p>{operation.notes}</p>}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
