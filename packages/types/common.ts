import * as v from "valibot";
export type SortOrder = "asc" | "desc";

export const NumberIdSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
});

export const CursorPropsSchema = v.object({
  id: v.union([v.string(), v.number()]),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
});

export const CursorPaginationQuerySchema = v.object({
  cursor: v.optional(v.nullable(v.string())),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform((val) => (val ? Number(val) : 20)),
      v.number(),
      v.integer(),
      v.minValue(1),
      v.maxValue(100),
    ),
    20,
  ),
  order: v.optional(v.union([v.literal("asc"), v.literal("desc")]), "desc"),
});

export const CursorMetaPropsSchema = v.object({
  ...v.partial(CursorPropsSchema).entries,
  total: v.number(),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform((val) => (val != null ? Number(val) : 10)),
      v.number(),
    ),
    10,
  ),
});

export const CursorMetaSchema = v.object({
  next_cursor: v.optional(v.nullable(v.string())),
  has_more: v.boolean(),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform((val) => (val != null ? Number(val) : 10)),
      v.number(),
    ),
    10,
  ),
});

export type CursorMeta = v.InferOutput<typeof CursorMetaSchema>;

export type CursorMetaProps = v.InferOutput<typeof CursorMetaPropsSchema>;

export type BaseCursorPaginationQuery = v.InferOutput<
  typeof CursorPaginationQuerySchema
>;
export type CursorProps = v.InferOutput<typeof CursorPropsSchema>;
export type CursorPaginationQuery<TFilter = unknown> =
  BaseCursorPaginationQuery & TFilter;
