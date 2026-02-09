# Feature: Remove Native p4api Provider

## Summary

Remove the native `p4api` npm package and its `ApiProvider` implementation entirely. The CLI provider (`CliProvider`) becomes the sole Perforce integration path. This eliminates the dual-provider pattern, the `useNativeApi` configuration flag, the factory fallback logic, and all native-module build concerns (ASAR unpacking, Vite externals).

---

## 1. Files to Delete

Delete the entire `src/Main/Features/P4/providers/api/` directory (4 files):

| File | Description |
|------|-------------|
| `src/Main/Features/P4/providers/api/index.ts` | `ApiProvider` class implementing `P4Provider` via native p4api bindings |
| `src/Main/Features/P4/providers/api/client.ts` | `P4Client` wrapper around `import P4 from "p4api"` — the only file that directly imports the native module |
| `src/Main/Features/P4/providers/api/mapper.ts` | Maps raw p4api response records to internal types (`mapChangeRecord`, `mapUserRecord`, `mapInfoRecord`) |
| `src/Main/Features/P4/providers/api/p4api.d.ts` | TypeScript type declarations for the `p4api` module |

---

## 2. Source Files to Modify

### `src/Main/Features/P4/factory.ts`

**Current behavior (52 lines):** Imports `useNativeApi` from config and `ApiProvider` from `./providers/api`. The `createProvider()` function checks `useNativeApi()` — if true, tries to instantiate `ApiProvider` with a try/catch fallback to `CliProvider`; if false, returns `CliProvider` directly.

**Changes:**
- Remove import of `useNativeApi` from `./config` (line 8)
- Remove import of `ApiProvider` from `./providers/api` (line 11)
- Simplify `createProvider()` to always return `new CliProvider()` — no conditional, no try/catch fallback
- Keep `getProvider()` (singleton pattern) and `resetProvider()` (dispose + reset) unchanged in structure

**After:**
```typescript
import { CliProvider } from "./providers/cli";
import type { P4Provider } from "./types";

let provider: P4Provider | null = null;

export function getProvider(): P4Provider {
  if (!provider) {
    provider = createProvider();
  }
  return provider;
}

function createProvider(): P4Provider {
  return new CliProvider();
}

export async function resetProvider(): Promise<void> {
  if (provider) {
    if (provider.dispose) {
      await provider.dispose();
    }
    provider = null;
  }
}
```

### `src/Main/Features/P4/config.ts`

**Current behavior (61 lines):** Defines `P4Config` interface with `useNativeApi: boolean` (default `true`), connection settings, and exports `useNativeApi()`, `getP4Config()`, `setP4Config()`, `resetP4Config()`.

**Changes:**
- Remove `useNativeApi` field from `P4Config` interface (lines 10-14)
- Remove `useNativeApi: true` from `defaultConfig` (line 27)
- Remove the exported `useNativeApi()` function (lines 51-53)
- Keep connection settings (`port`, `user`, `client`, `password`), `getP4Config()`, `setP4Config()`, and `resetP4Config()` unchanged

### `src/Main/Features/P4/types.ts`

**No structural changes required.** The `P4Provider` interface is already provider-agnostic — both `ApiProvider` and `CliProvider` implement it. It remains as-is.

**Optional:** Remove any comments referencing the dual-provider pattern if present.

### `src/Main/Features/P4/index.ts`

**No structural changes required.** This file imports from `./factory` (which still exports `getProvider` and `resetProvider`) and re-exports config functions and shared types. The public API surface is unchanged.

**Optional:** Remove any comments referencing `ApiProvider` or dual-provider if present.

---

## 3. Build/Config Files to Modify

### `package.json`

- Remove `"p4api": "^3.4.0"` from `dependencies` (line 53)
- Run `npm install` after to update `package-lock.json`

### `forge.config.ts`

- Remove the ASAR unpack rule for p4api (line 14): `unpack: "**/node_modules/p4api/**"`
- Remove the associated comment (line 13): `// Unpack native modules so they can be loaded at runtime`
- If `asar` config object becomes empty after this, simplify to `asar: true` or remove the key

### `vite.main.config.ts`

- Remove `"p4api"` from the `rollupOptions.external` array (line 13)
- If the external array becomes empty after this, remove the entire `external` property (or `rollupOptions` if it has no other keys)

---

## 4. Documentation to Update

### `CLAUDE.md`

**Line 35 — P4 feature description:**

Current:
> P4/ — Perforce integration with a **dual-provider pattern**: `ApiProvider` (native p4api bindings) and `CliProvider` (spawns p4 CLI). A factory (`factory.ts`) selects the provider and falls back to CLI if the native API is unavailable. Both implement the `P4Provider` interface.

Replace with:
> P4/ — Perforce integration via `CliProvider` (spawns p4 CLI commands). A factory (`factory.ts`) manages the singleton provider instance. The provider implements the `P4Provider` interface.

**Line 61 — Build output section:**

Current:
> Native modules (p4api) are unpacked from ASAR in `forge.config.ts`.

Remove this line entirely.

---

## 5. Tests to Update

### `test/Main/Features/P4/factory.test.ts` (110 lines)

**Current behavior:** Mocks both `ApiProvider` and `CliProvider`. Has 7 tests covering: ApiProvider selection when `useNativeApi` is true, CliProvider selection when false, singleton behavior, fallback from ApiProvider to CliProvider on error, reset behavior, and dispose handling.

**Changes:**
- Remove import of `ApiProvider` (line 10)
- Remove `jest.mock("...providers/api")` (line 14)
- Remove mock of `useNativeApi` from config mock
- **Delete test:** "should return ApiProvider when useNativeApi is true" (lines 29-36)
- **Delete test:** "should return CliProvider when useNativeApi is false" (lines 38-45)
- **Delete test:** "should fall back to CliProvider if ApiProvider throws" (lines 57-69)
- **Add test:** "should return CliProvider" — verify `createProvider()` always returns a `CliProvider` instance
- **Keep test:** "should return same provider instance on subsequent calls" (lines 47-55) — still valid for singleton behavior
- **Keep test:** "should allow creating new provider after reset" (lines 73-82) — still valid
- **Keep test:** "should call dispose on provider if available" (lines 84-96) — still valid
- **Keep test:** "should handle provider without dispose method" (lines 98-107) — still valid

### `test/Main/Features/P4/config.test.ts` (109 lines)

**Changes:**
- Remove assertions for `useNativeApi` in default config test (line 17: `expect(config.useNativeApi).toBe(true)`)
- Remove test "should update useNativeApi flag" (lines 34-39)
- Remove the entire `describe("useNativeApi")` block (lines 73-89) containing:
  - "should return true by default"
  - "should return false when set to false"
  - "should return true when set back to true"
- In the reset test (lines 92-107): remove `useNativeApi: false` from the custom config setup (line 95) and remove the assertion `expect(config.useNativeApi).toBe(true)` after reset (line 103)
- Keep all other tests: default config shape, partial update merging, config immutability, and reset behavior (minus `useNativeApi` assertions)

---

## 6. Tests Unaffected

These test files require **no changes** and should continue to pass as-is:

| Test File | Reason |
|-----------|--------|
| `test/Main/Features/P4/cli-auth.test.ts` | Tests CliProvider authentication — no ApiProvider references |
| `test/Main/Features/P4/executor.test.ts` | Tests CLI command execution — no ApiProvider references |
| `test/Main/Features/P4/parser.test.ts` | Tests CLI output parsing — no ApiProvider references |
| `test/Main/Features/P4/tickets.test.ts` | Tests ticket management — no ApiProvider references |
| `test/Main/Features/P4/index.test.ts` | Tests public API that delegates to factory — provider-agnostic |
| `test/Main/Features/Server/*.test.ts` | Server feature tests — entirely separate from P4 provider |
| All renderer/component tests | UI tests — no direct provider dependencies |

---

## 7. Verification Steps

After all changes are made, run the following in order:

1. **`npm install`** — Regenerate `package-lock.json` after removing `p4api` dependency
2. **`npm test`** — All tests must pass (factory and config tests updated, all others unchanged)
3. **`npm run lint`** — No lint errors from removed imports or unused references
4. **`npm start`** — App launches and can connect to a Perforce server via CLI provider
5. **`npm run make`** — Package builds successfully without native module concerns

---

## Risk Assessment

**Low risk.** The `CliProvider` is already the production fallback and is fully tested. The native `p4api` module is the primary source of build complexity (ASAR unpacking, native bindings). Removing it simplifies the build pipeline and eliminates a class of platform-specific build failures.

**No public API changes.** The `P4Provider` interface, IPC channels, and all exported functions from `src/Main/Features/P4/index.ts` remain identical. Renderer code is completely unaffected.
