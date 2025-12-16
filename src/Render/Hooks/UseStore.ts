import { AppState } from "../../Main/Features/Workspace";

export const useStore = () => {
  // Access the store through the window.zubridge object
  return (
    window as { zubridge?: { useStore?: () => AppState } }
  ).zubridge?.useStore?.() as AppState | undefined;
};
