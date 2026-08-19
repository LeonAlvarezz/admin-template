import React from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider, ThemeProvider, Toaster, useAuth } from "@admin/core";
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
    <ThemeProvider>
      <AuthProvider strategy={authStrategy}>
        <Toaster />
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
