# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

P4Client is an Electron desktop application for managing Perforce (P4) servers and viewing changelists. Built with Electron 39, React 19, TypeScript 5, and Vite 5. Uses Electron Forge for packaging.

## Commands

- **Start dev:** `npm start` (launches Electron with Vite dev server on localhost:5173)
- **Build/package:** `npm run make`
- **Lint:** `npm run lint`
- **Run all tests:** `npm test`
- **Run a single test:** `npx jest test/Main/Features/P4/factory.test.ts`
- **Run tests with coverage:** `npx jest --coverage`

## Architecture

### Process Model (Electron)

```
Renderer (React UI)  ←→  Preload (contextBridge)  ←→  Main (Node.js)
```

- **Main process** (`src/Main/main.ts`): Creates window, registers IPC handlers, manages Zustand store via Zubridge
- **Preload** (`src/Preload/preload.ts`): Exposes `window.p4API`, `window.serverAPI`, `window.electronAPI`, and `window.zubridge` via contextBridge
- **Renderer** (`src/Render/app.tsx`): React app consuming exposed APIs
- **Shared types** (`src/shared/types/`): Type definitions shared across all processes — `p4.ts`, `server.ts`, `store.ts`

### Feature Organization (Main Process)

Features live in `src/Main/Features/` with each feature exporting a public API:

- **P4/** — Perforce integration via `CliProvider` (spawns p4 CLI commands). A factory (`factory.ts`) manages the singleton provider instance. The provider implements the `P4Provider` interface.
- **Server/** — Server CRUD via `electron-store`, authentication (`auth.ts`), and session management (`session.ts`). P4 tickets are stored in p4's own ticket file, not in app storage.
- **Theme/** — Theme toggle action handler for Zubridge.

### State Management

- **Cross-process state** uses Zubridge (`@zubridge/electron`) to sync a Zustand store between main and renderer. The store is created in `src/Main/store.ts` with handlers attached in `src/Main/bridge.ts`.
- **Renderer-local state** uses React hooks: `useServers` (server management, login/logout, session) and `useP4Changes` (changelist fetching).
- Actions are dispatched from renderer via `useDispatch()` and handled in main process.

### IPC Channels

- `p4:getSubmittedChanges`, `p4:getPendingChanges`, `p4:getCurrentUser`
- `server:getServers`, `server:addServer`, `server:updateServer`, `server:removeServer`, `server:testConnection`
- `server:login`, `server:logout`, `server:getSessionStatus`, `server:validateSession`

### Result Pattern

P4 operations return `P4Result<T>` with `{ success, data?, error? }` — always use this wrapper for IPC responses that can fail.

### Build Output

- Main: `.vite/build/main.js`
- Preload: `.vite/build/preload.cjs` (CommonJS required by Electron)
- Renderer: `.vite/build/render/index.html`


## Testing

Tests are in `test/` mirroring the `src/` structure. Jest with ts-jest, node environment. Coverage is collected from `src/Main/Features/P4` and `src/Main/Features/Server`.

## Styling

Tailwind CSS 4 with CSS custom properties for theming (light/dark). Theme variables defined in `src/Render/index.css` (e.g., `--color-bg-primary`, `--color-accent`).
