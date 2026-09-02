import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/libs/api-client";
import type {
  ListOrdersQuery,
  Order,
  OrdersListResponse,
  UpdateOrder,
} from "@z3/types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: ListOrdersQuery) => [...orderKeys.lists(), filters] as const,
  detail: (id: number | string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrdersQuery(
  filters?: ListOrdersQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () =>
      apiClient.get<OrdersListResponse>("/orders", {
        params: {
          search: filters?.search || undefined,
          status: filters?.status || undefined,
          paymentStatus: filters?.paymentStatus || undefined,
          cursor: filters?.cursor || undefined,
          limit: filters?.limit,
          order: filters?.order,
        },
      }),
    enabled: options?.enabled ?? true,
  });
}

export function useOrderQuery(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => apiClient.get<Order>(`/orders/${id}`),
    enabled: options?.enabled ?? (id > 0),
  });
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrder }) =>
      apiClient.put<Order>(`/orders/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
