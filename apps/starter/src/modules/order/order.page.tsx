import { DataTable, Tag } from "@admin/core";
import type { Order } from "@admin/types";
import { SAMPLE_ORDERS } from "./constant/mock_order";
import { useState } from "react";
import { createOrderColumn } from "./components/order.column";

function OrderPage() {
  const [order, setOrder] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const columns = createOrderColumn({
    onEdit: (o) => {
      if (!o) return;
      setSelectedOrder(o);
    },

    onView: (o) => {
      if (!o) return;
      setSelectedOrder(o);
    },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your store's inventory, pricing, and catalog items.
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={order} />
    </div>
  );
}
export default OrderPage;
