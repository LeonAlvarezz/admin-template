import * as v from "valibot";

export enum USER_ROLE {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

export const UserSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  emailVerified: v.boolean(),
  image: v.optional(v.nullable(v.string())),
  createdAt: v.union([v.date(), v.string()]),
  updatedAt: v.union([v.date(), v.string()]),
  role: v.optional(v.nullable(v.string())),
  banned: v.optional(v.nullable(v.boolean())),
  banReason: v.optional(v.nullable(v.string())),
  banExpires: v.optional(v.nullable(v.union([v.date(), v.string()]))),
  twoFactorEnabled: v.optional(v.nullable(v.boolean())),
});

export const ChangePasswordSchema = v.object({
  currentPassword: v.string(),
  newPassword: v.string(),
});

export const EnableTwoFactorSchema = v.object({
  password: v.string(),
  method: v.union([v.literal("otp"), v.literal("totp")]),
  issuer: v.optional(v.string()),
});

export const UpdateUserInfoSchema = v.pick(UserSchema, ["name", "image"]);

export type User = v.InferOutput<typeof UserSchema>;

export const CreateUserSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  image: v.optional(v.nullable(v.string())),
});

export type CreateUser = v.InferOutput<typeof CreateUserSchema>;

export type UpdateUserInfo = v.InferOutput<typeof UpdateUserInfoSchema>;
export type ChangePassword = v.InferOutput<typeof ChangePasswordSchema>;
export type EnableTwoFactor = v.InferOutput<typeof EnableTwoFactorSchema>;

