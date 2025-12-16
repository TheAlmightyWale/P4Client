export type AppState = { counter: number };
// `src/main/store.ts`
import { createStore } from "zustand/vanilla";

/**
 * Types for the basic mode state
 * In basic mode, action handlers are properties of the state object
 */
export interface State {
  counter: number;
  theme: "light" | "dark";

  // Action handlers for basic mode
  "COUNTER:INCREMENT": () => void;
  "COUNTER:DECREMENT": () => void;
  "THEME:TOGGLE": () => void;

  // Index signature to satisfy AnyState requirement
  [key: string]: unknown;
}

/**
 * Initial state for basic mode
 */
export const initialState: State = {
  counter: 0,
  theme: "dark",
  "COUNTER:INCREMENT": () => {
    console.log("Increment Called");
  },
  "COUNTER:DECREMENT": () => {
    console.log("Decrement Called");
  },
  "THEME:TOGGLE": () => {
    console.log("Them toggled");
  },
};

// create app store
export const store = createStore<AppState>()(() => initialState);
