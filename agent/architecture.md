This file explains the overall architecture of the application, the frameworks it uses and points to other documentation to look at when doing work.

Goal:
The application is a client for the Perforce verison control system. It provides a stable GUI to perform perforce operations. Providing easy to use UX for common operations.

Frameworks:

This application is an electron typescript app, using react for it's frontend and zubridge as it's state management system.

TODO: how do we interact with the perforce server? And how do we manage our own persistant data? and what do we use to test?

Architecture:

## CSS Styling & Theming

The application uses **Tailwind CSS v4** for styling with support for dark and light themes.

### Key Files

| File                                      | Purpose                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `postcss.config.js`                       | PostCSS configuration using `@tailwindcss/postcss` plugin                      |
| `src/Render/index.css`                    | Global CSS with Tailwind import and CSS custom properties for theming          |
| `src/Render/Components/ThemeProvider.tsx` | React component that applies `dark` class to HTML element based on theme state |
| `src/Render/Components/button.tsx`        | Reusable button component with theme-aware variants                            |
| `src/Render/Components/themeToggle.tsx`   | Theme toggle button component                                                  |

### How Theming Works

1. **State Management**: Theme state (`'dark'` | `'light'`) is managed in the Zubridge store via `src/Main/Features/Theme/index.ts`
2. **CSS Custom Properties**: Colors are defined as CSS variables in `src/Render/index.css` with different values for `:root` (light) and `.dark` (dark theme)
3. **Theme Application**: The `ThemeProvider` component listens to theme state and adds/removes the `dark` class on the `<html>` element
4. **Component Styling**: Components use Tailwind's arbitrary value syntax with CSS variables (e.g., `bg-[var(--color-accent)]`) for theme-aware colors

### Theme Colors

The design system includes semantic color tokens:

- **Background**: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
- **Text**: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- **Accent**: `--color-accent`, `--color-accent-hover`, `--color-accent-active`
- **Semantic**: `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- **Border**: `--color-border`, `--color-border-focus`

### Related Documentation

For detailed implementation instructions, see `.agents/Features/css-styling-plan.md`
