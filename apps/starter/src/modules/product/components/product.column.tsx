import {
  CopyIcon,
  copyToClipboard,
  DataTableColumnHeader,
  DataTableRowActions,
  DeleteIcon,
  EditIcon,
  formatCurrency,
  formatDate,
  toast,
} from "@z3/admin-core";
import type { DefaultDataTableFeatures } from "@z3/admin-core";
import { PRODUCT_STATUS } from "@z3/types";
import type { Product } from "@z3/types";
import type { ColumnDef } from "@tanstack/react-table";

export const createProductColumn = ({
  onDelete,
  onEdit,
}: {
  onDelete: (product?: Product) => void;
  onEdit: (product?: Product) => void;
}): ColumnDef<DefaultDataTableFeatures, Product>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-muted-foreground">
          #{row.original.id}
        </span>
      ),
      size: 70,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="size-8 rounded-md object-cover border border-border shrink-0"
              />
            ) : (
              <div className="size-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0 border border-border">
                {product.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-foreground truncate">
                {product.name}
              </span>
              <span className="text-xs text-muted-foreground font-mono truncate">
                /{product.slug}
              </span>
            </div>
          </div>
        );
      },
      size: 280,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const isActive = status === PRODUCT_STATUS.ACTIVE;
        const isDraft = status === PRODUCT_STATUS.DRAFT;
        const label = isActive ? "Active" : isDraft ? "Draft" : "Inactive";
        const dotColor = isActive
          ? "bg-emerald-500"
          : isDraft
            ? "bg-amber-500"
            : "bg-rose-500";
        const badgeBg = isActive
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
          : isDraft
            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeBg}`}
          >
            <span className={`size-1.5 rounded-full ${dotColor}`} />
            {label}
          </span>
        );
      },
      size: 110,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {formatCurrency(row.original.price)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                stock > 20
                  ? "bg-emerald-500"
                  : stock > 0
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-medium">{stock} units</span>
          </div>
        );
      },
      size: 110,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      enableHiding: false,
      size: 120,
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DataTableRowActions
            actions={[
              {
                label: "Edit",
                icon: <EditIcon />,
                onClick: () => onEdit(product),
              },
              {
                label: "Copy Slug",
                icon: <CopyIcon />,
                onClick: async () => {
                  await copyToClipboard(product.slug);
                  toast.info(`Copied slug: ${product.slug}`);
                },
              },
              {
                label: "Delete",
                icon: <DeleteIcon />,
                variant: "destructive",
                onClick: () => onDelete(product),
              },
            ]}
          />
        );
      },
    },
  ];
};
