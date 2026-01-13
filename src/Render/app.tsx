import { createUseStore, useDispatch } from "@zubridge/electron";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// UI components
import { Button } from "./Components/button";
import { ThemeToggle } from "./Components/themeToggle";
import { ThemeProvider } from "./Components/ThemeProvider";
import { ChangesSection } from "./Components/P4/ChangesSection";

// Create the store hook
const useStore = createUseStore();

function App() {
  const store = useStore();
  const dispatch = useDispatch();

  // Get state values
  const counter = (store?.counter || 0) as number;
  const theme = (store?.theme || "dark") as "dark" | "light";

  // Action handlers
  const handleIncrement = async () => {
    await dispatch("COUNTER:INCREMENT");
  };

  const handleDecrement = async () => {
    await dispatch("COUNTER:DECREMENT");
  };

  const handleThemeToggle = async () => {
    await dispatch("THEME:TOGGLE");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-200">
        <div className="max-w-[var(--container-width)] mx-auto py-16 px-4">
          {/* Counter Display */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-center text-[var(--color-text-primary)]">
              Counter: {counter}
            </h2>
          </div>

          {/* Counter Actions */}
          <div className="flex gap-4 mb-8">
            <Button onClick={handleDecrement} className="flex-1">
              -
            </Button>
            <Button onClick={handleIncrement} className="flex-1">
              +
            </Button>
          </div>

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
