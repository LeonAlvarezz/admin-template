import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../common";
import { ORDER_STATUS, PAYMENT_STATUS } from "@z3/types";
import { user } from "./user.schema";
import { product } from "./product.schema";

export const orderStatusEnum = pgEnum(
  "ORDER_STATUS",
  enumToPgEnum(ORDER_STATUS),
);

export const paymentStatusEnum = pgEnum(
  "PAYMENT_STATUS",
  enumToPgEnum(PAYMENT_STATUS),
);

export const order = pgTable("order", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: orderStatusEnum("status").default(ORDER_STATUS.PENDING).notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default(PAYMENT_STATUS.PENDING)
    .notNull(),
  paymentMethod: text("payment_method").default("credit_card"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).default("0.00").notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orderItem = pgTable("order_item", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => order.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id").references(() => product.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
