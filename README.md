# Benchmark

Benchmark is the Next.js frontend that lets both human players and AI agents play a curated set of HTML5 mini-games, instrumented to measure cognitive/skill signals via Skillprint's scoring backend. This repo is a frontend shell only — it has no backend of its own; it talks to the Skillprint API (staging/production, resolved dynamically — see [`getApiBaseUrl`](src/app/utils/cookieUtils.ts)) for the game catalog, moods/skills taxonomy, auth, and scoring.

## Two surfaces

- **`/benchmark`** ([src/app/benchmark](src/app/benchmark)) — an AI-agent leaderboard and VLM (vision-language-model) simulator. [`GameCards.tsx`](src/app/benchmark/components/GameCards.tsx) hard-codes the small set of games that actually have assets checked into this repo (Colorize, Hextris, Box Tower) alongside per-game "AI baseline" scores, and [`VLMAgentSimulator.tsx`](src/app/benchmark/components/VLMAgentSimulator.tsx) / [`LeaderboardTable.tsx`](src/app/benchmark/components/LeaderboardTable.tsx) present how different AI providers perform on them.
- **`/game/[slug]`** ([src/app/game/[slug]/GameClient.tsx](src/app/game/[slug]/GameClient.tsx)) — the human-play flow. It:
  1. Resolves the requested slug against the backend catalog and maps it to a local static path (`public/games/live/<Name>/static/index.html`).
  2. Renders the game in a sandboxed `<iframe>`.
  3. Starts a Skillprint SDK session ([`skillprintSdk.ts`](src/app/lib/skillprintSdk.ts)) and polls the backend for live gameplay adjustments/tips while the game runs.
  4. Listens for `postMessage` events from the game (`GAME_COMPLETE`, screenshots, etc.), records the session locally ([`gameSessionUtils.ts`](src/app/lib/gameSessionUtils.ts)), and routes the player to a results/survey screen.

## How games are delivered

Games are plain static HTML5 bundles served from `public/games/live/<Name>/static/`. [`src/app/config/gameConfig.ts`](src/app/config/gameConfig.ts) is the local registry of "known" games — slugs, display metadata, and per-game exit-button styling — and [`GameClient.tsx`](src/app/game/[slug]/GameClient.tsx) maps a slug to its directory via `SLUG_TO_DIR_MAP`.

**Note:** `gameConfig.ts` currently lists 36 known game slugs, but only **Box Tower, Colorize 2, and Hextris** have built assets actually present under `public/games/live/`. The rest are configured but not yet playable here — see [#4](../../issues/4) for tracking the asset-sync gap, and [#1](../../issues/1)/[#2](../../issues/2)/[#3](../../issues/3) for known bugs in the current event-reporting bridge between a game and this app.

Game instrumentation (score/event reporting, session start/stop, live parameter adjustments) is added on the [skillprint/games](https://github.com/skillprint/games) side via the [`skillprint-js-sdk`](https://www.npmjs.com/package/skillprint-js-sdk) package; a matching build of that game then needs to be copied into `public/games/live/` here before it's playable through this app.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

By default the app points at the staging Skillprint API (`https://api.staging.skillprint.co/`); set `NEXT_PUBLIC_SKILLPRINT_API_BASE_URL` to override it, and `NEXT_PUBLIC_API_KEY` for the partner API key used by the Skillprint SDK.

## Key directories

- `src/app/game/[slug]/` — human-play game host (iframe + SDK session + result routing)
- `src/app/benchmark/` — AI-agent leaderboard/VLM simulator surface
- `src/app/config/` — game registry (`gameConfig.ts`, `inactiveGames.ts`, `whitelist.ts`)
- `src/app/lib/` — Skillprint SDK client and local game-session storage
- `src/app/api/` — thin REST client for the Skillprint backend
- `public/games/live/` — static game bundles actually shipped with this app
- `public/lib/skillprint-js-sdk/` — vendored copy of the SDK source (currently unused in practice — see [#3](../../issues/3))

## Learn More (Next.js)

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
