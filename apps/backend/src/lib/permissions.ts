import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  product: ["view", "create", "share", "update", "delete"], // <-- Permissions available for created roles
  user: ["list", "set-role", "update", "ban", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  product: ["view"],
});

export const admin = ac.newRole({
  product: ["view", "create", "update"],
  user: ["list", "set-role", "update"],
});

export const super_admin = ac.newRole({
  product: ["create", "update", "delete"],
  user: ["list", "set-role", "update", "ban", "delete"],
});
