import { JwtAuthStrategy, type UserProfile } from "@admin/core";
import { createRequestClient, authenticateResponseInterceptor } from "@repo/api-client";

export const apiClient = createRequestClient("/api");

export const authStrategy: JwtAuthStrategy = new JwtAuthStrategy({
  tokenKey: "admin_jwt_token",
  refreshTokenKey: "admin_refresh_token",

  onInitialize: async (token: string | null): Promise<{ user: UserProfile | null }> => {
    if (!token) return { user: null };
    try {
      const user = await apiClient.get<UserProfile>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { user };
    } catch {
      return { user: null };
    }
  },

  onLogin: async (credentials: Record<string, any>): Promise<{ user: UserProfile; token: string; refreshToken?: string }> => {
    const data = await apiClient.post<{ user?: UserProfile; token: string; refreshToken?: string }>(
      "/auth/login",
      credentials
    );
    return {
      user: data.user ?? {
        name: "Leon Alvarez",
        email: String(credentials.email || "leon@zeroui.com"),
      },
      token: data.token ?? "mock-access-token-12345",
      refreshToken: data.refreshToken ?? "mock-refresh-token-67890",
    };
  },

  onRefreshToken: async (refreshToken?: string | null): Promise<{ accessToken: string; refreshToken?: string }> => {
    const data = await apiClient.post<{ token: string; refreshToken?: string }>(
      "/auth/refresh",
      { refreshToken }
    );
    return {
      accessToken: data.token ?? "mock-new-access-token-99999",
      refreshToken: data.refreshToken,
    };
  },

  onLogout: () => apiClient.post("/auth/logout"),
});

// Interceptor 1: Automatically attach Authorization Bearer token to all requests
apiClient.addRequestInterceptor({
  fulfilled: (config) => {
    const authHeaders = authStrategy.getAuthHeaders();
    Object.entries(authHeaders).forEach(([k, v]) => {
      config.headers.set(k, v);
    });
    return config;
  },
});

// Interceptor 2: Automatic silent token refresh & queue when 401 occurs
apiClient.addResponseInterceptor(
  authenticateResponseInterceptor({
    client: apiClient,
    enableRefreshToken: true,
    doRefreshToken: () => authStrategy.refreshToken().then((t: string | null) => t || ""),
    doReAuthenticate: () => authStrategy.logout(),
    formatToken: (token: string) => (token ? `Bearer ${token}` : null),
  })
);
