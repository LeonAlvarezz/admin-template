import * as v from "valibot";
export const NumberIdSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
});
