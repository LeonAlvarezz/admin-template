import {
  OrderStatusColor,
  PaymentStatusColor,
} from "@/modules/shared/status-color";
import {
  DataTableColumnHeader,
  DataTableRowActions,
  EditIcon,
  formatCurrency,
  Tag,
  ViewIcon,
} from "@z3/admin-core";
import type { Color, DefaultDataTableFeatures } from "@z3/admin-core";
import type { Order, ORDER_STATUS, PAYMENT_STATUS } from "@z3/types";
import type { ColumnDef } from "@tanstack/react-table";

type Props = {
  onView: (order?: Order) => void;
  onEdit: (order?: Order) => void;
};
export const createOrderColumn = ({
  onView,
  onEdit,
}: Props): ColumnDef<DefaultDataTableFeatures, Order>[] => {
  return [
    {
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <DataTableColumnHeader title="Order Number" column={column} />
      ),
    },

    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader title="Customer Name" column={column} />
      ),
    },
    {
      accessorKey: "customerEmail",
      header: ({ column }) => (
        <DataTableColumnHeader title="Customer Email" column={column} />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => {
        return (
          <Tag
            label={row.original.status}
            color={OrderStatusColor[row.original.status]}
          />
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: ({ column }) => (
        <DataTableColumnHeader title="Payment Status" column={column} />
      ),
      cell: ({ row }) => {
        const paymentStatus: Record<PAYMENT_STATUS, Color> = {
          failed: "red",
          paid: "emerald",
          pending: "sky",
          refunded: "indigo",
        };
        return (
          <Tag
            label={row.original.paymentStatus}
            color={PaymentStatusColor[row.original.paymentStatus]}
          />
        );
      },
    },

    {
      accessorKey: "subtotal",
      header: ({ column }) => (
        <DataTableColumnHeader title="Subtotal" column={column} />
      ),
      cell: ({ row }) => formatCurrency(row.original.subtotal),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader title="Total Amount" column={column} />
      ),
      cell: ({ row }) => formatCurrency(row.original.totalAmount),
    },

    {
      accessorKey: "paymentMethod",
      header: ({ column }) => (
        <DataTableColumnHeader title="Payment Method" column={column} />
      ),
      size: 250,
      cell: ({ row }) => {
        return (
          <div className="rounded-md p-2 bg-muted/30 w-full">
            <p className="font-mono text-xs">{row.original.paymentMethod}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader title="Actions" column={column} />
      ),
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DataTableRowActions
            actions={[
              {
                label: "View Detail",
                icon: <ViewIcon />,
                onClick: () => onView(order),
              },
              {
                label: "Edit",
                icon: <EditIcon />,
                onClick: () => onEdit(order),
              },
            ]}
          />
        );
      },
    },
  ];
};
