export const SITE_KEY = "team5000-2026-tech-binder"

export const binderContent = {
  generatedAt: "2026-05-12",
  navItems: [
    { label: "Mechanical", href: "#hero" },
    { label: "Software", href: "#software" },
    { label: "Manufacturing", href: "#manufacturing" },
    { label: "Season Results", href: "#season-results" },
    { label: "Open Alliance", href: "#open-alliance" },
    { label: "Thanks", href: "#thanks" },
  ],
  hero: {
    robotName: "Icarus 2.0",
    team: "Team 5000 | HAMMERHEADS",
    headline: "Continuous fuel flow. Compact turret. Championship-speed cycles.",
    deck:
      "A precision engineering binder for the Hammerheads' 2026 robot, built around dual intake coverage, expandable hopper volume, a compact dye rotor indexer, an inverted pancake turret, and aggressive shoot-on-the-move scoring.",
    image: "/media/final-icarus-starting-config.png",
    imageAlt: "Team 5000 Icarus 2.0 Championship CAD render in starting configuration",
    callouts: [
      {
        label: "Dual intake system",
        detail:
          "Two wide acquisition paths let the robot collect fuel from either side and keep cycling through traffic.",
        x: "12%",
        y: "23%",
      },
      {
        label: "Expandable hopper",
        detail:
          "Deploying side structures increase usable fuel volume while keeping the robot compact in starting configuration.",
        x: "36%",
        y: "28%",
      },
      {
        label: "Dye rotor",
        detail:
          "Compact coaxial indexer moves fuel from the hopper into controlled shooter entry.",
        x: "58%",
        y: "19%",
      },
      {
        label: "Inverted pancake turret",
        detail:
          "Low-profile turret package keeps aim independent from chassis heading while preserving hopper space.",
        x: "70%",
        y: "54%",
      },
      {
        label: "No-climb architecture",
        detail:
          "Weight and packaging were focused on scoring volume instead of an endgame climb mechanism.",
        x: "21%",
        y: "72%",
      },
    ],
    metrics: [
      { label: "Design Mode", value: "Throughput-first" },
      { label: "Architecture", value: "Dual intake + turret" },
      { label: "Indexing", value: "Dye rotor indexer" },
      { label: "Final Reference", value: "Championship CAD" },
    ],
  },
  mechanicalSystems: [
    {
      id: "super-structure",
      name: "Super Structure",
      kicker:
        "4 SDS MK5N modules packaged around a compact open-center frame, expandable hopper volume, and low turret mass.",
      image: "/media/final-icarus-starting-config.png",
      metrics: [
        { label: "Frame Dimension", value: "26 x 28.75" },
        { label: "Drive", value: "4x SDS MK5N" },
        { label: "Final CAD", value: "Championship release" },
      ],
      details: [
        "The final Icarus 2.0 structure was built around maximizing internal fuel volume while still keeping the drivetrain, turret, and electrical systems serviceable.",
        "The robot uses a compact open-center swerve layout to protect the hopper path and leave space for the dye rotor and turret feed.",
        "Weight was managed aggressively through plate pocketing, compact subsystem packaging, and removing unnecessary structure.",
        "The final design does not include a climb mechanism, keeping weight, space, and complexity focused on fuel acquisition, indexing, and scoring.",
      ],
    },
    {
      id: "dual-intake",
      name: "Dual Intake System",
      kicker:
        "Two side acquisition paths built to make fuel collection faster, easier, and harder to defend.",
      image: "/media/final-icarus-viewer-layout.png",
      metrics: [
        { label: "Coverage", value: "Both sides" },
        { label: "Mode", value: "Max expansion" },
        { label: "Purpose", value: "Fuel volume" },
      ],
      details: [
        "The dual intake system gives the driver two collection directions, reducing the need to perfectly line up every pickup.",
        "The side structures deploy outward to increase the robot's collection envelope and usable hopper volume.",
        "The intake architecture supports rapid direction changes, helping the robot keep collecting while escaping defense or traffic.",
        "The system is designed around continuous fuel flow, feeding the hopper and dye rotor without forcing the driver to pause the cycle.",
      ],
    },
    {
      id: "dye-rotor",
      name: "Dye Rotor Indexer",
      kicker:
        "Compact coaxial indexer between the expandable hopper and turret shooter.",
      image: "/media/final-icarus-starting-config.png",
      metrics: [
        { label: "Role", value: "Indexer" },
        { label: "Flow", value: "Controlled feed" },
        { label: "Goal", value: "Stable shooter timing" },
      ],
      details: [
        "The dye rotor turns loose hopper fuel into a more controlled stream for the turret shooter.",
        "The rotor decouples intake chaos from shooter timing, helping the robot keep scoring even when fuel enters the hopper unevenly.",
        "Feed behavior, rotor speed, and shooter timing are treated as one continuous scoring pipeline.",
        "The system supports shoot-on-the-move by keeping fuel staged predictably before release.",
      ],
    },
    {
      id: "turret",
      name: "Inverted Pancake Turret",
      kicker:
        "Low-profile active turret architecture for compact packaging and moving shots.",
      image: "/media/final-icarus-starting-config.png",
      metrics: [
        { label: "Type", value: "Inverted pancake" },
        { label: "Aiming", value: "Active turret" },
        { label: "Purpose", value: "Shoot on the move" },
      ],
      details: [
        "The final robot uses an inverted pancake turret rather than the earlier coaxial turret concept.",
        "The low-profile turret package preserves hopper volume while letting the robot aim independently of chassis heading.",
        "The turret is the main enabler for shoot-on-the-move scoring, allowing the drivetrain to continue moving while the shooter tracks the target.",
        "Turret packaging, shooter feed, and rotor timing are designed together so the robot can maintain high scoring pressure without stop-and-settle cycles.",
      ],
    },
    {
      id: "expansion",
      name: "Max Expansion / Hopper Volume",
      kicker:
        "Deploying side structures maximize fuel capacity and intake reach without adding a climb system.",
      image: "/media/final-icarus-viewer-layout.png",
      metrics: [
        { label: "Mode", value: "Max expansion" },
        { label: "Purpose", value: "Fuel volume" },
        { label: "Endgame", value: "No climb" },
      ],
      details: [
        "Icarus 2.0 does not include a climb mechanism, so late-match value comes from continued scoring pressure rather than an endgame climb.",
        "The side structures deploy outward to create a larger collection and storage envelope for fuel.",
        "The robot architecture prioritizes intake reach, hopper volume, and continuous shooting over climbing hardware.",
        "Removing a climber keeps weight and packaging available for the dual intakes, dye rotor, turret, and expanded hopper structure.",
      ],
    },
  ],
  electrical: {
    image: "/media/final-icarus-starting-config.png",
    callouts: [
      {
        label: "Subsystem routing",
        body:
          "Electrical layout supports the turret, dye rotor, dual intakes, and drivetrain while preserving service access.",
      },
      {
        label: "Turret wiring",
        body:
          "Turret wiring is packaged to support continuous rotation management, aiming reliability, and quick inspection.",
      },
      {
        label: "Sensor systems",
        body:
          "Turret, rotor, drivetrain, and vision sensors are treated as part of one synchronized scoring pipeline.",
      },
      {
        label: "Service access",
        body:
          "Power and signal routing are kept inspectable for faster pit diagnosis and match-turnaround repair.",
      },
    ],
    principles: [
      "Serviceability",
      "Reliability",
      "Visible routing",
      "Match repair speed",
    ],
  },
  softwareSystems: [
    {
      name: "Autonomous",
      icon: "route",
      description:
        "Path planning, turret alignment, dye rotor synchronization, and moving-shot routines are treated as one scoring pipeline.",
      bullets: [
        "Dynamic aiming during path execution",
        "Real-time turret alignment before and during release",
        "Continuous shooting routines instead of stop-and-settle cycles",
      ],
    },
    {
      name: "Vision",
      icon: "scan",
      description:
        "AprilTag localization and target tracking feed the turret model so the robot can score while the drivetrain keeps pressure.",
      bullets: [
        "Motion compensation for chassis velocity",
        "Driver assistance overlays for shot confidence",
        "Vision health checks exposed through telemetry",
      ],
    },
    {
      name: "Architecture",
      icon: "network",
      description:
        "Command-based structure, logging, simulation, and replay tooling keep iteration fast and problems inspectable.",
      bullets: [
        "AdvantageKit-style telemetry and match replay thinking",
        "Subsystem boundaries tuned for testability",
        "Runtime tuning hooks for controls and feed synchronization",
      ],
    },
  ],
  strategy: {
    thesis:
      "Icarus 2.0 was built around uninterrupted fuel flow. Dual intakes make acquisition easier from either side, the expandable hopper and dye rotor keep fuel staged, and the inverted pancake turret lets the drivetrain keep moving while the robot maintains scoring pressure.",
    cards: [
      {
        title: "Throughput",
        body:
          "Dual intakes and a large expandable hopper reduce the time spent chasing clean pickup angles.",
      },
      {
        title: "Shoot-on-the-move",
        body:
          "The turret allows the drivetrain to keep moving while software controls final aim and release timing.",
      },
      {
        title: "Defense escape",
        body:
          "Two intake directions let the driver change collection paths instead of being locked into one approach lane.",
      },
      {
        title: "No-climb tradeoff",
        body:
          "The robot gives up climb hardware to keep weight, space, and complexity focused on high-volume fuel scoring.",
      },
    ],
    cycle: ["Acquire", "Expand", "Index", "Track", "Shoot", "Recover"],
  },
  manufacturingSteps: [
    {
      title: "V2 rebuild CAD",
      body:
        "The final robot architecture converted lessons from earlier iterations into a tighter package focused on intake reach, hopper volume, turret packaging, and weight control.",
    },
    {
      title: "CNC plate workflow",
      body:
        "Large structural plates and subsystem plates were designed for repeatable machining, fast assembly, and clean service access.",
    },
    {
      title: "SRPP and polycarbonate parts",
      body:
        "Low-friction plastics and thin polycarbonate parts support the hopper, guards, covers, guides, and lightweight packaging details.",
    },
    {
      title: "Additive parts",
      body:
        "3D printed pieces handle centering, spacers, covers, prototypes, and low-load packaging details where iteration speed matters.",
    },
    {
      title: "Tolerance philosophy",
      body:
        "Critical interfaces get controlled datums, while non-critical covers, guides, and shields get room for fast assembly and maintenance.",
    },
  ],
  prototypeTimeline: [
    {
      date: "Preseason",
      title: "Parametric frame and bumper planning",
      body:
        "The thread began with parametric CAD work for the frame and bumper system, but later robot details evolved significantly from those early concepts.",
      image: "/media/frame-cad.png",
    },
    {
      date: "Post Week Zero",
      title: "Icarus V2 rebuild",
      body:
        "After early testing, the robot evolved toward dual intakes, larger expandable hopper volume, an inverted pancake turret, and aggressive weight control.",
      image: "/media/final-icarus-starting-config.png",
    },
    {
      date: "Refinement",
      title: "Continuous-flow scoring package",
      body:
        "The intake, hopper, dye rotor, and turret were refined as one scoring pipeline instead of isolated mechanisms.",
      image: "/media/final-icarus-starting-config.png",
    },
    {
      date: "Max expansion",
      title: "Expandable hopper architecture",
      body:
        "The max expansion configuration shows the robot's priority clearly: increase fuel storage and acquisition reach while staying focused on scoring.",
      image: "/media/final-icarus-viewer-layout.png",
    },
    {
      date: "Championship",
      title: "Final Championship CAD release",
      body:
        "The final public CAD was released with starting configuration, max expansion, and scoring position renders, showing the completed no-climb continuous-scoring architecture.",
      image: "/media/final-icarus-viewer-layout.png",
    },
  ],
  seasonStats: [
    { label: "Events Attended", value: "5" },
    { label: "Awards Won", value: "5" },
    { label: "Playoff Appearances", value: "5" },
    { label: "Alliance Selections", value: "5" },
    { label: "Highest Rank", value: "3" },
    { label: "Win Percentage", value: "64.1%" },
    { label: "Worlds", value: "Division Captain" },
  ],
  seasonEvents: [
    {
      week: "Week Zero",
      event: "Practice Event",
      rank: "13",
      record: "2-3-0",
      role: "First Pick of Alliance 4",
      partner: "Team 2079 Alarm",
      awards: [],
      notes: [
        "Began major robot rebuild immediately after elimination.",
        "Used early matches to identify drivetrain and throughput issues.",
        "Established the foundation for later redesign iterations.",
      ],
    },
    {
      week: "Week 3",
      event: "URI District Event",
      rank: "3",
      record: "11-5-0",
      role: "Captains of Alliance 2",
      partner: "Team 6324",
      awards: ["Industrial Design Award"],
      notes: [
        "Significant mechanical improvements from the Week Zero rebuild.",
        "Improved intake consistency and dye rotor reliability.",
        "Turret refinement increased scoring stability.",
      ],
    },
    {
      week: "Week 5",
      event: "WPI District Event",
      rank: "8",
      record: "12-7-0",
      role: "First Pick of Alliance 2",
      partner: "Team 190",
      awards: [
        "District Event Finalist",
        "Excellence in Engineering Award sponsored by Littelfuse",
      ],
      notes: [
        "Increased autonomous consistency.",
        "Shoot-on-the-move performance improvements.",
        "Electrical and software refinement raised scoring throughput.",
      ],
    },
    {
      week: "Week 7",
      event: "NEDCMP Burns",
      rank: "9",
      record: "10-7-0",
      role: "First Pick of Alliance 3",
      partner: "Team 133 BERT",
      awards: ["Autonomous Award sponsored by Google.org"],
      notes: [
        "Autonomous system matured into a reliable scoring tool.",
        "Turret tracking, pathing, and synchronization were refined.",
        "Cycle times improved under defensive pressure.",
      ],
    },
    {
      week: "Week 9",
      event: "World Championship Hopper Division",
      rank: "5",
      record: "8-4-0",
      role: "Captains of Alliance 4",
      partner: "Team 6328",
      awards: ["Creativity Award sponsored by Rockwell Automation"],
      notes: [
        "Peak robot performance and full high-throughput strategy realization.",
        "Stable turret operation under pressure.",
        "Continuous scoring system performed at championship pace.",
      ],
    },
  ],
  media: [
    {
      title: "Final starting configuration",
      type: "CAD render",
      src: "/media/final-icarus-starting-config.png",
      description:
        "Championship CAD render showing Icarus 2.0 in starting configuration.",
    },
    {
      title: "Final max expansion",
      type: "CAD render",
      src: "/media/final-icarus-viewer-layout.png",
      description:
        "Max expansion configuration showing the deployed intake and hopper-volume architecture.",
    },
    {
      title: "Team 5000 identity",
      type: "Brand reference",
      src: "/brand/hammerheads-background.png",
      description:
        "Hammerheads visual identity reference used for the binder's graphite, steel, and white presentation style.",
    },
    {
      title: "Championship CAD",
      type: "CAD release",
      src: "/media/bumper-cad.png",
      description:
        "Final public CAD reference for Icarus 2.0 released in the Open Alliance thread.",
    },
  ],
  resources: [
    {
      label: "Chief Delphi Build Thread",
      href: "https://www.chiefdelphi.com/t/frc-5000-hammerheads-2026-build-thread-open-alliance/507502?u=logandelaar",
      kind: "Open Alliance",
      description:
        "Primary public build thread for engineering updates, robot development, and final CAD release.",
    },
    {
      label: "Championship CAD",
      href: "https://a360.co/44b0UAF",
      kind: "CAD",
      description:
        "Final public CAD reference linked from the build thread.",
    },
    {
      label: "Team GitHub",
      href: "https://github.com/hammerheads5000",
      kind: "Code",
      description: "Robot code, tools, and public software experiments.",
    },
    {
      label: "2026 Rebuilt Repository",
      href: "https://github.com/hammerheads5000/2026Rebuilt",
      kind: "Robot code",
      description: "Team 5000's 2026 robot code repository.",
    },
    {
      label: "Team Website",
      href: "https://www.hammerheads5000.com/",
      kind: "Team",
      description: "Hammerheads program site and team identity home.",
    },
  ],
}

export const initialNotes = [
  {
    author: "Logan",
    title: "Open Alliance launch",
    tag: "Build thread",
    body:
      "Document CAD, build progress, code progress, and competition lessons throughout the season so outside feedback can shape the robot.",
    createdAt: Date.parse("2025-10-24T17:23:00-04:00"),
  },
  {
    author: "Code",
    title: "On-the-fly path generation",
    tag: "Software",
    body: "Custom PathPlanner work explores dynamic autonomous paths that can react to field state and scoring priorities.",
    createdAt: Date.parse("2025-10-28T05:32:00-04:00"),
  },
  {
    author: "Mechanical",
    title: "Icarus V2 rebuild",
    tag: "Robot architecture",
    body:
      "The robot evolved into a dual-intake, expandable-hopper, dye-rotor, inverted-pancake-turret architecture focused on continuous fuel flow.",
    createdAt: Date.parse("2026-03-02T01:26:00-05:00"),
  },
  {
    author: "Mechanical",
    title: "No-climb scoring focus",
    tag: "Design tradeoff",
    body:
      "Icarus 2.0 does not use a climb mechanism; the design keeps weight and space focused on acquisition, storage, indexing, and shooting.",
    createdAt: Date.parse("2026-05-14T15:15:00-04:00"),
  },
  {
    author: "CAD",
    title: "Championship CAD release",
    tag: "Final robot",
    body:
      "Final public CAD was released with starting configuration, max expansion, and scoring position renders.",
    createdAt: Date.parse("2026-05-14T15:15:00-04:00"),
  },
]
