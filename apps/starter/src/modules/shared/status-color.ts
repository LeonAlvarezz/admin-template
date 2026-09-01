import type { Color } from "@z3/admin-core";
import type { ORDER_STATUS, PAYMENT_STATUS } from "@z3/types";

export const PaymentStatusColor: Record<PAYMENT_STATUS, Color> = {
  failed: "red",
  paid: "emerald",
  pending: "sky",
  refunded: "indigo",
};

export const OrderStatusColor: Record<ORDER_STATUS, Color> = {
  cancelled: "red",
  delivered: "emerald",
  pending: "sky",
  processing: "indigo",
  shipped: "green",
};
