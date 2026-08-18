import React from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
  useLocation,
} from "@tanstack/react-router";
import { AdminLayout } from "@admin/core";
import { navGroups } from "./config/navigation";

// Root component that integrates AdminLayout with TanStack Router
function RootComponent() {
  const location = useLocation();

  return (
    <AdminLayout
      title="ZeroUI Admin"
      navGroups={navGroups}
      currentPath={location.pathname}
      renderLink={({ path, className, children }) => (
        <Link to={path} className={className}>
          {children}
        </Link>
      )}
    >
      <Outlet />
    </AdminLayout>
  );
}

// 1. Create root route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// 2. Create child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function DashboardPage() {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome to ZeroUI Admin layout powered by <code>@admin/core</code> and
          TanStack Router!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="p-4 rounded-lg border border-border bg-sidebar shadow-xs">
            <h3 className="font-semibold text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold mt-1">$45,231.89</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-sidebar shadow-xs">
            <h3 className="font-semibold text-sm">Subscriptions</h3>
            <p className="text-2xl font-bold mt-1">+2,350</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-sidebar shadow-xs">
            <h3 className="font-semibold text-sm">Active Now</h3>
            <p className="text-2xl font-bold mt-1">+573</p>
          </div>
        </div>
      </div>
    );
  },
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: function ShopPage() {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Shop Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage product catalog, inventory, and order fulfillments.
        </p>
      </div>
    );
  },
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: function SchedulePage() {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Schedules & Calendar
        </h1>
        <p className="text-muted-foreground text-sm">
          View upcoming tasks, events, and automated schedules.
        </p>
      </div>
    );
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: function SettingsPage() {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure application preferences, roles, and API keys.
        </p>
      </div>
    );
  },
});

// 3. Assemble route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  scheduleRoute,
  settingsRoute,
]);

// 4. Create router instance
export const router = createRouter({ routeTree });

// Register router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
