# ATHANASIA: Ang Hiwaga ng Diwa — Downward Scroll Bugfix, English/Tagalog UI Language System & Aetherya Map Template Engine Overhaul

Architectural blueprint and execution plan for resolving game instance viewport scrolling, introducing a bilingual language toggle (English default with instant Tagalog switch for non-game essential UI), and overhauling the Tile Map Editor with the 1700×1700 Aetherya triangular/hexagonal grid template engine, real-time realm quota meters, and dual in-game board compatibility.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during Phase 1 interactive clarification:
> - **Downward Pull Bug Cause**: The auto-scroll down every few seconds in active matches is caused by `chatEndRef.current.scrollIntoView({ behavior: 'smooth' })` in `GameChat.tsx` firing on room polling updates, which drags the entire browser window down. This will be fixed by scoping scroll updates strictly to the chat container element's `scrollTop = scrollHeight`.
> - **Language System Scope**: English is the default language with an instant Tagalog toggle located in the top navigation bar (`Navbar.tsx`). All non-game essentials (navigation, buttons, lobby, admin, rules UI, profile editor, map editor, status indicators, and modal headers) will be localized, while preserving authentic game essentials (Sumpa curses, Pahiwatig clues, Pagsubok bugtong riddles, Kapalaran dilemmas, and character titles) in their original Philippine mythological flavor.
> - **Map Editor Full Overhaul**: The map editor is overhauled with the clean 1700×1700 SVG triangular/hexagonal grid engine from the provided HTML file (`Aetherya-Map-Template_5a9c0936.html`), featuring the 5 realm polygons, embedded tile art assets, 4 Diwaling gates, Aetherya Varyndor finale hexagon, real-time realm quota progress meters, order numbers toggle, undo history, and JSON import/export.
> - **Dual Board Compatibility**: Maps created or edited in the new template engine are automatically serialized into the game's sequential `BoardTile[]` data structure, ensuring seamless playability across both the **Mahiwagang Tile Map** and the **Payak na Track** in active multiplayer matches.

---

## 1. Overview & Core Concept

*ATHANASIA: Ang Hiwaga ng Diwa* combines strategic board progression across 5 elemental realms (*Talvaris*, *Alabarya*, *Alonawon*, *Himaraya*, *Aetherya*) with social deduction card play.

This update delivers three major enhancements:
1. **Viewport Stability**: Eliminates the disruptive window-level auto-scroll during gameplay by isolating chat history auto-scroll within its internal scroll container.
2. **Bilingual UI Experience**: Provides an intuitive English / Tagalog language toggle in the top bar with browser persistence, making the interface globally accessible while preserving the cultural authenticity of the mythological cards and lore.
3. **Aetherya Grid Map Template Integration**: Replaces the previous map editor with the exact mathematical triangular-hexagonal tessellation engine from `Aetherya-Map-Template_5a9c0936.html`, complete with realm territory quota tracking, order numbering, and full synchronization with the in-game multiplayer board renderer.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Seamless Gameplay Viewport (Bug Resolution)**:
   - When entering an active match, rolling dice, or receiving automated bot chat messages every few seconds, the browser window remains steady.
   - The game chat box scrolls to the latest message inside its own scrollable panel without moving the player's view of the board or hand drawer.
2. **Language Toggle & Bilingual Navigation**:
   - The top navbar features a clean segmented control (`EN | TL`) styled with subtle border highlights.
   - Clicking `TL` or `EN` immediately switches all UI labels (buttons, modals, tooltips, lobby controls, admin tabs, rules headers, and toast banners) without page reloads or match disruption.
   - Preserves player profile data, room states, and card question texts. Preference is stored in `localStorage` (`athanasia_language`) defaulting to `'en'`.
3. **Aetherya Grid Map Template Editor**:
   - Opened via the top navbar or lobby "Map Editor" button.
   - Top toolbar presents the 6 core tools:
     - `1: Daan` (Authentic filigree triangle art)
     - `2: Pagsubok` (Dark purple sun sigil triangle art)
     - `3: Kapalaran` (Radiant ruby flame triangle art)
     - `4: Gate` (Hexagon gate placement on grid vertices, numbered 1–4)
     - `5: Finale` (Large gold Aetherya Varyndor hexagon)
     - `6: Eraser` (Tile/hexagon removal)
   - Toolbar utilities: Keyboard shortcuts (`1`–`6`, `Ctrl+Z`), `Order numbers` checkbox to display `#1`..`#50` progression, `Undo`, `Clear all`, `Save to Server`, `Test Play`, and JSON `Copy layout` / `Load pasted layout`.
   - Bottom real-time realm quota cards display exact target counters:
     - **Talvaris**: 1 Gate, 8 Daan, 4 Pagsubok, 4 Kapalaran (Total: 17)
     - **Alabarya**: 1 Gate, 7 Daan, 3 Pagsubok, 3 Kapalaran (Total: 14)
     - **Alonawon**: 1 Gate, 5 Daan, 3 Pagsubok, 2 Kapalaran (Total: 11)
     - **Himaraya**: 1 Gate, 4 Daan, 2 Pagsubok, 1 Kapalaran (Total: 8)
     - **Aetherya**: 1 Finale Hexagon
     - Progress bars indicate completion status (`done` in soft green or `over` in amber/coral).
4. **In-Game Play of Template Maps**:
   - When a room uses a custom or canonical template map, players can toggle between the **Mahiwagang Tile Map** and the **Payak na Track**.
   - Player tokens animate and hop across the tiles, stopping appropriately at locked realm gates.

### Visual Identity & Theme

- **Palette**: Dark mythological void (`#0b0f17`, `#0d0b10`), rich gold accents (`#fefe56`, `#f59e0b`), emerald for Talvaris (`#c98a5e`, `#1a0402`), crimson for Alabarya (`#ff6a4d`, `#d4321e`), azure for Alonawon (`#aab1ff`, `#6470ff`), celestial mist for Himaraya (`#d4f0fc`), and gold for Aetherya (`#fefe56`).
- **Typography**: `Cinzel` & `Marcellus` for classical titles; `Plus Jakarta Sans` & `Instrument Sans` for crisp UI controls and tabular counts.
- **Micro-Interactions**: Smooth hover outlines on grid triangles, responsive cursor feedback (`crosshair` on map, pointer on toolbar), and tactile sound effects for tool selection and tile placement.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale |
| :--- | :--- | :--- |
| **Chat Scroll Bug Fix** | Container `scrollTop = scrollHeight` instead of `window.scrollIntoView` | `scrollIntoView()` on an inner child forces parent document scrolling in many browser viewports. Confining scroll to the chat's inner container eliminates screen jumping. |
| **Language Toggle Scope** | English by default for UI chrome; retain Tagalog for mythological cards & lore | Preserves cultural richness and riddle integrity while making navigation, room hosting, rules, and settings accessible to international and English-speaking players. |
| **Map Grid Geometry** | 1700×1700 90°-rotated triangular lattice (`W=72`, `HT=W*0.866`) | Directly ports the tested spatial math from `Aetherya-Map-Template_5a9c0936.html` ensuring gate hexagons stand on points and tiles tessellate with zero visual seams. |
| **Map Storage & Serialization** | Store raw template layout (tiles map, gates, finale) + serialize to ordered `BoardTile[]` | Allows the editor to retain full editing state while supplying the standard ordered array needed by the board game movement engine and simple track. |

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             ATHANASIA CLIENT                                │
│                                                                             │
│  ┌───────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │   Top Navbar (i18n)   │  │             Game Arena View                │  │
│  │  - EN / TL Toggle     │  │  - Viewport: No Window Auto-Scroll         │  │
│  │  - Profile / Rules    │  │  - GameChat: Scoped Container Scroll       │  │
│  └──────────┬────────────┘  │  - Dual Board: Mahiwaga & Payak Track      │  │
│             │               └─────────────────────┬──────────────────────┘  │
│             ▼                                     ▼                         │
│  ┌───────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │ AetheryaMapTemplate   │  │             Matchmaking Lobby              │  │
│  │  - 1700x1700 Lattice  │  │  - Localized UI (EN / TL)                  │  │
│  │  - 5 Realm Quotas     │  │  - Host Kick & Map Selector                │  │
│  │  - Undo / JSON Sync   │  │  - Pilgrim Profile Card                    │  │
│  └──────────┬────────────┘  └─────────────────────┬──────────────────────┘  │
└─────────────┼─────────────────────────────────────┼─────────────────────────┘
              │ HTTP /api/maps                      │ WebSocket /ws & HTTP
              ▼                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXPRESS SERVER (server.ts)                        │
│                                                                             │
│  ┌───────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │     Map Registry      │  │             Room State Store               │  │
│  │  - Template Layouts   │  │  - KICK_PLAYER, ROLL_DICE, etc.            │  │
│  │  - Canonical Seed     │  │  - Synchronized Broadcasts                 │  │
│  └───────────────────────┘  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Modules & Implementation Steps

1. **Chat Viewport Bugfix (`GameChat.tsx`)**:
   - Replace `chatEndRef.current?.scrollIntoView()` with a dedicated `messagesContainerRef` updating `messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight`.
   - Prevent window-level jumping during automatic polling and bot turns.
2. **Bilingual UI Translation System (`i18n.ts`)**:
   - Create lightweight dictionary mapping UI keys for navigation, matchmaking, lobby, rules modal, profile editor, admin modal, board controls, and toasts.
   - Export `useLanguage()` hook and context provider with `'en'` as default and `'tl'` switch, reading/writing `localStorage`.
   - Add segmented language switch button in `Navbar.tsx`.
3. **Aetherya Map Template Engine (`TileMapEditor.tsx` & `AetheryaMapCanvas.tsx`)**:
   - Integrate the complete 1700×1700 SVG lattice geometry (`isUp`, `corners`, `cellPts`, `centroid`, `hitCell`, `hitVertex`, `cellsAtVertex`, `cellsInHex`) and realm boundaries.
   - Implement the 6 tools (`daan`, `pagsubok`, `kapalaran`, `gate`, `fin`, `erase`) with high-resolution SVG/PNG assets.
   - Build realm quota cards (Talvaris, Alabarya, Alonawon, Himaraya, Aetherya) with real-time target meters (`done` / `over`).
   - Implement toolbar controls: `Order numbers`, `Undo` history stack, `Clear all`, `Save to Server`, `Test Play`, and JSON `Copy layout` / `Load pasted layout`.
4. **Map Serialization & In-Game Dual Board Compatibility**:
   - Convert template map data into sequential `BoardTile[]` with coordinates, realm assignments, and gate indexes.
   - Update `TileMapRenderer.tsx` and `GameBoard.tsx` to render template-based maps seamlessly in both the geometric map view and the simple track overview.
5. **End-to-End Build & Verification**:
   - Run compilation and linting tests.
   - Verify viewport stability during matches, instant language switching, map creation with quota verification, and room playability.
