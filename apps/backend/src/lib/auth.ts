import { env } from "@/config";
import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, openAPI, twoFactor } from "better-auth/plugins";
import { ac, admin, super_admin, user } from "./permissions";

export const auth = betterAuth({
  appName: "Zero Admin",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: env.CORS_ORIGINS,
  plugins: [
    openAPI(),
    twoFactor(),
    adminPlugin({
      ac,
      adminRoles: ["admin", "super_admin"],
      roles: {
        admin,
        super_admin,
        user,
      },
    }),
  ],
});
