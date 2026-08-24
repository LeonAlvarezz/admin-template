import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import SearchIcon from "~icons/boxicons/search";
import PlusIcon from "~icons/tabler/plus-filled";
import EditIcon from "~icons/lets-icons/edit-fill";
import CopyIcon from "~icons/solar/copy-bold";
import DeleteIcon from "~icons/mingcute/delete-fill";

import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  Button,
  Input,
  Checkbox,
  toast,
  formatCurrency,
  copyToClipboard,
} from "@admin/core";
import { ProductModal } from "./components/add-product-modal";
import type { ProductFormData } from "./components/add-product-modal";

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

const BASE_PRODUCTS = [
  {
    name: "Wireless Noise-Canceling Headphones",
    category: "Audio",
    price: 299.99,
  },
  {
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 149.5,
  },
  {
    name: "Minimalist Leather Backpack",
    category: "Accessories",
    price: 185.0,
  },
  { name: "Smart Fitness Watch Ultra", category: "Electronics", price: 349.0 },
  {
    name: "Ceramic Coffee Mug (Set of 4)",
    category: "Home & Kitchen",
    price: 34.99,
  },
  { name: "USB-C Multi-Port Hub Pro", category: "Accessories", price: 59.99 },
  { name: "Organic Cotton T-Shirt", category: "Apparel", price: 24.95 },
  { name: "Portable Bluetooth Speaker", category: "Audio", price: 89.99 },
  {
    name: "Stainless Steel Water Bottle 1L",
    category: "Home & Kitchen",
    price: 29.0,
  },
  {
    name: "Adjustable Desk Lamp LED",
    category: "Home & Kitchen",
    price: 49.99,
  },
  {
    name: 'Ultra-Wide Curved Gaming Monitor 34"',
    category: "Electronics",
    price: 699.99,
  },
  {
    name: "Wireless Ergonomic Vertical Mouse",
    category: "Electronics",
    price: 69.95,
  },
  {
    name: "Aluminum Laptop Stand Riser",
    category: "Accessories",
    price: 39.99,
  },
  { name: "Noise-Isolating In-Ear Earbuds", category: "Audio", price: 49.99 },
  {
    name: "Standing Desk Converter",
    category: "Office & Stationery",
    price: 219.0,
  },
  {
    name: "Leather Desk Pad Protector",
    category: "Office & Stationery",
    price: 29.5,
  },
  {
    name: "Smart Home Security Camera",
    category: "Electronics",
    price: 129.99,
  },
  {
    name: "Mechanical Pencil Set 0.5mm",
    category: "Office & Stationery",
    price: 15.99,
  },
  {
    name: "Fast Wireless Charging Pad 15W",
    category: "Accessories",
    price: 32.5,
  },
  {
    name: "Thermal Insulated Travel Flask",
    category: "Home & Kitchen",
    price: 27.99,
  },
];

const STATUSES: Array<Product["status"]> = ["active", "draft", "archived"];

const SAMPLE_PRODUCTS: Product[] = Array.from({ length: 65 }, (_, index) => {
  const base = BASE_PRODUCTS[index % BASE_PRODUCTS.length];
  const idNum = String(index + 1).padStart(3, "0");
  const skuPrefix = base.category.substring(0, 3).toUpperCase();
  const status = STATUSES[index % 3];
  const stock = (index * 7 + 3) % 120;
  const version = Math.floor(index / BASE_PRODUCTS.length);

  return {
    id: `PROD-${idNum}`,
    name: version > 0 ? `${base.name} (V${version + 1})` : base.name,
    sku: `${skuPrefix}-${idNum}`,
    category: base.category,
    price: parseFloat((base.price + (index % 5) * 5).toFixed(2)),
    stock: stock,
    status: stock === 0 ? "archived" : status,
    createdAt: `2026-0${(index % 6) + 1}-${String((index % 28) + 1).padStart(2, "0")}`,
  };
});

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
      size: 100,
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
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {formatCurrency(row.original.price)}
        </span>
      ),
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
      enableHiding: true,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DataTableRowActions
            actions={[
              {
                label: "Edit",
                icon: <EditIcon />,
                onClick: () => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                },
              },
              {
                label: "Copy SKU",
                icon: <CopyIcon />,
                onClick: async () => {
                  await copyToClipboard(product.sku);
                  toast.info(`Copied SKU: ${product.sku}`);
                },
              },

              {
                label: "Delete",
                icon: <DeleteIcon />,
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

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );

  const handleSaveProduct = (formData: ProductFormData) => {
    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...formData } : p,
        ),
      );
    } else {
      const product: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [product, ...prev]);
    }
  };

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
        toolbar={(table) => (
          <DataTable.Toolbar>
            <Input
              placeholder="Search products..."
              startIcon={<SearchIcon />}
              containerClassName="h-8"
              className="min-w-80"
            />
            <div className="flex items-center gap-2">
              <DataTable.ViewOptions table={table} />
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                }}
                className="h-8 px-3 text-xs flex items-center gap-1.5"
              >
                <PlusIcon />
                <span>Add Product</span>
              </Button>
            </div>
          </DataTable.Toolbar>
        )}
      />
      <ProductModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

export default ProductPage;
