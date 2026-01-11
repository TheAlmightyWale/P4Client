import { useEffect, type ReactNode } from "react";

interface ThemeProviderProps {
  theme: "light" | "dark";
  children: ReactNode;
}

/**
 * ThemeProvider component that applies the theme class to the document
 * This enables Tailwind's dark mode class strategy
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
