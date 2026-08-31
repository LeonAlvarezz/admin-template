import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import {
  Button,
  Upload,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Modal,
  Select,
  slugify,
  Textarea,
  toast,
} from "@admin/core";
import type { UploadFileItem } from "@admin/core";
import { PRODUCT_STATUS } from "@admin/types";
import type { Product } from "@admin/types";

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock: number;
  status: PRODUCT_STATUS;
  image?: string | null;
}

export type NewProductData = ProductFormData;

export interface ProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: ProductFormData) => void;
}

export type AddProductModalProps = ProductModalProps;

const STATUS_OPTIONS = [
  {
    label: "Active",
    value: PRODUCT_STATUS.ACTIVE,
    icon: <span className="size-2 rounded-full bg-emerald-500 shrink-0" />,
  },
  {
    label: "Draft",
    value: PRODUCT_STATUS.DRAFT,
    icon: <span className="size-2 rounded-full bg-amber-500 shrink-0" />,
  },
  {
    label: "Inactive",
    value: PRODUCT_STATUS.INACTIVE,
    icon: <span className="size-2 rounded-full bg-rose-500 shrink-0" />,
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
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product ? product.price : ("" as unknown as number),
      stock: product ? product.stock : ("" as unknown as number),
      status: product?.status ?? PRODUCT_STATUS.ACTIVE,
      image: product?.image ?? "",
    },
    onSubmit: async ({ value }) => {
      const trimmedName = value.name.trim();
      if (!trimmedName) {
        toast.error("Please enter a product name");
        return;
      }

      const trimmedSlug = (value.slug.trim() || slugify(trimmedName)).trim();
      if (!trimmedSlug) {
        toast.error("Please enter a product slug");
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

      onSave({
        name: trimmedName,
        slug: trimmedSlug,
        description: value.description.trim() || null,
        price: numPrice,
        stock: Math.floor(numStock),
        status: value.status,
        image: value.image.trim() || null,
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
        slug: product?.slug ?? "",
        description: product?.description ?? "",
        price: product ? product.price : ("" as unknown as number),
        stock: product ? product.stock : ("" as unknown as number),
        status: product?.status ?? PRODUCT_STATUS.ACTIVE,
        image: product?.image ?? "",
      });
    }
  }, [product, isOpen]);

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      size="2xl"
      className="max-h-[85vh] flex flex-col p-0 overflow-hidden"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col flex-1 min-h-0 space-y-0"
      >
        <Modal.Header className="px-6 sm:px-8 pt-6 pb-4 pr-12 sm:pr-16 shrink-0">
          <Modal.Title>
            {isEdit ? "Edit Product" : "Add New Product"}
          </Modal.Title>
          <Modal.Description>
            {isEdit
              ? "Update product details, pricing, and stock information."
              : "Fill in the details below to add a new item to your product catalog."}
          </Modal.Description>
        </Modal.Header>

        <Modal.Body className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-none scroll-fade-y">
          <FieldGroup className="gap-4 pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        onChange={(e) => {
                          const newName = e.target.value;
                          field.handleChange(newName);
                          // Auto-fill slug if currently empty or matches previous slugified value
                          const currentSlug = form.getFieldValue("slug");
                          if (!currentSlug || !isEdit) {
                            form.setFieldValue("slug", slugify(newName));
                          }
                        }}
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

              <form.Field
                name="slug"
                validators={{
                  onBlur: v.pipe(
                    v.string(),
                    v.minLength(1, "Slug is required"),
                  ),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="e.g. ergonomic-bluetooth-mouse"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
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
                        field.handleChange(val as PRODUCT_STATUS)
                      }
                      options={STATUS_OPTIONS}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="image">
              {(field) => {
                const currentVal = field.state.value;
                const items: UploadFileItem[] = currentVal
                  ? [
                      {
                        id: "product-image",
                        name: currentVal.split("/").pop() || "product-image",
                        url: currentVal,
                      },
                    ]
                  : [];

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Product Media / Image
                    </FieldLabel>
                    <Upload
                      id={field.name}
                      accept={["image", ".jpg", ".png", ".webp"]}
                      maxSize={5 * 1024 * 1024}
                      value={items}
                      multiple={false}
                      showLinkInput={true}
                      onLinkSubmit={(url) => {
                        field.handleChange(url);
                      }}
                      onDropAccepted={(files) => {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          field.handleChange(result);
                        };
                        reader.readAsDataURL(file);
                      }}
                      onChange={(newItems) => {
                        if (newItems.length === 0) {
                          field.handleChange("");
                        } else if (newItems[0].url) {
                          field.handleChange(newItems[0].url);
                        }
                      }}
                    />
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Description (Optional)
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Brief description of the product features and specs..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    maxWordCount={100}
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </Modal.Body>

        <Modal.Footer className="px-6 py-4 border-t border-border shrink-0">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([isSubmitting]) => (
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
