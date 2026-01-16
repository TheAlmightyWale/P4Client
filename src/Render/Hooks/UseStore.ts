import type { AppState } from "../../Main/Features";

export const useStore = () => {
  // Access the store through the window.zubridge object
  return (
    window as { zubridge?: { useStore?: () => AppState } }
  ).zubridge?.useStore?.() as AppState | undefined;
};
