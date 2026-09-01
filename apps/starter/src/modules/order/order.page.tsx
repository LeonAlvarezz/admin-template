import { DataTable } from "@z3/admin-core";
import type { Order } from "@z3/types";
import { SAMPLE_ORDERS } from "./constant/mock_order";
import { useState } from "react";
import { createOrderColumn } from "./components/order.column";
import { OrderModal } from "./components/order-modal";

function OrderPage() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const handleSaveOrder = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder);
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
    );
  };

  const columns = createOrderColumn({
    onEdit: (o) => {
      if (!o) return;
      setSelectedOrder(o);
      setModalMode("edit");
      setIsModalOpen(true);
    },
    onView: (o) => {
      if (!o) return;
      setSelectedOrder(o);
      setModalMode("view");
      setIsModalOpen(true);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage customer orders, track shipments, and review transactions.
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={orders} />

      <OrderModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        order={selectedOrder}
        initialMode={modalMode}
        onSave={handleSaveOrder}
      />
    </div>
  );
}

export default OrderPage;
