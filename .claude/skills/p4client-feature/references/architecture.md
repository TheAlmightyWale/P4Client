# P4Client Architecture Reference

## Overview

P4Client is an Electron + React + TypeScript desktop app for Perforce version control. Uses Zubridge for cross-process state management, Tailwind CSS v4 for styling, and Vite for builds.

## Process Model

```
Renderer (React UI)  <->  Preload (contextBridge)  <->  Main (Node.js)
```

- **Main** (`src/Main/`): Business logic, IPC handlers, Zustand store, features
- **Preload** (`src/Preload/preload.ts`): Exposes APIs via `contextBridge`
- **Renderer** (`src/Render/`): React UI, hooks, components

## Directory Layout

```
src/
  Main/
    main.ts              # IPC handler registration, window creation
    store.ts             # Zustand store creation
    bridge.ts            # Zubridge bridge setup
    Features/
      index.ts           # AppState interface, initialState
      P4/                # Perforce CLI integration
      Server/            # Server CRUD, auth, sessions
      Theme/             # Theme toggle action
      Dir/               # Directory explorer (fdir-based)
  Preload/
    preload.ts           # contextBridge API exposure
  Render/
    app.tsx              # Navigation, view switching
    index.css            # Tailwind + CSS custom properties
    Hooks/               # React hooks (useServers, useP4Changes, useDirExplorer)
    Components/
      common/            # Spinner, ErrorMessage
      button.tsx         # Reusable Button component
      P4/                # ChangesSection, PendingChangesSection
      Dir/               # DirectoryExplorerSection, DirectoryTree, DirectoryNode
      Server/            # ServerManagementPage
  shared/types/          # Types shared across all processes (p4.ts, server.ts, dir.ts)
test/                    # Jest tests mirroring src/ structure
.agents/Features/        # Feature plan documents
```

## Key Patterns

### IPC Channel Convention

Channels use `namespace:action` format:
- `p4:getSubmittedChanges`, `p4:getPendingChanges`
- `server:login`, `server:getAll`
- `dir:getWorkspaceRoot`, `dir:listDirectories`

### Result Pattern

All IPC responses use a typed result wrapper:

```typescript
interface P4Result<T> {  // or DirResult<T>, etc.
  success: boolean;
  data?: T;
  error?: string;
}
```

### Navigation

`src/Render/app.tsx` uses a `AppView` union type and `useState` for view switching. Each view maps to a container component rendered conditionally.

### Container Component Pattern

Container components follow this structure:
1. Get session status from `useServers()` hook
2. Get feature data from a dedicated hook
3. Render states in order: loading -> not logged in -> error -> empty -> data
4. Include a Refresh button when logged in

### Preload API Pattern

APIs exposed as typed objects via `contextBridge.exposeInMainWorld()`. Methods wrap `ipcRenderer.invoke()` calls. Window interface extended in shared types.

### Styling

Tailwind CSS v4 with CSS custom properties for theming:
- `--color-bg-primary/secondary/tertiary`
- `--color-text-primary/secondary/muted`
- `--color-accent/accent-hover/accent-active`
- `--color-success/warning/error/info`
- `--color-border/border-focus`

Components use `bg-[var(--color-accent)]` syntax. Dark theme via `.dark` class on `<html>`.

### Testing

Jest with ts-jest, node environment. Tests in `test/` mirror `src/` structure. Mock external dependencies (executor, fdir, etc.) and test feature functions directly.
