import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  component: SettingsProfilePage,
});

function SettingsProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        User Profile
      </h1>
      <p className="text-muted-foreground text-sm">
        Manage personal avatar, display name, and notification preferences.
      </p>
    </div>
  );
}
