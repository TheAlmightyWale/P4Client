import { createUseStore, useDispatch } from "@zubridge/electron";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// UI components
import { ThemeToggle } from "./Components/themeToggle";
import { ThemeProvider } from "./Components/ThemeProvider";
import { ChangesSection } from "./Components/P4/ChangesSection";
import { PendingChangesSection } from "./Components/P4/PendingChangesSection";
import { ServerManagementPage } from "./Components/Server";

// Create the store hook
const useStore = createUseStore();

type AppView = "servers" | "changes" | "pending";

function App() {
  const store = useStore();
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState<AppView>("changes");

  // Get state values
  const theme = (store?.theme || "dark") as "dark" | "light";

  // Action handlers
  const handleThemeToggle = async () => {
    await dispatch("THEME:TOGGLE");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-200">
        {/* Navigation */}
        <nav className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
          <div className="max-w-[var(--container-width)] mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
                  P4Client
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentView("servers")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      currentView === "servers"
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                    }`}
                  >
                    Servers
                  </button>
                  <button
                    onClick={() => setCurrentView("changes")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      currentView === "changes"
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                    }`}
                  >
                    Changes
                  </button>
                  <button
                    onClick={() => setCurrentView("pending")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      currentView === "pending"
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[var(--container-width)] mx-auto py-8 px-4">
          {currentView === "servers" && <ServerManagementPage />}
          {currentView === "changes" && <ChangesSection maxCount={25} />}
          {currentView === "pending" && <PendingChangesSection />}
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
