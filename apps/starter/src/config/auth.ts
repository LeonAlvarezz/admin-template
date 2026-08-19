import type { UserProfile } from "@admin/core";
import { SessionAuthStrategy } from "@admin/core";
import { apiClient } from "@/libs/api-client";
import type {
  SessionResponse,
  SignInEmail,
  SignInEmailResponse,
} from "@admin/types";

export const authStrategy: SessionAuthStrategy = new SessionAuthStrategy({
  onInitialize: async () => {
    try {
      const { user: userResponse } =
        await apiClient.get<SessionResponse>("/auth/get-session");
      return {
        email: userResponse.email,
        name: userResponse.name,
        avatarUrl: userResponse.image ?? undefined,
      };
    } catch {
      return null;
    }
  },

  onLogin: async (payload: SignInEmail) => {
    const data = await apiClient.post<SignInEmailResponse>(
      "/auth/sign-in/email",
      payload,
    );
    return {
      email: data.user.email,
      name: data.user.name,
    };
  },

  onLogout: () => apiClient.post("/auth/sign-out"),
});
