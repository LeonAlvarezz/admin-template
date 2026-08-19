import type { Session, User } from "better-auth";
import * as v from "valibot";
import { UserSchema } from "./user";

export const SignInEmailSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(1)),
  rememberMe: v.optional(v.boolean()),
});

export type SignInEmail = v.InferOutput<typeof SignInEmailSchema>;

export const SignInEmailResponseSchema = v.object({
  token: v.optional(v.string()),
  url: v.optional(v.nullable(v.string())),
  redirect: v.optional(v.boolean()),
  user: UserSchema,
});

export type SignInEmailResponse = v.InferOutput<
  typeof SignInEmailResponseSchema
>;

export type SessionResponse = {
  user: User;
  session: Session;
};
