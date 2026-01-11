import { createStore } from "zustand/vanilla";

/**
 * Types for the basic mode state
 * In basic mode, action handlers are properties of the state object
 */
export interface AppState {
  //Counter feature
  counter: number;
  "COUNTER:INCREMENT": () => void;
  "COUNTER:DECREMENT": () => void;

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
  //Counter feature
  counter: 0,
  "COUNTER:INCREMENT": () => {
    console.log("Increment Called");
  },
  "COUNTER:DECREMENT": () => {
    console.log("Decrement Called");
  },

  //Theme feature
  theme: "dark",
  "THEME:TOGGLE": () => {
    console.log("Theme toggled");
  },

  //History feature
};

// create app store
export const store = createStore<AppState>()(() => initialState);
