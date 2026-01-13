# P4 API Migration Plan

## Overview

This document outlines a plan to migrate the P4Client application from using the Perforce CLI (`p4` command) to using the native P4 API via the `p4api` npm package. The CLI implementation will be retained as a fallback option, controlled by a configuration flag.

## Current Implementation Analysis

### Current Architecture

The current P4 backend uses a CLI-based approach:

```
┌─────────────────────────────────────────────────────────────┐
│                     Current Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   index.ts   │───▶│ executor.ts  │───▶│  p4 CLI      │  │
│  │  P4 Feature  │    │ child_process│    │  subprocess  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                       │           │
│         │                                       ▼           │
│         │            ┌──────────────┐    ┌──────────────┐  │
│         └───────────▶│  parser.ts   │◀───│ Text Output  │  │
│                      │ Parse stdout │    │              │  │
│                      └──────────────┘    └──────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Current Files

| File                               | Purpose                                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| `src/Main/Features/P4/executor.ts` | Executes P4 CLI commands via `child_process.exec`                                 |
| `src/Main/Features/P4/parser.ts`   | Parses text output from CLI commands                                              |
| `src/Main/Features/P4/index.ts`    | High-level P4 operations (getSubmittedChanges, getPendingChanges, getCurrentUser) |
| `src/shared/types/p4.ts`           | TypeScript interfaces for P4 data structures                                      |

### Current Limitations of CLI Approach

1. **Performance**: Spawning a new process for each command has overhead
2. **Parsing Fragility**: Text parsing is brittle and can break with P4 version changes
3. **Error Handling**: CLI error messages are not structured
4. **Connection Management**: No persistent connection; each command reconnects
5. **Platform Dependency**: Requires `p4` CLI to be installed and in PATH

---

## Solution: p4api NPM Package

**Package**: `p4api` on npm  
**Repository**: https://github.com/nicksrandall/p4api

This package provides native Node.js bindings to the Helix Core C++ API using N-API.

### Benefits

- Native bindings to official Perforce C++ API
- Structured data output (no text parsing needed)
- Persistent connections possible
- Better performance than CLI spawning
- TypeScript support available
- Active maintenance

### Considerations

- Native module requires compilation (may need build tools)
- Platform-specific binaries needed
- Larger package size

### Example Usage

```typescript
import P4 from "p4api";

const p4 = new P4({
  P4PORT: "ssl:perforce.example.com:1666",
  P4USER: "username",
  P4CLIENT: "workspace",
});

// Get changes - returns structured data
const result = await p4.cmd("changes", "-s", "submitted", "-m", "10");
console.log(result.stat); // Array of change objects
```

---

## Proposed Architecture

The new architecture introduces a provider pattern with a configuration flag to switch between CLI and API backends:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Proposed Architecture                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐                                   │
│  │   index.ts   │───▶│  factory.ts  │                                   │
│  │  P4 Feature  │    │ Provider     │                                   │
│  └──────────────┘    │ Factory      │                                   │
│                      └──────┬───────┘                                   │
│                             │                                           │
│              ┌──────────────┼──────────────┐                            │
│              │              │              │                            │
│              ▼              │              ▼                            │
│  ┌──────────────────┐       │   ┌──────────────────┐                    │
│  │  cli-provider.ts │       │   │  api-provider.ts │                    │
│  │  CLI Backend     │       │   │  p4api Backend   │                    │
│  │  - executor.ts   │       │   │  - client.ts     │                    │
│  │  - parser.ts     │       │   │  - mapper.ts     │                    │
│  └──────────────────┘       │   └──────────────────┘                    │
│                             │                                           │
│                      ┌──────┴───────┐                                   │
│                      │  config.ts   │                                   │
│                      │ useNativeApi │                                   │
│                      │    flag      │                                   │
│                      └──────────────┘                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### New File Structure

```
src/Main/Features/P4/
├── index.ts              # Public API (unchanged interface)
├── config.ts             # Configuration including useNativeApi flag
├── factory.ts            # Provider factory - selects CLI or API
├── types.ts              # Internal provider interface
├── providers/
│   ├── cli/
│   │   ├── index.ts      # CLI provider implementation
│   │   ├── executor.ts   # Existing CLI executor (moved)
│   │   └── parser.ts     # Existing parser (moved)
│   └── api/
│       ├── index.ts      # API provider implementation
│       ├── client.ts     # p4api client wrapper
│       └── mapper.ts     # Map p4api responses to types
```

---

## Implementation Details

### Configuration Flag

```typescript
// src/Main/Features/P4/config.ts

export interface P4Config {
  /**
   * Use native p4api instead of CLI
   * Default: true (use native API)
   * Set to false to fall back to CLI
   */
  useNativeApi: boolean;

  /**
   * P4 connection settings
   */
  port?: string; // P4PORT
  user?: string; // P4USER
  client?: string; // P4CLIENT
  password?: string; // P4PASSWD
}

// Default configuration
const defaultConfig: P4Config = {
  useNativeApi: true,
  // Connection settings default to environment variables
};

let currentConfig: P4Config = { ...defaultConfig };

export function getP4Config(): P4Config {
  return { ...currentConfig };
}

export function setP4Config(config: Partial<P4Config>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function useNativeApi(): boolean {
  return currentConfig.useNativeApi;
}
```

### Provider Interface

```typescript
// src/Main/Features/P4/types.ts

import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../shared/types/p4";

/**
 * Interface that both CLI and API providers must implement
 */
export interface P4Provider {
  getSubmittedChanges(
    options?: GetSubmittedChangesOptions
  ): Promise<P4Result<ChangelistInfo[]>>;

  getPendingChanges(
    options?: GetPendingChangesOptions
  ): Promise<P4Result<ChangelistInfo[]>>;

  getCurrentUser(): Promise<P4Result<string>>;

  /**
   * Initialize the provider (e.g., establish connection)
   */
  initialize?(): Promise<void>;

  /**
   * Cleanup resources (e.g., close connection)
   */
  dispose?(): Promise<void>;
}
```

### Provider Factory

```typescript
// src/Main/Features/P4/factory.ts

import { useNativeApi } from "./config";
import type { P4Provider } from "./types";
import { CliProvider } from "./providers/cli";
import { ApiProvider } from "./providers/api";

let provider: P4Provider | null = null;

export function getProvider(): P4Provider {
  if (!provider) {
    provider = createProvider();
  }
  return provider;
}

function createProvider(): P4Provider {
  if (useNativeApi()) {
    try {
      return new ApiProvider();
    } catch (error) {
      console.warn("Failed to initialize p4api, falling back to CLI:", error);
      return new CliProvider();
    }
  }
  return new CliProvider();
}

/**
 * Reset provider (useful for testing or config changes)
 */
export async function resetProvider(): Promise<void> {
  if (provider?.dispose) {
    await provider.dispose();
  }
  provider = null;
}
```

### CLI Provider (Refactored Existing Code)

```typescript
// src/Main/Features/P4/providers/cli/index.ts

import type { P4Provider } from "../../types";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../../../shared/types/p4";
import { executeP4Command } from "./executor";
import { parseChangesOutput, parseUserOutput } from "./parser";

export class CliProvider implements P4Provider {
  async getSubmittedChanges(
    options: GetSubmittedChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      let command = "changes -s submitted";

      if (options.maxCount) {
        command += ` -m ${options.maxCount}`;
      }

      if (options.depotPath) {
        command += ` ${options.depotPath}`;
      }

      const { stdout } = await executeP4Command(command);
      const changes = parseChangesOutput(stdout, "submitted");

      return { success: true, data: changes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getPendingChanges(
    options: GetPendingChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      let user = options.user;

      if (!user) {
        const currentUser = await this.getCurrentUser();
        if (!currentUser.success || !currentUser.data) {
          return { success: false, error: "Could not determine current user" };
        }
        user = currentUser.data;
      }

      const command = `changes -s pending -u ${user}`;
      const { stdout } = await executeP4Command(command);
      const changes = parseChangesOutput(stdout, "pending");

      return { success: true, data: changes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getCurrentUser(): Promise<P4Result<string>> {
    try {
      const { stdout } = await executeP4Command("user -o");
      const user = parseUserOutput(stdout);

      if (!user) {
        return { success: false, error: "Could not parse user from output" };
      }

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
```

### API Provider (New)

```typescript
// src/Main/Features/P4/providers/api/index.ts

import type { P4Provider } from "../../types";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../../../shared/types/p4";
import { P4Client } from "./client";
import { mapChangeRecords, mapUserRecord } from "./mapper";

export class ApiProvider implements P4Provider {
  private client: P4Client;

  constructor() {
    this.client = new P4Client();
  }

  async initialize(): Promise<void> {
    await this.client.connect();
  }

  async dispose(): Promise<void> {
    await this.client.disconnect();
  }

  async getSubmittedChanges(
    options: GetSubmittedChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      const args = ["-s", "submitted"];

      if (options.maxCount) {
        args.push("-m", options.maxCount.toString());
      }

      if (options.depotPath) {
        args.push(options.depotPath);
      }

      const result = await this.client.runCommand("changes", ...args);
      const changes = mapChangeRecords(result.stat || [], "submitted");

      return { success: true, data: changes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getPendingChanges(
    options: GetPendingChangesOptions = {}
  ): Promise<P4Result<ChangelistInfo[]>> {
    try {
      let user = options.user;

      if (!user) {
        const currentUser = await this.getCurrentUser();
        if (!currentUser.success || !currentUser.data) {
          return { success: false, error: "Could not determine current user" };
        }
        user = currentUser.data;
      }

      const args = ["-s", "pending", "-u", user];
      const result = await this.client.runCommand("changes", ...args);
      const changes = mapChangeRecords(result.stat || [], "pending");

      return { success: true, data: changes };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getCurrentUser(): Promise<P4Result<string>> {
    try {
      const result = await this.client.runCommand("user", "-o");
      const user = mapUserRecord(result.stat?.[0]);

      if (!user) {
        return { success: false, error: "Could not get user from response" };
      }

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
```

### P4 API Client Wrapper

```typescript
// src/Main/Features/P4/providers/api/client.ts

import P4 from "p4api";
import { getP4Config } from "../../config";

export interface P4CommandResult {
  stat?: Record<string, string>[];
  error?: { data: string; severity: number; generic: number }[];
  info?: { data: string; level: number }[];
}

export class P4Error extends Error {
  constructor(
    message: string,
    public readonly errors?: { data: string; severity: number }[]
  ) {
    super(message);
    this.name = "P4Error";
  }
}

export class P4Client {
  private p4: P4 | null = null;
  private connected: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const config = getP4Config();

    this.p4 = new P4({
      P4PORT: config.port || process.env.P4PORT,
      P4USER: config.user || process.env.P4USER,
      P4CLIENT: config.client || process.env.P4CLIENT,
    });
  }

  async connect(): Promise<void> {
    if (!this.connected && this.p4) {
      // p4api handles connection automatically on first command
      // but we can verify connectivity here
      this.connected = true;
    }
  }

  async runCommand(cmd: string, ...args: string[]): Promise<P4CommandResult> {
    if (!this.p4) {
      throw new P4Error("P4 client not initialized");
    }

    const result = await this.p4.cmd(cmd, ...args);

    if (result.error && result.error.length > 0) {
      const errorMessages = result.error.map((e) => e.data).join("; ");
      throw new P4Error(errorMessages, result.error);
    }

    return result;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.p4 = null;
  }
}
```

### Data Mapper

```typescript
// src/Main/Features/P4/providers/api/mapper.ts

import type { ChangelistInfo } from "../../../../../shared/types/p4";

interface P4ChangeRecord {
  change: string;
  user: string;
  client: string;
  time: string;
  desc: string;
  status?: string;
}

interface P4UserRecord {
  User: string;
  Email?: string;
  FullName?: string;
}

/**
 * Maps a p4api change record to our ChangelistInfo type
 */
export function mapChangeRecord(
  record: P4ChangeRecord,
  status: "submitted" | "pending"
): ChangelistInfo {
  return {
    id: parseInt(record.change, 10),
    user: record.user,
    client: record.client,
    date: new Date(parseInt(record.time, 10) * 1000), // Unix timestamp to Date
    description: record.desc || "",
    status: (record.status as "submitted" | "pending") || status,
  };
}

/**
 * Maps an array of p4api change records
 */
export function mapChangeRecords(
  records: P4ChangeRecord[],
  status: "submitted" | "pending"
): ChangelistInfo[] {
  return records.map((record) => mapChangeRecord(record, status));
}

/**
 * Extracts username from p4api user record
 */
export function mapUserRecord(record?: P4UserRecord): string | null {
  return record?.User || null;
}
```

### Updated Public API

```typescript
// src/Main/Features/P4/index.ts

import { getProvider } from "./factory";
import type {
  ChangelistInfo,
  GetSubmittedChangesOptions,
  GetPendingChangesOptions,
  P4Result,
} from "../../../shared/types/p4";

// Re-export types for external use
export * from "../../../shared/types/p4";

// Re-export configuration functions
export { getP4Config, setP4Config } from "./config";

/**
 * Fetches submitted changelists from Perforce
 */
export async function getSubmittedChanges(
  options: GetSubmittedChangesOptions = {}
): Promise<P4Result<ChangelistInfo[]>> {
  return getProvider().getSubmittedChanges(options);
}

/**
 * Fetches pending changelists for a user
 */
export async function getPendingChanges(
  options: GetPendingChangesOptions = {}
): Promise<P4Result<ChangelistInfo[]>> {
  return getProvider().getPendingChanges(options);
}

/**
 * Gets the current Perforce user
 */
export async function getCurrentUser(): Promise<P4Result<string>> {
  return getProvider().getCurrentUser();
}
```

---

## Migration Plan

### Phase 1: Setup and Infrastructure

- [ ] Install p4api package: `npm install p4api`
- [ ] Run electron-rebuild: `npx electron-rebuild`
- [ ] Create configuration module (`config.ts`)
- [ ] Create provider interface (`types.ts`)
- [ ] Create provider factory (`factory.ts`)

### Phase 2: Refactor CLI Code

- [ ] Create `providers/cli/` directory structure
- [ ] Move `executor.ts` to `providers/cli/executor.ts`
- [ ] Move `parser.ts` to `providers/cli/parser.ts`
- [ ] Create `providers/cli/index.ts` implementing P4Provider interface
- [ ] Update imports in moved files

### Phase 3: Implement API Provider

- [ ] Create `providers/api/` directory structure
- [ ] Create `providers/api/client.ts` - p4api wrapper
- [ ] Create `providers/api/mapper.ts` - response mappers
- [ ] Create `providers/api/index.ts` implementing P4Provider interface
- [ ] Add error handling for API-specific errors

### Phase 4: Update Public API

- [ ] Update `index.ts` to use provider factory
- [ ] Export configuration functions
- [ ] Ensure backward compatibility with existing callers
- [ ] Add JSDoc documentation

### Phase 5: Testing

- [ ] Create tests for CLI provider
- [ ] Create tests for API provider
- [ ] Create tests for provider factory
- [ ] Test configuration flag switching
- [ ] Test automatic fallback on API initialization failure
- [ ] Test on Windows, macOS, and Linux
- [ ] Verify Electron packaging includes native modules correctly

### Phase 6: Documentation and Cleanup

- [ ] Update README with configuration options
- [ ] Document environment variables
- [ ] Add inline code documentation
- [ ] Update any existing documentation

---

## Electron Considerations

### Native Module Packaging

Since p4api uses native bindings, special consideration is needed for Electron:

1. **electron-rebuild**: Run after installing to rebuild native modules for Electron

   ```bash
   npx electron-rebuild
   ```

2. **Forge Configuration**: Update `forge.config.ts` to handle native modules:

   ```typescript
   // forge.config.ts
   {
     packagerConfig: {
       asar: {
         unpack: "**/node_modules/p4api/**";
       }
     }
   }
   ```

3. **Platform Builds**: Native modules need to be built for each target platform

---

## Configuration Examples

### Using Native API (Default)

```typescript
import { setP4Config } from "./Features/P4";

// Default - uses native API
setP4Config({
  useNativeApi: true,
  port: "ssl:perforce.example.com:1666",
  user: "myuser",
  client: "myworkspace",
});
```

### Falling Back to CLI

```typescript
import { setP4Config } from "./Features/P4";

// Force CLI usage
setP4Config({
  useNativeApi: false,
});
```

### Environment Variables

The system respects standard P4 environment variables:

- `P4PORT` - Perforce server address
- `P4USER` - Username
- `P4CLIENT` - Client/workspace name
- `P4PASSWD` - Password (if needed)

---

## Risk Assessment

| Risk                         | Likelihood | Impact | Mitigation                                          |
| ---------------------------- | ---------- | ------ | --------------------------------------------------- |
| Native module build failures | Medium     | High   | CLI fallback available; test on all platforms early |
| p4api package abandonment    | Low        | Medium | Package is actively maintained; CLI fallback exists |
| Performance regression       | Low        | Low    | Benchmark before/after; native API should be faster |
| Breaking changes in p4api    | Low        | Medium | Pin version; test upgrades in CI                    |
| Electron packaging issues    | Medium     | Medium | Test packaging early; use asar unpack config        |

---

## Success Criteria

1. All existing P4 functionality works with both providers
2. Configuration flag correctly switches between CLI and API
3. Automatic fallback works when API initialization fails
4. Tests pass on Windows, macOS, and Linux
5. Electron app packages correctly with native modules
6. Performance is equal or better than CLI approach when using API
7. No breaking changes to public API interface
