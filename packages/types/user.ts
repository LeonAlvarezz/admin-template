import * as v from "valibot";

export const UserSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  emailVerified: v.boolean(),
  image: v.nullable(v.string()),
  createdAt: v.union([v.date(), v.string()]),
  updatedAt: v.union([v.date(), v.string()]),
});

export type User = v.InferOutput<typeof UserSchema>;

export const CreateUserSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  image: v.optional(v.nullable(v.string())),
});

export type CreateUser = v.InferOutput<typeof CreateUserSchema>;

export const UpdateUserSchema = v.partial(CreateUserSchema);

export type UpdateUser = v.InferOutput<typeof UpdateUserSchema>;

