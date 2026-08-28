import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@admin/core";
import { apiClient } from "@/libs/api-client";
import type { ChangePassword, SessionResponse, UpdateUserInfo } from "@admin/types";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => apiClient.get<SessionResponse>("/auth/get-session"),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: (payload: UpdateUserInfo) =>
      apiClient.post("/auth/update-user", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session() });
      await auth.initialize();
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePassword) =>
      apiClient.post("/auth/change-password", payload),
  });
}
