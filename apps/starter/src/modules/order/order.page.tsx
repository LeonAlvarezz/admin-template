import { DataTable, toast } from "@z3/admin-core";
import type { Order } from "@z3/types";
import { useState } from "react";
import { createOrderColumn } from "./components/order.column";
import { OrderModal } from "./components/order-modal";
import { useOrdersQuery, useUpdateOrderMutation } from "./api/order.api";

function OrderPage() {
  const { data, isLoading } = useOrdersQuery();
  const orders = data?.orders ?? [];
  const updateOrderMutation = useUpdateOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const handleSaveOrder = async (updatedOrder: Order) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: updatedOrder.id,
        data: updatedOrder,
      });
      setSelectedOrder(updatedOrder);
      toast.success(`Order #${updatedOrder.orderNumber} updated successfully`);
    } catch {
      toast.error("Failed to update order");
    }
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
      <DataTable columns={columns} data={orders} loading={isLoading} />

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
