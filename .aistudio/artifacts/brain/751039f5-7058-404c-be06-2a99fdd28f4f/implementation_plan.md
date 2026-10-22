# ATHANASIA: Ang Hiwaga ng Diwa — Multiplayer Board & Card Adventure

A Philippine mythology-inspired dark-fantasy tactical board and social-deduction card game featuring real-time multiplayer rooms, interactive turn-based animations across four elemental realms and the celestial sanctuary Aetherya, a full-featured password-protected Admin Suite for modular card effect stacking and asset balancing, and complete Vercel deployment readiness.

> [!IMPORTANT]
> **Confirmed Design Choices (Phase 1 Clarifications)**:
> 1. **Matchmaking & Solo Play**: Real-time multiplayer rooms with private room codes, public matchmaking, and smart AI bot companions that can seamlessly fill slots or enable instant solo/practice play.
> 2. **Real-Time Multiplayer Architecture for Vercel**: Full-stack Node/Express server providing real-time WebSockets on port 3000 during local/dev runs, paired with serverless REST room polling and state synchronization endpoints (`/api/rooms/*`) so the game runs natively on both Cloud Run/dev servers and Vercel serverless deployments.
> 3. **Board Presentation**: Stylized isometric-style 2D serpentine grid path with rich animated player tokens, glowing elemental tile markers (Pentagon gates, Triangle paths/challenges/fates, and the Golden Aetherya Sanctuary), and fluid turn-based camera/step transitions.
> 4. **Admin Suite**: Secured with system password (default: `diwa_admin_2026`, editable) allowing admins to customize character/card visual assets, create new cards, rebalance old ones, and assemble modular stacked effect chains (e.g. `MOVE_FORWARD`, `SWAP_REALM`, `STEAL_BIYAYA`, `SKIP_TURN`, `ANTING_ANTING_SHIELD`).

---

## 1. Overview & Core Concept

* **What It Does**: Transposes the complete *ATHANASIA: Ang Hiwaga ng Diwa (V0.3)* Game Design Document into an interactive, digital tactical board and card game. 2 to 6 players (or AI bots) embark on a cooperative pilgrimage across 50 tiles spanning four elemental realms—**Talvaris** (Earth), **Alabarya/Liyabarya** (Fire), **Alonawon** (Water), and **Himaraya** (Air)—to reach the final sanctuary **Aetherya** and face Varyndor. Behind the journey lurks a secret **Impostor** seeking to sabotage the group, while each pilgrim carries a hidden **Sumpa** (Curse) that must be deduced to unlock the **Diwaling** (Guardian) gates.
* **Target Audience**: Fans of social deduction (Among Us, Blood on the Clocktower), strategic board games (Talisman, Betrayal at House on the Hill), Uno-style card play, and rich Philippine folklore and mythology.
* **Key Value**: Delivers the cultural depth of Philippine myth (bugtong riddles, proverb quizzes, folklore curses like Tikbalang, Manananggal, Bakunawa, Kapre, Nuno, Tiyanak) inside a clean UI with real-time multiplayer chat, tactical board navigation, and a modular admin sandbox.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title & Matchmaking Shell**: Atmospheric cinematic title screen with Baybayin-inspired typography and game lore. Players can enter their pilgrim handle, pick their ancestral avatar, browse open rooms, create private custom rooms (custom turn timer, player count 2–6, AI bot autofill), or play solo with bots immediately.
2. **Lobby & Room Settings**: Room hosts see connected players in real-time, can toggle AI bot slots, adjust room parameters (game speed, challenge difficulty, penalty severity), and converse via real-time chat.
3. **Game Start & Secret Dealing**:
   - Secret **Role Card** dealt (Aninag Pilgrim vs. Corrupted Impostor).
   - Secret **Sumpa Card** dealt with poetic Filipino folklore clues read aloud/broadcast to all players at game start.
   - Initial hand of **Biyaya** action cards and 1 **Guess the Impostor** accusation card.
4. **Active Turn Cycle**:
   - **Phase 1: Roll & Move**: Animated 3D/canvas dice roll; player token hops step-by-step along the serpentine grid trail.
   - **Phase 2: Tile Encounter**:
     - *Daan (Ordinary Triangle)*: Safe travel space.
     - *Pintuan ng Diwaling (Guardian Gate)*: Draws a **Pahiwatig Card** asking which companion holds the matching Sumpa. Group voting unlocks the realm gate.
     - *Pagsubok (Challenge Triangle)*: Interactive timed challenge (Traditional Bugtong riddle, Pambansang Sagisag trivia, Kasabihan fill-in-the-blank, 3 Tagalog names in 5s, or Tongue Twister). Correct answer earns a Biyaya card!
     - *Kapalaran (Risk-or-Reward Triangle)*: Dynamic narrative dilemma with Choice A vs Choice B affecting movement and hand resources.
   - **Phase 3: Biyaya Action & Accusation**: Player can strategically play Biyaya cards (*Abante* move forward, *Baliktad* reverse, *Harang* skip, *Kalasag* shield, *Swap Place*) or trigger their one-time *Guess the Impostor* accusation.
   - **Phase 4: Turn Pass**: Smooth transition with countdown timer and AI bot automated play.
5. **Aetherya & Endgame**: Reaching tile 50 triggers the crossing of the golden celestial bridge into Aetherya for the *Huling Hamon* against Varyndor. Winning conditions evaluate Aninag victory (gates cleared & Impostor unmasked/defeated) vs. Impostor victory.
6. **Admin Suite**: Accessible via a clean discreet badge with password authentication (`diwa_admin_2026`). Features a comprehensive dashboard:
   - **Card Registry**: Live table of all 6 decks (Role, Sumpa, Pahiwatig, Pagsubok, Biyaya, Kapalaran).
   - **Modular Card Builder**: Visual form to create new cards, define triggers, and stack modular effect primitives (`movement`, `draw_cards`, `discard`, `skip_turn`, `swap`, `shield`, `halve_roll`, `peek_clue`).
   - **Asset Manager**: Change card artwork URLs/presets, realm backgrounds, and pilgrim character avatars.
   - **JSON Import/Export**: Backup custom balance patches or reset to canonical GDD rules.

### Visual Identity & Theme
- **Color Budget (60-30-10)**:
  - *60% Neutral Canvas*: Midnight charcoal and deep volcanic slate (`#0B0F17`, `#111827`) evoking the primordial twilight of *Karimlan*.
  - *30% Structural Elements*: Earthy ochre, terracotta, mossy jade, and moonlit azure (`#1E293B`, `#162238`, `#1C1917`) matching the 4 realms.
  - *10% Focal Accents*: Spiritual Diwa gold (`#F59E0B`), celestial cyan (`#06B6D4`), and corrupted Impostor crimson (`#EF4444`).
- **Typography**:
  - *Display / Titles*: `Cinzel` / `Outfit` with Baybayin glyph accents for an ancient mythological aura.
  - *Body Prose & Cards*: `Plus Jakarta Sans` for crisp legibility during fast-paced challenges.
  - *Metrics & Numerals*: `tabular-nums font-mono` for tile counts, turn timers, and dice rolls.
- **Micro-Interactions**:
  - Web Audio API procedural sound synthesizer (dice rattle, card flip, elemental bell chime, warning drum for Impostor accusations, victory fanfare).
  - Floating card drawer with hover magnification, playable glow affordances, and draggable or one-click play.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale | Alternatives Considered |
|---|---|---|---|
| **Real-time Networking** | Dual-mode Server: WebSocket room manager with HTTP REST fallback (`/api/rooms`) | Ensures 100% real-time responsive sync on Node/Docker while simultaneously working on Vercel serverless environments with polling fallback. | Pure WebSockets (breaks on Vercel without paid external services) or pure polling (slower latency). |
| **Board Presentation** | Stylized 2D Isometric Serpentine Grid with SVG Path Overlays | Gives clear tactical overview of all 50 tiles and 4 realm borders without heavy WebGL 3D overhead, ensuring 60fps performance on mobile and desktop. | Pure 3D Three.js canvas (higher GPU overhead, slower load) or plain 1D linear track (lacks tactical table presence). |
| **Card System Architecture** | Modular Primitive Stacking Engine | Standardizes card mechanics into composable building blocks (`type`, `target`, `effects[]`, `conditions[]`) so Admin can reskin and recombine effects without touching code. | Hardcoded card switch statements (rigid, admin cannot create new mechanics). |
| **AI Companion Logic** | Client/Server Rule-Based Bot Engine | Bots make sensible rolls, answer riddles with realistic accuracy/timer delay, play defensive Biyaya cards, and participate in Diwaling votes. | External LLM API for each bot move (incurs API cost/latency and violates the no-unsolicited-AI rule). |
| **Admin Authentication** | Session-based password lock with customizable passphrase | Secure, instant access without requiring external auth setup, with full ability to modify game data in browser localStorage and server state. | External OAuth (unnecessary friction for game tuning). |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATHANASIA CLIENT (Vite/React)                   │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐ │
│ │  Title & Matchmaking │  │  50-Tile Game Board │  │ Real-time Chat  │ │
│ │  - Public Queue      │  │  - 4 Elemental Zones│  │  - Room Log     │ │
│ │  - Custom Rooms      │  │  - Animated Tokens  │  │  - Quick Emojis │ │
│ │  - Solo / Bot Setup  │  │  - Diwaling Gates   │  │  - Accusations  │ │
│ └──────────┬───────────┘  └──────────┬──────────┘  └────────┬────────┘ │
│            │                         │                      │          │
│ ┌──────────┴─────────────────────────┴──────────────────────┴────────┐ │
│ │                      Game Engine & Action Dispatcher               │ │
│ │  - Turn Loop Manager      - Card Draw & Play Resolver              │ │
│ │  - Dice & Motion Animator - Impostor Deduction Engine              │ │
│ │  - Web Audio Synthesizer  - Sumpa & Pahiwatig Gate Validator       │ │
│ └────────────────────────────────────┬───────────────────────────────┘ │
│                                      │                                 │
│ ┌────────────────────────────────────┴───────────────────────────────┐ │
│ │            Admin Suite (Password Protected: diwa_admin_2026)       │ │
│ │  - Modular Card Editor      - Asset Customizer (Characters/Cards)  │ │
│ │  - Deck Balancer (6 Decks)  - JSON Export/Import & Reset           │ │
│ └────────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │ (WebSocket / HTTP Polling)
┌──────────────────────────────────────▼─────────────────────────────────┐
│                        FULL-STACK SERVER (server.ts)                   │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────┬───────────────────────────────┐ │
│ │  Express REST API (/api/rooms/*)   │  WebSocket Server (/ws)       │ │
│ │  - Room creation & state fetch     │  - Real-time client broadcast │ │
│ │  - Polling fallback for Vercel     │  - Disconnect/reconnect queue │ │
│ └────────────────────────────────────┴───────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │               In-Memory & Persistent Game Room Store               │ │
│ │  - Active Rooms Map & Matchmaking Queue                            │ │
│ │  - Server-Authoritative State & Turn Validation                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Deck Structure

```typescript
// Core Modular Card System
export type CardDeckType = 'role' | 'sumpa' | 'pahiwatig' | 'pagsubok' | 'biyaya' | 'kapalaran' | 'accusation';

export type CardEffectType = 
  | 'MOVE_FORWARD'
  | 'MOVE_BACKWARD'
  | 'DRAW_BIYAYA'
  | 'DISCARD_BIYAYA'
  | 'SKIP_TURN'
  | 'EXTRA_TURN'
  | 'ANTING_ANTING_SHIELD'
  | 'SWAP_PLAYERS_SAME_REALM'
  | 'SWAP_PLAYER_FURTHEST'
  | 'HALVE_NEXT_ROLL'
  | 'PEEK_PAHIWATIG'
  | 'AUTO_CORRECT_PAGSUBOK'
  | 'TELEPORT_REALM_START';

export interface CardEffect {
  type: CardEffectType;
  value?: number;
  target?: 'self' | 'target_player' | 'all_opponents' | 'adjacent_player';
  condition?: string;
  description: string;
}

export interface GameCard {
  id: string;
  deck: CardDeckType;
  title: string;
  subtitle?: string;
  realm?: 'talvaris' | 'alabarya' | 'alonawon' | 'himaraya' | 'aetherya' | 'all';
  category?: 'bugtong' | 'sagisag' | 'kasabihan' | 'speed_trivia' | 'tongue_twister' | 'idiom' | 'action' | 'curse' | 'clue';
  flavorText?: string;
  question?: string;
  answer?: string;
  choices?: { label: string; text: string; effects: CardEffect[] }[]; // for Kapalaran
  effects?: CardEffect[]; // for Biyaya / Action
  hint?: string; // for Sumpa
  matchingSumpaId?: string; // for Pahiwatig
  artworkUrl?: string;
}

// 50-Tile Board Representation
export type TileType = 'pintuan' | 'daan' | 'pagsubok' | 'kapalaran' | 'aetherya';

export interface BoardTile {
  index: number; // 0 to 50
  realm: 'talvaris' | 'alabarya' | 'alonawon' | 'himaraya' | 'aetherya';
  shape: 'pentagon' | 'triangle' | 'sanctuary';
  type: TileType;
  title: string;
  gridX: number; // calculated for serpentine layout
  gridY: number;
  guardianName?: string;
}

// Player State
export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isBot: boolean;
  role: 'aninag' | 'impostor';
  currentTile: number; // 0 (start) to 50 (aetherya)
  hand: GameCard[]; // Biyaya cards
  sumpaCard: GameCard; // Secret curse
  hasUsedAccusation: boolean;
  hasShield: boolean;
  skipNextTurn: boolean;
  halveNextRoll: boolean;
  isEliminated: boolean;
}

// Room & Game State
export interface GameRoom {
  code: string;
  name: string;
  hostId: string;
  maxPlayers: number;
  status: 'lobby' | 'playing' | 'ended';
  players: PlayerState[];
  currentTurnIndex: number;
  turnTimeLimit: number;
  turnSecondsRemaining: number;
  turnPhase: 'roll' | 'tile_event' | 'action' | 'gate_challenge' | 'ended';
  activeEventCard?: GameCard;
  impostorAccusationActive?: { accuserIndex: number; targetIndex: number; result?: boolean };
  chatMessages: { id: string; sender: string; text: string; timestamp: number; type: 'chat' | 'system' | 'accusation' }[];
  winner?: 'aninag' | 'impostor';
  diwalingGatesUnlocked: Record<string, boolean>; // 'talvaris', 'alabarya', 'alonawon', 'himaraya'
  diceValue?: number;
}
```

---

## 5. Step-by-Step Implementation Strategy

1. **Step 1: Game Lore & Deck Canonical Database (`src/data/`)**:
   - Seed all 60 Pagsubok challenge cards (10 Bugtong, 10 Sagisag, 10 Kasabihan, 10 Speed Trivia, 10 Tongue Twisters, 10 Idioms).
   - Seed all 6 Sumpa cards and 18 Pahiwatig clue cards with authentic Filipino mythological lore.
   - Seed all 30 Uno-style Biyaya cards and 30 Kapalaran risk/reward choices.
   - Construct the exact 50-tile serpentine board dataset according to GDD dimensions.
2. **Step 2: Server & Real-Time Transport (`server.ts` & `/api/rooms/`)**:
   - Create Express server mounted with Vite middlewares in dev mode.
   - Implement WebSocket server on the same HTTP server (`ws`) handling rooms, player joins, chat, moves, card actions, and bot triggers.
   - Add REST API endpoints (`/api/rooms`, `/api/rooms/:code`, `/api/rooms/:code/action`) so Vercel deployment has instant serverless room support.
3. **Step 3: Tactical Isometric Serpentine Board & Token Animation (`src/components/Board/`)**:
   - Render the 50-tile track with distinct elemental zone art (Earth green/stone, Fire molten red, Water deep ocean cyan, Air sky lavender, and Aetherya gold).
   - Hexagonal/Pentagonal Guardian gates at realm thresholds with glowing gate status indicators.
   - Smooth token hop animations with sound synth effects and camera pan.
4. **Step 4: Interactive Gameplay Overlays & Modal Encounters (`src/components/Modals/`)**:
   - *Pintuan ng Diwaling Gate*: Clue comparison and group vote UI.
   - *Pagsubok Challenge*: Clean riddle / trivia card modal with live countdown timer and instant submit.
   - *Kapalaran Fate*: Choice A vs Choice B narrative card modal with risk/reward payoff animations.
   - *Impostor Accusation*: Dramatic accusation sequence with voting result feedback.
5. **Step 5: Hand Drawer, Real-Time Chat & Dice Controls**:
   - Uno-style collapsible player hand with Biyaya card inspect, shield status, and action triggers.
   - In-game real-time chat with room status log and quick reaction emojis.
   - Animated 3D/canvas dice roller with physics bounce sound.
6. **Step 6: Admin Suite & Modular Card Balancer (`src/components/Admin/`)**:
   - Password modal (`diwa_admin_2026`).
   - Card deck manager with search, filter, and edit controls.
   - Modular effect stacker: add/remove multiple effect primitives per card.
   - Asset customizer: upload/select custom character tokens and card frame art.
   - JSON export and import for seamless balance sharing.
7. **Step 7: Vercel Deployment Documentation (`DEPLOYMENT_VERCEL.md`)**:
   - Comprehensive standalone markdown document detailing deployment instructions, environment variables, Vercel build settings, and serverless API proxy configuration.
8. **Step 8: Verification & Compilation**:
   - Ensure clean TypeScript build and full test execution.
