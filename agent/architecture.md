This file explains the overall architecture of the application, the frameworks it uses and points to other documentation to look at when doing work.

Goal:
The application is a client for the Perforce version control system. It provides a stable GUI to perform perforce operations. Providing easy to use UX for common operations.

Frameworks:

This application is an electron typescript app, using react for it's frontend and zubridge as it's state management system.

Architecture:

## Renderer Navigation

The app uses a simple view-switching pattern in `src/Render/app.tsx`:

- `AppView` type defines available views (e.g., `"servers" | "changes"`)
- Navigation tabs in the top bar switch between views via `useState`
- Each view maps to a container component (e.g., `ServerManagementPage`, `ChangesSection`)
- Container components follow a pattern: check session status, show loading/error/data states

## P4 CLI Integration

P4 commands are executed via the CLI provider at `src/Main/Features/P4/providers/cli/`:

- **Executor** (`executor.ts`): Runs `p4 -ztag` commands via `child_process.exec/spawn`, supports environment overrides (`P4PORT`, `P4USER`, `P4CLIENT`, `P4TICKET`)
- **Parser** (`parser.ts`): Parses `-ztag` structured output into `ZtagRecord[]` arrays. The `parseZtagOutput` function splits records using the `change` field as a delimiter. Dedicated parse functions exist for each command type (`parseChangesOutput`, `parseUserOutput`, `parseInfoOutput`, etc.)
- **Provider** (`index.ts`): Implements the `P4Provider` interface defined in `types.ts`. Singleton instance managed by `factory.ts`

### Adding New P4 Commands

1. Add the method to `P4Provider` interface in `src/Main/Features/P4/types.ts`
2. Implement in `CliProvider` at `src/Main/Features/P4/providers/cli/index.ts`
3. Add any new parser functions to `parser.ts`
4. Export a public function from `src/Main/Features/P4/index.ts`
5. Register an IPC handler in `src/Main/main.ts`
6. Expose via preload in `src/Preload/preload.ts`
7. Update the `P4API` type in `src/shared/types/p4.ts`

## Feature Plans

Detailed implementation plans for features are stored in `.agents/Features/`. These documents include requirements, architecture diagrams, UI mockups, and step-by-step implementation instructions. See `agent/addFeature.md` for the feature planning process.

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
