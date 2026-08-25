import * as React from "react";
import {
  DataTable,
  Button,
  Input,
  toast,
  ConfirmModal,
  SearchIcon,
  PlusIcon,
} from "@admin/core";
import { ProductModal } from "./components/add-product-modal";
import type { ProductFormData } from "./components/add-product-modal";
import { createProductColumn } from "./components/product.column";
import { PRODUCT_STATUS } from "@admin/types";
import type { Product } from "@admin/types";
import { SAMPLE_PRODUCTS } from "./constant/mock_product";

function ProductPage() {
  const [products, setProducts] = React.useState<Product[]>(SAMPLE_PRODUCTS);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null,
  );

  const handleSaveProduct = (formData: ProductFormData) => {
    const now = new Date().toISOString();
    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                ...formData,
                updatedAt: now,
              }
            : p,
        ),
      );
    } else {
      const nextId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: nextId,
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.warning(`Deleted product ${productToDelete.name}`);
      setProductToDelete(null);
    }
  };

  const columns = createProductColumn({
    onDelete: (p) => {
      if (!p) return;
      setProductToDelete(p);
      setIsDeleteOpen(true);
    },
    onEdit: (p) => {
      if (!p) return;
      setSelectedProduct(p);
      setIsModalOpen(true);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="gap-1 flex flex-col">
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
      <ConfirmModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Delete "${productToDelete?.name}"?`}
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        variant="destructive"
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}

export default ProductPage;
