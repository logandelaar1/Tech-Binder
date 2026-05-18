export type BaseNoteTab = "overview" | "materials" | "build"
export type OptionalNoteTab = "development" | "leds"
export type NoteTab = BaseNoteTab | OptionalNoteTab

export type DetailSection = {
  title: string
  bullets: string[]
}

export type MechanismDeepDive = {
  id: string
  title: string
  kicker: string
  image: string
  imageAlt: string
  stats: Array<{ label: string; value: string }>
  panelBullets: string[]
  tabs: Record<BaseNoteTab, DetailSection[]> & Partial<Record<OptionalNoteTab, DetailSection[]>>
}

export type GlossaryEntry = {
  terms: string[]
  title: string
  body: string
  process?: string
  href?: string
}

export const deepDiveTabs: Array<{ id: NoteTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "materials", label: "Materials" },
  { id: "build", label: "Build notes" },
  { id: "development", label: "Development" },
  { id: "leds", label: "LED patterns" },
]

export const glossaryEntries: GlossaryEntry[] = [
  {
    terms: ["Kraken x44", "x44"],
    title: "Kraken X44 motor",
    body:
      "Every x44 reference in this binder means a Kraken X44 brushless motor powered by Talon FX.",
    process: "Used on intake deploy, swerve steering, dye rotor feed and hook, turret rotation, and hood motion.",
    href: "https://store.ctr-electronics.com/products/kraken-x44",
  },
  {
    terms: ["Kraken x60", "x60"],
    title: "Kraken X60 motor",
    body:
      "Every x60 reference in this binder means a Kraken X60 brushless motor powered by Talon FX.",
    process: "Used on swerve drive, intake feed rollers, and shooter flywheels.",
    href: "https://store.ctr-electronics.com/products/kraken-x60",
  },
  {
    terms: ["Kraken"],
    title: "Kraken motor family",
    body:
      "The robot uses Kraken X44 and Kraken X60 motors throughout the drivetrain, intakes, indexer, turret, shooter, and hood.",
    process: "All shorthand x44/x60 callouts in the notes refer to Kraken motors.",
    href: "https://store.ctr-electronics.com/collections/kraken",
  },
  {
    terms: ["SRPP"],
    title: "Self-reinforced polypropylene",
    body:
      "West Coast Products SRPP sheet was used for impact-prone and low-friction robot parts.",
    process: "CNC routed, laminated where thicker gear racks were needed, and preferred over polycarbonate in several places.",
    href: "https://wcproducts.com/products/srpp-sheets",
  },
  {
    terms: ["6061", "6061 aluminum", "Metal Supermarkets"],
    title: "Metal Supermarkets 6061 aluminum",
    body:
      "Default aluminum alloy for the robot unless a note calls out a different alloy; Team 5000 purchased the 6061 stock from Metal Supermarkets.",
    process: "CNC routed, water-jetted, pocketed, and used for structure, racks, plates, and gear features.",
    href: "https://www.metalsupermarkets.com/aluminum-6061/",
  },
  {
    terms: ["3033 aluminum", "3000 series"],
    title: "3000-series bumper aluminum",
    body:
      "The bumper back plates were CNC machined from 3033 aluminum after the team pivoted away from bending.",
    process: "The material was soft and gummy to machine, so the notes specifically recommend avoiding it on a CNC when possible.",
  },
  {
    terms: ["3D printed", "additive manufacturing"],
    title: "Additive manufacturing",
    body:
      "Printed parts were used where iteration speed, shape complexity, or non-critical packaging mattered.",
    process: "Most printed parts were treated as consumables and replaced between competitions.",
  },
  {
    terms: ["Bambu PETG-CF", "Bambu Labs PETG-CF", "Bambu Labs PET-G CF", "PETG-CF", "PET-G CF"],
    title: "Bambu PETG-CF",
    body:
      "Carbon-fiber-filled PETG used for stiffer printed parts where toughness and a clean finish mattered.",
    process: "Printed with appropriate hardened-nozzle settings and used on parts like rotor and roller details.",
    href: "https://us.store.bambulab.com/products/petg-cf",
  },
  {
    terms: ["Bambu PLA Tough+", "Bambu Labs PLA Tough+", "PLA Tough+"],
    title: "Bambu PLA Tough+",
    body:
      "Tough PLA-family filament used for rigid printed mechanisms and shaped spacers.",
    process: "Used for turret, rotor, and packaging parts where stiffness and fast printing were useful.",
    href: "https://us.store.bambulab.com/products/pla-tough-upgrade",
  },
  {
    terms: ["Bambu PLA Matte", "Bambu Labs PLA Matte", "PLA Matte"],
    title: "Bambu PLA Matte",
    body:
      "Matte PLA used for LED holders and low-load printed packaging details.",
    process: "Printed with snap-fit diffuser features for the LED status system.",
    href: "https://us.store.bambulab.com/products/pla-matte",
  },
  {
    terms: ["Overture 95A TPU", "95A TPU", "TPU"],
    title: "95A TPU",
    body:
      "Flexible filament used on lower intake roller end caps where impacts were more likely.",
    process: "Printed as a tougher, more compliant alternative to rigid end caps.",
    href: "https://www.amazon.com/s?k=Overture+95A+TPU",
  },
  {
    terms: ["Formlabs Tough 1500", "Tough 1500"],
    title: "Formlabs Tough 1500 resin",
    body:
      "SLA resin used for carbon-fiber transfer roller end caps.",
    process: "Bonded to sanded and acetone-cleaned carbon fiber with Loctite HY 4070.",
    href: "https://formlabs.com/store/materials/tough-1500-resin/",
  },
  {
    terms: ["UHMW"],
    title: "UHMW polyethylene",
    body:
      "Ultra-low-friction plastic used for the dye rotor stabilizer that guides fuel into the shooter.",
    process: "Machined from 1/2 inch stock and clamped around the dye rotor lid.",
    href: "https://www.mcmaster.com/uhmw-polyethylene/",
  },
  {
    terms: ["SDS MK5n", "MK5n"],
    title: "SDS MK5n swerve module",
    body:
      "Swerve module used on Icarus 2.0 with Kraken x60 drive motors and Kraken x44 steering motors.",
    process: "Configured with the R1 ratio for the final drivetrain.",
    href: "https://www.swervedrivespecialties.com/products/mk5n-swerve-module",
  },
  {
    terms: ["Refire x44 adapter boards", "Refire adapter boards"],
    title: "Refire X44 adapter boards",
    body:
      "Adapter boards used to power the swerve CANcoders from the Kraken X44 steering motor wiring package.",
    process: "Wires were directly soldered to the boards, and the drive CAN order stayed drive motor to CANcoder to steer motor.",
    href: "https://refiresolutions.com/all-products/",
  },
  {
    terms: ["Pigeon"],
    title: "Pigeon IMU",
    body:
      "Inertial measurement unit used by the robot for drivetrain heading and motion estimation.",
    process: "Unavoidable Pigeon connections were soldered with solder seal, adhesive heat-shrinked, hot glued, and strain relieved.",
    href: "https://store.ctr-electronics.com/collections/sensors",
  },
  {
    terms: ["CANivore"],
    title: "CANivore",
    body:
      "Dedicated CAN bus interface used for the robot's motor and sensor loop.",
    process: "The final robot used one CANivore loop for simplicity.",
    href: "https://store.ctr-electronics.com/products/canivore",
  },
  {
    terms: ["roboRIO", "rio"],
    title: "NI roboRIO",
    body:
      "FRC robot controller referenced in the electrical reliability notes.",
    process: "Unavoidable controller-side connections were secured, hot glued, and strain relieved.",
    href: "https://www.ni.com/en/shop/model/roborio.html",
  },
  {
    terms: ["Orange Pis", "Orange Pi"],
    title: "Orange Pi coprocessor",
    body:
      "Vision or compute coprocessor family referenced in the wiring notes.",
    process: "Unavoidable Orange Pi connections were secured and strain relieved.",
    href: "http://www.orangepi.org/",
  },
  {
    terms: ["radio"],
    title: "FRC radio",
    body:
      "Robot radio referenced in the electrical reliability notes.",
    process: "Radio connections were treated as unavoidable connections and secured accordingly.",
    href: "https://andymark.com/products/vivid-hosting-vh-109-frc-radio",
  },
  {
    terms: ["PDP 2.0", "power distribution"],
    title: "Power distribution",
    body:
      "Power distribution point referenced in the no-splice wiring practice.",
    process: "If a wire was too short, the preferred fix was to re-run it from power distribution rather than patch inline.",
    href: "https://www.revrobotics.com/rev-11-1850/",
  },
  {
    terms: ["CANcoder"],
    title: "CANcoder",
    body:
      "Absolute encoder used on the swerve modules.",
    process: "Powered through Refire adapter boards for Kraken x44 motors, with CAN kept in a drive motor -> CANcoder -> steer motor sequence.",
    href: "https://store.ctr-electronics.com/products/cancoder",
  },
  {
    terms: ["AprilTag", "AprilTags", "AprilTag localization"],
    title: "AprilTag localization",
    body:
      "Fiducial target localization used by the software stack for field pose and turret targeting.",
    process: "Referenced in the vision notes as part of the moving-shot aiming pipeline.",
    href: "https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html",
  },
  {
    terms: ["vision camera", "camera", "cameras"],
    title: "Vision camera",
    body:
      "Camera hardware used by the vision system to feed AprilTag localization and driver assistance.",
    process: "Exact camera model is left as a team-provided detail, but the glossary keeps the vision term searchable.",
    href: "https://docs.wpilib.org/en/stable/docs/software/vision-processing/introduction/what-is-vision.html",
  },
  {
    terms: ["PathPlanner", "path planning"],
    title: "PathPlanner",
    body:
      "Common FRC autonomous path planning tool referenced by the robot software notes.",
    process: "Used as the mental model for path state, moving-shot routines, and autonomous scoring.",
    href: "https://pathplanner.dev/",
  },
  {
    terms: ["3M 8005"],
    title: "3M 8005 adhesive",
    body:
      "Adhesive used to laminate two SRPP sheets into one thicker rack blank.",
    process: "Sanded, acetone-cleaned SRPP was aligned and clamped with bolts and pan-head washers for 24 hours.",
    href: "https://www.amazon.com/s?k=3M+8005+adhesive",
  },
  {
    terms: ["Loctite HY 4070", "HY 4070"],
    title: "Loctite HY 4070",
    body:
      "Hybrid adhesive used to bond printed end caps to carbon fiber transfer rollers.",
    process: "Bond surfaces were sanded, cleaned with acetone, glued, and held with gaff tape while curing.",
    href: "https://www.amazon.com/s?k=Loctite+HY+4070",
  },
  {
    terms: ["red Loctite", "blue Loctite", "Loctite"],
    title: "Threadlocker",
    body:
      "Red Loctite was used for permanent retention; blue Loctite was used for serviceable hardware.",
    process: "Critical tapped shaft ends and high-risk fasteners were threadlocked, and bolts were marked for inspection.",
    href: "https://www.amazon.com/s?k=loctite+threadlocker+red+blue",
  },
  {
    terms: ["FoamByMail 3 lb cross-linked closed-cell foam", "FoamByMail"],
    title: "FoamByMail bumper foam",
    body:
      "3 lb cross-linked closed-cell foam used in the structural bumper package.",
    process: "Cut down to size, then paired with welded aluminum backers and riveted fabric.",
    href: "https://www.foambymail.com/cross-linked-polyethylene-foam.html",
  },
  {
    terms: ["WCP hex-lite", "hex-lite shaft", "hex-lite shafts", "hex lite"],
    title: "WCP Hex Lite shaft",
    body:
      "Lightweight hex shaft stock used on the kicker and hopper-wall structure.",
    process: "Used as 3/8 inch hex-lite shafts across intake and hopper features.",
    href: "https://wcproducts.com/products/shaft-stock",
  },
  {
    terms: ["WCP hollow hex", "hollow hex", "hollow hex shafts"],
    title: "WCP hollow hex",
    body:
      "Hollow hex shaft stock used where snap-ring retained shafts simplified the turret and hood package.",
    process: "Turned down to length with snap rings at the ends.",
    href: "https://wcproducts.com/products/shaft-stock",
  },
  {
    terms: ["WCP nut strips", "nut strips", "Nut Strips"],
    title: "WCP nut strips",
    body:
      "Threaded strips used to join panels and rails at 90 degree interfaces without loose nuts.",
    process: "Used on hopper wall panels and frame rail joints with Loctited button heads.",
    href: "https://wcproducts.com/products/nut-strips",
  },
  {
    terms: ["WCP smoked polycarbonate", "smoked polycarbonate", "polycarbonate plates", "polycarbonate sheet"],
    title: "WCP smoked polycarbonate",
    body:
      "Smoked polycarbonate sheet used for lightweight panels, covers, pans, and clear-ish robot protection.",
    process: "The robot also used plain polycarbonate for the dye rotor bowl and bumper pan.",
    href: "https://wcproducts.com/products/plastic-sheet-tube",
  },
  {
    terms: ["polycarbonate rollers", "polycarbonate tubes", "McMaster-Carr", "McMaster"],
    title: "McMaster polycarbonate tube",
    body:
      "Polycarbonate tube stock used for the intake dead-axle rollers.",
    process: "The intake rollers use 2-1/16 inch long, 1-7/8 inch ID, 2 inch OD tube sections.",
    href: "https://www.mcmaster.com/polycarbonate-tubes/",
  },
  {
    terms: ["carbon fiber transfer roller", "carbon fiber tubes", "carbon fiber rods", "carbon fiber"],
    title: "WCP carbon fiber tube",
    body:
      "Carbon fiber tube and rod stock used for torque transfer and lightweight turret plate support.",
    process: "Transfer-roller end caps were bonded to sanded, acetone-cleaned carbon fiber with Loctite HY 4070.",
    href: "https://wcproducts.com/products/carbon-fiber-tubing",
  },
  {
    terms: ["WCP x-contact bearings", "x-contact bearings", "x-contact bearing"],
    title: "WCP X-contact bearings",
    body:
      "Large contact bearings used to make the dye rotor compact and coaxial.",
    process: "Three WCP 4.5 inch x-contact bearings support the coaxial dye rotor architecture.",
    href: "https://wcproducts.com/products/wcp-1111",
  },
  {
    terms: ["Swyft Robotics hex bearings", "hex bearings", "hex bearing"],
    title: "Swyft Robotics hex bearings",
    body:
      "All hex bearings on Icarus 2.0 were Swyft Robotics hex bearings.",
    process: "Used wherever the robot needed hex-bore bearing support.",
    href: "https://swyftrobotics.com/",
  },
  {
    terms: ["pocketed aluminum gears", "WCP gears", "aluminum gears"],
    title: "WCP pocketed aluminum gears",
    body:
      "Aluminum gears used where low backlash, low weight, and clean packaging mattered.",
    process: "The robot favors pocketed aluminum gears and large final-stage reductions over planetary gearboxes.",
    href: "https://wcproducts.com/products/aluminum-hex-bore-gears",
  },
  {
    terms: ["10 mm HTD belts", "HTD belts"],
    title: "10 mm HTD belt preference",
    body:
      "Preferred belt style for this robot when the mechanism could avoid chain and sprocket packaging.",
    process: "Chosen for simplicity, low backlash, and packaging confidence.",
    href: "https://wcproducts.com/collections/belts-chain-gears",
  },
  {
    terms: ["Thrifty Bot shooter wheels", "shoot wheels", "shooter wheels", "3 inch 45A"],
    title: "Thrifty Bot shooter wheels",
    body:
      "3 inch 45A shooter wheels used in the turret shooter.",
    process: "Four wheels are paired with custom brass flywheels and Thrifty Bot inertia disks.",
    href: "https://www.thethriftybot.com/products/3-inch-solid-urethane-wheel-45a-durometer",
  },
  {
    terms: ["Thrifty Bot sushi rollers", "sushi rollers", "1 inch 45A"],
    title: "Thrifty Bot sushi rollers",
    body:
      "1 inch 45A sushi rollers used as the back hood rollers in the shooter.",
    process: "The hood uses two rows of four 1 inch rollers.",
    href: "https://www.thethriftybot.com/products/qty-10-1-inch-solid-urethane-wheel-45a-durometer",
  },
  {
    terms: ["Thrifty Bot inertia disks", "inertia disks"],
    title: "Thrifty Bot inertia disks",
    body:
      "Flywheel inertia disks placed inside the shooter wheels to increase shooter energy storage.",
    process: "Four disks were used alongside two custom brass inertia flywheels.",
    href: "https://www.thethriftybot.com/products/3-flywheel-mass-disc-kit",
  },
  {
    terms: ["WCP 2 inch compliant wheel", "2 inch WCP 45A compliant wheel", "horizontal feed roller"],
    title: "WCP 2 inch 45A compliant wheel",
    body:
      "The horizontal dye rotor feed roller uses one 2 inch WCP 45A compliant wheel.",
    process: "Fuel follows a C-shaped path around this wheel for longer contact before entering the rotor.",
    href: "https://wcproducts.com/products/star-flex-wheels",
  },
  {
    terms: ["WCP 3 inch compliant wheels", "3 inch WCP 45A compliant wheels", "vertical feed roller"],
    title: "WCP 3 inch 45A compliant wheels",
    body:
      "The vertical dye rotor feed roller uses three stacked 3 inch WCP 45A compliant wheels.",
    process: "The wheels were cut down to about 1.5 inches wide for the compact feed stack.",
    href: "https://wcproducts.com/products/star-flex-wheels",
  },
  {
    terms: ["surgical tubing"],
    title: "Surgical tubing",
    body:
      "Elastic tubing used to deploy the 254-style kicker.",
    process: "Zip-tied between kicker plates and intake side plates.",
    href: "https://www.amazon.com/s?k=surgical+tubing",
  },
  {
    terms: ["athletic jersey mesh", "jersey mesh"],
    title: "Athletic jersey mesh",
    body:
      "Mesh fabric used for the final intake hopper net after the first version used extra black bumper fabric.",
    process: "Sewn into a half-box shape and reinforced at zip-tie locations.",
    href: "https://www.amazon.com/s?k=athletic+jersey+mesh+fabric",
  },
  {
    terms: ["144 pixels per meter", "LED strips", "LEDs"],
    title: "144 pixels-per-meter LED strip",
    body:
      "Dense addressable LED strip used for disabled, autonomous, teleop, and shift-state feedback.",
    process: "Mounted in 3D printed Bambu PLA Matte holders with snap-in diffuser slots.",
    href: "https://www.amazon.com/s?k=144+pixels+per+meter+led+strip",
  },
  {
    terms: ["heat-set threaded inserts", "heat-set inserts"],
    title: "Heat-set threaded inserts",
    body:
      "Threaded inserts melted into printed pulley end caps so button-head bolts could mount them to polycarbonate rollers.",
    process: "Each pulley end cap uses two inserts.",
    href: "https://www.mcmaster.com/heat-set-inserts/",
  },
  {
    terms: ["button-head bolts", "button heads"],
    title: "Button-head hardware",
    body:
      "Low-profile button-head bolts used throughout the intake rollers, hopper walls, and panel joints.",
    process: "Some bolt locations used electrical tape wraps or Loctite to keep hardware from backing out.",
    href: "https://www.mcmaster.com/button-head-cap-screws/",
  },
  {
    terms: ["electrical tape"],
    title: "Electrical tape",
    body:
      "Tape used as a small retention aid around pulley mounting bolts.",
    process: "One or two wraps helped keep roller hardware from backing out.",
    href: "https://www.amazon.com/s?k=electrical+tape",
  },
  {
    terms: ["pan-head washers", "pan head washers"],
    title: "Pan-head washers",
    body:
      "Washers used with bolts to align and clamp laminated SRPP rack blanks.",
    process: "Provided clamping force during the 24 hour 3M 8005 adhesive cure.",
    href: "https://www.mcmaster.com/washers/",
  },
  {
    terms: ["solder seal", "adhesive heat shrink", "heat shrink"],
    title: "Sealed wire repair materials",
    body:
      "Electrical sealing materials used only where a connection was unavoidable.",
    process: "Connections were soldered with solder seal, then covered with adhesive heat shrink for strain relief and sealing.",
    href: "https://www.amazon.com/s?k=solder+seal+wire+connectors+adhesive+heat+shrink",
  },
  {
    terms: ["hot glue", "hot glued"],
    title: "Hot glue strain relief",
    body:
      "Hot glue was used to secure unavoidable electrical connections at controllers, radios, coprocessors, and CAN hardware.",
    process: "Used with proper strain relief rather than as a substitute for good wiring.",
    href: "https://www.amazon.com/s?k=hot+glue+sticks",
  },
  {
    terms: ["snap rings", "snap ring"],
    title: "Snap rings",
    body:
      "Retaining rings used with turned WCP hollow hex shafts.",
    process: "Used at shaft ends to keep hood and turret hardware retained cleanly.",
    href: "https://wcproducts.com/products/shaft-stock",
  },
  {
    terms: ["battery mount", "battery-retention plate", "battery"],
    title: "Battery mounting package",
    body:
      "Battery retention evolved through the season as the bumper pan allowed weight and service improvements.",
    process: "The dye rotor bowl mounted partly to the battery mount, and the old battery-retention plate was removed after the bumper pan was added.",
    href: "https://www.mkbattery.com/",
  },
  {
    terms: ["crimp", "crimps", "14 AWG terminals", "terminals"],
    title: "Crimp terminals",
    body:
      "Power and CAN wires were terminated with properly sized crimp terminals, including special 14 AWG terminals for Kraken motor wiring.",
    process: "Every crimp was pull-tested and checked regularly between competitions.",
    href: "https://www.mcmaster.com/electrical-wire-terminals/",
  },
  {
    terms: ["gaff tape"],
    title: "Gaff tape",
    body:
      "Temporary holding tape used while carbon fiber transfer roller end caps cured.",
    process: "Used after sanding, acetone cleaning, and applying Loctite HY 4070.",
    href: "https://www.amazon.com/s?k=gaff+tape",
  },
  {
    terms: ["zip ties", "zip-tie", "zip-tied"],
    title: "Zip ties",
    body:
      "Simple retention hardware used on the net, kicker tubing, and wire management.",
    process: "Net zip-tie locations were reinforced with sewing to prevent tearing.",
    href: "https://www.mcmaster.com/cable-ties/",
  },
  {
    terms: ["rack and pinion", "rack-and-pinion"],
    title: "Rack-and-pinion deployment",
    body:
      "Linear gear deployment used on the intakes so they could compress inward during side impacts.",
    process: "Chosen because it kept the intakes compact and avoided extra pivot joints.",
  },
  {
    terms: ["dead-axle roller", "dead axle roller", "dead-axle rollers"],
    title: "Dead-axle roller",
    body:
      "Roller architecture where the tube spins on bearings around fixed stub axles instead of spinning a full-length live axle.",
    process: "Kept the intake rollers compact and serviceable.",
  },
  {
    terms: ["stub axle", "stub axles"],
    title: "Stub axle",
    body:
      "Short axle sections turned from 1/2 inch hex down to 0.375 inch bearing diameter.",
    process: "The remaining 0.125 inch of hex gave a flat wrench surface for mounting.",
  },
  {
    terms: ["kicker", "254-style kicker"],
    title: "254-style kicker",
    body:
      "Deployable intake kicker inspired by common high-speed FRC intake architecture.",
    process: "Built from 1/4 inch SRPP plates, WCP hex-lite shafts, and surgical tubing deployment.",
  },
  {
    terms: ["hopper walls", "intake hopper walls"],
    title: "Intake hopper walls",
    body:
      "Side panels that keep collected fuel moving toward the indexer instead of escaping or hanging up.",
    process: "The final version moved from cracked, flimsy 1/16 inch bent polycarbonate to 1/8 inch SRPP.",
  },
  {
    terms: ["hopper net", "intake hopper net", "half-box"],
    title: "Half-box hopper net",
    body:
      "Sewn net that forms a box-like pocket as fuel loads into the robot, maximizing capacity without elastic complexity.",
    process: "Mounted to the top plate and front hex-lite shaft with reinforced zip-tie points.",
  },
  {
    terms: ["inverted pancake turret"],
    title: "Inverted pancake turret",
    body:
      "Low-profile turret architecture that keeps the shooter compact while allowing the robot to aim independently of chassis heading.",
    process: "Uses an 18 inch ring gear, compact cable sleeve path, and active hood/shooter package.",
  },
  {
    terms: ["coaxial dye rotor", "dye rotor", "indexer"],
    title: "Coaxial dye rotor indexer",
    body:
      "The dye rotor is the robot's indexer, not just a buffer: it moves fuel from the hopper path into controlled shooter entry.",
    process: "Hook and feed systems are powered separately, chain-driven under the rotor, and supported by x-contact bearings.",
  },
  {
    terms: ["C-shaped path", "C shape", "C-shaped fuel path"],
    title: "C-shaped feed path",
    body:
      "Fuel wraps around the horizontal feed wheel longer before moving up into the rotor.",
    process: "The extra contact time improves feed authority in the compact dye rotor.",
  },
  {
    terms: ["hood"],
    title: "Shooter hood",
    body:
      "Adjustable hood package that sets shot angle for the turret shooter.",
    process: "Powered by a Kraken X44 through a rack drive with shim tape used for low backlash.",
  },
  {
    terms: ["shim tape"],
    title: "Shim tape",
    body:
      "Thin material wrapped on shafts to reduce play and backlash in critical mechanisms.",
    process: "Used on turret rotation and hood shafts where accurate aiming mattered.",
  },
  {
    terms: ["homing sequence", "homing"],
    title: "Homing sequence",
    body:
      "A recovery routine that re-zeroes an intake or hood if the built-in motor encoder position drifts after impact or belt skip.",
    process: "Used because the robot normally starts from known zero positions.",
  },
  {
    terms: ["bellypan"],
    title: "Structural bellypan",
    body:
      "Bottom plate that carries electronics and ties the frame together.",
    process: "The final bellypan includes an electronics hole pattern and a recessed pocket for the dye rotor bearing.",
  },
  {
    terms: ["bumper pan"],
    title: "Polycarbonate bumper pan",
    body:
      "A 1/8 inch polycarbonate pan added to the bumper package mid-season.",
    process: "Helped with bump traversal and let the team remove an old battery-retention plate to make weight.",
  },
  {
    terms: ["shielded CAN", "CAN wiring", "CAN bus"],
    title: "Shielded CAN wiring",
    body:
      "CAN bus wiring with shielding used outside the drive base after Week Zero.",
    process: "Part of the team's no-connections, strain-relieved electrical reliability approach.",
  },
  {
    terms: ["daisy chaining", "daisy chain"],
    title: "CAN daisy chaining",
    body:
      "Preferred CAN wiring topology for this robot because it keeps debugging simpler than star-style wiring.",
    process: "Drive modules used a drive motor -> CANcoder -> steer motor path.",
  },
  {
    terms: ["Cylon animation", "Cylon"],
    title: "Cylon LED animation",
    body:
      "Scanning LED pattern used to indicate the robot is enabled in autonomous.",
    process: "One of several LED state patterns shown in the LED patterns tab.",
  },
  {
    terms: ["Dyneema"],
    title: "Dyneema",
    body:
      "High-strength rope material recommended in the field notes for any future rope mechanism.",
    process: "Not central to this no-climb final robot, but kept as a design rule.",
    href: "https://www.amazon.com/s?k=dyneema+rope",
  },
]

export const fullRobotDeepDive: MechanismDeepDive = {
  id: "full",
  title: "Icarus 2.0 Architecture",
  kicker:
    "A scoring-first robot built from CNC SRPP, mostly 6061 aluminum, low-backlash mechanisms, and competition-proven wiring habits.",
  image: "/media/icarus-version-2.png",
  imageAlt: "Icarus 2.0 CAD overview",
  stats: [
    { label: "Core materials", value: "6061 + SRPP" },
    { label: "Drivetrain", value: "4 SDS MK5n modules" },
    { label: "Architecture", value: "Dual intake + turret" },
    { label: "Indexer", value: "Coaxial dye rotor" },
  ],
  panelBullets: [
    "All SRPP was purchased from West Coast Products and CNC machined.",
    "All aluminum is 6061 from Metal Supermarkets unless a subsystem note calls out a different alloy.",
    "The final architecture concentrates weight and packaging around intake reach, a compact indexer, and moving-shot scoring.",
  ],
  tabs: {
    overview: [
      {
        title: "Robot philosophy",
        bullets: [
          "Icarus 2.0 prioritizes fuel acquisition, indexing, and shooting instead of climb hardware.",
          "The rack-and-pinion intakes, coaxial dye rotor indexer, and inverted pancake turret were treated as one continuous scoring path.",
          "The robot was designed with season-long iteration in mind, leaving room to rework mechanisms without throwing away the whole package.",
        ],
      },
      {
        title: "Baseline rules",
        bullets: [
          "All SRPP came from West Coast Products and was CNC machined.",
          "All aluminum is 6061 from Metal Supermarkets unless otherwise specified.",
          "The robot leans on pocketed plates, half-pocketed shells, stub axles, hollow hex with snap rings, and standardized hardware.",
        ],
      },
    ],
    materials: [
      {
        title: "Common material stack",
        bullets: [
          "Metal Supermarkets 6061 aluminum handles most machined and water-jetted plate structure.",
          "SRPP is used for racks, intake plates, hopper walls, hood parts, and contact-prone mechanism details.",
          "Polycarbonate remains useful for bowls, pans, covers, and low-mass sheet parts where transparency or bendability helps.",
          "Printed Bambu PETG-CF, Bambu PLA Tough+, Bambu PLA Matte, Overture 95A TPU, and Formlabs Tough 1500 fill packaging and iteration roles.",
        ],
      },
      {
        title: "COTS and adhesives",
        bullets: [
          "WCP hardware appears throughout the robot: SRPP, nut strips, hex-lite shafts, compliant wheels, and x-contact bearings.",
          "All hex bearings were Swyft Robotics hex bearings.",
          "3M 8005 laminated the SRPP racks, and Loctite HY 4070 bonded carbon fiber transfer roller end caps.",
          "Red Loctite was used where the team wanted permanent retention; blue Loctite was used on serviceable bumper and hopper hardware.",
        ],
      },
    ],
    build: [
      {
        title: "Electrical reliability practices",
        bullets: [
          "For two seasons, the team had zero competition electrical issues from CAN wire breaks or motor power loss, ignoring collision damage.",
          "The wiring rule was NO CONNECTIONS: if a wire was too short, it was re-run from the PDP 2.0 rather than patched inline.",
          "Unavoidable connections at the Pigeon, Orange Pis, radio, roboRIO, and CANivore were soldered or secured, hot glued, and properly strain relieved.",
          "After Week Zero, everything except the drive base moved to shielded CAN.",
          "Every crimp was pull-tested and checked regularly between competitions.",
        ],
      },
    ],
    development: [
      {
        title: "Architecture lock",
        bullets: [
          "The final robot settled around dual side acquisition, a compact coaxial dye rotor indexer, and a low-profile turret instead of a climber.",
          "The package kept the drivetrain, electronics, indexer, and turret serviceable while preserving as much fuel volume as possible.",
        ],
      },
      {
        title: "Weight and service iteration",
        bullets: [
          "Pocketing, half-pocketing, and removing low-value structure became the main weight-control tools.",
          "The bumper pan and no-climb tradeoff opened up enough weight and package space to keep the scoring system reliable.",
        ],
      },
      {
        title: "Championship release",
        bullets: [
          "The final public CAD shows the scoring-first architecture after the rebuild, district tuning, and championship packaging pass.",
          "Future picture slot: final full robot CAD render, final pit photo, and one annotated underside/serviceability image.",
        ],
      },
    ],
    leds: [
      {
        title: "Disabled states",
        bullets: [
          "Rainbow means the robot is disabled and all is good.",
          "Flashing red means the robot is disabled and the battery voltage is below the desired threshold: 12.4 V at competitions and 12.1 V in testing.",
        ],
      },
      {
        title: "Match states",
        bullets: [
          "A Cylon animation means the robot is enabled in autonomous.",
          "In teleop, the LEDs show shift progress bars.",
          "Purple means transition/endgame, blue means active, and red means inactive.",
          "When two active periods are next to each other, the lights combine the sections and show purple plus blue.",
          "The lights flash when a shift change is coming.",
        ],
      },
    ],
  },
}

export const mechanismDeepDives: Record<string, MechanismDeepDive> = {
  "dual-intake": {
    id: "dual-intake",
    title: "Dual Intakes",
    kicker:
      "Two compact side intakes using rack-and-pinion deployment, dead-axle rollers, SRPP hopper walls, and a sewn half-box fuel net.",
    image: "/media/icarus-version-2.png",
    imageAlt: "Dual intake CAD still",
    stats: [
      { label: "Deploy", value: "One Kraken x44 each" },
      { label: "Feed", value: "One Kraken x60 each" },
      { label: "Deploy ratio", value: "2.91:1" },
      { label: "Feed ratio", value: "2.27:1" },
    ],
    panelBullets: [
      "Rack-and-pinion deployment lets each intake compress inward on side impacts without adding a bunch of pivot joints.",
      "Each side packages a Kraken x44 deploy motor, Kraken x60 feed motor, dead-axle polycarbonate rollers, a kicker, hopper walls, and a sewn net.",
      "Both intakes only take up about 1.3 inches of space on each side of the robot when closed.",
    ],
    tabs: {
      overview: [
        {
          title: "Design intent",
          bullets: [
            "The dual intakes were built for aggressive cycle speeds and easy collection from either side of the robot.",
            "Rack and pinion was chosen because it can compress inward on impact and avoids a mechanism full of pivot joints.",
            "The motor spacing was designed to work with both rollers or, if all spare rollers were gone, only the bottom roller with a longer belt.",
          ],
        },
        {
          title: "Competition result",
          bullets: [
            "The same four intake plates ran at all four competitions with no rack tooth chipping.",
            "A homing sequence let the intake recover if the zero position moved because a belt skipped on impact.",
            "The intakes stayed compact enough that the two sides only consumed about 1.3 inches per side when closed.",
          ],
        },
      ],
      materials: [
        {
          title: "Racks and plates",
          bullets: [
            "The racks are 3/8 inch, 10 DP SRPP racks made from two CNC-cut 3/16 inch SRPP sheets laminated with 3M 8005.",
            "All SRPP was purchased from West Coast Products and CNC machined.",
            "The kicker plates were CNC cut from 1/4 inch SRPP.",
            "The final hopper walls are 1/8 inch SRPP after 1/16 inch bent polycarbonate proved too flimsy, cracked easily, and caught on the other intake.",
          ],
        },
        {
          title: "Rollers and printed parts",
          bullets: [
            "Dead-axle rollers use 2-1/16 inch long, 1-7/8 inch ID, 2 inch OD polycarbonate rollers from McMaster-Carr.",
            "Upper roller pulley end caps were 3D printed from Bambu PETG-CF.",
            "Lower, more impact-prone roller pulley end caps were 3D printed from Overture 95A TPU.",
            "Each pulley end cap uses two heat-set threaded inserts and button-head bolts into the polycarbonate roller.",
            "For part simplification, all rollers used the same pulley end caps even when a pulley was not required.",
          ],
        },
        {
          title: "Transfer roller, net, and hardware",
          bullets: [
            "The carbon fiber transfer roller/jackshaft moves torque between both sides of each intake.",
            "Transfer roller end caps were 3D printed from Formlabs Tough 1500 resin and bonded to the carbon fiber with Loctite HY 4070.",
            "The intake hopper net started as black bumper fabric, then became athletic jersey mesh from Amazon sewn into a half-box shape.",
            "WCP nut strips join the hopper wall panels at 90 degree angles with blue-Loctited button heads.",
            "A WCP 3/8 inch hex-lite shaft runs across the bottom of the front hopper wall for rigidity and to keep fuel out of the gap near the intake roller.",
          ],
        },
      ],
      build: [
        {
          title: "Rack lamination",
          bullets: [
            "The SRPP bonding surfaces were lightly sanded with 80 grit sandpaper while being careful not to tear the SRPP fibers.",
            "The sanded SRPP was cleaned with acetone before gluing.",
            "Bolts and pan-head washers were used for alignment and clamping force while the 3M 8005 cured for 24 hours.",
          ],
        },
        {
          title: "Roller and axle details",
          bullets: [
            "Stub axles were turned from 1/2 inch hex shaft down to 0.375 inch bearing diameter for the two bearings inside the stub axle.",
            "The turned axles leave 0.125 inch of hex so a flat hex wrench can be used during mounting.",
            "A button head and washer on the inside keep the stub axle from falling out, and the hardware is red-Loctited.",
            "A wrap or two of electrical tape around pulley mounting bolts helped keep them from backing out.",
          ],
        },
        {
          title: "Actuation and feed",
          bullets: [
            "Each intake deploys with one Kraken x44 geared about 2.91:1 before the rack and pinion: 17:50 on the small intake and 17:49 on the large intake.",
            "The intake uses the built-in motor encoder for position, starting with intakes in at zero.",
            "Each intake roller is powered by one Kraken x60 geared about 2.27:1 with a 15:34 ratio.",
          ],
        },
        {
          title: "Kicker and net",
          bullets: [
            "The kicker is a 254-style kicker with two WCP 3/8 inch hex-lite shafts spanning the sides.",
            "Bolts were red-Loctited into the tapped shaft ends.",
            "Surgical tubing was zip-tied to the kicker plates and intake side plates for deployment.",
            "The net is mounted to the top plate and the 3/8 inch hex-lite shaft along the front of the intake with zip ties.",
            "Every zip-tie location on the net was reinforced with sewing to prevent tearing.",
            "The net is not elastic so drivers do not have to worry about whether the robot can fit under the trench.",
          ],
        },
      ],
      development: [
        {
          title: "Prototype walls",
          bullets: [
            "Early hopper walls were 1/16 inch bent polycarbonate.",
            "They were too flimsy, got caught on the other intake too often, and cracked too easily.",
          ],
        },
        {
          title: "SRPP solve",
          bullets: [
            "The final 1/8 inch SRPP hopper walls solved the stiffness and interference issues.",
            "Nut strips let the panels join cleanly at 90 degrees without loose nuts.",
          ],
        },
        {
          title: "Competition validation",
          bullets: [
            "The same four intake plates ran at all four competitions with no rack tooth chipping.",
            "Future picture slot: early polycarbonate wall, final SRPP wall, rack closeup, roller/stub axle detail, and sewn net shape under load.",
          ],
        },
      ],
    },
  },
  turret: {
    id: "turret",
    title: "Turret Shooter",
    kicker:
      "A low-profile active turret with an 18 inch ring gear, compact cable sleeve path, high-inertia shooter, SRPP hood, and UHMW feed stabilizer.",
    image: "/media/turret-teaser.png",
    imageAlt: "Turret CAD still",
    stats: [
      { label: "Ring gear", value: "18 in / 10 DP" },
      { label: "Travel", value: "420 deg" },
      { label: "Rotation", value: "Kraken x44 / 45:1" },
      { label: "Shooter", value: "Two Kraken x60 motors" },
      { label: "Hood range", value: "6.4-48 deg" },
    ],
    panelBullets: [
      "The main turret gear plate is pocketed 6061 aluminum with a 10 DP tooth pattern around an 18 inch ring gear.",
      "A Kraken x44 drives 420 degrees of turret rotation through a 45:1 reduction, with shim tape used for near-zero backlash.",
      "Two Kraken x60 motors drive the shooter and back hood rollers through a 17:15 upduction for better full-field passing.",
      "The hood moves from 6.4 degrees to 48 degrees for close shots, long shots, and full-field passing.",
    ],
    tabs: {
      overview: [
        {
          title: "Architecture",
          bullets: [
            "The inverted pancake turret keeps the shooter low while preserving space for fuel flow through the robot.",
            "The turret rotation system uses a Kraken x44, built-in motor encoder position tracking, and a constant starting zero.",
            "The turret has 420 degrees of travel so the robot gets large aiming freedom without needing true continuous rotation.",
            "The shooter, hood, and dye rotor stabilizer are packaged as one controlled feed into the turret.",
          ],
        },
      ],
      materials: [
        {
          title: "Turret ring and cable package",
          bullets: [
            "The main turret gear plate is made from pocketed 6061 aluminum and was water-jetted.",
            "The turret bearing negative was 3D printed from Bambu PLA Tough+ and bolted to the turret ring; the specific bearing callout was left as a TBD in the notes.",
            "The smaller inside cable-management ring is 3D printed and reduces the cable sleeve travel path from about 18 inches to about 12 inches.",
            "The cable sleeve runs between a 1/32 inch polycarbonate top plate and the 1/8 inch turret mounting plate.",
          ],
        },
        {
          title: "Shooter, hood, and stabilizer",
          bullets: [
            "The 17 tooth shooter pulleys were 3D printed from Bambu PLA Tough+.",
            "The shooter uses four 3 inch 45A Thrifty Bot shooter wheels and two rows of four 1 inch 45A Thrifty Bot sushi rollers as back hood wheels.",
            "The hood is cut from 1/4 inch SRPP.",
            "The hood rack is reinforced with a 1/8 inch 6061 aluminum rack riveted to the SRPP.",
            "The dye rotor stabilizer is machined from 1/2 inch UHMW for ultra-low friction.",
          ],
        },
      ],
      build: [
        {
          title: "Rotation",
          bullets: [
            "The turret ring gear diameter is 18 inches.",
            "A 10 DP gear tooth pattern is cut along the turret plate edge for rotation.",
            "The turret spins with a Kraken x44 through a 45:1 reduction using a 12 tooth to 30 tooth stage and a 10 tooth to 180 tooth stage.",
            "Shim tape was used on the shaft for near-zero backlash between the motor and turret.",
            "The turret uses the built-in motor encoder to track position from a constant zero.",
          ],
        },
        {
          title: "Cable management",
          bullets: [
            "There is no cable retraction method; the standard cable sleeve was allowed to do what it wanted, and it worked well.",
            "The bulk of the 1/8 inch turret plate was left about 0.03 inches thick.",
            "The plate could not be fully pocketed through because the cable sleeve would get caught.",
            "Two carbon fiber rods run above the 1/8 inch turret plate to keep it from flexing down in the middle.",
          ],
        },
        {
          title: "Shooter and hood drive",
          bullets: [
            "Two Kraken x60 motors are geared up about 1:1.13 using a 17 tooth to 15 tooth ratio.",
            "The upduction helps the robot make better full-field passes.",
            "Two custom brass inertia flywheels were used, one on each side.",
            "Four Thrifty Bot inertia disks were placed inside the shooter wheels; final MOI was left as a TBD in the notes.",
            "The hood is powered by a Kraken x44 geared about 3.5:1 before the rack using 14:50 and then 23:24.",
            "The hood travel range is 6.4 degrees to 48 degrees.",
            "Shim tape was used on all hood shafts for near-zero backlash.",
            "The hood starts down and can run a homing sequence if it needs to re-zero.",
            "All hex shafts are WCP hollow hex turned down to length with snap rings at the ends.",
          ],
        },
        {
          title: "Feed stabilization",
          bullets: [
            "The UHMW stabilizer clamps around the dye rotor lid.",
            "Its job is to create a clean, constant feed of fuel from the dye rotor indexer into the shooter.",
          ],
        },
      ],
      development: [
        {
          title: "Architecture shift",
          bullets: [
            "The final robot used the inverted pancake turret instead of the earlier coaxial turret concept.",
            "The lower profile preserved hopper space while keeping the shooter independently aimable.",
          ],
        },
        {
          title: "Backlash pass",
          bullets: [
            "Shim tape was used in both the turret rotation and hood drive to tighten backlash.",
            "The largest reduction was kept late in the drive path to reduce loads and improve aiming feel.",
          ],
        },
        {
          title: "Shooter tuning",
          bullets: [
            "The 17:15 upduction was kept because it improved full-field passing.",
            "Future picture slot: turret ring detail, cable sleeve path, hood rack, shooter wheel stack, and UHMW dye rotor stabilizer.",
          ],
        },
      ],
    },
  },
  "dye-rotor": {
    id: "dye-rotor",
    title: "Dye Rotor Indexer",
    kicker:
      "The dye rotor is the robot's compact coaxial indexer: separate hook and feed systems move fuel through a low bowl and into the turret.",
    image: "/media/final-icarus-starting-config.png",
    imageAlt: "Dye rotor CAD still",
    stats: [
      { label: "Bowl height", value: "1.3 in" },
      { label: "Feed motors", value: "Two Kraken x44 motors" },
      { label: "Hook ratio", value: "30:1" },
      { label: "Bearings", value: "Three WCP 4.5 in" },
    ],
    panelBullets: [
      "The dye rotor is the robot's indexer, with the base of the bowl only about 1.3 inches above the bottom of the robot.",
      "Hook and feed wheels are powered separately so fuel movement and feed timing can be tuned independently.",
      "The horizontal feed wheel uses a C-shaped fuel path for longer contact before fuel moves up into the rotor.",
    ],
    tabs: {
      overview: [
        {
          title: "Coaxial indexer",
          bullets: [
            "The dye rotor is a compact vertically coaxial indexer, with the base of the bowl sitting about 1.3 inches above the bottom of the robot.",
            "Hook and feed wheels are powered separately.",
            "Both the hook and feed are chain-driven under the rotor to keep the mechanism vertically compact.",
            "Three WCP 4.5 inch x-contact bearings allow the coaxial architecture.",
          ],
        },
      ],
      materials: [
        {
          title: "Printed and sheet components",
          bullets: [
            "The top portion of the dye rotor is 3D printed from Bambu PETG-CF.",
            "The bottom parts sandwiched between the aluminum hook plates are 3D printed from Bambu PLA Tough+.",
            "Those lower printed parts use very low infill with zero top and bottom layers.",
            "Tapped 3/8 inch hex shafts provide the bulk of the lower rotor structure.",
            "The ramp is a simple 3D printed Bambu PLA Tough+ part.",
          ],
        },
        {
          title: "Bowl and wheels",
          bullets: [
            "The bowl is two pieces of 1/8 inch polycarbonate split for easy removal.",
            "The bowl mounts to threaded inserts on the MK5n modules and the battery mount.",
            "There is no fancy funneling because there was not much room for fuel to sit on the bowl edges anyway.",
            "The vertical feed roller is three stacked 3 inch WCP 45A compliant wheels cut down to about 1.5 inches.",
            "The horizontal feed roller is one 2 inch WCP 45A compliant wheel.",
          ],
        },
      ],
      build: [
        {
          title: "Power and reductions",
          bullets: [
            "The feed wheels use two Kraken x44 motors geared roughly 1:1.",
            "The feed rollers are driven through a planetary-like gear arrangement.",
            "The hook is geared around a 30:1 ratio.",
            "Both the hook and the feed are chain-driven underneath the rotor.",
          ],
        },
        {
          title: "Fuel path",
          bullets: [
            "The horizontal feed roller moves fuel up and into the rotor.",
            "Fuel follows a C-shaped path around the horizontal wheel so it stays in contact with the feed wheel longer.",
            "The compact bowl and rotor geometry were driven by the lack of available vertical and edge storage space.",
          ],
        },
      ],
      development: [
        {
          title: "Vertical package",
          bullets: [
            "The dye rotor was pushed as low as possible; the bowl base sits about 1.3 inches above the bottom of the robot.",
            "The compact height made the coaxial bearing stack and under-rotor chain drives central to the design.",
          ],
        },
        {
          title: "Feed authority",
          bullets: [
            "The horizontal 2 inch WCP 45A compliant wheel was shaped around a C path to keep fuel in contact longer.",
            "The vertical roller uses three cut-down 3 inch WCP 45A compliant wheels to fit the feed stack.",
          ],
        },
        {
          title: "Serviceable bowl",
          bullets: [
            "The two-piece 1/8 inch polycarbonate bowl was split for easy removal.",
            "Future picture slot: lid print, under-rotor chain drive, x-contact bearing stack, C-shaped feed path, and two-piece bowl mounting.",
          ],
        },
      ],
    },
  },
  "super-structure": {
    id: "super-structure",
    title: "Superstructure",
    kicker:
      "The robot backbone combines an SDS MK5n drivetrain, structural side plates, bellypan support, welded bumpers, and competition-readable LED states.",
    image: "/media/frame-cad.png",
    imageAlt: "Superstructure CAD still",
    stats: [
      { label: "Modules", value: "4 SDS MK5n modules" },
      { label: "Drive", value: "Kraken x60" },
      { label: "Steer", value: "Kraken x44" },
      { label: "Side plates", value: "1/4 in" },
    ],
    panelBullets: [
      "The drivetrain uses four SDS MK5n modules with Kraken x60 drive motors and Kraken x44 steering motors on the R1 ratio.",
      "The frame combines 1/16 inch 2x1 box tube on intake sides, 1/4 inch side plates, and a 1/8 inch bellypan.",
      "The bumpers became part of the superstructure, including welded aluminum backers, cross-linked foam, and a polycarbonate bumper pan.",
    ],
    tabs: {
      overview: [
        {
          title: "Backbone",
          bullets: [
            "The drivetrain uses four SDS MK5n modules with Kraken x60 motors as drive motors and four Kraken x44 motors as steering motors.",
            "Refire adapter boards for Kraken x44 motors power the CANcoders, and all wires are directly soldered to the boards.",
            "The CAN loop was never split off on the drive modules; it runs drive motor -> CANcoder -> steer motor.",
            "The final ratio is the R1 gear ratio.",
          ],
        },
      ],
      materials: [
        {
          title: "Frame and side plates",
          bullets: [
            "All 6061 aluminum was purchased from Metal Supermarkets unless another alloy is called out.",
            "Along the intake sides, the frame uses 1/16 inch 2x1 box tube.",
            "Along the non-intake sides, a 2 inch tall by 0.25 inch frame rail runs between the swerve modules.",
            "Those rails mount with WCP nut strips and red Loctite.",
            "The 1/4 inch side plates form the bulk of the robot structure and support both intakes and the turret mounting plate.",
            "The 1/8 inch structural bellypan has an electronics mounting hole pattern and a recessed pocket for the dye rotor bearing.",
            "1/16 inch 1x1 box tube rails span the middle of the robot to keep the bellypan from sagging under the dye rotor weight.",
          ],
        },
        {
          title: "Bumpers and LED hardware",
          bullets: [
            "The bumpers use FoamByMail 3 lb cross-linked closed-cell foam cut down to size.",
            "The bumper back plates were CNC machined from 3033 aluminum.",
            "The team originally planned to bend the 3000-series backers, but pivoted to welding because a brake of the right length was not available.",
            "Machining 3000-series aluminum was brutal because it was soft, gummy, and gummed up cutters easily.",
            "LEDs are 144 pixels-per-meter strips from Amazon mounted in 3D printed Bambu PLA Matte holders with snap-in diffuser slots.",
            "All hex bearings were Swyft Robotics hex bearings.",
          ],
        },
      ],
      build: [
        {
          title: "Side plate iteration",
          bullets: [
            "Version 1 side plates were CNC machined and took about 4.5 hours each.",
            "Version 2 side plates were water-jetted, saving a bunch of fabrication time.",
            "The 1/4 inch side plates made more sense when the robot still had two intakes and a climber, because all of that only took 1.3 inches per side.",
            "Even after the climb was removed, the 1/4 inch plates still acted as key structure for intakes and the turret plate.",
            "The final weight for each side plate was a little over 4 pounds.",
          ],
        },
        {
          title: "Bumper package",
          bullets: [
            "The welded aluminum bumper backers were wrapped in fabric and the fabric was riveted to the metal backer.",
            "Halfway through the season, a 1/8 inch polycarbonate bumper pan was added.",
            "The bumper pan made going over the bump easier and let the team remove the old battery-retention plate.",
            "Letting the battery rest on the bumper pan helped the robot make weight.",
            "Bumpers mount with two 3 inch bolts through the box tube and nuts on the other side.",
            "Rivnuts were tried first and failed quickly.",
            "The robot had to be flipped to change bumpers, but a full bumper change could still happen in under a minute with the robot back upright.",
          ],
        },
      ],
      development: [
        {
          title: "Side plate V1",
          bullets: [
            "Version 1 side plates were CNC machined and took about 4.5 hours each.",
            "The thick plates made sense while the robot still carried two intakes and a climber in very little side space.",
          ],
        },
        {
          title: "Side plate V2",
          bullets: [
            "Version 2 side plates were water-jetted to save fabrication time.",
            "The final plates stayed as structure for both intakes and the turret mounting plate even after the climber was removed.",
          ],
        },
        {
          title: "Bumper evolution",
          bullets: [
            "Rivnuts failed quickly, so the final bumpers used two 3 inch bolts through the box tube with nuts on the other side.",
            "The mid-season polycarbonate bumper pan improved bump traversal and helped the robot make weight.",
            "Future picture slot: side plate V1/V2 comparison, welded bumper backer, bumper pan underside, bellypan pocket, and LED holder/diffuser.",
          ],
        },
      ],
      leds: [
        {
          title: "Disabled states",
          bullets: [
            "Rainbow means the robot is disabled and all is good.",
            "Flashing red means the robot is disabled and the battery voltage is below the desired threshold: 12.4 V at competitions and 12.1 V in testing.",
          ],
        },
        {
          title: "Auto and teleop states",
          bullets: [
            "A Cylon animation means the robot is enabled in autonomous.",
            "In teleop, the LEDs show shift progress bars.",
            "Purple means transition/endgame, blue means active, and red means inactive.",
            "When two active periods are next to each other, the lights combine the sections and show purple plus blue.",
            "The lights flash when a shift change is coming.",
          ],
        },
      ],
    },
  },
}

export const mechanismPanelNotes: Record<string, string[]> = Object.fromEntries(
  Object.entries(mechanismDeepDives).map(([id, dive]) => [id, dive.panelBullets])
)

export const loganFieldNotes: DetailSection[] = [
  {
    title: "Reliability and inspection",
    bullets: [
      "Reliability is the most important thing.",
      "Design built-in redundancy when possible.",
      "System checks are super important; do them immediately after a match so there is time to fix anything you catch.",
      "System checks should include bolt, belt, and mechanical checks.",
      "Most 3D printed parts were replaced between competitions.",
      "Mark all bolts with a paint marker so you can quickly see if they are backing out.",
      "Label wires and cable manage with zip ties or Velcro ties.",
      "Take the time to do it right, even if it is the second, third, or fifth time.",
    ],
  },
  {
    title: "Materials and manufacturing",
    bullets: [
      "If choosing between SRPP and polycarbonate, SRPP wins most of the time because the material properties outweigh the cost.",
      "Not worrying about getting Loctite on SRPP is very nice.",
      "Pocket everything: ounces make pounds.",
      "Thick material plus shell pocketing is overpowered, like the dye rotor stabilizer.",
      "Half-pocketing is overpowered; leaving a thin shell, even about 0.030 inch, can be plenty.",
      "CAD parts with the intended manufacturing technique in mind.",
      "Create processes to remount parts accurately on the CNC if they need to be adjusted or pocketed more later.",
      "Bent sheet metal tech is where it is at, even though this robot did not fully get to use it.",
    ],
  },
  {
    title: "Mechanism preferences",
    bullets: [
      "Use pocketed aluminum gears wherever a gear is needed.",
      "Use shim tape on hex shafts where low backlash matters.",
      "For low-backlash mechanisms, make the final stage the largest reduction so the rest of the system sees less force.",
      "No planetary gearboxes when weight and backlash matter.",
      "10 mm HTD belts are the move.",
      "Nut strips are great for 90 degree joints.",
      "No long hex shaft runs because they flex and bend too much.",
      "Stub axle rollers are incredible.",
      "Hollow hex plus snap rings is the tech.",
      "Hard stops are very nice.",
      "No pneumatics.",
      "Single-pivot pivoting joints are tough; avoid them when possible.",
    ],
  },
  {
    title: "Electrical practices",
    bullets: [
      "NO CONNECTIONS: if a wire has to be extended, re-run it instead of splicing it wherever possible.",
      "If a connection is unavoidable, solder it, use adhesive heat shrink, hot glue it when appropriate, and strain-relieve it properly.",
      "Be mindful of CAN wire runs; star topology makes debugging more difficult, so daisy chaining is preferred.",
      "Every crimp should be pull-tested and checked regularly.",
      "Strain relief should be placed on most motors so nothing can be pulled out.",
      "Cable chain causes more problems than it is worth.",
    ],
  },
  {
    title: "Competition and design philosophy",
    bullets: [
      "Function over form; mechanical beauty is always better.",
      "Do not reinvent what is already working.",
      "Try the simple solution because it might work.",
      "Do not be afraid to do the thing no one else is doing.",
      "To be competitive, stay ahead of where the game is going; when teams were getting 10 BPS, the target moved to 15.",
      "Software can fix a lot, but the default solution should be a mechanical solution.",
      "Code needs time, so work with coders on a fair timeline.",
      "One driver and two coaches is the move 90% of the time.",
      "Set reasonable goals with the team's capabilities in mind.",
      "CAD everything.",
      "Krakens are the way.",
      "If there is rope on the robot, it should be Dyneema.",
      "If you have the money, buy parts as you start the design so fabrication and assembly can begin when CAD is done.",
    ],
  },
]
