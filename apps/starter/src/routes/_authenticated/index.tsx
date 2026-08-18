import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Dashboard Overview
      </h1>
      <p className="text-muted-foreground text-sm">
        Welcome to ZeroUI Admin layout powered by <code>@admin/core</code> and
        TanStack Router file-based routing!
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
}
