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
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  plugins: [
    openAPI(),
    twoFactor(),
    adminPlugin({
      ac,
      roles: {
        admin,
        super_admin,
        user,
      },
    }),
  ],
});
