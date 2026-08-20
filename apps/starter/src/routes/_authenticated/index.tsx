import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { VisitorBarChart } from "../../modules/dashboard/components/visitor-bar-chart";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to ZeroUI Admin layout powered by <code>@admin/core</code> and
          TanStack Router file-based routing!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-sidebar shadow-xs">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</h3>
          <p className="text-2xl font-bold mt-1 text-foreground">$45,231.89</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-sidebar shadow-xs">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Subscriptions</h3>
          <p className="text-2xl font-bold mt-1 text-foreground">+2,350</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-sidebar shadow-xs">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Active Now</h3>
          <p className="text-2xl font-bold mt-1 text-foreground">+573</p>
        </div>
      </div>

      <VisitorBarChart />
    </div>
  );
}

