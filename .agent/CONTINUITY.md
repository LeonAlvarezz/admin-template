# CONTINUITY

## [PLANS]
- 2026-08-14T15:17Z [CODE] Fix workspace dependency protocol (`workspace:*`) for Bun workspace packages.

## [DECISIONS]
- 2026-08-14T15:17Z [CODE] Updated `@admin/core` and `@repo/*` dependencies from `"*"` to `"workspace:*"` in `apps/starter/package.json` and `packages/core/package.json`.
- 2026-08-14T15:22Z [CODE] Configured `@tailwindcss/vite` plugin in `apps/starter/vite.config.ts` and added `@source "../**/*.{ts,tsx}"` to `packages/core/src/styles/main.css`.
- 2026-08-14T15:26Z [CODE] Added OKLCH semantic theme design tokens (`primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `card`, `popover`) for light/dark modes in `packages/core/src/styles/main.css`.
- 2026-08-14T15:29Z [CODE] Extracted sidebar design tokens from reference image (Dark Charcoal `#171a23`, Active Item `#232836`, Electric Blue `#3b82f6`) and configured `--color-sidebar-*` utilities in `packages/core/src/styles/main.css`.
- 2026-08-14T16:01Z [CODE] Configured `@iconify/tailwind` and `@iconify-json/lucide` in `packages/core`.
- 2026-08-17T14:18Z [CODE] Updated `packages/core/src/components/ui/input.tsx` to use `InputProps<"input">` from `@headlessui/react` and pass `placeholder={placeholder}` directly.
- 2026-08-17T14:32Z [CODE] Refactored `packages/core/src/components/ui/input.tsx` to use a `<div>` wrapper with `focus-within` styling instead of `<label htmlFor={name}>`, and added `startIcon`, `endIcon`, and `containerClassName` props.
- 2026-08-17T14:47Z [CODE] Added `KbdKey`, `ModifierKey`, `SpecialKey` types and implemented `Keyboard` component in `packages/core/src/components/ui/keyboard.tsx`.
- 2026-08-17T15:12Z [CODE] Adjusted `--accent` OKLCH values in `packages/core/src/styles/main.css` for higher contrast in light and dark mode hover states.
- 2026-08-17T15:24Z [CODE] Created `packages/core/src/components/ui/nav-item.tsx` and integrated `<NavItem />` with active state and collapsed layout handling into `packages/core/src/components/sidebar.tsx`.
- 2026-08-17T15:48Z [CODE] Enhanced `packages/core/src/components/ui/nav-item.tsx` to support `icon` and `label` props alongside `<NavItem.Action>` compound slot for interactable components (like switches/controls).
- 2026-08-17T16:12Z [CODE] Pinned sidebar footer to bottom using `flex flex-col flex-1` on sidebar container and `mt-auto` on `<footer>` in `packages/core/src/components/sidebar.tsx`.
- 2026-08-17T17:02Z [CODE] Fixed `@headlessui/react` `<Menu>` popup in `packages/core/src/components/sidebar.tsx` by setting `anchor="top start"` and adding popover container styling (`bg-popover border shadow-lg z-50`).
- 2026-08-17T17:07Z [CODE] Configured `w-[var(--button-width)]` on `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to match `<MenuButton>` width dynamically.
- 2026-08-17T17:15Z [CODE] Added `min-w-48` and `whitespace-nowrap` to `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to prevent text squishing/wrapping when sidebar is collapsed.
- 2026-08-17T17:16Z [CODE] Configured `anchor={{ to: "top start", gap: 12 }}` on `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to shift menu up 12px from `<MenuButton>`.
- 2026-08-17T17:22Z [CODE] Added `transition` boolean prop to `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to enable Headless UI v2 smooth scale & fade transition lifecycle.
- 2026-08-17T17:55Z [CODE] Decoupled `@admin/core` navigation by introducing `NavItemConfig`, `NavGroupConfig`, and `renderLink` callback prop in `packages/core/src/types/index.ts`.
- 2026-08-17T17:58Z [CODE] Installed `@tanstack/react-router` in `apps/starter`, created `apps/starter/src/config/navigation.tsx`, and configured root & child routes in `apps/starter/src/App.tsx`.

## [PROGRESS]
- 2026-08-14T15:17Z [CODE] Fixed workspace resolution so Bun resolves `@admin/core` locally instead of searching npm registry.
- 2026-08-14T15:22Z [CODE] Fixed Tailwind v4 processing for `@admin/core` components in Vite.
- 2026-08-14T15:26Z [CODE] Added Tailwind CSS v4 `@theme` design tokens with dark mode support.
- 2026-08-14T15:29Z [CODE] Added extracted sidebar color tokens to main theme.
- 2026-08-14T15:48Z [CODE] Added `@/*` path alias mapping to `./src/*`.
- 2026-08-14T16:01Z [CODE] Installed `@iconify/tailwind` & `@iconify-json/lucide` in `packages/core` to fix Vite plugin CSS transform failure.
- 2026-08-14T16:06Z [CODE] Installed `@svgr/core` & `@svgr/plugin-jsx` peer dependencies in `apps/starter` and `packages/core` to resolve `unplugin-icons` React JSX compiler pre-transform errors.
- 2026-08-14T16:11Z [CODE] Installed `@iconify/json` across `packages/core` and `apps/starter` to enable offline build-time bundling with `unplugin-icons`.
- 2026-08-14T17:34Z [CODE] Updated `ghost` button variant hover classes to `data-hover:bg-accent data-hover:text-accent-foreground` in `packages/core/src/components/ui/button.tsx`.
- 2026-08-14T17:46Z [CODE] Fixed `<aside>` background in `packages/core/src/components/sidebar.tsx` from `bg-sidebar-accent` to `bg-sidebar`.
- 2026-08-17T14:18Z [CODE] Updated `packages/core/src/components/ui/input.tsx` to use `InputProps<"input">` from `@headlessui/react` and pass `placeholder={placeholder}` directly.
- 2026-08-17T14:32Z [CODE] Updated `Input` wrapper from `<label>` to `<div>` container supporting `startIcon` / `endIcon` slots.
- 2026-08-17T14:47Z [CODE] Created `KbdKey` union type and key formatting map in `packages/core/src/components/ui/keyboard.tsx`.
- 2026-08-17T15:12Z [CODE] Updated accent color tokens in `packages/core/src/styles/main.css`.
- 2026-08-17T15:24Z [CODE] Implemented `<NavItem />` component and updated `SideBar` list items.
- 2026-08-17T15:48Z [CODE] Added `<NavItem.Action>` compound slot and automatic `<div>` tag switching for interactable controls.
- 2026-08-17T16:12Z [CODE] Pinned sidebar footer to bottom using `flex-1` flex container & `mt-auto`.
- 2026-08-17T17:02Z [CODE] Fixed `<Menu>` popup placement with `anchor="top start"` and popover styling.
- 2026-08-17T17:58Z [CODE] Implemented router-agnostic `renderLink` navigation rendering in `SideBar` and `NavItem`, and integrated TanStack Router into `apps/starter`.

## [DISCOVERIES]
- Bun requires `workspace:*` syntax to locate workspace packages in a monorepo without 404ing on npm.
- `bun add` treats `--filter` arguments as package names to install from npm instead of workspace target filters. Put `--filter` before `add` (`bun --filter <pkg> add`) or use `--cwd <path>`.
- Tailwind v4 requires `@tailwindcss/vite` in `vite.config.ts` and `@source` in CSS for scanning monorepo package components.
- Casing mismatch between import path (`./Sidebar`) and physical filename (`sidebar.tsx`) triggers TypeScript compiler errors on case-insensitive filesystems (macOS) due to module resolution cache indexing both casing variants.
- `@tailwindcss/vite` throws transform plugin error when `@plugin "@iconify/tailwind"` is used in CSS without installing `@iconify/tailwind` and `@iconify-json/<set>` in `node_modules`.
- `unplugin-icons` configured with `compiler: "jsx", jsx: "react"` requires `@svgr/core` and `@svgr/plugin-jsx` peer dependencies to transform SVG icons into React components during Vite build/dev.
- `@iconify/json` provides the complete offline dataset of all 150,000+ Iconify icon sets so `unplugin-icons` bundles any icon into the application output at build-time with 0 runtime network requests.
- Vite resolves `@/` imports using the consuming app's `vite.config.ts` alias configuration (`apps/starter/src`), causing imports like `@/libs/cn` inside package files (`packages/core/src/...`) to resolve relative to `apps/starter` instead of `packages/core`. Components inside monorepo packages must use relative paths (`../../libs/cn`).
- `@headlessui/react` v2 `<Input>` component is generic over `TTag`. `React.ComponentPropsWithRef<typeof HeadlessInput>` fails because `typeof HeadlessInput` is an overloaded generic function signature that doesn't default `TTag` to `"input"` during `ComponentPropsWithRef` inference, resulting in `CleanProps<union of 165+ HTML tags>` which strips element-specific props like `placeholder`. Use `InputProps<"input">` from `@headlessui/react` or `ComponentPropsWithRef<"input">` instead.

## [OUTCOMES]
- Package dependency syntax fixed for Bun.
- Tailwind v4 setup completed for `@admin/core` and `apps/starter`.
- Semantic theme tokens configured in `@admin/core`.
- Extracted sidebar palette integrated into `@theme`.
- `@/*` path alias enabled across packages and Vite build configuration.
- Configured `@iconify/json` and `unplugin-icons` for offline build-time icon bundling across all workspace apps.
- Fixed `@/` path alias import failure in `packages/core/src/components/ui/button.tsx`.
- Fixed TypeScript prop typing and placeholder handling in `packages/core/src/components/ui/input.tsx`.
- Refactored `@admin/core` layout & sidebar navigation to be 100% router-agnostic, accepting dynamic `navGroups` and custom `renderLink` functions.
- Integrated `@tanstack/react-router` in `apps/starter` with full type safety and client-side page routing.




