import React from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@admin/core";
import { routeTree } from "./routeTree.gen";
import { authStrategy } from "./config/auth";

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  return (
    <AuthProvider strategy={authStrategy}>
      <InnerApp />
    </AuthProvider>
  );
}
