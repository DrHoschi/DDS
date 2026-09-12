# DDS-04F – Construction View / Isometric Presentation Reconciliation

Status: **DEFINED / PRESENTATION CONTRACT FIXED / NOT IMPLEMENTED / DDS-04G NOT AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Presentation reference:

- the user-provided target image showing the intended child-friendly house-construction screen
- reference purpose: visual hierarchy, fixed three-quarter construction view, readable building pieces, visible snap points, material differentiation, playful environment
- not pixel-authoritative
- not production-art authority

Relevant existing authorities:

- DDS-04B – authoritative Construction State
- DDS-04C – authoritative Snap / Placement / Occupancy / Undo
- DDS-04D – authoritative Material assignment + advisory Stability
- DDS-04E – authoritative Wolf Force / Failure / Detachment
- DDS-04F – presentation / interaction only

## 1. Reconciliation Objective

The current DDS-04F scene is a technical 2D projection suitable for proving mechanics but not suitable for judging whether a child can spatially understand and intentionally build a house.

This reconciliation defines the next DDS-04F presentation contract only.

It does not add gameplay.

The goal is a scene that visually reads as:

**a fixed, child-friendly 2.5D three-quarter construction view**

with the same broad visual intent as the provided target image.

## 2. View Name

The construction scene shall be called:

**Fixed 2.5D Isometric-Style Construction View**

More precisely, its projection contract is:

**fixed orthographic dimetric 2:1 projection**

It is intentionally not described as:

- free 3D camera
- perspective 3D camera
- top-down view
- side view
- freely rotatable isometric camera

The term “isometric-style” is retained for product/design communication because it matches the intended game readability.

The technical projection remains explicitly dimetric.

## 3. World-Axis Convention

The existing authoritative construction coordinate convention remains:

- `x` = ground-plane axis 1
- `z` = ground-plane axis 2
- `y` = vertical height

No authoritative transform semantics are changed.

DDS-04F only projects these values into screen space.

## 4. Fixed Projection Contract

For presentation, authoritative world coordinates are projected with a fixed 2:1 dimetric transform.

Let:

- `S` = presentation scale in screen pixels / logical scene units
- `OX` = scene horizontal origin
- `OY` = scene vertical origin
- `H` = vertical-height presentation multiplier

Then:

`screenX = OX + (x - z) * S`

`screenY = OY + (x + z) * (S / 2) - y * H`

Prototype baseline:

- `S = 44 px` at the reference iPad scene scale
- `H = 44 px`
- responsive implementation may scale `S` and `H` together
- ratio `ground horizontal : ground vertical = 2 : 1` remains fixed

The projection must not contain category-specific position hacks.

Every module, Ghost and snap marker uses the same world-to-screen projection function.

## 5. Fixed View Direction

The viewer looks toward the construction from one fixed three-quarter direction.

Presentation convention:

- world `+x` projects down-right
- world `+z` projects down-left
- positive `y` projects upward
- the construction origin sits approximately in the lower-middle / center region of the scene
- the upper background remains available for environment art and visual breathing room

The player does not rotate the camera in DDS-04F.

The existing “Drehen” action rotates the selected building piece only.

## 6. No Perspective Depth Scaling

The construction scene uses orthographic-style projection.

Therefore:

- a module does not become smaller merely because it is farther toward the rear of the scene
- spatial depth is communicated by position, overlap, visible faces and draw order
- no perspective vanishing point is required

This keeps snap alignment and building readability deterministic.

## 7. Depth / Draw-Order Contract

Visual overlap must follow projected construction depth rather than DOM insertion order.

Presentation depth key:

`depth = x + z + yDepthBias`

with vertical elements additionally ordered so that higher visible faces do not incorrectly disappear behind lower nearby elements.

Exact implementation may derive a deterministic render key from:

1. ground depth `x + z`
2. vertical base `y`
3. stable instance identity as tie-breaker

The tie-breaker is presentation-only.

It must not alter authoritative state.

## 8. Module Visual Grammar

All six authorized module categories must become visually recognizable construction pieces rather than abstract glyph boxes.

### FLOOR

Visual form:

- horizontal floor/foundation panel
- clear top face
- thickness visible on front/side edges
- approximately one construction-cell footprint

Must read immediately as “a floor piece”.

### WALL

Visual form:

- vertical rectangular wall panel
- visible front/side thickness
- lower edge aligns to floor / compatible support
- top edge remains visually available for roof / upper snap relationships

Must not look like a generic upright rectangle only.

### CORNER

Visual form:

- L-shaped / two-face corner wall piece
- two perpendicular visible wall planes
- visually communicates a 90° building corner

### DOOR_OPENING

Visual form:

- wall/door-frame module
- clear opening in the center
- frame or wall edges remain structural/readable
- opening must be visible from the fixed construction view

### ROOF

Visual form:

- pitched roof module
- two readable roof slopes where possible
- ridge direction follows authoritative rotation
- must sit visually above WALL/CORNER/BEAM support

### BEAM

Visual form:

- elongated structural timber / beam
- visible length and thickness
- rotation must be immediately readable

## 9. Geometry vs. Artwork Boundary

DDS-04F presentation may use one of two replaceable prototype techniques:

1. CSS / SVG / Canvas pseudo-3D geometry
2. pre-rendered 2.5D module sprites

The presentation contract must not depend on which technique is chosen.

Authoritative placement stays in DDS-04B/C.

The renderer consumes:

- category
- transform
- materialRef
- placementState

and produces only visuals.

## 10. Rotation Presentation Contract

The existing authorized module rotations:

- 0°
- 90°
- 180°
- 270°

remain authoritative input to DDS-04C.

DDS-04F must visually distinguish these rotations.

For sprite-based presentation:

- category assets may use four fixed orientation variants

For procedural presentation:

- geometry is re-projected from the rotated local module orientation

No new free-angle rotation is authorized.

## 11. Material Presentation Contract

Material identity must be visible in the module itself, not only in the left-side material button.

The geometry/category remains the same while the material skin changes.

### STRAW

Visual language:

- warm yellow / golden
- bundled / layered straw texture
- softer, lighter appearance

### WOOD

Visual language:

- warm brown timber
- plank / log grain
- clearly structural wood appearance

### STONE

Visual language:

- gray masonry / block texture
- heavier visual mass
- visibly different surface rhythm from wood/straw

Mixed-material houses are explicitly allowed visually because material is assigned per module.

No presentation rule may force the whole house to one material.

## 12. Material Icon / Bottom-Piece Preparation

The UI may prepare visually proper illustrated thumbnails for:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

The thumbnails should use the same fixed 2.5D visual grammar as the scene modules.

The bottom bar therefore becomes a true piece palette rather than text plus abstract symbols.

Likewise the material buttons may use recognizable:

- straw bundle
- timber/logs
- stone blocks

These are presentation assets only.

They do not create material authority.

## 13. Ghost Presentation Contract

The Ghost must be the same spatial form and orientation as the module that would be committed.

Valid Ghost:

- semi-transparent
- green/cyan edge or glow
- readable material/category silhouette
- clearly distinguishable from a committed module

Invalid locked Ghost:

- stays at the manually selected target
- semi-transparent
- red/orange invalid edge
- no automatic jump to another target
- Place remains disabled

The Ghost transform always comes from DDS-04C.

DDS-04F must not visually offset the Ghost from its authoritative target merely for composition.

## 14. Snap-Point Presentation Contract

Snap targets must visually appear attached to the actual construction geometry.

They may no longer look like arbitrary floating screen-space controls.

Each snap marker position is derived from:

- target instance authoritative transform
- target snap local position from DDS-04C profile
- the same fixed world-to-screen projection

Visual states:

### Recommended target

- blue/cyan star / glow
- visibly the automatic suggestion

### Other valid target

- green/cyan dot / plus / star
- tap-selectable
- lower emphasis than recommendation

### Manually selected target

- stronger ring / glow
- persists through rotation / re-render
- visually tied to the Ghost

### Invalid selected target after rotation/state change

- red/orange marker
- remains visible until user chooses another target or restores validity

Non-selected invalid candidates may remain hidden in the prototype.

## 15. Snap-Marker Scale Rule

Snap markers are interaction affordances, not world objects.

Therefore:

- their center is world-projected
- their touch target may retain a minimum screen-space size
- marker diameter may remain approximately 44–56 CSS px on touch devices
- the marker itself must not alter construction geometry

This preserves touch usability while keeping spatial anchoring correct.

## 16. Scene Ground / Build Plot

The central scene shall contain a clearly readable construction plot.

Presentation target:

- slightly raised or visually delimited build area
- enough open space around the house to read the footprint
- environment beyond the plot may be decorative
- the plot itself must not hide floor-level snap points

The build plot is presentation only unless a later gameplay block explicitly introduces build-area rules.

DDS-04F does not create a new build-boundary authority.

## 17. Environment Presentation

The target visual direction may include decorative environment such as:

- grass
- path
- trees
- fence
- flowers
- stream / bridge
- rocks
- village / countryside background

For DDS-04F:

- environment is static/decorative presentation
- it must not participate in collision
- it must not block authoritative placement
- it must not create resource nodes
- it must not create map gameplay

A generated background image may be used later if useful.

That asset work requires its own implementation/asset step.

## 18. Schweinchen Presentation Boundary

Pig characters may appear in the construction scene as decorative presentation elements.

DDS-04F may later show:

- one or more Schweinchen near the construction plot
- idle pose
- simple construction-themed pose
- non-authoritative decorative movement if separately implemented as presentation

DDS-04F does **not** authorize:

- pig pathfinding
- map navigation
- resource collection
- worker AI
- build-task execution
- inventory
- autonomous construction
- character gameplay authority

Those ideas remain future gameplay scope.

## 19. Wolf Presentation Boundary

A Wolf figure may appear decoratively near the scene edge as visual anticipation of the Wolf-Test.

For DDS-04F:

- Wolf visual does not determine force
- Wolf position in artwork is not DDS-04E source authority unless explicitly bound in a later authorized step
- no Wolf AI
- no Wolf animation requirement
- no cinematic blow sequence

The Wolf-Test button remains the current interaction trigger.

## 20. UI Composition Target

The broad target composition follows the provided reference image.

### Top

- title / construction context
- lightweight status / playful note allowed

### Left

- material selection
- coarse Stability feedback

### Center

- dominant fixed 2.5D construction scene
- house / Ghost / snap markers
- decorative environment behind it

### Right

- Drehen
- Platzieren
- Rückgängig
- Wolf-Test
- Reset/Neu may remain here or be visually secondary

### Bottom

- visual building-piece palette
- six authorized categories
- clear active selection

This is hierarchy authority for the prototype.

It is not pixel-perfect layout authority.

## 21. Scene Priority

The house and current build interaction must remain the strongest visual focus.

Presentation order of importance:

1. current house / Ghost
2. selected / recommended snap target
3. primary build actions
4. piece palette
5. material / Stability
6. decorative pigs / Wolf
7. environment

Decorative art must never reduce snap/placement readability.

## 22. Responsive Boundary

This reconciliation defines the visual language first against the proven iPad layout.

The same fixed 2.5D projection remains on iPhone later.

Responsive changes may alter:

- scene scale
- panel arrangement
- palette arrangement
- amount of decorative background visible

Responsive changes must not alter:

- camera/view direction
- projection formula
- world-axis convention
- meaning of module rotations
- authoritative snap positions

iPhone testing remains deferred until the corrected iPad presentation / interaction passes.

## 23. Current Manual Snap-Target Work Preservation

The recently implemented manual snap-target selection remains required.

The new visual presentation must preserve:

- automatic first valid recommendation
- all valid selectable targets
- manual target selection
- target lock
- same-target rotation revalidation
- fail-safe invalid placement
- candidate regeneration after place / undo / Wolf-Test

This reconciliation changes how those candidates look and where their markers are drawn.

It does not change their authority.

## 24. Wolf-Test Response Presentation

DDS-04E remains authoritative for detachment / displacement.

DDS-04F may improve how that response is shown:

- module visibly shifts in the same 2.5D projection
- detached state can use slight visual fade / tilt cue
- failed parts remain spatially understandable

DDS-04F must not add visual movement that contradicts the authoritative DDS-04E transform.

No production physics animation is authorized.

## 25. Asset Preparation Boundary

A later presentation implementation may require visual assets.

Allowed asset categories for a separate implementation step:

- six module category visuals / orientation variants
- material skins or material-specific variants
- material icons
- static background / environment
- optional decorative pig / Wolf placeholders

AI-generated assets may be used as replaceable prototype art.

No generated image becomes character Identity Master authority automatically.

Frozen character identity assets remain separately authoritative.

## 26. Presentation-Only State

DDS-04F may own presentation data such as:

- projected screen position
- draw-order key
- sprite/orientation choice
- visible-face choice
- selected visual highlight
- snap-marker appearance
- decorative scene layer
- responsive scene scale

DDS-04F may not own:

- committed module transform
- committed module identity
- connection state
- occupancy
- material assignment
- Stability result
- force result
- detached state

## 27. Explicitly Not Authorized

This reconciliation does not authorize:

- implementation in this same step
- free camera rotation
- camera orbit
- camera zoom gameplay
- free-perspective 3D
- physics-engine migration
- new module categories
- stairs
- raised platforms
- decorative construction modules
- map exploration
- resource gathering
- pig worker AI
- pig navigation
- Wolf AI
- character animation production
- new character identities
- level generation
- campaign / progression
- DDS-04G

## 28. Required Implementation Evidence Later

A later narrow presentation implementation must prove at minimum:

1. all authoritative world coordinates use one shared projection function
2. FLOOR reads as horizontal floor piece
3. WALL reads as vertical wall
4. CORNER reads as 90° corner
5. DOOR_OPENING visibly contains an opening
6. ROOF reads as pitched roof
7. BEAM reads as elongated structural beam
8. 0/90/180/270 rotations are visually distinguishable
9. STRAW / WOOD / STONE are visually distinguishable on modules
10. mixed materials remain possible
11. Ghost matches final module form/orientation
12. snap markers are world-anchored to real target positions
13. recommended / valid / selected target states remain distinguishable
14. manual target-selection behavior remains intact
15. draw order creates coherent house overlap
16. Wolf-Test displacement remains coherent in the same projection
17. iPad scene remains touch-usable
18. no DDS-04B/C/D/E source authority is duplicated
19. no future gameplay capability is pulled forward

## 29. Reconciliation Result

**DDS-04F CONSTRUCTION VIEW / ISOMETRIC PRESENTATION = RECONCILED**

Fixed presentation contract:

- fixed 2.5D isometric-style construction view
- technical projection = orthographic dimetric 2:1
- world axes = x/z ground, y height
- shared projection:
  - `screenX = OX + (x - z) * S`
  - `screenY = OY + (x + z) * (S / 2) - y * H`
- no free camera rotation
- proper visual forms for six module categories
- material skin visibly applied per module
- Ghost uses same geometry/form as committed piece
- snap points become world-anchored construction markers
- target image defines hierarchy/style direction, not pixel authority
- pigs / Wolf / environment remain decorative presentation only in DDS-04F
- no gameplay or authority expansion

## Next Admissible Step

The next admissible step is exclusively:

**DDS-04F – Construction View / Isometric Presentation – Implementation Scope Reconciliation**

That step must determine exactly:

- which current DDS-04F rendering functions/files are replaced or extended,
- whether the first implementation uses procedural CSS/SVG/Canvas geometry or pre-rendered 2.5D assets,
- which minimum visual assets are required,
- and which files must remain untouched.

No implementation may occur in that same scope-reconciliation step.

DDS-04G remains unauthorized.
