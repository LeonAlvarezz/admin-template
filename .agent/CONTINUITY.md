# CONTINUITY

## [PLANS]
- 2026-08-14T15:17Z [CODE] Fix workspace dependency protocol (`workspace:*`) for Bun workspace packages.

## [DECISIONS]
- 2026-08-14T15:17Z [CODE] Updated `@admin/core` and `@repo/*` dependencies from `"*"` to `"workspace:*"` in `apps/starter/package.json` and `packages/core/package.json`.
- 2026-08-14T15:22Z [CODE] Configured `@tailwindcss/vite` plugin in `apps/starter/vite.config.ts` and added `@source "../**/*.{ts,tsx}"` to `packages/core/src/styles/main.css`.
- 2026-08-14T15:26Z [CODE] Added OKLCH semantic theme design tokens (`primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `card`, `popover`) for light/dark modes in `packages/core/src/styles/main.css`.
- 2026-08-14T15:29Z [CODE] Extracted sidebar design tokens from reference image (Dark Charcoal `#171a23`, Active Item `#232836`, Electric Blue `#3b82f6`) and configured `--color-sidebar-*` utilities in `packages/core/src/styles/main.css`.
- 2026-08-14T16:01Z [CODE] Configured `@iconify/tailwind` and `@iconify-json/lucide` in `packages/core`.

## [PROGRESS]
- 2026-08-14T15:17Z [CODE] Fixed workspace resolution so Bun resolves `@admin/core` locally instead of searching npm registry.
- 2026-08-14T15:22Z [CODE] Fixed Tailwind v4 processing for `@admin/core` components in Vite.
- 2026-08-14T15:26Z [CODE] Added Tailwind CSS v4 `@theme` design tokens with dark mode support.
- 2026-08-14T15:29Z [CODE] Added extracted sidebar color tokens to main theme.
- 2026-08-14T15:48Z [CODE] Added `@/*` path alias mapping to `./src/*`.
- 2026-08-14T16:01Z [CODE] Installed `@iconify/tailwind` & `@iconify-json/lucide` in `packages/core` to fix Vite plugin CSS transform failure.
- 2026-08-14T16:06Z [CODE] Installed `@svgr/core` & `@svgr/plugin-jsx` peer dependencies in `apps/starter` and `packages/core` to resolve `unplugin-icons` React JSX compiler pre-transform errors.
- 2026-08-14T16:11Z [CODE] Installed `@iconify/json` across `packages/core` and `apps/starter` to enable offline build-time bundling with `unplugin-icons`.

## [DISCOVERIES]
- Bun requires `workspace:*` syntax to locate workspace packages in a monorepo without 404ing on npm.
- `bun add` treats `--filter` arguments as package names to install from npm instead of workspace target filters. Put `--filter` before `add` (`bun --filter <pkg> add`) or use `--cwd <path>`.
- Tailwind v4 requires `@tailwindcss/vite` in `vite.config.ts` and `@source` in CSS for scanning monorepo package components.
- Casing mismatch between import path (`./Sidebar`) and physical filename (`sidebar.tsx`) triggers TypeScript compiler errors on case-insensitive filesystems (macOS) due to module resolution cache indexing both casing variants.
- `@tailwindcss/vite` throws transform plugin error when `@plugin "@iconify/tailwind"` is used in CSS without installing `@iconify/tailwind` and `@iconify-json/<set>` in `node_modules`.
- `unplugin-icons` configured with `compiler: "jsx", jsx: "react"` requires `@svgr/core` and `@svgr/plugin-jsx` peer dependencies to transform SVG icons into React components during Vite build/dev.
- `@iconify/json` provides the complete offline dataset of all 150,000+ Iconify icon sets so `unplugin-icons` bundles any icon into the application output at build-time with 0 runtime network requests.

## [OUTCOMES]
- Package dependency syntax fixed for Bun.
- Tailwind v4 setup completed for `@admin/core` and `apps/starter`.
- Semantic theme tokens configured in `@admin/core`.
- Extracted sidebar palette integrated into `@theme`.
- `@/*` path alias enabled across packages and Vite build configuration.
- Configured `@iconify/json` and `unplugin-icons` for offline build-time icon bundling across all workspace apps.

