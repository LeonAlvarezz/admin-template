import { describe, expect, test } from "bun:test";
import {
  corsOriginsSchema,
  createCorsOriginValidator,
  httpOriginSchema,
  trustProxyHopsSchema,
} from "../src/config/cors";

function validateOrigin(
  validator: ReturnType<typeof createCorsOriginValidator>,
  origin?: string,
) {
  return new Promise<boolean>((resolve, reject) => {
    validator(origin, (error, allowed) => {
      if (error) return reject(error);
      resolve(allowed === true);
    });
  });
}

describe("production HTTP security configuration", () => {
  test("Better Auth shares the validated CORS origin allowlist", async () => {
    const authSource = await Bun.file(
      new URL("../src/lib/auth.ts", import.meta.url),
    ).text();

    expect(authSource).toContain('import { env } from "@/config";');
    expect(authSource).toContain("trustedOrigins: env.CORS_ORIGINS");
  });

  test("normalizes a comma-separated exact-origin allowlist", () => {
    expect(
      corsOriginsSchema.parse(
        " https://admin.example.com/,http://localhost:5173 ",
      ),
    ).toEqual(["https://admin.example.com", "http://localhost:5173"]);
  });

  test("defaults to the local frontend origin", () => {
    expect(corsOriginsSchema.parse(undefined)).toEqual([
      "http://localhost:5173",
    ]);
  });

  test("rejects URLs that are not HTTP origins", () => {
    expect(httpOriginSchema.safeParse("ftp://admin.example.com").success).toBe(
      false,
    );
    expect(
      httpOriginSchema.safeParse("https://admin.example.com/path").success,
    ).toBe(false);
  });

  test("accepts configured browser origins", async () => {
    const validate = createCorsOriginValidator([
      "https://admin.example.com",
    ]);
    expect(await validateOrigin(validate, "https://admin.example.com")).toBe(
      true,
    );
  });

  test("accepts requests without an Origin header", async () => {
    const validate = createCorsOriginValidator([
      "https://admin.example.com",
    ]);
    expect(await validateOrigin(validate)).toBe(true);
  });

  test("rejects unconfigured origins and invalid proxy hops", async () => {
    const validate = createCorsOriginValidator([
      "https://admin.example.com",
    ]);

    await expect(
      validateOrigin(validate, "https://attacker.example"),
    ).rejects.toThrow("Origin not allowed by CORS");
    expect(trustProxyHopsSchema.safeParse(-1).success).toBe(false);
    expect(trustProxyHopsSchema.parse("1")).toBe(1);
  });
});
