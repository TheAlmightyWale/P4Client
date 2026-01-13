import { createStore } from "zustand/vanilla";

/**
 * Types for the basic mode state
 * In basic mode, action handlers are properties of the state object
 */
export interface AppState {
  //Theme feature
  theme: "light" | "dark";
  "THEME:TOGGLE": () => void;

  // Index signature to satisfy AnyState requirement
  [key: string]: unknown;
}

/**
 * Initial state for basic mode
 */
export const initialState: AppState = {
  //Theme feature
  theme: "dark",
  "THEME:TOGGLE": () => {
    console.log("Theme toggled");
  },
};

// create app store
export const store = createStore<AppState>()(() => initialState);
