import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import {
  Button,
  CopyIcon,
  copyToClipboard,
  EditIcon,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  formatCurrency,
  formatDate,
  Input,
  MaximizeIcon,
  MinimizeIcon,
  Modal,
  NumberStepper,
  PlusIcon,
  Select,
  Tag,
  toast,
  TrashIcon,
} from "@admin/core";
import type { Color } from "@admin/core";
import type { Order, OrderItem } from "@admin/types";
import { ORDER_STATUS, PAYMENT_STATUS } from "@admin/types";
import { ORDER_ITEMS_POOL } from "../constant/mock_order";
import { OrderStatusColor } from "@/modules/shared/status-color";

export interface OrderModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  order: Order | null;
  initialMode?: "view" | "edit";
  onSave?: (updatedOrder: Order) => void;
}

const ORDER_STATUS_OPTIONS = [
  {
    label: "Pending",
    value: ORDER_STATUS.PENDING,
    icon: <span className="size-2 rounded-full bg-sky-500 shrink-0" />,
  },
  {
    label: "Processing",
    value: ORDER_STATUS.PROCESSING,
    icon: <span className="size-2 rounded-full bg-indigo-500 shrink-0" />,
  },
  {
    label: "Shipped",
    value: ORDER_STATUS.SHIPPED,
    icon: <span className="size-2 rounded-full bg-emerald-500 shrink-0" />,
  },
  {
    label: "Delivered",
    value: ORDER_STATUS.DELIVERED,
    icon: <span className="size-2 rounded-full bg-teal-500 shrink-0" />,
  },
  {
    label: "Cancelled",
    value: ORDER_STATUS.CANCELLED,
    icon: <span className="size-2 rounded-full bg-rose-500 shrink-0" />,
  },
];

const PAYMENT_STATUS_OPTIONS = [
  {
    label: "Paid",
    value: PAYMENT_STATUS.PAID,
    icon: <span className="size-2 rounded-full bg-emerald-500 shrink-0" />,
  },
  {
    label: "Pending",
    value: PAYMENT_STATUS.PENDING,
    icon: <span className="size-2 rounded-full bg-sky-500 shrink-0" />,
  },
  {
    label: "Refunded",
    value: PAYMENT_STATUS.REFUNDED,
    icon: <span className="size-2 rounded-full bg-indigo-500 shrink-0" />,
  },
  {
    label: "Failed",
    value: PAYMENT_STATUS.FAILED,
    icon: <span className="size-2 rounded-full bg-rose-500 shrink-0" />,
  },
];

const PAYMENT_METHOD_OPTIONS = [
  { label: "Credit Card (Visa)", value: "Credit Card (Visa)" },
  { label: "Credit Card (Mastercard)", value: "Credit Card (Mastercard)" },
  { label: "Apple Pay", value: "Apple Pay" },
  { label: "PayPal", value: "PayPal" },
  { label: "Stripe", value: "Stripe" },
];

export function OrderModal({
  isOpen,
  setIsOpen,
  order,
  initialMode = "view",
  onSave,
}: OrderModalProps) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editableItems, setEditableItems] = useState<OrderItem[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<
    number | null
  >(null);

  // Sync mode and items when order or modal state changes
  useEffect(() => {
    if (isOpen && order) {
      setMode(initialMode);
      setEditableItems(order.items ? [...order.items] : []);
      setSelectedProductToAdd(null);
      setIsFullscreen(false);
    }
  }, [isOpen, order, initialMode]);

  // Dynamic financial totals calculation
  const totals = useMemo(() => {
    const subtotal = parseFloat(
      editableItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
    );
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15.0;
    const totalAmount = parseFloat((subtotal + tax + shippingFee).toFixed(2));
    return { subtotal, tax, shippingFee, totalAmount };
  }, [editableItems]);

  const form = useForm({
    defaultValues: {
      status: order?.status ?? ORDER_STATUS.PENDING,
      paymentStatus: order?.paymentStatus ?? PAYMENT_STATUS.PENDING,
      paymentMethod: order?.paymentMethod ?? "Credit Card (Visa)",
      customerEmail: order?.customerEmail ?? "",
      customerPhone: order?.customerPhone ?? "",
      shippingAddress: order?.shippingAddress ?? "",
      notes: order?.notes ?? "",
    },
    onSubmit: async ({ value }) => {
      if (!order) return;

      if (editableItems.length === 0) {
        toast.error("Order must contain at least one item");
        return;
      }

      const updatedOrder: Order = {
        ...order,
        status: value.status,
        paymentStatus: value.paymentStatus,
        paymentMethod: value.paymentMethod,
        customerEmail: value.customerEmail.trim(),
        customerPhone: value.customerPhone.trim() || null,
        shippingAddress: value.shippingAddress.trim() || null,
        notes: value.notes.trim() || null,
        items: editableItems,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shippingFee: totals.shippingFee,
        totalAmount: totals.totalAmount,
        updatedAt: new Date().toISOString(),
      };

      onSave?.(updatedOrder);
      toast.success(`Order ${order.orderNumber} updated successfully`);
      setMode("view");
    },
  });

  // Re-sync form default values when entering edit mode
  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod ?? "Credit Card (Visa)",
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone ?? "",
        shippingAddress: order.shippingAddress ?? "",
        notes: order.notes ?? "",
      });
      setEditableItems(order.items ? [...order.items] : []);
    }
  }, [order, mode]);

  if (!order) return null;

  const handleCopyOrderNumber = async () => {
    await copyToClipboard(order.orderNumber);
    toast.success(`Copied ${order.orderNumber} to clipboard`);
  };

  const handleUpdateQuantity = (itemId: number, delta: number) => {
    setEditableItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: parseFloat((item.price * newQty).toFixed(2)),
            };
          }
          return item;
        })
        .filter((item): item is OrderItem => item !== null),
    );
  };

  const handleSetQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) return;
    setEditableItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            subtotal: parseFloat((item.price * quantity).toFixed(2)),
          };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (itemId: number) => {
    if (editableItems.length <= 1) {
      toast.error("Order must contain at least one item");
      return;
    }
    setEditableItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.info("Item removed from order");
  };

  const handleAddItem = () => {
    if (!selectedProductToAdd) return;
    const poolItem = ORDER_ITEMS_POOL.find(
      (p) => p.productId === selectedProductToAdd,
    );
    if (!poolItem) return;

    // Check if item already exists in order
    const existingIndex = editableItems.findIndex(
      (item) => item.productId === poolItem.productId,
    );

    if (existingIndex >= 0) {
      // Increment existing quantity
      setEditableItems((prev) =>
        prev.map((item, idx) => {
          if (idx === existingIndex) {
            const quantity = item.quantity + 1;
            return {
              ...item,
              quantity,
              subtotal: parseFloat((item.price * quantity).toFixed(2)),
            };
          }
          return item;
        }),
      );
      toast.success(`Incremented quantity for "${poolItem.productName}"`);
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: Date.now(),
        orderId: order.id,
        productId: poolItem.productId,
        productName: poolItem.productName,
        productImage: poolItem.productImage,
        price: poolItem.price,
        quantity: 1,
        subtotal: poolItem.price,
        createdAt: new Date().toISOString(),
      };
      setEditableItems((prev) => [...prev, newItem]);
      toast.success(`Added "${poolItem.productName}" to order`);
    }

    setSelectedProductToAdd(null);
  };

  const productSelectOptions = ORDER_ITEMS_POOL.map((p) => ({
    label: `${p.productName} (${formatCurrency(p.price)})`,
    value: p.productId,
  }));

  const isEditMode = mode === "edit";

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      size={isFullscreen ? "full" : "4xl"}
      showFullscreen={true}
      isFullscreen={isFullscreen}
      onFullscreenChange={setIsFullscreen}
    >
      {/* Header with Title, Actions, Fullscreen Button */}
      <Modal.Header>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Modal.Title className="text-xl font-bold">
                {order.orderNumber}
              </Modal.Title>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={handleCopyOrderNumber}
                title="Copy order number"
              >
                <CopyIcon className="size-3.5" />
              </Button>
            </div>
            <Modal.Description className="mt-1">
              Placed on{" "}
              {formatDate(order.createdAt, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Modal.Description>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Tags in View Mode */}
            {!isEditMode && (
              <>
                <Tag
                  label={order.status}
                  color={OrderStatusColor[order.status]}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => setMode("edit")}
                >
                  <EditIcon className="size-3.5" />
                  <span>Edit</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal.Header>

      {/* Body Content */}
      <Modal.Body
        className={isFullscreen ? "flex-1 overflow-y-auto min-h-0 pr-1" : ""}
      >
        {isEditMode ? (
          /* =======================================
             EDIT MODE
             ======================================= */
          <form
            id="order-edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* General & Status Settings */}
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <form.Field name="status">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Fulfillment Status
                      </FieldLabel>
                      <Select
                        searchable={false}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(val) =>
                          field.handleChange(val as ORDER_STATUS)
                        }
                        options={ORDER_STATUS_OPTIONS}
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="paymentStatus">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Payment Status
                      </FieldLabel>
                      <Select
                        searchable={false}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(val) =>
                          field.handleChange(val as PAYMENT_STATUS)
                        }
                        options={PAYMENT_STATUS_OPTIONS}
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="paymentMethod">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Payment Method
                      </FieldLabel>
                      <Select
                        searchable={false}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(val) => field.handleChange(String(val))}
                        options={PAYMENT_METHOD_OPTIONS}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Customer Contact & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field
                  name="customerEmail"
                  validators={{
                    onBlur: v.pipe(
                      v.string(),
                      v.email("Please enter a valid email address"),
                    ),
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Customer Email
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="customer@example.com"
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

                <form.Field name="customerPhone">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Customer Phone (Optional)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="+1 (555) 000-0000"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="shippingAddress">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Shipping Address (Optional)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="123 Main St, City, State ZIP"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="notes">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Order Notes (Optional)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Delivery instructions or notes..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
            </FieldGroup>

            {/* Editable Order Items Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Order Items ({editableItems.length})
                </h3>
              </div>

              {/* Items List */}
              <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                {editableItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="size-12 rounded-md object-cover border border-border shrink-0 bg-muted"
                        />
                      ) : (
                        <div className="size-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs shrink-0">
                          Item
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      {/* Quantity Stepper */}
                      <NumberStepper
                        value={item.quantity}
                        min={1}
                        onChange={(newQty) =>
                          handleSetQuantity(item.id, newQty)
                        }
                      />

                      {/* Line Subtotal */}
                      <p className="text-sm font-semibold text-foreground min-w-20 text-right">
                        {formatCurrency(item.subtotal)}
                      </p>

                      {/* Remove Action */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove product"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Product Toolbar */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <div className="w-full sm:flex-1">
                  <Select
                    searchable={true}
                    placeholder="Select a product to add to this order..."
                    value={selectedProductToAdd}
                    onChange={(val) =>
                      setSelectedProductToAdd(val === null ? null : Number(val))
                    }
                    options={productSelectOptions}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  disabled={!selectedProductToAdd}
                  className="w-full sm:w-auto shrink-0 gap-1.5"
                >
                  <PlusIcon className="size-4" />
                  <span>Add Product</span>
                </Button>
              </div>
            </div>

            {/* Live Financial Summary */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping Fee</span>
                <span className="font-medium text-foreground">
                  {totals.shippingFee === 0
                    ? "Free"
                    : formatCurrency(totals.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(totals.tax)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-primary font-bold">
                  {formatCurrency(totals.totalAmount)}
                </span>
              </div>
            </div>
          </form>
        ) : (
          /* =======================================
             VIEW MODE
             ======================================= */
          <div className="space-y-6">
            {/* Customer & Delivery Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card/50 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer Details
                </p>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">
                    {order.customerName}
                  </p>
                  <p className="text-muted-foreground">{order.customerEmail}</p>
                  {order.customerPhone && (
                    <p className="text-muted-foreground">
                      {order.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Shipping & Payment
                </p>
                <div className="space-y-1 text-sm">
                  {order.shippingAddress && (
                    <p className="text-foreground">{order.shippingAddress}</p>
                  )}
                  {order.paymentMethod && (
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">
                        Payment:
                      </span>{" "}
                      {order.paymentMethod}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-xs text-muted-foreground italic mt-2 border-t border-border/50 pt-1.5">
                      <span className="font-medium not-italic">Note:</span>{" "}
                      {order.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Read-only Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Order Items ({order.items?.length ?? 0})
                </h3>
              </div>

              <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="size-12 rounded-md object-cover border border-border shrink-0 bg-muted"
                          />
                        ) : (
                          <div className="size-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs shrink-0">
                            Item
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No items in this order.
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping Fee</span>
                <span className="font-medium text-foreground">
                  {order.shippingFee === 0
                    ? "Free"
                    : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Tax</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(order.tax)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-primary">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      {/* Footer Controls */}
      <Modal.Footer>
        {isEditMode ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditableItems(order.items ? [...order.items] : []);
                setMode("view");
              }}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  form="order-edit-form"
                  variant="default"
                  disabled={isSubmitting}
                >
                  Save Changes
                </Button>
              )}
            </form.Subscribe>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default OrderModal;
