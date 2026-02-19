---
name: p4client-feature
description: >
  Guide for adding new features to the P4Client Electron application and understanding its
  architecture. Use when: (1) Adding a new feature or view to the app, (2) Asking about the
  project architecture, process model, or code organization, (3) Needing to understand existing
  patterns (IPC, preload, hooks, components, theming, testing). Do NOT use for simple bug fixes,
  typos, or refactors that don't require architectural understanding.
---

# P4Client Feature Development

## Planning Phase

Before writing code, create a plan document at `.agents/Features/<feature-name>-plan.md`. The plan must answer these four questions:

1. **What state needs to be tracked?** — List each piece of state, its type, and where it lives (hook state, Zubridge store, etc.)
2. **Where will that state come from?** — IPC calls, store sync, user input, etc.
3. **What user interactions will be needed?** — Click handlers, navigation, form inputs
4. **How will user interactions change the state?** — Map each interaction to its state change

The plan should also include: requirements table, UI mockup (ASCII), file structure, and implementation steps. See existing plans in `.agents/Features/` for examples.

### Test Planning

The plan document must include a **Testing Strategy** section. Design for testability from the start — do not treat tests as an afterthought.

**Identify mock boundaries during planning.** For each function in the feature module, list the external dependencies that will need mocking:
- P4 CLI calls → mock `executeP4Command` from the executor module
- File system operations → mock the library (e.g., `fdir`) at the module level
- Third-party APIs → mock the client/SDK

**Design functions to be independently testable:**
- Keep business logic in the feature module (`src/Main/Features/<Name>/index.ts`), not in IPC handlers or hooks
- Each exported function should accept its inputs as parameters (not read global state) and return a result wrapper
- Pure helper functions (parsing, tree building, data transformation) should be separable from I/O so they can be tested via the public functions that call them

**Plan test scenarios for each exported function.** For every function, list:
- Happy path(s) — normal input, expected output
- Error cases — dependency throws, invalid input, missing data
- Edge cases — empty results, boundary values, unusual but valid input
- Default behavior — what happens when optional parameters are omitted

**Mock chained/builder APIs explicitly.** When a dependency uses a builder pattern (e.g., `new fdir().withMaxDepth(0).onlyDirs().crawl(path)`), plan individual mocks for each method in the chain and re-wire them in `beforeEach` after `clearAllMocks`.

Present the plan to the user for approval before implementing.

## Implementation Steps

Follow these steps in order. For full patterns and code examples, read [references/implementation-guide.md](references/implementation-guide.md).

1. **Shared types** — `src/shared/types/<feature>.ts`: Data interfaces, options, result wrapper, API interface, Window extension
2. **Feature module** — `src/Main/Features/<Name>/index.ts`: Business logic functions returning `{ success, data?, error? }`. Keep all logic here (not in IPC handlers). Accept inputs as parameters, return result wrappers — this makes every function directly testable without Electron
3. **IPC handlers** — `src/Main/main.ts`: Register `ipcMain.handle()` calls before window creation. Handlers should be thin pass-throughs to feature module functions
4. **Preload** — `src/Preload/preload.ts`: Expose typed API via `contextBridge`
5. **React hook** — `src/Render/Hooks/use<Feature>.ts`: State management, fetch, refresh
6. **Components** — `src/Render/Components/<Feature>/`: Container section + child components
7. **Navigation** — `src/Render/app.tsx`: Add to `AppView` type, nav button, conditional render
8. **Tests** — `test/Main/Features/<Feature>/index.test.ts`: See [Test Implementation](#test-implementation) below
9. **Verify** — Run `npm run lint` and `npx tsc --noEmit`, then `npm test` before committing

## Test Implementation

**File**: `test/Main/Features/<Feature>/index.test.ts`

Follow these rules when writing tests:

**Structure:**
- One `describe` block per exported function
- `beforeEach`: call `jest.clearAllMocks()` and re-wire any chained mock return values
- Use `afterAll` for cleanup if the module has singleton state (e.g., factory reset)

**Mocking:**
- Mock at the module level with `jest.mock("path/to/module")`
- Cast mocks for type safety: `const mockFn = mod.fn as jest.MockedFunction<typeof mod.fn>`
- For builder/chained APIs, create individual `jest.fn()` per method and wire return values in `beforeEach`
- Use `mockResolvedValue` / `mockRejectedValue` for async functions
- Use `mockResolvedValueOnce` when a test requires sequential calls to return different values

**Coverage per function:**
- Happy path — valid input produces `{ success: true, data }`
- Missing/invalid data — returns `{ success: false, error }` (not a throw)
- Dependency throws `Error` — caught, returns `{ success: false, error: message }`
- Dependency throws non-Error — caught, returns `{ success: false, error: fallback }`
- Empty results — returns `{ success: true, data: [] }` (not an error)
- Default parameters — verify correct default when optional params omitted
- Output ordering — verify alphabetical sorting if the function sorts results
- Argument pass-through — verify the mock was called with expected arguments

**Run tests:**
- Single file: `npx jest test/Main/Features/<Feature>/index.test.ts`
- Full suite: `npm test`

## Architecture Quick Reference

For full architecture details, read [references/architecture.md](references/architecture.md).

**Process model**: Renderer <-> Preload (contextBridge) <-> Main (Node.js)

**Key conventions**:
- IPC channels: `namespace:action` (e.g., `p4:getSubmittedChanges`)
- Result wrapper: `{ success: boolean; data?: T; error?: string }`
- Container components: session check -> loading -> error -> empty -> data
- Styling: Tailwind CSS v4 with `bg-[var(--color-accent)]` syntax for theme tokens
- Tests: Jest + ts-jest, mocks in `test/` mirroring `src/`
