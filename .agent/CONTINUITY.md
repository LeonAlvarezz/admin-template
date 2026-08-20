# CONTINUITY

## [PLANS]
- 2026-08-14T15:17Z [CODE] Fix workspace dependency protocol (`workspace:*`) for Bun workspace packages.
- 2026-08-18T11:57Z [CODE] Add 2-level nested navigation support to `@admin/core` `NavItem` and `SideBar` (accordion when expanded, popover flyout when collapsed).
- 2026-08-18T14:10Z [CODE] Transition `apps/starter` to TanStack Router File-Based Routing using `@tanstack/router-plugin` and `src/routes/` tree.
- 2026-08-19T17:03Z [USER] Refined API error plan: use existing `toast` component instead of `Alert`, and utilize `ApiClientError.data` error response payload for frontend error handling.

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
- 2026-08-18T15:20Z [USER] Locked in `Plus Jakarta Sans` as the primary default font family across `@admin/core` and `apps/starter`. Configured `@theme { --font-sans: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; }` in `packages/core/src/styles/main.css`.
- 2026-08-18T14:05Z [CODE] Fixed ESLint configuration in `apps/starter/eslint.config.js` and `packages/core/eslint.config.js` by replacing missing `@tanstack/eslint-config` import with shared monorepo `@repo/eslint-config/react-internal`.
- 2026-08-17T17:02Z [CODE] Fixed `@headlessui/react` `<Menu>` popup in `packages/core/src/components/sidebar.tsx` by setting `anchor="top start"` and adding popover container styling (`bg-popover border shadow-lg z-50`).
- 2026-08-17T17:07Z [CODE] Configured `w-[var(--button-width)]` on `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to match `<MenuButton>` width dynamically.
- 2026-08-17T17:15Z [CODE] Added `min-w-48` and `whitespace-nowrap` to `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to prevent text squishing/wrapping when sidebar is collapsed.
- 2026-08-17T17:16Z [CODE] Configured `anchor={{ to: "top start", gap: 12 }}` on `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to shift menu up 12px from `<MenuButton>`.
- 2026-08-17T17:22Z [CODE] Added `transition` boolean prop to `<MenuItems>` in `packages/core/src/components/sidebar.tsx` to enable Headless UI v2 smooth scale & fade transition lifecycle.
- 2026-08-17T17:55Z [CODE] Decoupled `@admin/core` navigation by introducing `NavItemConfig`, `NavGroupConfig`, and `renderLink` callback prop in `packages/core/src/types/index.ts`.
- 2026-08-17T17:58Z [CODE] Installed `@tanstack/react-router` in `apps/starter`, created `apps/starter/src/config/navigation.tsx`, and configured root & child routes in `apps/starter/src/App.tsx`.
- 2026-08-18T11:16Z [CODE] Implemented Hybrid Sidebar & Footer Architecture in `packages/core/src/components/sidebar.tsx` with `SidebarContext`, compound sub-components (`SideBar.Header`, `SideBar.Nav`, `SideBar.Footer`, `SideBar.UserMenu`), and convenience props (`user`, `userMenuItems`, `onSignOut`, `sidebarFooter`).
- 2026-08-18T11:34Z [CODE] Locked in TanStack Router natively in `@admin/core`. Added `@tanstack/react-router` dependency to `packages/core`, updated `NavItem` to render `<Link to={href}>` with `activeProps`, and removed `renderLink` and `currentPath` boilerplate.
- 2026-08-18T11:38Z [CODE] Created `CustomSidebarDemo` component in `apps/starter/src/components/CustomSidebarDemo.tsx` demonstrating custom compound layout (Org Switcher, Storage bar) and added live toggle in `App.tsx`.
- 2026-08-18T15:39Z [USER] Activated Judy mentor mode for implementing Step 1: `AuthStrategy` interface & `AuthProvider` in `packages/core`.
- 2026-08-19T11:50Z [CODE] Created `UserSchema`, `CreateUserSchema`, `UpdateUserSchema` and inferred TypeScript types in `packages/types/user.ts` using Valibot based on `apps/backend/src/db/schema/user.schema.ts`.
- 2026-08-19T14:07Z [CODE] Refined `SignInEmailSchema`, `SignInEmailResponseSchema`, and `SessionSchema` in `packages/types/auth.ts` using Valibot v1 and updated export typings.
- 2026-08-19T14:44Z [CODE] Installed `@tanstack/react-form` and `@tanstack/valibot-form-adapter` in `apps/starter` and refactored `apps/starter/src/routes/login.tsx` to use TanStack Form with `SignInEmailSchema` validation.
- 2026-08-19T14:50Z [CODE] Fixed TanStack Form type mismatch by adding default value `false` to `v.optional(v.boolean(), false)` in `packages/types/auth.ts` and explicitly typing `useForm<SignInEmail>`.
- 2026-08-19T15:18Z [CODE] Updated `packages/core/src/components/ui/field.tsx` to wrap `Field` and `FieldSet` in Headless UI's `Field` (`HeadlessField`) and `Fieldset` (`HeadlessFieldset`), providing valid parent context for `HeadlessLabel`.
- 2026-08-20T11:37Z [CODE] Fixed login form in `apps/starter/src/routes/login.tsx` by setting submit button disabled state to `disabled={isSubmitting}` instead of `disabled={!canSubmit || isSubmitting}`, allowing immediate submit clicks without requiring field unfocus or showing live typing validation errors.
- 2026-08-20T12:07:33+07:00 [USER] Login validation contract: fields give feedback on blur, the full schema validates on submit, and users can submit by click or Enter without first blurring the password field.
- 2026-08-20T13:11:18+07:00 [USER] Place `LoginForm` in `apps/starter/src/modules/auth/components/login-form.tsx`; do not add a test file.
- 2026-08-20T14:12:26+07:00 [USER] Nested sidebar active state uses a round marker and a bright animated rail that ends at the marker center; no faint rail tail may extend below it.
- 2026-08-20T14:16:37+07:00 [USER] Supersedes the 14:12 rail detail: retain a faint background track from the list top to the final sub-item center, while the brighter selected segment ends at the active round marker; neither reaches the row bottom.

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
- 2026-08-18T11:16Z [CODE] Refactored `SideBar` into a hybrid compound architecture (`SidebarContext`, `SideBar.Header`, `SideBar.Nav`, `SideBar.Footer`, `SideBar.UserMenu`) while supporting prop-based configuration in `<AdminLayout>`.
- 2026-08-18T11:34Z [CODE] Locked in TanStack Router natively across `@admin/core`. Removed `renderLink` and `currentPath` props.
- 2026-08-18T11:38Z [CODE] Built disposable `CustomSidebarDemo` component demonstrating custom compound layout in `apps/starter`.
- 2026-08-18T11:43Z [CODE] Comprehensive documentation updated in root `README.md` and saved to `docs.md` artifact.
- 2026-08-18T15:22Z [CODE] Removed throwaway `font-prototype.tsx` route, cleaned up `navigation.tsx`, and removed extra prototype font imports from `index.html`. Verified clean production build.
- 2026-08-18T15:43Z [USER] Created `packages/core/src/auth/type.ts` defining `AuthStrategy` interface for session and jwt modes.
- 2026-08-18T15:45Z [CODE] Created `SessionAuthStrategy` and `JwtAuthStrategy` in `packages/core/src/auth/` using native `fetch`. Exported via `packages/core/src/index.ts`. Verified clean typecheck.
- 2026-08-18T15:54Z [CODE] Ported `/eurasie-travel/packages/api-client` into `packages/api-client` as `@repo/api-client`, refactored 100% from `axios` to zero-dependency native `fetch` client with interceptors, upload/download, and 401 token refresh queue. Verified clean typecheck across monorepo.
- 2026-08-18T16:00Z [CODE] Implemented `AuthProvider` and `useAuth` hook in `packages/core/src/auth/auth-provider.tsx` with React context state, initialization loading state, login/logout actions, and memoized context value. Verified clean typecheck.
- 2026-08-18T16:35Z [CODE] Added full `refreshToken` support to `JwtAuthStrategy`, `AuthStrategy`, `AuthProvider`, and `@repo/api-client`. Wired `onRefreshToken` and automatic 401 token refresh queue in `apps/starter/src/config/auth.ts`. Verified clean build across monorepo.
- 2026-08-18T16:37Z [CODE] Implemented `/login` route in `apps/starter/src/routes/login.tsx` with email/password form, loading states, and error alerts. Updated `__root.tsx` to bypass `AdminLayout` on `/login` and redirect unauthenticated users. Verified clean build.
- 2026-08-18T16:44Z [CODE] Refactored `apps/starter/src/routes` into idiomatic TanStack Router architecture using `_authenticated.tsx` layout route and native `beforeLoad` route guard. Simplified `__root.tsx` to a pure root container. Verified clean build.
- 2026-08-18T16:48Z [CODE] Fixed white screen error by moving `useAuth()` call inside `<InnerApp>` (child of `<AuthProvider>`) in `apps/starter/src/App.tsx`. Reverted `apps/starter/src/config/auth.ts` to clean version. Verified clean build.
- 2026-08-18T16:55Z [CODE] Cloned `https://github.com/LeonAlvarezz/express-template` repository into `apps/backend` inside the monorepo workspace.
- 2026-08-18T17:18Z [CODE] Created `.env.example` and `.env` in `apps/backend`, exported `book.schema.ts` in `src/db/schema/index.ts`, added missing dependencies (`http-errors`, `qs`), and verified zero typecheck errors via `tsc`.
- 2026-08-18T17:20Z [CODE] Refactored `apps/backend/src/core/middleware/guard.ts` from API Key check (`x-api-key`) to Better Auth session-based auth (`auth.api.getSession`), attaching `user` & `session` to Express `Request`.
- 2026-08-18T17:27Z [CODE] Synchronized `auth-schema.ts` into modular schema files in `apps/backend/src/db/schema/` (`user`, `session`, `account`, `verification`, `relations`). Removed standalone `auth-schema.ts` and verified `tsc` passes clean.
- 2026-08-18T18:00Z [CODE] Fixed export in `apps/starter/src/libs/api-client.ts`, wired `auth.ts` to `@/libs/api-client`, removed redundant `packages/api-client` directory & dependencies across monorepo. Verified clean `tsc` build.
- 2026-08-19T17:35Z [CODE] Hooked up `signInEmail`, `logOut`, and `getSession` from `AuthService` in `AuthController` (`apps/backend/src/modules/auth/auth.controller.ts`), added `fromNodeHeaders` header passing, and removed leftover `BookController` boilerplate. Verified clean `tsc` typecheck.
- 2026-08-19T17:36Z [CODE] Fixed `apps/backend/src/modules/auth/auth.route.ts` to export standard `Router` default export (`authRouter`), mounted under `/auth` in `apps/backend/src/core/route-handler/index.ts`. Resolving Express `app.use` middleware runtime TypeError. Verified clean `tsc` typecheck.
- 2026-08-19T17:53Z [CODE] Updated `ApiClient` in `apps/starter/src/libs/api-client.ts` with `ApiResponse<T>` envelope support, automatic `data.data` unwrapping on `success: true`, explicit `responseReturn: "envelope"`, and automatic `ApiClientError` throwing when `success: false`.
- 2026-08-19T17:57Z [CODE] Fixed backend `error-middleware.ts` status code parsing when `error.status` is a string (e.g. Better Auth `APIError` `status: "UNAUTHORIZED"`), preventing Express `res.status()` runtime TypeError.

## [DISCOVERIES]
- 2026-08-19T17:57Z [CODE] Better Auth `APIError` sets `status` to string enum (e.g., `'UNAUTHORIZED'`) and `statusCode` to integer `401`. Express `res.status(statusCode)` throws a runtime `TypeError` if passed a non-numeric string.
- 2026-08-20T11:51:02+07:00 [TOOL] Login password error appears during typing because email blur runs the form-level `SignInEmailSchema` and stores a password error; password `handleChange` then marks `isTouched`, satisfying the UI error gate before password blur. TanStack Form 1.33.5 state reproduction confirmed the error clears on password blur.

## [OUTCOMES]
- 2026-08-19T17:53Z [CODE] `ApiClient` seamlessly unwraps backend `ApiResponse<T>` envelopes and treats `success: false` as error responses.
- 2026-08-19T17:57Z [CODE] Backend `errorMiddleware` and `res.error` safely parse non-numeric status strings to integer status codes.
- 2026-08-20T12:07:33+07:00 [CODE] Login now runs `SignInEmailSchema` on submit, keeps aligned email/password validators on blur, and has a Bun regression test proving valid credentials submit without password blur. Focused test, changed-file lint, starter typecheck/build, and `git diff --check` passed; full starter lint remains blocked by the pre-existing `vite.config.ts` parser-project mismatch.
- 2026-08-20T13:11:18+07:00 [CODE] Supersedes the 12:07 test-file detail: login form state, validation, submit, and redirect behavior now live in `src/modules/auth/components/login-form.tsx`; `routes/login.tsx` only owns the page shell, and no login-form test file remains. Focused lint, starter typecheck/build, and `git diff --check` passed.
- 2026-08-20T14:12:26+07:00 [CODE] Expanded nested navigation now derives the active child index, animates a round marker in 32px row steps, and animates a bright rail only from the list top to the marker center. Changed-file lint, core typecheck, starter build, and `git diff --check` passed.
- 2026-08-20T14:16:37+07:00 [CODE] Added a faint truncated background track ending at the final sub-item center behind the animated selected rail; verification remained clean.







## [DISCOVERIES]
- 2026-08-18T14:32:34+07:00 [TOOL] `NavItemConfig.path` and `UserMenuItem.href` incorrectly use `LinkProps<RegisteredRouter["routeTree"]>`: `LinkProps`' first generic is the rendered component type and the type represents the entire props object, not a `to` string. `bun --filter @admin/core check-types` fails on every string path; `apps/starter/src/config/navigation.tsx` also has `path: ""` while the generated route is `/shop/products`.
- Bun requires `workspace:*` syntax to locate workspace packages in a monorepo without 404ing on npm.
- `bun add` treats `--filter` arguments as package names to install from npm instead of workspace target filters. Put `--filter` before `add` (`bun --filter <pkg> add`) or use `--cwd <path>`.
- Tailwind v4 requires `@tailwindcss/vite` in `vite.config.ts` and `@source` in CSS for scanning monorepo package components.
- Casing mismatch between import path (`./Sidebar`) and physical filename (`sidebar.tsx`) triggers TypeScript compiler errors on case-insensitive filesystems (macOS) due to module resolution cache indexing both casing variants.
- `@tailwindcss/vite` throws transform plugin error when `@plugin "@iconify/tailwind"` is used in CSS without installing `@iconify/tailwind` and `@iconify-json/<set>` in `node_modules`.
- `unplugin-icons` configured with `compiler: "jsx", jsx: "react"` requires `@svgr/core` and `@svgr/plugin-jsx` peer dependencies to transform SVG icons into React components during Vite build/dev.
- `@iconify/json` provides the complete offline dataset of all 150,000+ Iconify icon sets so `unplugin-icons` bundles any icon into the application output at build-time with 0 runtime network requests.
- Vite resolves `@/` imports using the consuming app's `vite.config.ts` alias configuration (`apps/starter/src`), causing imports like `@/libs/cn` inside package files (`packages/core/src/...`) to resolve relative to `apps/starter` instead of `packages/core`. Components inside monorepo packages must use relative paths (`../../libs/cn`).
- `@headlessui/react` v2 `<Input>` component is generic over `TTag`. `React.ComponentPropsWithRef<typeof HeadlessInput>` fails because `typeof HeadlessInput` is an overloaded generic function signature that doesn't default `TTag` to `"input"` during `ComponentPropsWithRef` inference, resulting in `CleanProps<union of 165+ HTML tags>` which strips element-specific props like `placeholder`. Use `InputProps<"input">` from `@headlessui/react` or `ComponentPropsWithRef<"input">` instead.
- If an application package extends a shared TSConfig with `"declaration": true` and `"declarationMap": true` without setting `"noEmit": true`, running `tsc` will emit `.d.ts` and `.d.ts.map` files directly into `src/`.

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
- Implemented Hybrid Sidebar & Footer Architecture (`SideBar` compound components + `AdminLayout` convenience props) in `@admin/core`.
- Locked in TanStack Router natively inside `@admin/core`, eliminating all `renderLink` and `currentPath` boilerplate.
- Built disposable `CustomSidebarDemo` component demonstrating custom compound layout in `apps/starter`.
- Created comprehensive project documentation in root `README.md` and `docs.md` artifact.
- Implemented 2-level nested navigation support in `NavItem` and `SideBar` (`NavItemConfig.items`) with accordion toggle, flyout popover in mini mode, and auto-expansion for active child routes.
- Resolved `.map` / `.d.ts.map` pollution in `apps/starter/src/` by adding `"noEmit": true` to `apps/starter/tsconfig.json` and updating `.gitignore`.
- Replaced non-existent `@tanstack/eslint-config` with shared workspace config `@repo/eslint-config/react-internal` in `apps/starter/eslint.config.js` and `packages/core/eslint.config.js`.
- 2026-08-19T15:18Z [CODE] Headless UI v2 `Label` component (`HeadlessLabel`) expects to be rendered within a Headless UI parent context (`Field`, `Fieldset`, `Control`, `Checkbox`, `Radio`, etc.). Rendering `HeadlessLabel` inside a standard `<div>` triggers runtime error: "You used a <Label /> component, but it is not inside a relevant parent."
- 2026-08-18T14:38Z [CODE] Updated `README.md` with 2-level nested navigation docs and file-based routing architecture. Fixed `RoutePath` type fallback in `packages/core/src/types/index.ts` to support generic string paths alongside generated route autocompletion. Verified `check-types` and production `build`.
- 2026-08-19T15:18Z [CODE] Resolved `<Label />` parent context runtime error by converting `Field` and `FieldSet` in `packages/core/src/components/ui/field.tsx` to Headless UI `Field` and `Fieldset` components. Verified zero type errors and clean production build.
- 2026-08-19T15:45Z [CODE] Created `ThemeProvider` React Context in `packages/core/src/hooks/theme.tsx`, updated `useTheme` hook, simplified `ThemeSwitch` to sync `isDark` state, and wrapped `App` with `ThemeProvider` in `apps/starter/src/App.tsx` so theme initializes immediately on initial load (including `/login`). Verified zero typecheck errors across monorepo.
- 2026-08-19T17:05Z [CODE] Implemented robust API error extraction and network error wrapping in `ApiClient` (`apps/starter/src/libs/api-client.ts`), capturing response `data` on `ApiClientError.data`. Updated `LoginPage` to display exact server/network error messages via `toast.error()`. Verified clean typecheck and production build.
- 2026-08-20T13:33:00+07:00 [CODE] Added `InputPassword` (`<Input.Password />`) and `Checkbox` components to `packages/core/src/components/ui/`, exported from `@admin/core`, and integrated `Input.Password` + `rememberMe` checkbox into `LoginForm` in `apps/starter`.
- 2026-08-20T13:38:00+07:00 [CODE] Omitted render-prop `children` from `HeadlessCheckboxProps` in `CheckboxProps` so `children` type defaults to `ReactNode`.
- 2026-08-20T14:41:00+07:00 [CODE] Expanded Glass Toast prototype at `/_authenticated/toast-prototype` with 4 vibrant options (Neon Glow, Progress Timer, Split Hero Column, Frosted Island) resolving dull/generic look. Verified clean `tsc` build.
- 2026-08-20T14:42:00+07:00 [DECISION] Locked in Option 1C (Split Hero Icon Pillar) as the production toast design. Refactored `Toaster` in `packages/core/src/components/ui/toaster.tsx` to natively render all `toast` notifications using the Split Hero Glass Pillar layout. Monorepo typechecks passed cleanly.
- 2026-08-20T14:47:00+07:00 [CODE] Fixed first-toast missing animation bug by defining `@keyframes toastEnter` / `toastExit` in `packages/core/src/styles/main.css` and attaching explicit CSS keyframe animation styles to `SplitHeroToast` in `toaster.tsx`. Monorepo typechecks passed cleanly.
- 2026-08-20T14:55:00+07:00 [CODE] Extended `toast` in `packages/core/src/components/ui/toaster.tsx` with `toast.warning()` (amber pillar + warning icon) and `toast.info()` (blue pillar + info icon) methods. Monorepo typechecks passed cleanly.






