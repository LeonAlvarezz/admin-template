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
import { PRODUCT_STATUS } from "@admin/types";

export const productStatusEnum = pgEnum(
  "PRODUCT_STATUS",
  enumToPgEnum(PRODUCT_STATUS),
);
export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  image: text("image"),
  status: productStatusEnum().default(PRODUCT_STATUS.DRAFT).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
