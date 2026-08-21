import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  Button,
  Checkbox,
  toast,
} from "@admin/core";
import type { DefaultDataTableFeatures } from "@admin/core";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "Wireless Noise-Canceling Headphones",
    sku: "AUDIO-NC-01",
    category: "Electronics",
    price: 299.99,
    stock: 45,
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "PROD-002",
    name: "Ergonomic Mechanical Keyboard",
    sku: "PERIPH-MK-87",
    category: "Electronics",
    price: 149.5,
    stock: 12,
    status: "active",
    createdAt: "2026-02-01",
  },
  {
    id: "PROD-003",
    name: "Minimalist Leather Backpack",
    sku: "BAG-LEA-09",
    category: "Accessories",
    price: 185.0,
    stock: 0,
    status: "archived",
    createdAt: "2026-02-10",
  },
  {
    id: "PROD-004",
    name: "Smart Fitness Watch Ultra",
    sku: "SMART-WATCH-04",
    category: "Electronics",
    price: 349.0,
    stock: 28,
    status: "active",
    createdAt: "2026-03-05",
  },
  {
    id: "PROD-005",
    name: "Ceramic Coffee Mug (Set of 4)",
    sku: "HOME-MUG-04",
    category: "Home & Kitchen",
    price: 34.99,
    stock: 120,
    status: "active",
    createdAt: "2026-03-12",
  },
  {
    id: "PROD-006",
    name: "USB-C Multi-Port Hub Pro",
    sku: "ACC-USBC-71",
    category: "Accessories",
    price: 59.99,
    stock: 5,
    status: "draft",
    createdAt: "2026-04-02",
  },
  {
    id: "PROD-007",
    name: "Organic Cotton T-Shirt",
    sku: "APP-TSHIRT-01",
    category: "Apparel",
    price: 24.95,
    stock: 85,
    status: "active",
    createdAt: "2026-04-18",
  },
  {
    id: "PROD-008",
    name: "Portable Bluetooth Speaker",
    sku: "AUDIO-SPK-02",
    category: "Electronics",
    price: 89.99,
    stock: 19,
    status: "active",
    createdAt: "2026-05-01",
  },
  {
    id: "PROD-009",
    name: "Stainless Steel Water Bottle 1L",
    sku: "HOME-BTL-1L",
    category: "Home & Kitchen",
    price: 29.0,
    stock: 64,
    status: "active",
    createdAt: "2026-05-14",
  },
  {
    id: "PROD-010",
    name: "Adjustable Desk Lamp LED",
    sku: "HOME-LAMP-01",
    category: "Home & Kitchen",
    price: 49.99,
    stock: 0,
    status: "draft",
    createdAt: "2026-06-01",
  },
];

function ProductPage() {
  const [products, setProducts] = React.useState<Product[]>(SAMPLE_PRODUCTS);

  const columns: ColumnDef<DefaultDataTableFeatures, Product>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 40,
    // },
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU / ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-muted-foreground">
          {row.original.sku}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" />
      ),
      size: 300,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.original.price);
        return (
          <span className="font-semibold text-foreground">{formatted}</span>
        );
      },
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
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      meta: {
        className: "w-28",
      },
      cell: ({ row }) => {
        const status = row.original.status;
        const colorMap: Record<Product["status"], string> = {
          active:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          draft:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          archived: "bg-muted text-muted-foreground border-border",
        };

        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colorMap[status]}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      meta: {
        className: "w-12 text-right",
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DataTableRowActions
            actions={[
              {
                label: "Edit",
                icon: "i-lucide-pencil",
                onClick: () => toast.info(`Editing ${product.name}`),
              },
              {
                label: "Copy SKU",
                icon: "i-lucide-copy",
                onClick: () => toast.info(`Copied SKU: ${product.sku}`),
              },
              {
                label: "Delete",
                icon: "i-lucide-trash-2",
                variant: "destructive",
                onClick: () => {
                  setProducts((prev) =>
                    prev.filter((p) => p.id !== product.id),
                  );
                  toast.warning(`Deleted product ${product.name}`);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search by product name, SKU, or category..."
        toolbarActions={
          <Button
            variant="default"
            size="sm"
            onClick={() => toast.success("Create Product Modal Triggered")}
            className="h-9 px-3 text-xs flex items-center gap-1.5"
          >
            <span className="i-lucide-plus size-4" />
            <span>Add Product</span>
          </Button>
        }
      />
    </div>
  );
}

export default ProductPage;
