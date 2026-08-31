import * as v from "valibot";

export const IdStringSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1, "ID is required")),
});

export type IdStringDto = v.InferOutput<typeof IdStringSchema>;
