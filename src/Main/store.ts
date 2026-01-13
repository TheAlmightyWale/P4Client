import { create, type StoreApi } from "zustand";
import { createThemeHandlers } from "./Features/Theme";
import type { AppState } from "./Features";
import { initialState } from "./Features";

/**
 * Creates a Zustand store for the basic mode
 * In basic mode, action handlers are attached directly to the store state
 */
export function createStore(): StoreApi<AppState> {
  console.log("[Basic Mode] Creating Zustand store");

  const store = create<AppState>()(() => initialState);

  // Create action handlers using the features pattern
  // All new features should be registered here
  const themeHandlers = createThemeHandlers(store);

  // Attach action handlers to the store (basic mode pattern)
  store.setState((state) => ({
    ...state,
    ...themeHandlers,
  }));

  return store;
}
