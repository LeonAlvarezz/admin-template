import { describe, expect, mock, test } from "bun:test";
import React, { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { Card } from "../../../packages/core/src/components/ui/card";

mock.module("@admin/core", () => ({ Card }));
mock.module("../src/modules/dashboard/components/visitor-bar-chart", () => ({
  VisitorBarChart: () => null,
}));

const { Route } = await import("../src/routes/_authenticated/index");

describe("Dashboard", () => {
  test("renders the three metrics with shared Card styling", () => {
    const Dashboard = Route.options.component;

    expect(Dashboard).toBeDefined();

    if (!Dashboard) {
      throw new Error("Dashboard route component is missing");
    }

    const dashboard = (Dashboard as () => ReactNode)();

    if (!isValidElement<{ children?: ReactNode }>(dashboard)) {
      throw new Error("Dashboard route did not render a React element");
    }

    const [, metricsGrid] = Children.toArray(dashboard.props.children);

    if (!isValidElement<{ children?: ReactNode }>(metricsGrid)) {
      throw new Error("Dashboard metrics grid is missing");
    }

    const metrics = Children.toArray(metricsGrid.props.children);

    expect(metrics).toHaveLength(3);
    expect(
      metrics.every((metric) => isValidElement(metric) && metric.type === Card),
    ).toBe(true);
  });
});
