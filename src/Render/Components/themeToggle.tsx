import clsx from "clsx";
import type React from "react";
import Button from "./button";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

/**
 * Theme toggle button component that switches between light and dark themes
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = "",
}) => {
  const icon = theme === "light" ? "🌙" : "☀️";
  const label =
    theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode";

  return (
    <div className={clsx("w-full", className)}>
      <Button
        variant="secondary"
        onClick={onToggle}
        className="w-full"
        aria-label={label}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </Button>
    </div>
  );
};

export default ThemeToggle;
