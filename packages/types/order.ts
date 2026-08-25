import * as v from "valibot";

export enum ORDER_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export const OrderItemSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  orderId: v.pipe(v.number(), v.integer()),
  productId: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
  productName: v.string(),
  productImage: v.optional(v.nullable(v.string())),
  price: v.number(),
  quantity: v.pipe(v.number(), v.integer()),
  subtotal: v.number(),
  createdAt: v.union([v.date(), v.string()]),
});

export type OrderItem = v.InferOutput<typeof OrderItemSchema>;

export const OrderSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  orderNumber: v.string(),
  userId: v.optional(v.nullable(v.string())),
  customerName: v.string(),
  customerEmail: v.pipe(v.string(), v.email()),
  customerPhone: v.optional(v.nullable(v.string())),
  status: v.enum(ORDER_STATUS),
  paymentStatus: v.enum(PAYMENT_STATUS),
  paymentMethod: v.optional(v.nullable(v.string())),
  subtotal: v.number(),
  tax: v.number(),
  shippingFee: v.number(),
  totalAmount: v.number(),
  shippingAddress: v.optional(v.nullable(v.string())),
  notes: v.optional(v.nullable(v.string())),
  createdAt: v.union([v.date(), v.string()]),
  updatedAt: v.union([v.date(), v.string()]),
  items: v.optional(v.array(OrderItemSchema)),
});

export type Order = v.InferOutput<typeof OrderSchema>;

export const CreateOrderItemSchema = v.object({
  productId: v.optional(v.pipe(v.number(), v.integer())),
  productName: v.pipe(v.string(), v.minLength(1, "Product name is required")),
  productImage: v.optional(v.string()),
  price: v.pipe(v.number(), v.minValue(0, "Price must be positive")),
  quantity: v.pipe(v.number(), v.integer(), v.minValue(1, "Quantity must be at least 1")),
  subtotal: v.pipe(v.number(), v.minValue(0)),
});

export type CreateOrderItem = v.InferOutput<typeof CreateOrderItemSchema>;

export const CreateOrderSchema = v.object({
  userId: v.optional(v.string()),
  customerName: v.pipe(v.string(), v.minLength(1, "Customer name is required")),
  customerEmail: v.pipe(v.string(), v.email("Invalid email format")),
  customerPhone: v.optional(v.string()),
  status: v.optional(v.enum(ORDER_STATUS), ORDER_STATUS.PENDING),
  paymentStatus: v.optional(v.enum(PAYMENT_STATUS), PAYMENT_STATUS.PENDING),
  paymentMethod: v.optional(v.string(), "credit_card"),
  subtotal: v.pipe(v.number(), v.minValue(0)),
  tax: v.optional(v.pipe(v.number(), v.minValue(0)), 0),
  shippingFee: v.optional(v.pipe(v.number(), v.minValue(0)), 0),
  totalAmount: v.pipe(v.number(), v.minValue(0)),
  shippingAddress: v.optional(v.string()),
  notes: v.optional(v.string()),
  items: v.pipe(v.array(CreateOrderItemSchema), v.minLength(1, "At least one item is required")),
});

export type CreateOrder = v.InferOutput<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = v.object({
  status: v.optional(v.enum(ORDER_STATUS)),
  paymentStatus: v.optional(v.enum(PAYMENT_STATUS)),
  notes: v.optional(v.string()),
});

export type UpdateOrderStatus = v.InferOutput<typeof UpdateOrderStatusSchema>;

export const UpdateOrderSchema = v.partial(CreateOrderSchema);
export type UpdateOrder = v.InferOutput<typeof UpdateOrderSchema>;
