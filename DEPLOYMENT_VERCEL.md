# ATHANASIA: Ang Hiwaga ng Diwa — Built-In Vercel & Production Deployment Guide

**ATHANASIA: Ang Hiwaga ng Diwa** now features **100% built-in, out-of-the-box Vercel support** directly in the repository. You do **not** need to create any extra files or manually upload API endpoints.

---

## 1. Zero-Config Vercel Deployment (Built-In)

Everything required for Vercel is already pre-configured in this repository:
* **`/api/index.ts`**: The built-in Vercel Serverless Function handling all `/api/rooms`, `/api/health`, and game actions.
* **`vercel.json`**: Pre-configured rewrites mapping `/api/(.*)` directly to `/api/index` and SPA routes to `index.html`.
* **Vite Frontend**: Compiles into `dist/` with high-performance Tailwind CSS v4.

### How to Deploy from GitHub to Vercel:

1. **Push your repository** to your GitHub account.
2. Go to your [Vercel Dashboard](https://vercel.com) and click **"Add New..." ➔ "Project"**.
3. Select your repository (`AthanasiaVer2`).
4. Keep the default settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Click **"Deploy"**.

That's it! Vercel will automatically build the client assets into `dist/` and deploy `/api/index.ts` as a serverless backend.

---

## 2. Real-Time Multiplayer & Serverless Dual-Mode Architecture

The game incorporates dual-mode synchronization:
1. **Persistent Server Mode (Local / Cloud Run / Railway / VPS)**:
   * Runs `server.ts` with WebSocket server at `/ws` for millisecond-latency push updates.
2. **Serverless Mode (Vercel)**:
   * When deployed on Vercel, the client automatically utilizes active state polling (`/api/rooms/:code`) every 2.5 seconds as a fallback.
   * Enables multiplayer match codes, Diwaling gate group deductions, bot actions, and chat across separate players on Vercel without requiring third-party WebSocket infrastructure.

---

## 3. Bilingual UI Switch (Filipino / English)

A language switcher is available in the top navigation bar:
* **`FIL (🇵🇭)` / `ENG (🇺🇸)` toggle**: Switches all UI instructions, dialogs, buttons, rules, and event descriptions between Filipino and English.
* **Preserved Philippine Lore**: Titles and essential game properties (**ATHANASIA**, **Sumpa**, **Pahiwatig**, **Pagsubok**, **Biyaya**, **Kapalaran**, **Aninag**, **Impostor**, **Talvaris**, **Alabarya**, **Alonawon**, **Himaraya**, **Aetherya**, **Pintuan ng Diwaling**, **Anting-Anting**) strictly remain in their authentic Tagalog forms in both languages.

---

## 4. In-Game Admin Suite

* Click the gear/settings icon in the top navigation bar or the "Admin Suite" link in the lobby footer.
* Default admin password:
  ```
  diwa_admin_2026
  ```
* Customize avatars, rebalance card effect stacks, and test room states live.
