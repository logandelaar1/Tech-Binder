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
      "This page is the main place to look through the full Icarus 2.0 CAD. You can orbit around the robot, focus on specific subsystems, and use ghost mode when you still want to see the rest of the robot for context.",
    bullets: [
      "The full assembly view is the main CAD reference for Icarus 2.0.",
      "Subsystem tabs focus the model on the superstructure, intakes, dye rotor, or turret.",
      "Ghost mode is helpful when isolating one subsystem makes it hard to understand how everything fits together.",
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
      "Icarus 2.0 was built around a scoring-first design, using CNC SRPP, mostly 6061 aluminum, low-backlash mechanisms, and wiring practices that had already proven themselves through competition.",
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
        title: "Week 0 test robot",
        body:
          "Version 1 was basically our first full robot package that we threw together with the goal of testing everything at Week 0. It let us prove out the major ideas, find what was annoying to service, and see which parts of the robot needed to change before our first real event.",
        image: "/media/icarus-version-2.png",
        alt: "Icarus version 1 CAD render",
      },
      {
        label: "Version 2",
        title: "First event rebuild",
        body:
          "Version 2 was the rebuild after Week 0. We took what we learned from testing and turned it into the robot we actually wanted to compete with. The structure got cleaner, the packaging got tighter, and a lot of the small issues from the first version were fixed before our first event.",
        image: "/media/icarus-version-1.png",
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
      "The LEDs were added partly because they made the robot look cooler, but they were also actually useful. They gave the drive team and pit crew quick information about what the robot was doing without needing to stare at a dashboard.",
    bullets: [
      "The LEDs showed robot state, readiness, and match-flow information from across the field or in the pit.",
      "The strips had to stay visible while still being protected from impacts, intake contact, and pit work.",
      "LED wiring was routed cleanly, strain relieved, labeled, and kept serviceable during panel or assembly removal.",
      "LED states were treated like a real communication system for enabled/disabled state, mechanism state, readiness, and debugging.",
      "The system was designed so it could be disabled or ignored without affecting core robot function.",
    ],
    blocks: [
      {
        title: "Disabled and healthy",
        body: "A rainbow pattern means the robot is disabled and the main system checks look good.",
      },
      {
        title: "Low battery",
        body: "Flashing red means the battery voltage is lower than we want: 12.4 V at events and 12.1 V during testing.",
      },
      {
        title: "Autonomous",
        body: "A Cylon-style sweep shows that the robot is enabled in autonomous.",
      },
      {
        title: "Teleop shift progress",
        body: "Progress bars show the flow of the match. Purple represents transition/endgame, blue represents active scoring windows, and red represents inactive periods.",
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
      "The superstructure is the backbone of the robot, tying together the SDS MK5n drivetrain, side plates, bellypan, bumpers, electronics, and the service access we needed throughout the season.",
    image: "/media/Superstructure.png",
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
          "The superstructure was designed around fuel storage, intake support, turret stiffness, and being able to work on the robot quickly.",
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
          "The drivetrain uses four SDS MK5n modules with Kraken x60 drive motors and Kraken x44 steering motors on the R1 ratio.",
        media: {
          src: "/media/Drive Train.png",
          alt: "Drivetrain assembly",
          caption: "Drivetrain with wheels and motors",
        },
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
          "The bumpers ended up being more than just bumpers. They became part of the robot's structure and helped with weight, battery access, and driving over field elements.",
        media: {
          src: "/media/Bumper Backer.png",
          alt: "Bumper backer plate",
          caption: "Aluminum bumper structure",
        },
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
      "The robot used two compact side intakes with rack-and-pinion deployment, dead-axle rollers, SRPP hopper walls, and a sewn half-box fuel net.",
    image: "/media/Intakes.png",
    imageAlt: "Dual intake system assembly",
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
          "The rack-and-pinion deployment let each intake compress inward during side hits while keeping the whole mechanism simple and compact.",
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
          "The intake rollers were built from polycarbonate tube, printed pulley caps, turned stub axles, and shared end-cap geometry to keep the parts simpler.",
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
          "The intake structure used a lot of SRPP because it handled impacts, Loctite exposure, and season-long abuse better than thin polycarbonate.",
        media: {
          src: "/media/Intakes.png",
          alt: "Intake structure frame",
          caption: "Intake frame and mechanism",
        },
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
          "The hopper net started as a quick fabric fix, but it ended up being a real capacity feature.",
        bullets: [
          "The first version used extra black bumper fabric; the final version used athletic jersey mesh from Amazon.",
          "The net was sewn as a half box so fuel pushed it into a box-like shape and increased usable capacity.",
          "The design avoided elastic so drivers did not need to worry about whether the robot could fit under the trench.",
          "Zip-tie locations were reinforced with stitching to prevent tearing.",
        ],
        media: {
          src: "/media/Net.png",
          alt: "Intake hopper net assembly",
          caption: "Half-box hopper net",
        },
      },
    ],
  },
  {
    id: "dye-rotor",
    label: "Dye Rotor",
    title: "Dye Rotor Indexer",
    summary:
      "The dye rotor is the robot's compact coaxial indexer. It uses separate hook and feed systems to move fuel through a low bowl and up into the turret.",
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
          "The dye rotor packages the hook and feed systems into a very short vertical stack. The base of the bowl sits about 1.3 inches above the robot floor, which helped keep the whole robot low and compact.",
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
          "The dye rotor went through a bunch of versions before landing on the final compact coaxial indexer setup.",
        iterations: [
          {
            label: "V1",
            title: "First rotor concept",
            body: "V1 was the first real prototype. It failed pretty much immediately and did not work well. The whole thing was too flimsy, but it helped prove what needed to change.",
            image: "/media/dye-rotor-v1.png",
            alt: "Dye rotor version 1",
          },
          {
            label: "V2",
            title: "Week 0 version",
            body: "V2 worked much better and was the version that ran at Week 0. This was the first dye rotor version that felt like the concept could actually work on the full robot.",
            image: "/media/dye-rotor-v2.png",
            alt: "Dye rotor version 2",
          },
          {
            label: "V3",
            title: "Icarus 2.0 redesign",
            body: "V3 was redesigned for Icarus 2.0. The biggest change was that the lid got taller, which helped with the updated robot packaging.",
            image: "/media/dye-rotor-v3.png",
            alt: "Dye rotor version 3",
          },
          {
            label: "V4",
            title: "Counter-rotating floor idea",
            body: "V4 explored the idea of a counter-rotating floor to speed up the dye rotor and increase throughput. It never ended up getting built because once we geared up the shooter wheels for long-distance shots, we did not have enough recovery time to take advantage of more balls per second.",
            image: "/media/dye-rotor-v4.png",
            alt: "Dye rotor version 4",
          },
          {
            label: "V5",
            title: "Final planned version",
            body: "V5 was the final planned version. It took what we learned from the earlier versions and cleaned it into the best overall package. Unfortunately, it never ran at Worlds because the hook bent during transportation to Houston.",
            image: "/media/dye-rotor-v5.png",
            alt: "Dye rotor version 5",
          },
          {
            label: "V6",
            title: "Back to the proven setup",
            body: "V6 was basically a return to V3 after V5 broke. We swapped back to the original V3-style setup because it was proven and reliable enough to get us through Worlds.",
            image: "/media/dye-rotor-v6.png",
            alt: "Dye rotor version 6",
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
      "The turret is a low-profile active shooter with a large ring gear, compact cable routing, hood adjustment, and a high-energy shooter package.",
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
          "The turret was designed to take up as little space inside the robot as possible while still letting the robot aim independently from the drivetrain. The final package was only about 3 inches tall, which helped preserve a lot of internal hopper space.",
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
          "The turret started as a quick early-season prototype and turned into a compact inverted pancake package that preserved as much hopper space as possible.",
        iterations: [
          {
            label: "V0",
            title: "Early turret concept",
            body: "V0 was designed on day one of the season and was used for early prototyping and testing. It helped us get the basic shooter, hood, and turret ideas into CAD quickly.",
            image: "/media/turret-v0.png",
            alt: "Turret version 0",
          },
          {
            label: "V2",
            title: "Week 0 turret",
            body: "V2 was the version used during Week 0. By this point, the turret had SRPP plates and was much closer to something that could actually survive on the robot.",
            image: "/media/turret-v2.png",
            alt: "Turret version 2",
          },
          {
            label: "V4",
            title: "Final turret",
            body: "V4 was the final turret design. It used the inverted pancake architecture, compact cable sleeve routing, and a refined shooter and hood package, all while staying extremely low-profile inside the robot.",
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
      "Lookup tables using InterpolatingTreeMaps for shot parameters (hood angle and wheel angular velocity) and time-of-flight measured empirically from various distances from the hub.",
      "Shoot-on-the-move using 5 iterations of time-of-flight recursion.",
      "Turret tracking using velocity compensation: velocity setpoint is derived from the robot's angular velocity (to counteract robot rotation), translational velocity (to account for tangential motion relative to the target), and translational acceleration (to account for changing shoot-on-the-move). Position setpoint is latency-compensated using the velocity setpoint.",
      "Passing target dynamically adjusts based on distance to account for roll and encourage clustering in the corner.",
      "Robot automatically begins scoring 2 seconds before an active shift starts and stops 1 second after the shift ends to maximize scoring time.",
    ],
  },
  {
    id: "zones",
    label: "Zones",
    title: "Predictive field zones",
    eyebrow: "Driver assistance",
    body:
      "Zone logic triggered automatic hood ducking, trench alignment, and shooting pauses based on where the robot was and where it was about to be.",
    bullets: [
      "Robot autonomously triggers zone-based actions, such as ducking the hood under the trench and pausing shooting behind the tower.",
      "Auto-align through the trenches for heading and Y position.",
      "Predictive zones allow for actions that take time, such as aligning to the trenches and ducking the hood, by determining whether the robot will be in the zone in a set amount of time. This lets the robot score while partially in the trench while giving enough time to duck the hood, and it lets the robot drive close to the trench without auto align triggering until it is driving towards the trench.",
      "Zone and PredictiveZone interfaces allow easy combination of zones to act as one zone.",
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
      src: "/media/CAMERAS.png",
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
      "Available on GitHub as a compact single-file utility.",
      "Mini-library built early in the season for testing fuel dynamics with simple drop-in usage.",
      "Runs physics simulation of the fuel including optional drag simulation.",
      "Collisions with game elements, field, robot, and between fuel.",
      "Automatic intaking of game pieces.",
      "Helpful for simulated driver practice and autonomous testing.",
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
    href: "https://a360.co/4wuUiK0",
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
      "Thank you for the advice, examples, and New England standard-setting that pushed the robot and team forward.",
  },
  {
    name: "Team 5687, The Outliers",
    body:
      "Thank you for the collaboration, perspective, and competitive pressure that made everyone sharper.",
  },
  {
    name: "Team 190",
    body:
      "Thank you for being a strong partner and helping make WPI one of the defining events of the season.",
  },
  {
    name: "Team 6328",
    body:
      "Thank you for the championship-level partnership in Hopper and for helping the robot finish the year at its best.",
  },
  {
    name: "Team 1768",
    body:
      "Thank you for the season-long competition and the reminder that reliability still has to survive real contact.",
  },
  {
    name: "NE FIRST",
    body:
      "Thank you for building the district environment that lets teams iterate, compete, learn, and come back stronger.",
  },
  {
    name: "FIRST, FIRST HQ, and Volunteers",
    body:
      "Thank you for the game, events, field work, inspections, score table fixes, queue calls, and long days that made the season possible.",
  },
  {
    name: "Chief Delphi",
    body:
      "Thank you for being the place where build threads, feedback, arguments, and weirdly specific robot knowledge can live in public.",
  },
  {
    name: "Parents & Mentors",
    body:
      "Thank you for the rides, food, late nights, machine help, sanity checks, and patience required to support a season like this.",
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
