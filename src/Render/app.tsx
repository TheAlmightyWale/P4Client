import { createUseStore, useDispatch } from "@zubridge/electron";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// UI components
import { ThemeToggle } from "./Components/themeToggle";
import { ThemeProvider } from "./Components/ThemeProvider";
import { ChangesSection } from "./Components/P4/ChangesSection";

// Create the store hook
const useStore = createUseStore();

function App() {
  const store = useStore();
  const dispatch = useDispatch();

  // Get state values
  const theme = (store?.theme || "dark") as "dark" | "light";

  // Action handlers
  const handleThemeToggle = async () => {
    await dispatch("THEME:TOGGLE");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-200">
        <div className="max-w-[var(--container-width)] mx-auto py-16 px-4">
          {/* P4 Changes Section */}
          <div className="mb-8">
            <ChangesSection maxCount={25} />
          </div>

          <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
        </div>
      </div>
    </ThemeProvider>
  );
}

// Get the DOM container element
const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
