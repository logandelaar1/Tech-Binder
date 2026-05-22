export type Metric = {
  label: string
  value: string
  detail?: string
}

export type MediaBlock = {
  src: string
  alt: string
  caption?: string
}

export type CopyBlock = {
  title: string
  body?: string
  bullets?: string[]
  media?: MediaBlock
  metrics?: Metric[]
}

export type BinderTab = {
  id: string
  label: string
  title: string
  eyebrow?: string
  body?: string
  bullets?: string[]
  media?: MediaBlock
  metrics?: Metric[]
  blocks?: CopyBlock[]
  iterations?: Iteration[]
}

export type Iteration = {
  label: string
  title: string
  body: string
  image: string
  alt: string
  bullets?: string[]
}

export type MechanicalSystem = {
  id: string
  label: string
  title: string
  summary: string
  image: string
  imageAlt: string
  metrics: Metric[]
  tabs: BinderTab[]
}

export type CncOperation = {
  id: string
  material: string
  title: string
  tool: string[]
  groups: Array<{
    title: string
    rows: Metric[]
  }>
  notes?: string[]
}

export const navItems = [
  { label: "Mechanical", href: "#mechanical" },
  { label: "Software", href: "#software" },
  { label: "Season", href: "#season" },
  { label: "Open Alliance", href: "#open-alliance" },
  { label: "Thanks", href: "#thanks" },
]

export const robotSpecs: Metric[] = [
  { label: "Robot", value: "Icarus" },
  { label: "Weight", value: "114.9 lb" },
  { label: "Height", value: "21.75 in" },
  { label: "Frame length", value: "26 in" },
  { label: "Frame width", value: "28.75 in" },
  { label: "Bumper weight", value: "17.9 lb" },
  { label: "Bumper dimensions", value: "35.125 in x 32.625 in" },
]

export const fullAssemblyTabs: BinderTab[] = [
  {
    id: "cad",
    label: "CAD Overview",
    title: "Full assembly CAD",
    eyebrow: "Full Assembly",
    body:
      "Use the live Fusion-derived assembly to orbit the full robot, isolate subsystems, ghost surrounding structure, and inspect the packaging that ties the scoring system together.",
    bullets: [
      "The full assembly view is the main mechanical reference for Icarus 2.0.",
      "Subsystem tabs focus the model on the superstructure, intakes, dye rotor, or turret.",
      "Ghost mode keeps surrounding context visible when isolation hides too much of the robot.",
    ],
    metrics: [
      { label: "Robot", value: "Icarus" },
      { label: "Weight", value: "114.9 lb" },
      { label: "Height", value: "21.75 in" },
      { label: "Frame", value: "26 x 28.75 in" },
    ],
  },
  {
    id: "version",
    label: "Version Comparison",
    title: "Icarus 2.0 Architecture",
    eyebrow: "Full Assembly",
    body:
      "Icarus evolved into a scoring-first package built from CNC SRPP, mostly 6061 aluminum, low-backlash mechanisms, and competition-proven wiring habits.",
    media: {
      src: "/media/icarus-version-2.png",
      alt: "Icarus 2.0 final robot render",
      caption: "Final robot reference",
    },
    metrics: [
      { label: "Core materials", value: "6061 + SRPP" },
      { label: "Drivetrain", value: "4 SDS MK5n modules" },
      { label: "Architecture", value: "Dual intake + turret" },
      { label: "Indexer", value: "Coaxial dye rotor" },
    ],
    iterations: [
      {
        label: "Version 1",
        title: "Early rebuild package",
        body:
          "Version 1 kept the high-throughput goal but still carried earlier packaging decisions and unfinished refinement around the intakes, turret, and hopper volume.",
        image: "/media/icarus-version-1.png",
        alt: "Icarus version 1 CAD render",
      },
      {
        label: "Version 2",
        title: "Championship package",
        body:
          "Version 2 tightened the structure, cleaned the turret and top plate packaging, improved subsystem access, and became the final championship reference.",
        image: "/media/icarus-version-2.png",
        alt: "Icarus version 2 CAD render",
      },
    ],
  },
  {
    id: "leds",
    label: "LED System",
    title: "LEDs as robot feedback",
    eyebrow: "Feedback + Debugging",
    body:
      "LEDs were added as both a driver feedback tool and a quick visual debugging system. While they made Icarus look significantly cooler, the real value was giving the drive team and pit crew instant information without needing to stare at dashboards.",
    bullets: [
      "The LED system communicated robot state, readiness, and match-flow information from across the field or pit.",
      "Mounting needed to keep strips visible while avoiding direct impacts, intake contact, and pit-work damage.",
      "LED wiring was routed cleanly, strain relieved, labeled, and kept serviceable during panel or assembly removal.",
      "LED states were treated as a communication system for enabled/disabled state, mechanism state, readiness, and debugging information.",
      "The system was designed so it could be disabled or ignored without affecting core robot function.",
    ],
    blocks: [
      {
        title: "Disabled and healthy",
        body: "Rainbow pattern indicates the robot is disabled and system checks look normal.",
      },
      {
        title: "Low battery",
        body: "Flashing red indicates battery voltage is below the desired threshold: 12.4 V at events and 12.1 V during testing.",
      },
      {
        title: "Autonomous",
        body: "A Cylon-style sweep shows the robot is enabled in autonomous.",
      },
      {
        title: "Teleop shift progress",
        body: "Progress bars communicate match periods. Purple represents transition/endgame, blue represents active scoring windows, and red represents inactive periods.",
      },
    ],
  },
]

export const mechanicalSystems: MechanicalSystem[] = [
  {
    id: "full",
    label: "Full Assembly",
    title: "Icarus 2.0",
    summary:
      "The final robot packages dual intakes, the dye rotor indexer, turret shooter, electronics, and bumper structure around a compact swerve base.",
    image: "/media/icarus-version-2.png",
    imageAlt: "Icarus 2.0 full robot CAD render",
    metrics: robotSpecs.slice(1, 5),
    tabs: fullAssemblyTabs,
  },
  {
    id: "super-structure",
    label: "Superstructure",
    title: "Superstructure",
    summary:
      "The robot backbone combines an SDS MK5n drivetrain, structural side plates, bellypan support, welded bumpers, and protected service access.",
    image: "/media/icarus-version-2.png",
    imageAlt: "Icarus superstructure CAD render",
    metrics: [
      { label: "Frame", value: "26 x 28.75 in" },
      { label: "Drive", value: "4 SDS MK5n" },
      { label: "Drive motors", value: "Kraken x60" },
      { label: "Steer motors", value: "Kraken x44" },
    ],
    tabs: [
      {
        id: "overview",
        label: "Overview",
        title: "Structural package",
        body:
          "The superstructure was designed around internal fuel volume, intake support, turret mounting stiffness, and fast service access.",
        bullets: [
          "All aluminum is 6061 unless otherwise specified.",
          "Quarter-inch side plates carry intake loads and support the turret mounting plate.",
          "An eighth-inch structural bellypan carries electronics and includes a recessed pocket for the dye rotor bearing.",
          "Middle 1 x 1 box tube rails span the frame to keep the bellypan from sagging under the dye rotor load.",
        ],
      },
      {
        id: "drivetrain",
        label: "Drivetrain",
        title: "Swerve base",
        body:
          "Four SDS MK5n modules use Kraken x60 drive motors and Kraken x44 steering motors on the R1 ratio.",
        bullets: [
          "Refire x44 adapter boards powered the CANcoders.",
          "Drive CAN wiring stayed daisy chained: drive motor to CANcoder to steer motor.",
          "Intake sides use 1/16 inch 2 x 1 box tube.",
          "Non-intake sides use 2 inch tall by 0.25 inch frame rails mounted with WCP nut strips and red Loctite.",
        ],
      },
      {
        id: "bumpers",
        label: "Bumpers",
        title: "Bumpers as structure",
        body:
          "The bumpers became part of the robot architecture, supporting weight savings, battery service, and traversal reliability.",
        bullets: [
          "Bumper foam was FoamByMail 3 lb cross-linked closed-cell foam cut to size.",
          "Backer plates were CNC machined from 3000-series aluminum, then welded after the bending plan became impractical.",
          "Fabric was riveted directly to the welded metal backer.",
          "A 1/8 inch polycarbonate bumper pan improved bump traversal and helped remove enough retained hardware to make weight.",
          "Bumpers mounted with two 3 inch bolts through the box tube after rivnuts failed.",
        ],
      },
    ],
  },
  {
    id: "dual-intake",
    label: "Intakes",
    title: "Dual Intake System",
    summary:
      "Two compact side intakes use rack-and-pinion deployment, dead-axle rollers, SRPP hopper walls, and a sewn half-box fuel net.",
    image: "/media/stub-roller-cross-section.png",
    imageAlt: "Stub axle roller cross section",
    metrics: [
      { label: "Deploy", value: "1 Kraken x44 each" },
      { label: "Feed", value: "1 Kraken x60 each" },
      { label: "Deploy ratio", value: "2.91:1" },
      { label: "Feed ratio", value: "2.27:1" },
    ],
    tabs: [
      {
        id: "overview",
        label: "Overview",
        title: "Side acquisition",
        body:
          "Rack-and-pinion deployment let each intake compress inward during side impacts while keeping the mechanism simple and compact.",
        bullets: [
          "The same four intake plates ran through all four competitions with no tooth-chipping issues.",
          "Both intakes consumed about 1.3 inches per side when closed.",
          "Motor spacing was designed to work with both rollers or, in a failure case, only the lower roller using a longer belt.",
        ],
      },
      {
        id: "rollers",
        label: "Rollers",
        title: "Dead-axle roller stack",
        body:
          "The intake rollers were built around polycarbonate tube, printed pulley caps, turned stub axles, and shared end-cap geometry for part simplification.",
        bullets: [
          "Rollers use 2 1/16 inch long, 1 7/8 inch ID, 2 inch OD polycarbonate tube from McMaster-Carr.",
          "Upper pulley end caps were printed in Bambu PETG-CF; the lower impact-prone caps used Overture 95A TPU.",
          "Stub axles were turned from 1/2 inch hex shaft to 0.375 inch bearing diameter, leaving 0.125 inch of hex for wrench access.",
          "A carbon fiber transfer roller/jackshaft moved torque between both sides of each intake.",
          "Carbon fiber end caps were Formlabs Tough 1500 resin, bonded with Loctite HY 4070 after sanding and acetone cleaning.",
        ],
        media: {
          src: "/media/stub-roller-cross-section.png",
          alt: "Stub roller cross section",
          caption: "Stub roller cross section",
        },
      },
      {
        id: "structure",
        label: "Structure",
        title: "Racks, kicker, and hopper walls",
        body:
          "The intake structure leaned hard on SRPP because it tolerated impacts, Loctite exposure, and season-long abuse better than thin polycarbonate.",
        bullets: [
          "3/8 inch, 10 DP SRPP racks were laminated from two CNC machined 3/16 inch SRPP sheets using 3M 8005 glue.",
          "Rack bonding surfaces were lightly sanded with 80 grit, cleaned with acetone, then clamped with bolts and pan-head washers for 24 hours.",
          "The 254-style kicker used 1/4 inch CNC machined SRPP plates and two WCP 3/8 inch hex lite shafts.",
          "Hopper walls started as 1/16 inch bent polycarbonate but switched to 1/8 inch SRPP after cracking and interference issues.",
          "WCP nut strips joined hopper panels at 90 degree angles with blue-Loctited button heads.",
        ],
      },
      {
        id: "net",
        label: "Net",
        title: "Half-box hopper net",
        body:
          "The intake hopper net started as a quick fabric solution and became a deliberate capacity feature.",
        bullets: [
          "The first version used extra black bumper fabric; the final version used athletic jersey mesh from Amazon.",
          "The net was sewn as a half box so fuel pushed it into a box-like shape and increased usable capacity.",
          "The design avoided elastic so drivers did not need to worry about whether the robot could fit under the trench.",
          "Zip-tie locations were reinforced with stitching to prevent tearing.",
        ],
      },
    ],
  },
  {
    id: "dye-rotor",
    label: "Dye Rotor",
    title: "Dye Rotor Indexer",
    summary:
      "The dye rotor is the robot's compact coaxial indexer: separate hook and feed systems move fuel through a low bowl and into the turret.",
    image: "/media/dye-rotor-full-assembly.png",
    imageAlt: "Dye rotor full assembly",
    metrics: [
      { label: "Role", value: "Indexer" },
      { label: "Bowl height", value: "1.3 in" },
      { label: "Feed motors", value: "Two Kraken x44" },
      { label: "Hook ratio", value: "30:1" },
    ],
    tabs: [
      {
        id: "overview",
        label: "Overview",
        title: "Coaxial indexer",
        body:
          "The dye rotor packages separate hook and feed systems into a very short vertical stack, with the base of the bowl sitting about 1.3 inches above the robot floor.",
        bullets: [
          "Hook and feed wheels are powered independently so fuel movement can be tuned separately.",
          "Feed wheels use two Kraken x44 motors geared roughly 1:1.",
          "The hook is geared around 30:1.",
          "Both hook and feed are chain-driven under the rotor to keep the mechanism vertically compact.",
          "Three WCP 4.5 inch x-contact bearings enable the coaxial architecture.",
          "The horizontal feed wheel uses a C-shaped fuel path for longer contact before fuel moves up into the rotor.",
        ],
        media: {
          src: "/media/dye-rotor-full-assembly.png",
          alt: "Dye rotor full assembly",
          caption: "Final dye rotor assembly",
        },
      },
      {
        id: "iterations",
        label: "Iterations",
        title: "Dye rotor development",
        body:
          "The rotor went through several CAD generations before settling into the final coaxial indexer package.",
        iterations: [
          {
            label: "V1",
            title: "First rotor concept",
            body: "Early geometry established the general bowl and moving-hook concept.",
            image: "/media/dye-rotor-v1.png",
            alt: "Dye rotor version 1",
          },
          {
            label: "V2",
            title: "Feed path refinement",
            body: "The feed path and indexing geometry became more deliberate as packaging constraints tightened.",
            image: "/media/dye-rotor-v2.png",
            alt: "Dye rotor version 2",
          },
          {
            label: "V3",
            title: "Coaxial packaging",
            body: "The rotor stack moved toward the compact coaxial layout used by the final robot.",
            image: "/media/dye-rotor-v3.png",
            alt: "Dye rotor version 3",
          },
          {
            label: "V4",
            title: "Manufacturable structure",
            body: "Printed and machined parts were revised for easier assembly, access, and reliability.",
            image: "/media/dye-rotor-v4.png",
            alt: "Dye rotor version 4",
          },
          {
            label: "V5",
            title: "Final indexer",
            body: "The final rotor combines the low bowl, separate hook and feed, and compact turret handoff.",
            image: "/media/dye-rotor-v5.png",
            alt: "Dye rotor version 5",
          },
        ],
      },
    ],
  },
  {
    id: "turret",
    label: "Turret",
    title: "Inverted Pancake Turret",
    summary:
      "A low-profile active turret with a large ring gear, compact cable path, hood adjustment, and high-energy shooter package.",
    image: "/media/turret-v4.png",
    imageAlt: "Final turret CAD render",
    metrics: [
      { label: "Rotation", value: "420 degrees" },
      { label: "Ring gear", value: "18 in" },
      { label: "Hood range", value: "6.4-48 degrees" },
      { label: "Rotation motor", value: "Kraken x44" },
    ],
    tabs: [
      {
        id: "overview",
        label: "Overview",
        title: "Compact active shooter",
        body:
          "The turret preserves hopper volume while letting the robot aim independently from chassis heading.",
        bullets: [
          "The main turret gear plate is pocketed 6061 aluminum, water-jetted with a 10 DP gear tooth pattern around an 18 inch ring.",
          "Turret rotation uses a Kraken x44 through a 45:1 reduction, with shim tape used for near-zero backlash.",
          "A smaller printed inner ring reduced cable sleeve travel from an 18 inch turret path to roughly 12 inches.",
          "The hood moves from 6.4 degrees to 48 degrees for shot tuning and full-field passing.",
          "A 1/2 inch UHMW dye rotor stabilizer clamps around the rotor lid for low-friction, consistent feed into the shooter.",
        ],
        media: {
          src: "/media/turret-v4.png",
          alt: "Final inverted pancake turret render",
          caption: "Final inverted pancake turret",
        },
      },
      {
        id: "iterations",
        label: "Iterations",
        title: "Turret development",
        body:
          "The turret shifted from early concept geometry into a compact inverted pancake package that better preserved hopper space.",
        iterations: [
          {
            label: "V0",
            title: "Early turret concept",
            body: "The first package explored the basic shooter, hood, and turret packaging envelope.",
            image: "/media/turret-v0.png",
            alt: "Turret version 0",
          },
          {
            label: "V2",
            title: "Mechanism integration",
            body: "Power transmission, hood motion, and feed geometry moved into a tighter integrated assembly.",
            image: "/media/turret-v2.png",
            alt: "Turret version 2",
          },
          {
            label: "V4",
            title: "Final turret",
            body: "The final turret uses the inverted pancake architecture, compact cable sleeve routing, and refined shooter/hood package.",
            image: "/media/turret-v4.png",
            alt: "Turret version 4",
          },
        ],
      },
    ],
  },
]

export const softwareTabs: BinderTab[] = [
  {
    id: "shooting",
    label: "Shooting",
    title: "Shoot-on-the-move stack",
    eyebrow: "Controls",
    body:
      "Shot parameters were selected from lookup tables and corrected with time-of-flight recursion plus velocity-compensated turret tracking.",
    bullets: [
      "Lookup tables use InterpolatingTreeMaps for hood angle, wheel angular velocity, and empirically measured time of flight from multiple hub distances.",
      "Shoot-on-the-move uses five iterations of time-of-flight recursion.",
      "Turret velocity setpoint accounts for robot angular velocity, tangential translation relative to the target, and translational acceleration.",
      "The position setpoint is latency-compensated using the velocity setpoint.",
      "The passing target adjusts dynamically based on distance to account for roll and encourage clustering in the corner.",
      "The robot begins scoring 2 seconds before an active shift starts and stops 1 second after it ends to maximize scoring time.",
    ],
    media: {
      src: "/media/final-icarus-viewer-layout.png",
      alt: "Shot pipeline and robot software visualization",
      caption: "Shot pipeline reference",
    },
  },
  {
    id: "zones",
    label: "Zones",
    title: "Predictive field zones",
    eyebrow: "Driver assistance",
    body:
      "Zone logic triggered automatic hood ducking, trench alignment, and shooting pauses based on where the robot was and where it was about to be.",
    bullets: [
      "The robot autonomously triggers zone-based actions such as ducking the hood under the trench and pausing shooting behind the tower.",
      "Auto-align controls heading and Y position through the trenches.",
      "Predictive zones account for actions that take time, allowing the robot to score while partially in the trench while still ducking the hood in time.",
      "Zone and PredictiveZone interfaces make it easy to combine multiple field regions into one behavior.",
    ],
  },
  {
    id: "cameras",
    label: "Cameras",
    title: "360 degree vision",
    eyebrow: "Localization",
    body:
      "Six cameras gave Icarus near-360 field awareness, keeping odometry updated while the robot rotated, cycled, and lined up moving shots.",
    bullets: [
      "Camera coverage was arranged so AprilTags stayed visible from many robot headings instead of only during clean straight-on looks.",
      "Vision measurements constantly corrected odometry rather than being treated as occasional snapshots.",
      "The wide camera layout supported moving shots, trench alignment, driver-assistance behavior, and fast pose recovery after collisions.",
      "Redundant sightlines helped when field elements, defenders, or the robot structure blocked individual cameras.",
    ],
    media: {
      src: "/media/final-icarus-viewer-layout.png",
      alt: "Six-camera vision and odometry software reference",
      caption: "360 vision concept",
    },
  },
  {
    id: "fuelsim",
    label: "FuelSim",
    title: "FuelSim mini-library",
    eyebrow: "Simulation",
    body:
      "FuelSim was a drop-in simulation helper built early in the season to test fuel dynamics, autonomous behavior, and simulated driver practice.",
    bullets: [
      "Runs physics simulation of fuel with optional drag.",
      "Simulates collisions with game elements, the field, the robot, and other fuel.",
      "Supports automatic intaking of game pieces.",
      "Useful for simulated driver practice and autonomous testing.",
      "Available on GitHub as a compact single-file utility.",
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    title: "Simulation-first controls",
    eyebrow: "Robot code",
    body:
      "The codebase leaned on AdvantageKit, telemetry, simulation, and replay-friendly thinking so mechanical iteration had useful software feedback.",
    bullets: [
      "Simulation with AdvantageKit and custom FuelSim.",
      "Shoot-on-the-move using time-of-flight recursion with lookup tables and velocity-compensated turret tracking.",
      "Auto-align to the trenches and automatic hood ducking using predictive zones.",
    ],
  },
]

export const manufacturingCapabilities = [
  {
    title: "CNC Router",
    body:
      "Primary process for SRPP, polycarbonate, aluminum plates, racks, and pocketed parts.",
  },
  {
    title: "Waterjet",
    body:
      "Used when large structural plates became too slow to machine directly, especially later side plate revisions.",
  },
  {
    title: "3D Printing",
    body:
      "Bambu PETG-CF, Bambu PLA Tough+, Overture TPU, Formlabs Tough 1500, and PLA Matte supported prototypes, covers, pulley caps, LED holders, and low-load packaging.",
  },
  {
    title: "Fabrication",
    body:
      "Bumper welding, fabric riveting, tube cutting, shaft turning, adhesive bonding, and repeated fixture-aware rework supported season iteration.",
  },
]

export const cncGeneralNotes = [
  {
    label: "SRPP tooling",
    value: "SRPP is cut using a compression endmill.",
  },
  {
    label: "3/32 inch cutter",
    value: "The 3/32 inch cutter is not compression; it is a normal endmill.",
  },
  {
    label: "Preferred source",
    value: "Amazon O-Flute / Compression Endmill Set",
    detail:
      "https://www.amazon.com/gp/aw/d/B0D1FTXBRP?ref=ppx_pop_mob_b_asin_image&th=1",
  },
]

export const cncOperations: CncOperation[] = [
  {
    id: "aluminum-drilling",
    material: "6061 Aluminum",
    title: "Drilling Operations",
    tool: ["#9 Drill", "0.196 inch diameter"],
    groups: [
      {
        title: "Feeds & Speeds",
        rows: [
          { label: "Spindle Speed", value: "6500 RPM" },
          { label: "Surface Speed", value: "333 SFM" },
          { label: "Plunge Feedrate", value: "15 in/min" },
          { label: "Retract Feedrate", value: "20 in/min" },
          { label: "Coolant", value: "Disabled" },
        ],
      },
      {
        title: "Heights",
        rows: [
          { label: "Clearance Height Offset", value: "0.400 in" },
          { label: "Retract Height Offset", value: "0.200 in" },
          { label: "Feed Height Offset", value: "0.200 in" },
          { label: "Top Height Offset", value: "0.000 in" },
          {
            label: "Bottom Height",
            value:
              "Through drilling: 0.000 in + tip through; contour: -0.040 in; other drilling: -0.125 in",
          },
          { label: "Breakthrough Depth", value: "0.050 in" },
        ],
      },
      {
        title: "Cycle",
        rows: [
          { label: "Cycle Type", value: "Chip Break" },
          { label: "Pecking Depth", value: "0.040 in" },
          { label: "Minimum Pecking Depth", value: "0.030 in" },
          { label: "Accumulated Peck Depth", value: "0.490 in" },
          { label: "Chip Break Distance", value: "0.004 in" },
          { label: "Dwelling Period", value: "0.150 s" },
        ],
      },
      {
        title: "Linking",
        rows: [
          { label: "Retraction Policy", value: "Avoid collisions" },
          { label: "High Feedrate Mode", value: "Preserve rapid movement" },
          { label: "Safe Distance", value: "0.080 in" },
        ],
      },
    ],
  },
  {
    id: "aluminum-contour",
    material: "6061 Aluminum",
    title: "2D Contour Operations",
    tool: ["1/8 inch Flat Endmill", "Single flute / O-flute style"],
    groups: [
      {
        title: "Feeds & Speeds",
        rows: [
          { label: "Spindle Speed", value: "20,000 RPM" },
          { label: "Surface Speed", value: "654 SFM" },
          { label: "Cutting Feedrate", value: "45 in/min" },
          { label: "Feed per Tooth", value: "0.00075 in" },
          { label: "Lead-In Feedrate", value: "25 in/min" },
          { label: "Lead-Out Feedrate", value: "25 in/min" },
          { label: "Transition Feedrate", value: "25 in/min" },
          { label: "Ramp Feedrate", value: "45 in/min" },
          { label: "Plunge Feedrate", value: "15 in/min" },
          { label: "Coolant", value: "Flood" },
        ],
      },
      {
        title: "Heights",
        rows: [
          { label: "Clearance Height Offset", value: "0.400 in" },
          { label: "Retract Height Offset", value: "0.200 in" },
          { label: "Feed Height Offset", value: "0.200 in" },
          { label: "Top Height Offset", value: "0.000 in" },
          { label: "Bottom Height Offset", value: "-0.040 in" },
        ],
      },
      {
        title: "Passes",
        rows: [
          { label: "Tolerance", value: "0.0004 in" },
          { label: "Compensation Type", value: "In computer" },
          { label: "Finish Feedrate", value: "45 in/min" },
          { label: "Outer Corner Mode", value: "Roll around" },
          { label: "Multiple Finishing Passes", value: "Disabled" },
          { label: "Roughing Passes", value: "Disabled" },
          { label: "Maximum Roughing Stepdown", value: "0.140 in" },
          { label: "Finishing Stepdown", value: "0.008 in" },
          { label: "Rough Final", value: "Enabled" },
          { label: "Order by Islands", value: "Enabled" },
          { label: "Stock on Islands", value: "0.125 in" },
          { label: "Stock to Leave", value: "Disabled" },
          { label: "Smoothing", value: "Enabled, tolerance 0.0004 in" },
        ],
      },
      {
        title: "Linking / Ramp",
        rows: [
          { label: "High Feedrate Mode", value: "Preserve rapid movement" },
          { label: "Safe Distance", value: "0.025 in" },
          { label: "Lift Height", value: "0.000 in" },
          { label: "Ramping Angle", value: "2 degrees" },
          { label: "Maximum Ramp Stepdown", value: "0.040 in" },
          { label: "Ramp Clearance Height", value: "0.060 in" },
          { label: "Entry", value: "Uses predrilled positions" },
        ],
      },
    ],
  },
  {
    id: "aluminum-adaptive",
    material: "6061 Aluminum",
    title: "2D Adaptive Pocketing / Lightening",
    tool: ["1/4 inch Flat Endmill", "Single flute / O-flute style"],
    groups: [
      {
        title: "Feeds & Speeds",
        rows: [
          { label: "Spindle Speed", value: "20,000 RPM" },
          { label: "Surface Speed", value: "1309 SFM" },
          { label: "Cutting Feedrate", value: "100 in/min" },
          { label: "Feed per Tooth", value: "0.005 in" },
          { label: "Lead-In Feedrate", value: "25 in/min" },
          { label: "Lead-Out Feedrate", value: "25 in/min" },
          { label: "Transition Feedrate", value: "25 in/min" },
          { label: "Ramp Feedrate", value: "100 in/min" },
          { label: "Plunge Feedrate", value: "15 in/min" },
          { label: "Coolant", value: "Flood" },
        ],
      },
      {
        title: "Adaptive Setup A, Heavier Cut",
        rows: [
          { label: "Tolerance", value: "0.004 in" },
          { label: "Optimal Load", value: "0.040 in" },
          { label: "Minimum Cutting Radius", value: "0.025 in" },
          { label: "Direction", value: "Climb" },
          { label: "Stock to Leave", value: "Enabled, radial 0.010 in, axial 0.000 in" },
          { label: "Smoothing", value: "Disabled" },
          { label: "Feed Optimization", value: "Disabled" },
          { label: "Retraction Policy", value: "Full retract" },
          { label: "High Feedrate Mode", value: "Preserve rapid movement" },
          { label: "Allow Rapid Retract", value: "Enabled" },
          { label: "Lift Height", value: "0.008 in" },
          { label: "Non-Engagement Feedrate", value: "100 in/min" },
          { label: "Horizontal Lead-In", value: "0.025 in" },
          { label: "Vertical Lead-In/Clearance", value: "0.025 in" },
          { label: "Ramp Type", value: "Helix" },
          { label: "Ramping Angle", value: "3 degrees" },
          { label: "Ramp Clearance Height", value: "0.030 in" },
          { label: "Helical Ramp Diameter", value: "0.450 in" },
          { label: "Minimum Ramp Diameter", value: "0.350 in" },
        ],
      },
      {
        title: "Adaptive Setup B, Lighter / Finish-Oriented",
        rows: [
          { label: "Tolerance", value: "0.004 in" },
          { label: "Optimal Load", value: "0.030 in" },
          { label: "Minimum Cutting Radius", value: "0.040 in" },
          { label: "Direction", value: "Climb" },
          { label: "Multiple Depths", value: "Disabled" },
          { label: "Stock to Leave", value: "Disabled" },
          { label: "Smoothing", value: "Enabled, tolerance 0.001 in" },
          { label: "Feed Optimization", value: "Disabled" },
          { label: "Retraction Policy", value: "Full retract" },
          { label: "High Feedrate Mode", value: "Preserve rapid movement" },
          { label: "Allow Rapid Retract", value: "Enabled" },
          { label: "Lift Height", value: "0.008 in" },
          { label: "Non-Engagement Feedrate", value: "100 in/min" },
          { label: "Horizontal Lead-In", value: "0.025 in" },
          { label: "Vertical Lead-In/Clearance", value: "0.025 in" },
          { label: "Ramp Type", value: "Helix" },
          { label: "Ramping Angle", value: "3 degrees" },
          { label: "Ramp Clearance Height", value: "0.030 in" },
          { label: "Helical Ramp Diameter", value: "0.450 in" },
          { label: "Minimum Ramp Diameter", value: "0.300 in" },
          { label: "Entry", value: "Uses predrilled/edge entry positions" },
        ],
      },
    ],
  },
  {
    id: "plastic-drilling",
    material: "Polycarbonate / SRPP",
    title: "Drilling Operations",
    tool: ["#9 Drill", "0.196 inch diameter"],
    groups: [
      {
        title: "Feeds & Speeds",
        rows: [
          { label: "Spindle Speed", value: "6500 RPM" },
          { label: "Surface Speed", value: "333 SFM" },
          { label: "Plunge Feedrate", value: "15 in/min" },
          { label: "Retract Feedrate", value: "20 in/min" },
          { label: "Coolant", value: "Disabled" },
        ],
      },
      {
        title: "Heights",
        rows: [
          { label: "Clearance Height Offset", value: "0.400 in" },
          { label: "Retract Height Offset", value: "0.200 in" },
          { label: "Feed Height Offset", value: "0.200 in" },
          { label: "Top Height Offset", value: "0.000 in" },
          { label: "Bottom Height Offset", value: "-0.118 in" },
          { label: "Breakthrough Depth", value: "0.050 in" },
        ],
      },
    ],
  },
  {
    id: "plastic-contour",
    material: "Polycarbonate / SRPP",
    title: "2D Contour Operations",
    tool: [
      "1/8 inch Compression Endmill",
      "Single flute / O-flute style",
      "SRPP uses compression tooling",
    ],
    groups: [
      {
        title: "Feeds & Speeds",
        rows: [
          { label: "Spindle Speed", value: "16,000 RPM" },
          { label: "Surface Speed", value: "524 SFM" },
          { label: "Cutting Feedrate", value: "140 in/min" },
          { label: "Feed per Tooth", value: "0.004374 in" },
          { label: "Lead-In Feedrate", value: "75 in/min" },
          { label: "Lead-Out Feedrate", value: "75 in/min" },
          { label: "Transition Feedrate", value: "75 in/min" },
          { label: "Ramp Feedrate", value: "90 in/min" },
          { label: "Plunge Feedrate", value: "40 in/min" },
          { label: "Coolant", value: "Flood" },
        ],
      },
      {
        title: "Heights",
        rows: [
          { label: "Clearance Height Offset", value: "0.400 in" },
          { label: "Retract Height Offset", value: "0.200 in" },
          { label: "Feed Height Offset", value: "0.200 in" },
          { label: "Top Height Offset", value: "0.000 in" },
          { label: "Bottom Height Offset", value: "-0.030 in" },
        ],
      },
      {
        title: "Passes",
        rows: [
          { label: "Tolerance", value: "0.0004 in" },
          { label: "Compensation Type", value: "In computer" },
          { label: "Finish Feedrate", value: "140 in/min" },
          { label: "Outer Corner Mode", value: "Roll around" },
          { label: "Multiple Finishing Passes", value: "Disabled" },
          { label: "Maximum Roughing Stepdown", value: "0.140 in" },
          { label: "Finishing Stepdown", value: "0.008 in" },
          { label: "Rough Final", value: "Enabled" },
          { label: "Order by Islands", value: "Enabled" },
          { label: "Stock on Islands", value: "0.125 in" },
          { label: "Stock to Leave", value: "Disabled" },
          { label: "Smoothing", value: "Enabled, tolerance 0.0004 in" },
        ],
      },
      {
        title: "Linking / Ramp",
        rows: [
          { label: "High Feedrate Mode", value: "Preserve rapid movement" },
          { label: "Safe Distance", value: "0.025 in" },
          { label: "Lift Height", value: "0.000 in" },
          { label: "Entry", value: "Uses predrilled positions" },
        ],
      },
    ],
  },
]

export const seasonEvents = [
  {
    week: "Week Zero",
    event: "Practice Event",
    rank: "13",
    record: "2-3-0",
    role: "First Pick of Alliance 4",
    partner: "Team 2079",
    awards: [] as string[],
  },
  {
    week: "Week 3",
    event: "URI District Event",
    rank: "3",
    record: "11-5-0",
    role: "Captain of Alliance 2",
    partner: "Team 6324",
    awards: ["Industrial Design Award"],
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
  },
  {
    week: "Week 7",
    event: "NEDCMP Burns",
    rank: "9",
    record: "10-7-0",
    role: "First Pick of Alliance 3",
    partner: "Team 133 BERT",
    awards: ["Autonomous Award sponsored by Google.org"],
  },
  {
    week: "Week 9",
    event: "World Championship Hopper Division",
    rank: "5",
    record: "8-4-0",
    role: "Captain of Alliance 4",
    partner: "Team 6328",
    awards: ["Creativity Award sponsored by Rockwell Automation"],
  },
]

export const seasonStats: Metric[] = [
  { label: "World rank", value: "#34" },
  { label: "Awards", value: "5", detail: "Awarded at every event" },
  { label: "Event record", value: "41-23-0" },
  { label: "Finals", value: "First since rookie year" },
  { label: "Historical awards", value: "5 of 12", detail: "Earned in one season" },
  { label: "Team match volume", value: "~20%", detail: "Of all Team 5000 matches ever" },
  { label: "Instagram views", value: "28M+" },
  { label: "Instagram followers", value: "5,000+" },
  { label: "YouTube views", value: "500,000" },
]

export const resources = [
  {
    label: "Chief Delphi Build Thread",
    kind: "Open Alliance",
    href:
      "https://www.chiefdelphi.com/t/frc-5000-hammerheads-2026-build-thread-open-alliance/507502?u=logandelaar",
    description:
      "Primary public build thread for development updates, CAD releases, testing notes, and season recap.",
  },
  {
    label: "Championship CAD",
    kind: "CAD",
    href: "https://a360.co/44b0UAF",
    description: "Final public CAD reference linked from the build thread.",
  },
  {
    label: "Team GitHub",
    kind: "Code",
    href: "https://github.com/hammerheads5000",
    description: "Robot code, tools, and public software experiments.",
  },
  {
    label: "2026 Rebuilt Repository",
    kind: "Robot Code",
    href: "https://github.com/hammerheads5000/2026Rebuilt",
    description: "Team 5000's 2026 robot code repository.",
  },
  {
    label: "Team Website",
    kind: "Team",
    href: "https://www.hammerheads5000.com/",
    description: "Hammerheads program site and team identity home.",
  },
]

export const thankYouCards = [
  {
    name: "Team 125",
    body:
      "Thank you for the advice, examples, and New England standard-setting that helped push the robot and team forward.",
  },
  {
    name: "Team 5687, The Outliers",
    body:
      "Thank you for the collaboration, perspective, and the kind of competitive pressure that makes everyone better.",
  },
  {
    name: "Team 190",
    body:
      "Thank you for being a strong partner and for helping make WPI one of the defining events of the season.",
  },
  {
    name: "Team 6328",
    body:
      "Thank you for the championship-level partnership in Hopper and for making the last event of the season feel like the robot had fully arrived.",
  },
  {
    name: "Team 1768",
    body:
      "Thank you for the season-long competition and for the match that proved electrical reliability still has to survive robots making aggressive contact.",
  },
  {
    name: "NE FIRST",
    body:
      "Thank you for building the district environment that lets teams iterate, compete, learn, and come back stronger every few weeks.",
  },
  {
    name: "FIRST",
    body:
      "Thank you for creating the program that turns weird robot ideas into real engineering, real pressure, and real growth.",
  },
  {
    name: "FIRST HQ",
    body:
      "Thank you for the event infrastructure, game, and championship experience that made the season possible.",
  },
  {
    name: "FIRST Volunteers",
    body:
      "Thank you for every inspection, field reset, queue call, score table fix, and long day that made the events run.",
  },
  {
    name: "Chief Delphi",
    body:
      "Thank you for being the place where build threads, feedback, arguments, and weirdly specific robot knowledge all live in public.",
  },
  {
    name: "Parents & Mentors",
    body:
      "Thank you for the rides, food, late nights, machine help, sanity checks, and the patience required to support a season like this.",
  },
  {
    name: "Cooper / @cpennell20",
    body:
      "Thank you for the advice, review, and outside perspective that helped keep the engineering honest.",
  },
  {
    name: "Mr. Johnson",
    body:
      "Thank you for making space for the work, supporting the team, and helping keep the program moving.",
  },
  {
    name: "Sylvain",
    body:
      "Thank you for the technical help, mentorship, and steady willingness to make the hard parts less impossible.",
  },
  {
    name: "Mr. and Mrs. Flanagan",
    body:
      "Thank you for the support, time, and care that helped make the season possible behind the scenes.",
  },
]
