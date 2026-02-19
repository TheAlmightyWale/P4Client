# Feature Implementation Guide

Step-by-step implementation instructions for adding a feature to P4Client. Each step includes the file to modify and the pattern to follow.

## Table of Contents

1. [Shared Types](#1-shared-types)
2. [Main Process Feature Module](#2-main-process-feature-module)
3. [IPC Handler Registration](#3-ipc-handler-registration)
4. [Preload Exposure](#4-preload-exposure)
5. [React Hook](#5-react-hook)
6. [Renderer Components](#6-renderer-components)
7. [Navigation Tab](#7-navigation-tab)
8. [Tests](#8-tests)

---

## 1. Shared Types

**File**: `src/shared/types/<feature>.ts`

Create a type file with:
- Data interfaces (what the feature returns)
- Options interfaces (what the feature accepts)
- A result wrapper matching `{ success: boolean; data?: T; error?: string }`
- An API interface defining the methods exposed to the renderer
- A `declare global { interface Window { ... } }` extension

Example pattern:

```typescript
export interface MyData { /* fields */ }
export interface MyOptions { /* params */ }

export interface MyResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MyAPI {
  getData: (options: MyOptions) => Promise<MyResult<MyData[]>>;
}

declare global {
  interface Window {
    myAPI: MyAPI;
  }
}
```

## 2. Main Process Feature Module

**File**: `src/Main/Features/<FeatureName>/index.ts`

Create an `index.ts` that exports async functions returning the result wrapper type. Each function:
- Uses try/catch
- Returns `{ success: true, data }` on success
- Returns `{ success: false, error: message }` on failure
- Converts unknown errors: `error instanceof Error ? error.message : "fallback message"`

For P4 CLI operations, import from `../P4/providers/cli/executor` and `../P4/providers/cli/parser`.

## 3. IPC Handler Registration

**File**: `src/Main/main.ts`

Add handlers inside `app.whenReady().then(...)`, before window creation:

```typescript
import { myFunction } from "./Features/MyFeature";

ipcMain.handle("feature:action", async (_event, options) => {
  return myFunction(options);
});
```

## 4. Preload Exposure

**File**: `src/Preload/preload.ts`

Add a typed API object and expose it:

```typescript
import type { MyAPI } from "../shared/types/myFeature";

const myAPI: MyAPI = {
  getData: (options) => ipcRenderer.invoke("feature:action", options),
};
contextBridge.exposeInMainWorld("myAPI", myAPI);
```

## 5. React Hook

**File**: `src/Render/Hooks/use<Feature>.ts`

Create a hook that manages:
- Data state, loading state, error state
- An `initialize` or `fetch` function using `useCallback`
- A `refresh` function that clears state and re-fetches
- Returns all state and actions

Pattern:

```typescript
export function useMyFeature() {
  const [data, setData] = useState<MyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.myAPI.getData({ /* options */ });
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch, refresh: fetch };
}
```

## 6. Renderer Components

**Directory**: `src/Render/Components/<Feature>/`

Create a container section component following this pattern:

```typescript
export const MySection: React.FC = () => {
  const { sessionStatus, loading: sessionLoading } = useServers();
  const { data, loading, error, fetch, refresh } = useMyFeature();
  const isLoading = sessionLoading || loading;

  useEffect(() => {
    if (sessionStatus.isLoggedIn && data.length === 0 && !loading) {
      fetch();
    }
  }, [sessionStatus.isLoggedIn, data.length, loading, fetch]);

  const renderContent = () => {
    if (isLoading) return <Spinner /> + loading message;
    if (!sessionStatus.isLoggedIn) return login prompt;
    if (error) return <ErrorMessage message={error} onRetry={refresh} />;
    if (data.length === 0) return empty message;
    return <DataDisplay data={data} />;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2>Title</h2>
        {sessionStatus.isLoggedIn && <Button onClick={refresh}>Refresh</Button>}
      </div>
      {renderContent()}
    </div>
  );
};
```

Reusable components to import:
- `Spinner` from `../common/Spinner` (sizes: sm, md, lg)
- `ErrorMessage` from `../common/ErrorMessage` (props: message, onRetry)
- `Button` from `../button` (variants: primary, secondary, success, danger, ghost; sizes: sm, md, lg; props: loading, disabled)

## 7. Navigation Tab

**File**: `src/Render/app.tsx`

Three changes:
1. Add to `AppView` type: `type AppView = "servers" | "changes" | ... | "newview"`
2. Add nav button (copy existing button pattern, change view name and label)
3. Add conditional render: `{currentView === "newview" && <MySection />}`

## 8. Tests

**File**: `test/Main/Features/<Feature>/index.test.ts`

- Mock external dependencies with `jest.mock()`
- Test each exported function for: happy path, error cases, edge cases
- Use `beforeEach` to clear mocks
- All functions returning result wrappers: test both `success: true` and `success: false` paths

Run tests: `npx jest test/Main/Features/<Feature>/index.test.ts`
Run all tests: `npm test`
Run lint: `npm run lint`
