import { z } from "zod";

type CorsOriginResult =
  | boolean
  | string
  | RegExp
  | Array<boolean | string | RegExp>;

export type CorsOriginValidator = (
  requestOrigin: string | undefined,
  callback: (error: Error | null, origin?: CorsOriginResult) => void,
) => void;

export const httpOriginSchema = z
  .string()
  .trim()
  .url()
  .transform((value) => new URL(value))
  .refine(
    (url) => url.protocol === "http:" || url.protocol === "https:",
    "Origin must use HTTP or HTTPS",
  )
  .refine(
    (url) =>
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password,
    "Origin must not contain credentials, a path, query, or hash",
  )
  .transform((url) => url.origin);

export const corsOriginsSchema = z
  .string()
  .prefault("http://localhost:5173")
  .transform((value) => value.split(","))
  .pipe(z.array(httpOriginSchema).min(1))
  .transform((origins) => [...new Set(origins)]);

export const trustProxyHopsSchema = z.coerce.number().int().min(0).default(0);

export function createCorsOriginValidator(
  allowedOrigins: readonly string[],
): CorsOriginValidator {
  const allowlist = new Set(allowedOrigins);

  return (origin, callback) => {
    if (!origin || allowlist.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  };
}
