import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
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
}
