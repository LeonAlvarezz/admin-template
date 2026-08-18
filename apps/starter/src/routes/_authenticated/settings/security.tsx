import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/security")({
  component: SettingsSecurityPage,
});

function SettingsSecurityPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Security Settings
      </h1>
      <p className="text-muted-foreground text-sm">
        Configure two-factor authentication, sessions, and active API tokens.
      </p>
    </div>
  );
}
