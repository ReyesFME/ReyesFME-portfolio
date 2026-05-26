// =========================================================================
//  PROJECT WAVE — DOCUMENTATION DATA
//  Two documents: GDD (Game Design Document) + Asset Pipeline
// =========================================================================

export const waveDocuments = [
  {
    id: "gdd",
    label: "Game Design Document",
    tag: "[GDD]",
    description: "Full game design specification — mechanics, levels, economy, and boss design.",
    status: "active",
  },
  {
    id: "pipeline",
    label: "Asset Pipeline & Task Allocation",
    tag: "[PIPE]",
    description: "Creative and developer task breakdown with role assignments.",
    status: "active",
  },
];

// ─── GDD Pages ────────────────────────────────────────────────────────────────
export const gddPages = [
  {
    id: 1,
    title: "1. Game Introduction & Overview",
    section: "OVERVIEW",
    content: `[Game Design Document]
Project W.A.V.E.

[1. Game Introduction / Overview]
Project W.A.V.E. is a fast-paced, environmental arcade shooter. Players control a specialized vessel tasked with cleaning the Pelagic Zone of the ocean. The game blends collection mechanics (inspired by Feeding Frenzy) with combat/shooting mechanics (inspired by Galaga and Platypus).

[1.1. In-Game Universe Story]
The main island of Frishco thrived and was turned into a successful place, benefiting and depending on its maritime economy. Several companies established their capital here but as the economy grew, so did the problems. After facing a decline in the maritime economy, an environmental organization called W.A.V.E. (Waste Acquisition & Vital Extraction) got a closer look at what was happening.

W.A.V.E. immediately sent out a campaign to fight off the main progenitor of illegal trash dumping — the company called D.R.A.I.N. (Deep-sea Resource Acquisition and Industrial Network).

W.A.V.E. discovered that D.R.A.I.N. was extracting amounts of oil greater than they should, bleeding industrial waste into the ocean. W.A.V.E. hires the player to clean up the affected area. On level 3, NPC leader David Gretenburgoh reveals the greater goal: to launch a campaign to remove D.R.A.I.N. from Frishco altogether.

The CEO of D.R.A.I.N., Vår Montrose, makes his first appearance on level 3, mocking and taunting W.A.V.E. This rivalry intensifies through levels 4 and 5.

[Story Standpoint of the Boss Fight]
- Phase 1 (The Exterior): Destroy the Trash Ejection Ports. The factory shoots compressed plastic cubes.
- Phase 2 (The Pipes): Use the Skimmer to neutralize Oil Exhausts. Screen fills with sludge, slowing you down.
- Phase 3 (The Core): Factory's Heat Vents open — the only vulnerable point. Fires Heavy Metal scrap as last defense.

[1.2. Character List]
- Alfonse Muir — Playable character. Main protagonist the player controls.
- David Gretenburgoh — Leader of W.A.V.E. Narrator/guide NPC.
- Vår Montrose — CEO of D.R.A.I.N. Villain NPC.`
  },
  {
    id: 2,
    title: "2. Game Mechanics",
    section: "MECHANICS",
    content: `[2. Game Mechanics]

[2.1. The "Blessing" System (Feeding Frenzy Style)]
Active, short-term buffs found floating in the water during gameplay. They change how the player feels immediately.

How it works: Touch the fish (e.g., Sailfish, Turtle) for an instant boost lasting nth seconds.
Visual Cue: Player avatar changes — glow, shield, or movement trail effect.

The "Subway Surfer" Twist: Though temporary, blessing durations can be upgraded in the Shop using accumulated points.

[2.2. The "Gear" System (Subway Surfer Style)]
Permanent stat increases or tool unlocks that stay with the player throughout levels.

How it works: Between levels, the player spends trash points in the Shop to upgrade their Net Level or Harpoon Power.

Progression:
- Level 1 Net: Small radius, catches 1 bottle at a time.
- Level MAX Net: Huge radius, catches multiple pieces of trash at once.

Specific Tools: Different trash types (Oil, Metal, Plastic) require unlocking the Skimmer or Hook before interaction in later levels.

[2.3. Permanent Progression (The Shop)]
- Gear Upgrades: Increase the fire rate, range, or capacity of the Net, Hook, and Skimmer.
- Blessing Duration: Increases how long temporary fish buffs last. (Level 1: 5s → Max Level: 20s)`
  },
  {
    id: 3,
    title: "3. Level Design & Progression",
    section: "LEVELS",
    content: `[3. Level Design & Progression]
Structure: 5 Levels total, concluding with a 3-Phase Final Boss.

Visual Evolution: As the player clears levels, the background transforms from murky/polluted to vibrant (coral spawning, return of marine life).

Visual Polish: Add Foreground elements. As levels progress, small schools of fish (non-interactable) swim by — making the Thriving status feel alive.

[Level Breakdown]
- Level 1: Tutorial/Demo Reel. Introduces basic collection and demonstrates blessings (level 1 only).
- Levels 2–4: Incremental difficulty. Introduces Large Plastics, Oil, and Heavy Metal hazards alongside their respective gears.
- Level 5: Final Boss Battle against the Source of Pollution.
  - Phase 1: Plastic Barrage.
  - Phase 2: Oil Status Debuffs.
  - Phase 3: Heavy Metal durable attacks.`
  },
  {
    id: 4,
    title: "4. Technical Requirements",
    section: "TECHNICAL",
    content: `[4. Technical Requirements (Dev Team)]
- Platform: PC (Web/Itch.io) and Mobile.
- Input: Left/Right/Up/Down movement — WASD or Arrow keys for PC, Joystick for Mobile.
- Auto-shooting for off-hand tools. Off-hand gears can be upgraded to catch more in a designated area.
- The specialized gear is placed on the main hand and requires a click to activate. Special gears have cooldowns. Main-hand gears can be switched depending on what hazard is present.

[Core Systems Required]
- Dual Hitbox System: Small Collection hitbox for points; Large Damage hitbox for hazards.
- Economy System: Calculation of trash-to-points conversion and shop prices.
- Buff Manager: Timer-based logic for fish blessings.
- Boss AI: Static cooldown states between phases to allow player Free Shoot windows.

[5. Win/Loss Conditions]
Win Condition: Reach the end of the timer for levels 1–4. For the final level, defeat the Final Boss.
Loss Condition: Life points (Health Bar) reach zero due to colliding with hazardous trash or Boss attacks.
Post-Game: A detailed tally screen showing specific counts of trash collected. (e.g., 300 Bottles, 50 Gallons of Oil)

[Participation Reward]
If a player repeatedly fails Level 1, add a Participation Reward: even on failure, they keep 25% of the points they collected — allowing them to eventually afford the upgrade to pass.`
  },
  {
    id: 5,
    title: "6. Trash Point Economy",
    section: "ECONOMY",
    content: `[6. Trash Point Economy]

| Trash Category | Item Example | Mechanic | Point Value | Difficulty / Risk |
|---|---|---|---|---|
| Small Plastic | Bottles, Straws, Bags | Collection (Touch) | 10 pts | Low — Generic fodder |
| Large Plastic | Detergent Jugs, Crates | Collection (Net) | 25 pts | Low — Requires more space |
| Heavy Metal | Anchors, Scrap, Cans | Shoot (Harpoon) | 75 pts | Medium — Blocks path |
| Hazardous Oil | Oil Slicks / Patches | Shoot (Skimmer) | 100 pts | High — Slows player down |
| Ghost Nets | Large Tangles | Shoot (Harpoon) | 150 pts | High — Durable / Multi-hit |`
  },
  {
    id: 6,
    title: "7. Shop — Gear System",
    section: "SHOP",
    content: `[7. Shop Upgrades Interface Logic]
The shop has two distinct tabs:
- Gear Tab: Focuses on Power. (e.g., Harpoon Reload Speed, Skimmer Width)
- Blessing Tab: Focuses on Time. (e.g., Sailfish Duration, Turtle Shield Duration)

[7.1. Gear List]
- Small Plastics — touch (Feeding Frenzy style)
- Large Plastics — net (off-hand)
- Metal — hook/harpoon (main-hand, special)
- Oil — Skimmer (main-hand, special)

[7.1.1. Gear Upgrade Catalogue]

A. The Recovery Net (Off-Hand Auto-Shooter)
- Level 1 (Base): Small collection radius.
- Level 2 (Reinforced Fiber): Increases radius by 20%.
- Level 3 (Magnetic Weave): Can pull in trash from two lanes over.
- Level 4 (High-Capacity Mesh): Eliminates filling-up lag between scoops.
- Level 5 (MAX — Gravity Well): Massive vacuum radius; captures trash before you even touch it.

B. The Harpoon Launcher (Heavy Metal / Ghost Nets)
- Level 1 (Base): Single slow projectile with 1.5s–2s cooldown.
- Level 2 (Weighted Tips): Reduces cooldown to 1.2s.
- Level 3 (Hydro-Propulsion): Projectile speed +50% with 0.9s cooldown.
- Level 4 (Rapid Reload): 0.6s cooldown for clearing paths through clusters.
- Level 5 (MAX — Railgun Piercing): 0.3s cooldown; projectiles pierce through the first target to hit a second.

C. The Oil Skimmer (Hazardous Oil)
- Level 1 (Base): Narrow spray, clears 10% of a patch per hit.
- Level 2 (Enhanced Filter): Increases spray width.
- Level 3 (Wide-Bore Intake): Clears a full horizontal line of oil.
- Level 4 (Chemical Neutralizer): Clears 30% of oil per hit.
- Level 5 (MAX — Aura Field): Clears 50% of oil per hit; auto-cleans a small radius around the boat.`
  },
  {
    id: 7,
    title: "7.2. Blessing System & Upgrades",
    section: "SHOP",
    content: `[7.2. Blessing List]
- Swordfish — effective trash collecting (ignores gear level)
- Jellyfish — shield for oil debuff
- Sailfish — faster movement speed
- Octopus — collect more trash (limited to gear level)
- Turtle — shields from any attack

[Blessing Upgrade Table]

| Upgrade Level | Duration | Shop Cost | Total Runs to Afford |
|---|---|---|---|
| Level 1 (Base) | 5s | 0 pts (Starting) | — |
| Level 2 | 8s | 400 pts | ~1 Good Run |
| Level 3 | 11s | 1,000 pts | ~1.5 Runs |
| Level 4 | 14s | 2,200 pts | ~3 Runs |
| Level 5 (MAX) | 18s | 4,500 pts | ~5–6 Runs |

[7.2.1. Blessing Spawn Behaviour]
- Logic: A blessing fish should spawn every 45–60 seconds.
- Dynamic Spawn: If the player's health drops below 30%, the game "pities" them and immediately spawns a Turtle (Shield) or Jellyfish (Oil Immunity).
- Placement: Blessings always spawn in the opposite lane of a heavy trash cluster — forcing a strategic choice: stay and clean for points, or dodge for the blessing.`
  },
  {
    id: 8,
    title: "8. Balance Rules",
    section: "BALANCE",
    content: `[8. Balance Rule (For Devs)]
Design using the Base Gear Baseline:
- Level 1–2: Passable with Level 1 (Base) Gear.
- Level 3–4: Passable with Level 1 Gear if the player is very skilled; intended for Level 2 or 3 Gear.
- Level 5 (Boss): Passable with Level 2 Gear; intended for Level 3 or 5 Gear.

[8.1. Gears Affect Gameplay]

| Feature | Base Gear (Level 1) | Max Gear (Level 5) | Impact on Gameplay |
|---|---|---|---|
| Harpoon Speed | Slow projectile, 2s cooldown | Rapid fire, 0.5s cooldown | High gear makes Targeted Extraction effortless |
| Net / Body Size | Small collection radius | Large vacuum radius | High gear lets you collect trash you didn't touch |
| Skimmer Power | Clears 10% of oil per hit | Clears 50% of oil per hit | High gear removes Slow debuffs almost instantly |

[8.2. The "Farm" Loop]
Since players can replay levels, the economy must not break:
- First Clear Bonus: Give a large chunk of points (e.g., 500) the first time they beat a level.
- Replay Value: On second play, they only get what they actually collect — preventing becoming overpowered too quickly.

[8.3. Recommendations Based on Gear vs. Level Difficulty]
Encourage upgrading without forcing it — add a Recommended Gear icon on the Level Selection screen.
- If a player tries Level 4 with Level 1 Gear: show a small yellow warning: "Warning: High pollution detected. Upgrade your Skimmer for a better chance of survival!"`
  },
  {
    id: 9,
    title: "9. Difficulty Curve",
    section: "BALANCE",
    content: `[9. Difficulty Curve]

[9.1. Gear vs. Trash]

| Gear Level | Hits to Clear (Metal / Oil) | Cooldown | Feel / Experience |
|---|---|---|---|
| Level 1 | 5 Hits | 1.5s | Struggle: Must focus on one target at a time |
| Level 2 | 4 Hits | 1.2s | Steady: Can clear 2 items before getting overwhelmed |
| Level 3 | 3 Hits | 0.9s | Efficient: The Sweet Spot for mid-game play |
| Level 4 | 2 Hits | 0.6s | Powerful: Rapidly clearing paths through hazards |
| Level 5 | 1 Hit | 0.3s | God Mode: Trash is destroyed instantly on contact |

[9.2. Spawn Difficulty and Intensity]
As levels progress, Density (how much trash is on screen) increases. Lower cooldowns are needed to keep up.

- Levels 1–2: Low density. A 1.5s cooldown is fine — large gaps between trash.
- Levels 3–4: Medium density. Trash spawns in clusters. Level 1 gear means dodging more than cleaning.
- Level 5: High density + Boss attacks. High fire rate (Level 4/5) necessary to clear a hole through trash to reach the Boss.`
  },
  {
    id: 10,
    title: "10–11. Special Gears & Passable Logic",
    section: "BALANCE",
    content: `[10. Special Gears Specifications]

A. The Harpoon (For Heavy Metal)
- Level 1: Single slow projectile.
- Level 3: Projectile speed increases by 50%.
- Level 5: Piercing effect — harpoon goes through the first piece of trash and hits a second behind it.

B. The Skimmer (For Oil Slicks)
- Level 1: Narrow spray, clears a tiny patch of oil.
- Level 3: Wide spray, clears a horizontal line of oil.
- Level 5: Aura effect — Skimmer automatically clears a small radius around the boat without needing to aim.

[11. "Passable but Hard" Logic]
To ensure a Level 1 player can still beat Level 5, implement Trash Despawn:
- If the player cannot clear trash fast enough, trash eventually moves off-screen without dealing damage — UNLESS the player physically crashes into it.
- This rewards skilled dodgers even with weak gear. The breaking point is the Final Boss; if dodge game is strong but gears are weak, the boss cannot ultimately be defeated.

The Soft Wall (Levels 1–4): Survival is the priority. If you can't clean, you're a "bad environmentalist" (low score) but a "good pilot" (survived). This prevents players from getting stuck and quitting.

The Hard Wall (Level 5 Boss): Victory is the priority. You cannot dodge a boss forever — you must eventually clean it out of existence. This forces engagement with the upgrade economy.`
  },
  {
    id: 11,
    title: "12. Boss vs. Gear Analysis",
    section: "BOSS",
    content: `[12. Boss vs. Gear]

| Gear Level | Damage/Hit | Cooldown | Effective DPS | Time to Defeat | Difficulty |
|---|---|---|---|---|---|
| Level 1 | 5 | 1.5s | 3.3 | ~50 Mins | UNBEATABLE: Regen outpaces damage |
| Level 2 | 15 | 1.2s | 12.5 | ~13 Mins | FAIL: Hits the 10-min time limit |
| Level 3 | 40 | 0.9s | 44.4 | ~3.7 Mins | RECOMMENDED: Standard challenge |
| Level 4 | 100 | 0.6s | 166.6 | ~1 Min | FAST: Player feels highly effective |
| Level 5 | 250 | 0.3s | 833.3 | 12 Secs | GOD MODE: Total destruction |

Notes:
- At Level 1 & 2: Player deals less than 13 DPS. Boss heals 10 HP/sec — effective damage is only 3 DPS. Never finish in 10 minutes.
- At Level 3: Player deals 44 DPS. Subtracting 10 HP regen = 34 Net DPS. Win in roughly 5 minutes.

[12.1. Visual and Audio Cues]

[12.1.1. "Inefficient Gears"]
- 0–2 Minutes (Reality Check): If Boss HP hasn't moved past 90%, NPC triggers a warning.
  - NPC Dialogue: "Our harpoons are barely scratching this sludge! We're not cleaning fast enough—at this rate, the ocean will be lost in 10 minutes!"
- Visual Feedback: Hits from Level 1–2 gear produce grey sparks (ineffective). Hits from Level 3+ produce bright green bubbles (effective).

[12.1.2. HP-Based Cues for the Final Boss]
- At 75% HP: Chimneys start to crumble.
- At 50% HP: Oil starts leaking uncontrollably from the sides.
- At 25% HP: Lights flicker and alarms (SFX) start going off.`
  },
  {
    id: 12,
    title: "13–14. Ending & Tally Screens",
    section: "ENDGAME",
    content: `[13. Ending Cue]
Comic-style resolution to convey the endgame story.

[14. Tally Screens]

[14.1. Victory Tally — "Clean-up Report"]
Verifies the accomplished cleanup progress throughout gameplay.

The Impact List:
- Plastic Bottles: [Count] → "Kept out of sea turtle habitats!"
- Oil Slicks: [Liters/Gallons] → "Sea birds saved!"
- Heavy Metal: [Kilograms] → "Coral reefs protected!"

Total Points Earned: [Total]
Environmental Status: A visual bar moving from Toxic to Thriving.

[14.2. Failure Tally — "The Encouragement Logic"]
If the player dies or hits the 10-minute timer on the boss, the screen guides them back to the Shop.

Message: "The Pollution is too thick!"

The Advice Section: Game checks the player's gear level:
- If Gear is Level 1–2: "Your current Harpoon is bouncing off the trash! Visit the Shop to increase your piercing power."
- If Health was the issue: "The ocean is hazardous. Try upgrading the duration of the Turtle blessing for more protection!"

Button: [Go to Lab] — Make this big and shiny.`
  },
];

// ─── Pipeline Pages ───────────────────────────────────────────────────────────
export const pipelinePages = [
  {
    id: 1,
    title: "Asset Pipeline — Creatives",
    section: "CREATIVES",
    content: `[Asset Pipeline & Task Allocation]
Project 4b: Complete

[Creatives Team]

[Animation & Video]
- Demo reel editing and shooting — Game Designer, Game Tester (for game demo) — associate artist
- Intro Animation leading up to the home screen — lead artist
- Idle animation at the home screen
- Guide gameplay script

[Map Backgrounds (3 total)]
- Map 1: Coastal/Bay area for Level 1 and 2 — lead artist
- Map 2: Deep sea area for Level 3 and 4 — associate artist
- Map 3: The final approach to the D.R.A.I.N. rig for Level 5 (final) — associate artist

[UI Interface — PC and Mobile]
- Home screen — both artists
- Laboratory screen — both artists
- Map progression — both artists
- Breakdown/Summary of total points after the entire game — both artists

[UI Creation — Both Artists]
- Home screen
- Laboratory screen
- Map progression
- Score breakdown/summary screen

[Other Backgrounds (2D) — Both Artists]

[Comic for Resolution + Storytelling — Lead Artist]

[Fish of Blessing Illustration — Lead Artist]
- Swordfish — for effective trash collecting (ignores gear level)
- Jellyfish — shield for oil debuff
- Sailfish — faster movement speed
- Octopus — can collect more trash (limited to gear level)
- Turtle — shields from any attack`
  },
  {
    id: 2,
    title: "Asset Pipeline — Character & Gear Assets",
    section: "CREATIVES",
    content: `[Asset Creation]

[Characters — Lead Artist]
- Alphonse Muir, playable character
- David Gretenburgoh, ally NPC
- Vår Montrose, enemy NPC

[Player Avatar — Both Artists]
2.5D or 3D

[Shooting Gears — Associate Artist]
- Net
- Harpoon / Hooks
- Skimmer

[Trash Catalogue]

Small / Biodegradable — Associate Artist:
- Plastic sheet
- Plastic bottle

Large Non-Biodegradable — Lead Artist:
- Drum
- Old Tire
- Detergent (or other larger) containers

Oil Assets — Associate Artist:
- Oil patches (small, medium, large)

Metal Debris — Associate Artist:
- Scraps
- Rods
- Broken machineries`
  },
  {
    id: 3,
    title: "Asset Pipeline — Developer Team",
    section: "DEVELOPERS",
    content: `[Developer Team]

[Associate Developer Tasks]
- Start Up page
- Sound settings
- Start game — directed to the level selection screen
- Skip button for the intro part
- Guide gameplay (flowchart required)
- Shop for gear and ability upgrades
- Pointing System summary after every level
- Closing comic strip and resolution
- Skip button for the outro part
- Breakdown/summary of score (e.g., "You collected a total of 5,000 trash in the ocean. 300 bottles, 500 pounds of oil, 600 metal pieces...")

[Lead Developer Tasks]
- Shooting Mechanic
  - Automatic
  - Clickable
- Lifepoint assignment to trash depending on gear level
- Blessing of fish timed mechanic
- Level 1
- Level 2
- Level 3
- Level 4
- Level 5 (final)`
  },
  {
    id: 4,
    title: "Asset Pipeline — Audio Requirements",
    section: "AUDIO",
    content: `[Required Audio Effects]

[Sound Effects]
- Splashing into water — vessel diving SFX
- Blessing Acquired effect — shining SFX upon acquiring a blessing
- Gear Usage SFX — foley sounds when gear is in active use. Note: vehicle is operating underwater; include/edit raw sounds with a water-y aspect
- Static Radio waves effect — used for the narrative radio interference moment
- Gathering Trash SFX
  - Plastic
  - Metal
  - Oil
- Machinery hovering foley sound
- Machinery Foley
- Drifting movement SFX — underwater context; include water-y aspect
- Vessel foley sound — main machinery movement SFX
- Oil Rig SFX — for when waste is being dumped
- Trash on impact to player (depends on debris type)
  - Plastic sheet impact
  - Metal scraps impact
  - Plastic container impact
- Upgrade SFX — for gear or blessing upgrades

[Background / Ambient Music]
- BGM for home screen — must be at least 1 minute long for idle purposes
- BGM for gameplay levels
  - Levels 1 and 2 — same BGM, casual and light-hearted tone
  - Levels 3 and 4 — same BGM, heavier tone (turning point revealed)
  - Level 5 — menacing BGM for boss fight
- BGM for closing comic sequence — must be at least 2–3 minutes long`
  },
];