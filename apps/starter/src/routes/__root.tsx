import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextValue } from "@admin/core";

export interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
