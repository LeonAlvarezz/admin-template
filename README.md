# ZeroUI Admin Template & Architecture

A modern, high-performance monorepo admin template built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **TanStack Router**, and **Headless UI v2**, powered by **Bun** and **Turborepo**.

---

## 🏗️ Monorepo Architecture

```
admin-template/
├── apps/
│   └── starter/           # Frontend consumer application using @admin/core
├── packages/
│   └── core/              # Core framework package (@admin/core)
└── package.json           # Workspace root dependencies & scripts
```

- **Package Manager**: [Bun](https://bun.sh) (uses `workspace:*` dependency protocol).
- **Monorepo Build System**: [Turborepo](https://turbo.build) for parallel builds and caching.
- **Bundler & Compiler**: [Vite](https://vitejs.dev) with `@tailwindcss/vite` plugin and `unplugin-icons`.

---

## 🎨 Design System & Styling

### Tailwind CSS v4 & Semantic Design Tokens
- Managed centrally in `@admin/core` ([`packages/core/src/styles/main.css`](file:///Users/leonhong/Personal%20Project/admin-template/packages/core/src/styles/main.css)).
- Uses **OKLCH color space** for high-contrast, accessible light & dark modes:
  - `--color-primary`, `--color-secondary`, `--color-accent`, `--color-muted`, `--color-destructive`.
  - Custom sidebar dark charcoal tokens (`#171a23`, `#232836`, `#3b82f6`).

### Offline Icon Bundling
- Powered by `unplugin-icons` and `@iconify/json`.
- All 150,000+ Iconify icons (Lucide, Solar, BoxIcons, Tabler, etc.) are bundled at build time with **0 runtime network requests**.

---

## 🧩 UI Components (`@admin/core`)

| Component | Description |
| :--- | :--- |
| **`AdminLayout`** | Top-level layout shell wrapping sidebar, header, and main scroll container. |
| **`SideBar`** | Collapsible sidebar supporting both **Convenience Props API** and **Compound Components API**. |
| **`NavItem`** | Natively renders TanStack Router `<Link>` with automatic active route styling and `<NavItem.Action>` slots. |
| **`Input`** | Form input wrapper built on `@headlessui/react` supporting `startIcon`, `endIcon`, and `focus-within` styling. |
| **`Keyboard`** | Keycap component supporting modifier symbols (`⌘`, `⌥`, `⇧`, `ctrl`, `k`). |
| **`ThemeSwitch` / `ThemeToggle`** | Theme mode switchers for toggling dark/light mode. |

---

## 🧭 Navigation & Router Architecture

`@admin/core` is natively integrated with **TanStack Router**. `<NavItem>` directly renders TanStack's `<Link to={item.path}>` with `activeProps` for automatic active route highlights and route preloading.

### 1. Convenience Props API (Fast Setup)

For 90% of standard admin apps, pass `navGroups`, `user`, and `onSignOut` directly to `<AdminLayout>`:

```tsx
import { AdminLayout } from "@admin/core";
import { Outlet } from "@tanstack/react-router";
import { navGroups } from "./config/navigation";

export default function App() {
  return (
    <AdminLayout
      title="ZeroUI Admin"
      navGroups={navGroups}
      user={{
        name: "Leon Alvarez",
        email: "leon@zeroui.com",
      }}
      onSignOut={() => alert("Signed out successfully!")}
    >
      <Outlet />
    </AdminLayout>
  );
}
```

### 2. Compound Components API (Custom Sidebar)

For applications requiring custom widgets (such as organization switchers or storage progress bars), compose `<SideBar>` compound components:

```tsx
import { AdminLayout, SideBar } from "@admin/core";
import { Outlet } from "@tanstack/react-router";
import ShieldIcon from "~icons/solar/shield-bold";

export function CustomApp() {
  return (
    <AdminLayout
      sidebar={
        <SideBar>
          {/* Custom Header */}
          <SideBar.Header title="Acme Enterprise" />

          {/* Navigation */}
          <SideBar.Nav groups={navGroups} />

          {/* Custom Footer with Org Switcher & Storage Meter */}
          <SideBar.Footer>
            <div className="px-3 py-2">
              <div className="rounded-lg bg-accent/40 p-2 text-xs flex items-center gap-2">
                <ShieldIcon className="size-4 text-primary" />
                <span className="font-semibold">Acme Corp (PRO)</span>
              </div>
            </div>
            <SideBar.UserMenu
              user={{ name: "Leon Alvarez", email: "leon@acme.com" }}
              onSignOut={() => alert("Signed out!")}
            />
          </SideBar.Footer>
        </SideBar>
      }
    >
      <Outlet />
    </AdminLayout>
  );
}
```

---

## 🛠️ Development & Commands

### Prerequisites
- [Bun](https://bun.sh) v1.1+

### Installation
```bash
bun install
```

### Development
Start all workspace apps in dev mode:
```bash
bun run dev
```

Or target the starter app directly:
```bash
bun --cwd apps/starter dev
```

### Type Checking & Build
```bash
# Typecheck packages and apps
bun run check-types

# Production build
bun run build
```

---

## 📄 License
MIT
