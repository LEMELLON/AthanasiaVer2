# ATHANASIA: Ang Hiwaga ng Diwa — Deployment Guide (Vercel & Production)

This guide provides step-by-step instructions for deploying **ATHANASIA: Ang Hiwaga ng Diwa** to **Vercel** as well as containerized platforms (such as Google Cloud Run, Railway, or Render).

---

## 1. System Architecture Overview

* **Frontend**: React 19 SPA built with Vite, Tailwind CSS v4, and Lucide icons.
* **Backend**: Express server running on Node.js with:
  * Native **WebSocket server** (`/ws`) for instant real-time multi-user synchronization and live chat.
  * **REST API endpoints** (`/api/rooms/*` and `/api/admin/*`) providing serverless-compatible room polling and state dispatch for serverless platforms like Vercel.
* **Audio Engine**: Web Audio API procedural sound synthesizer (no external audio assets or CDNs required).
* **Game Lore & Rules**: Complete implementation of *ATHANASIA: Ang Hiwaga ng Diwa (V0.3)* including all 60 Pagsubok challenge cards, 6 Sumpa curses, 18 Pahiwatig clue cards, 30 Biyaya action cards, and 30 Kapalaran risk/reward choices.

---

## 2. Required API Keys and Environment Variables

Define these environment variables in your deployment environment:

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | Optional | `3000` | Port for the HTTP/WebSocket server. |
| `NODE_ENV` | Optional | `production` | Set to `production` when deployed. |
| `APP_URL` | Optional | `https://your-app.vercel.app` | Canonical URL of your deployed application. |
| `GEMINI_API_KEY` | Optional | - | Optional Google Gemini API key if enabling server-side AI generative lore features. |
| `ADMIN_PASSWORD` | Optional | `diwa_admin_2026` | Master password for the in-game Admin Suite and Modular Card Balancer. |

---

## 3. Deploying to Vercel (Step-by-Step)

### Option A: Using the Vercel Web Dashboard (Recommended)

1. **Push your repository** to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New..."** ➔ **"Project"**.
3. Import your repository.
4. In the **Project Settings**:
   * **Framework Preset**: Select `Vite` (or `Other`).
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
5. **Environment Variables**:
   * Add `NODE_ENV` = `production`
   * Add any optional keys (e.g. `GEMINI_API_KEY`, `APP_URL`).
6. Click **"Deploy"**.
7. Vercel will build the frontend assets into `dist/` and route requests through `vercel.json`.

---

### Option B: Deploying via Vercel CLI

1. Install the Vercel CLI globally if you haven't already:
   ```bash
   npm install -g vercel
   ```
2. In the project root directory, run:
   ```bash
   vercel
   ```
3. Follow the interactive prompts to link your project.
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

---

## 4. Serverless `/api` Architecture & Real-Time Multiplayer on Vercel

### A. Dedicated Serverless Function Handlers (`/api/index.ts` & `/api/[...path].ts`)
To prevent `405 Method Not Allowed` rejections and avoid SPA fallback routing collisions on Vercel, the app includes dedicated serverless function entrypoints:
* `/api/index.ts`: Handles requests to `/api` and `/api/`
* `/api/[...path].ts`: Catch-all serverless function handling dynamic routes such as `/api/rooms`, `/api/rooms/:code/join`, `/api/rooms/:code/action`, `/api/maps`, and `/api/admin/settings`
* In `server.ts`, all API routes are mounted onto an `apiRouter` that is dual-mounted at both `/api` and `/`, ensuring route resolution regardless of path stripping.
* Express listener and WebSocket Server are guarded with `if (!process.env.VERCEL)` so the app exports cleanly as a serverless lambda on Vercel while running with persistent WebSockets locally and in Docker.

### B. Isolated Routing (`vercel.json`)
The `vercel.json` config uses a negative lookahead regex to strictly isolate API endpoints from the static single-page app rewrite:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api", "destination": "/api/index" },
    { "source": "/api/(.*)", "destination": "/api/[...path]" },
    { "source": "/((?!api($|/)).*)", "destination": "/index.html" }
  ]
}
```

### C. Map Editor & Room Synchronization
* **1700x1700 Lattice Symmetry**: Both the Map Editor canvas and the in-game `TileMapRenderer` use the identical 1700x1700 equilateral triangular lattice geometry (`aetheryaLattice.ts`), Baybayin sigils (`ᜇ` Daan, `ᜉ` Pagsubok, `ᜃ` Kapalaran), radial/linear gradients, and territory boundaries.
* **Dual-Persistence Sync**: When a custom map is saved or test-played, the full `TileMapData` is persisted to both the server registry (`POST /api/maps`) and `localStorage` (`athanasia_active_custom_map`).
* **Direct Payload Embedding**: During room creation, the full `customMap` object is passed directly to `POST /api/rooms` so that even cold-started serverless instances immediately have access to the exact custom map without relying on shared in-memory state.

### D. Dual-Mode Networking & Fallback Polling
* On standard persistent Node servers (or local `npm run dev`), the app connects to `/ws` for sub-millisecond WebSocket updates.
* On Vercel (where serverless lambdas are ephemeral), the client's automated fallback polling synchronizes `/api/rooms/:code` every 2.5 seconds.
* This ensures that players can join the same room code, see live movement, receive chat messages, and participate in Diwaling gate deductions regardless of hosting platform!

---

## 5. Local Development and Testing

To test the application locally with full WebSockets and live hot-reloading:

```bash
# 1. Install all dependencies
npm install

# 2. Run the full-stack dev server (port 3000)
npm run dev
```

Open your browser to:
```
http://localhost:3000
```

---

## 6. Accessing the In-Game Admin Suite

* Click the gear/settings icon in the top navigation bar or the "Admin Suite" link in the lobby footer.
* Enter the system password:
  ```
  diwa_admin_2026
  ```
* In the Admin Suite, you can:
  * **Build Modular Cards**: Stack effects (e.g., `MOVE_FORWARD`, `DRAW_BIYAYA`, `SKIP_TURN`, `ANTING_ANTING_SHIELD`, `SWAP_PLAYERS_SAME_REALM`).
  * **Customize Assets**: Change character avatar URLs and realm environments.
  * **Rebalance Decks**: Edit questions, answers, and choices for all 6 decks.
  * **Export/Import JSON**: Download and share custom balance patches.
