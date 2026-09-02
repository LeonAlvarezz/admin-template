import * as React from "react";
import {
  DataTable,
  Button,
  Input,
  toast,
  ConfirmModal,
  SearchIcon,
  PlusIcon,
} from "@z3/admin-core";
import { ProductModal } from "./components/add-product-modal";
import type { ProductFormData } from "./components/add-product-modal";
import { createProductColumn } from "./components/product.column";
import type { Product } from "@z3/types";
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "./api/product.api";

function ProductPage() {
  const { data, isLoading } = useProductsQuery();
  const products = data?.products ?? [];
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null,
  );

  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      if (selectedProduct) {
        await updateProductMutation.mutateAsync({
          id: selectedProduct.id,
          data: formData,
        });
        toast.success(`Updated "${formData.name}" successfully`);
      } else {
        await createProductMutation.mutateAsync(formData);
        toast.success(`Created "${formData.name}" successfully`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProductMutation.mutateAsync(productToDelete.id);
        toast.warning(`Deleted product "${productToDelete.name}"`);
      } catch (error) {
        toast.error("Failed to delete product");
      } finally {
        setProductToDelete(null);
        setIsDeleteOpen(false);
      }
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
        loading={isLoading}
        toolbar={(table) => (
          <DataTable.Toolbar>
            <Input
              placeholder="Search products..."
              value={
                (table.getColumn("name")?.getFilterValue() as
                  | string
                  | undefined) ?? ""
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
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

