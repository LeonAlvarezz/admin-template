import type { UserProfile } from "../types";

export interface AuthStrategy {
  type: "session" | "jwt";
  initialize: () => Promise<UserProfile | null>;
  login: (credentials: Record<string, any>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshToken?: () => Promise<string | null>;
  getToken?: () => string | null;
  getAuthHeaders?: () => Record<string, string>;
}
