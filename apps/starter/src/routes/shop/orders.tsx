import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop/orders")({
  component: ShopOrdersPage,
});

function ShopOrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Customer Orders
      </h1>
      <p className="text-muted-foreground text-sm">
        Track fulfillment status, shipments, and customer payments.
      </p>
    </div>
  );
}
