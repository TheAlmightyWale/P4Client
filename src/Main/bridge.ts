import type {
  ZubridgeMiddleware,
  ZustandBridge,
} from "@zubridge/electron/main";
import { createZustandBridge } from "@zubridge/electron/main";
import type { StoreApi } from "zustand";
import type { AppState } from "./Features";

/**
 * Creates a bridge using the basic approach
 * In basic mode, action handlers are attached directly to the store state
 */
export function createBridge(
  store: StoreApi<AppState>,
  middleware?: ZubridgeMiddleware
): ZustandBridge {
  console.log("[Basic Mode] Creating bridge with attached handlers");

  // Create bridge with the store that has handlers attached
  return createZustandBridge<AppState>(store, { middleware });
}
