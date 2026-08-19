import type { UserProfile } from "@admin/core";
import { SessionAuthStrategy } from "@admin/core";
import { apiClient } from "@/libs/api-client";

export const authStrategy: SessionAuthStrategy = new SessionAuthStrategy({
  onInitialize: async () => {
    try {
      const user = await apiClient.get<UserProfile>("/auth/get-session");
      return { user };
    } catch {
      return { user: null };
    }
  },

  onLogin: async (
    credentials: Record<string, any>,
  ): Promise<{ user: UserProfile; token: string; refreshToken?: string }> => {
    const data = await apiClient.post<{
      user?: UserProfile;
      token: string;
      refreshToken?: string;
    }>("/auth/login", credentials);
    return {
      user: data.user ?? {
        name: "Leon Alvarez",
        email: String(credentials.email || "leon@zeroui.com"),
      },
      token: data.token ?? "mock-access-token-12345",
      refreshToken: data.refreshToken ?? "mock-refresh-token-67890",
    };
  },

  onRefreshToken: async (
    refreshToken?: string | null,
  ): Promise<{ accessToken: string; refreshToken?: string }> => {
    const data = await apiClient.post<{ token: string; refreshToken?: string }>(
      "/auth/refresh",
      { refreshToken },
    );
    return {
      accessToken: data.token ?? "mock-new-access-token-99999",
      refreshToken: data.refreshToken,
    };
  },

  onLogout: () => apiClient.post("/auth/logout"),
});

// Interceptor: Automatically attach Authorization Bearer token to all requests
apiClient.addRequestInterceptor((config) => {
  const authHeaders = authStrategy.getAuthHeaders();
  const headers = new Headers(config.headers);
  Object.entries(authHeaders).forEach(([k, v]) => {
    headers.set(k, v);
  });
  return { ...config, headers };
});
