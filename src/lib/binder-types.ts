export type Metric = {
  label: string
  value: string
}

export type HeroCallout = {
  label: string
  detail: string
  x: string
  y: string
}

export type MechanicalSystem = {
  id: string
  name: string
  kicker: string
  image: string
  metrics: Metric[]
  details: string[]
}

export type ElectricalCallout = {
  label: string
  body: string
}

export type SoftwareSystem = {
  name: string
  icon: "route" | "scan" | "network"
  description: string
  bullets: string[]
}

export type StrategyCard = {
  title: string
  body: string
}

export type ManufacturingStep = {
  title: string
  body: string
}

export type PrototypeEntry = {
  date: string
  title: string
  body: string
  image: string
}

export type SeasonEvent = {
  week: string
  event: string
  rank: string
  record: string
  role: string
  partner: string
  awards: string[]
  notes: string[]
}

export type MediaItem = {
  title: string
  type: string
  src: string
  description: string
}

export type ResourceLink = {
  label: string
  href: string
  kind: string
  description: string
}

export type EngineeringNote = {
  _id?: string
  author: string
  title: string
  tag: string
  body: string
  createdAt: number
}

export type BinderContent = {
  generatedAt: string
  navItems: Array<{ label: string; href: string }>
  hero: {
    robotName: string
    team: string
    headline: string
    deck: string
    image: string
    imageAlt: string
    callouts: HeroCallout[]
    metrics: Metric[]
  }
  mechanicalSystems: MechanicalSystem[]
  electrical: {
    image: string
    callouts: ElectricalCallout[]
    principles: string[]
  }
  softwareSystems: SoftwareSystem[]
  strategy: {
    thesis: string
    cards: StrategyCard[]
    cycle: string[]
  }
  manufacturingSteps: ManufacturingStep[]
  prototypeTimeline: PrototypeEntry[]
  seasonStats: Metric[]
  seasonEvents: SeasonEvent[]
  media: MediaItem[]
  resources: ResourceLink[]
  liveNotes: EngineeringNote[]
}
