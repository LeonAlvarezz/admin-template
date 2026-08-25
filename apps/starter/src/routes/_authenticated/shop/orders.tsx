import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import OrderPage from "@/modules/order/order.page";

export const Route = createFileRoute("/_authenticated/shop/orders")({
  component: OrderPage,
});
