import * as v from "valibot";
import { CursorMetaSchema, CursorPaginationQuerySchema } from "./common";

export enum PRODUCT_STATUS {
  ACTIVE = "active",
  DRAFT = "draft",
  INACTIVE = "inactive",
}

export const ProductSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.nullable(v.string())),
  price: v.number(),
  status: v.enum(PRODUCT_STATUS),
  stock: v.pipe(v.number(), v.integer()),
  image: v.optional(v.nullable(v.string())),
  createdAt: v.union([v.date(), v.string()]),
  updatedAt: v.union([v.date(), v.string()]),
});

export type Product = v.InferOutput<typeof ProductSchema>;

export const CreateProductSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Product name is required")),
  slug: v.pipe(v.string(), v.minLength(1, "Slug is required")),
  description: v.optional(v.nullable(v.string())),
  price: v.pipe(v.number(), v.minValue(0, "Price must be positive")),
  stock: v.optional(v.pipe(v.number(), v.integer()), 0),
  image: v.optional(v.nullable(v.string())),
});

export type CreateProduct = v.InferOutput<typeof CreateProductSchema>;

export const UpdateProductSchema = v.partial(CreateProductSchema);
export type UpdateProduct = v.InferOutput<typeof UpdateProductSchema>;

export const ListProductsQuerySchema = v.object({
  ...CursorPaginationQuerySchema.entries,
  search: v.optional(v.string()),
  status: v.optional(v.enum(PRODUCT_STATUS)),
});

export type ListProductsQuery = {
  search?: string;
  status?: PRODUCT_STATUS;
  cursor?: string | null;
  limit?: number;
  order?: "asc" | "desc";
};

export const ProductsListResponseSchema = v.object({
  products: v.array(ProductSchema),
  total: v.number(),
  meta: v.optional(CursorMetaSchema),
});

export type ProductsListResponse = v.InferOutput<
  typeof ProductsListResponseSchema
>;

