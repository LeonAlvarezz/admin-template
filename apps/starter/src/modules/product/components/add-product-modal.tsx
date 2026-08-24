import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Modal,
  NativeSelect,
  Select,
  toast,
} from "@admin/core";

export interface ProductFormData {
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
}

export type NewProductData = ProductFormData;

export interface ProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: (ProductFormData & { id?: string }) | null;
  onSave: (product: ProductFormData) => void;
}

export type AddProductModalProps = ProductModalProps;

const CATEGORIES = [
  "Audio",
  "Electronics",
  "Accessories",
  "Home & Kitchen",
  "Apparel",
];

const STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active",
    icon: <span className="size-2 rounded-full bg-emerald-500 shrink-0" />,
  },
  {
    label: "Draft",
    value: "draft",
    icon: <span className="size-2 rounded-full bg-amber-500 shrink-0" />,
  },
  {
    label: "Archived",
    value: "archived",
    icon: <span className="size-2 rounded-full bg-muted-foreground shrink-0" />,
  },
];

export function ProductModal({
  isOpen,
  setIsOpen,
  product,
  onSave,
}: ProductModalProps) {
  const isEdit = Boolean(product);

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      category: product?.category ?? "Electronics",
      sku: product?.sku ?? "",
      price: product ? product.price : ("" as unknown as number),
      stock: product ? product.stock : ("" as unknown as number),
      status: product?.status ?? "active",
    },
    onSubmit: async ({ value }) => {
      const trimmedName = value.name.trim();
      if (!trimmedName) {
        toast.error("Please enter a product name");
        return;
      }

      const numPrice = Number(value.price);
      if (isNaN(numPrice) || numPrice < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      const numStock = Number(value.stock);
      if (isNaN(numStock) || numStock < 0) {
        toast.error("Please enter a valid stock quantity");
        return;
      }

      const generatedSku =
        value.sku.trim() ||
        `${value.category.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

      onSave({
        name: trimmedName,
        category: value.category,
        sku: generatedSku,
        price: numPrice,
        stock: numStock,
        status: value.status,
      });

      toast.success(
        isEdit
          ? `Product "${trimmedName}" updated successfully`
          : `Product "${trimmedName}" created successfully`,
      );
      handleClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: product?.name ?? "",
        category: product?.category ?? "Electronics",
        sku: product?.sku ?? "",
        price: product ? product.price : ("" as unknown as number),
        stock: product ? product.stock : ("" as unknown as number),
        status: product?.status ?? "active",
      });
    }
  }, [product, isOpen]);

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <Modal.Header>
          <Modal.Title>
            {isEdit ? "Edit Product" : "Add New Product"}
          </Modal.Title>
          <Modal.Description>
            {isEdit
              ? "Update product details, pricing, and stock information."
              : "Fill in the details below to add a new item to your product catalog."}
          </Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <FieldGroup className="gap-4">
            <form.Field
              name="name"
              validators={{
                onBlur: v.pipe(
                  v.string(),
                  v.minLength(1, "Product name is required"),
                ),
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Ergonomic Bluetooth Mouse"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      autoFocus
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field name="category">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <NativeSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      options={CATEGORIES}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="sku">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      SKU (Stock Keeping Unit)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. ELE-84920 (Auto if empty)"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <form.Field
                name="price"
                validators={{
                  onBlur: v.pipe(
                    v.number("Price must be a number"),
                    v.minValue(0, "Price must be positive"),
                  ),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Price ($)</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="29.99"
                        value={
                          field.state.value === 0 &&
                          !field.state.meta.isTouched &&
                          !isEdit
                            ? ""
                            : field.state.value
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value),
                          )
                        }
                        required
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="stock"
                validators={{
                  onBlur: v.pipe(
                    v.number("Stock must be an integer"),
                    v.minValue(0, "Stock must be non-negative"),
                  ),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Stock Quantity
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min="0"
                        placeholder="50"
                        value={
                          field.state.value === 0 &&
                          !field.state.meta.isTouched &&
                          !isEdit
                            ? ""
                            : field.state.value
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10) || 0,
                          )
                        }
                        required
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="status">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      searchable={true}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(val) =>
                        field.handleChange(
                          val as "active" | "draft" | "archived",
                        )
                      }
                      options={STATUS_OPTIONS}
                    />
                  </Field>
                )}
              </form.Field>
            </div>
          </FieldGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isEdit ? "Save Changes" : "Create Product"}
              </Button>
            )}
          </form.Subscribe>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export const AddProductModal = ProductModal;
export default ProductModal;
