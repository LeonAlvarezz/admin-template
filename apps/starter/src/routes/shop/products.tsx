import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop/products")({
  component: ShopProductsPage,
});

function ShopProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Products Catalog
      </h1>
      <p className="text-muted-foreground text-sm">
        View, edit, and create new inventory items in your store.
      </p>
    </div>
  );
}
