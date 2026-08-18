import React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@admin/core";
import { navGroups } from "../config/navigation";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
