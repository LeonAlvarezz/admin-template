import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/libs/api-client";
import type {
  CreateProduct,
  ListProductsQuery,
  Product,
  ProductsListResponse,
  UpdateProduct,
} from "@z3/types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ListProductsQuery) =>
    [...productKeys.lists(), filters] as const,
  detail: (id: number | string) => [...productKeys.all, "detail", id] as const,
};

export function useProductsQuery(
  filters?: ListProductsQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () =>
      apiClient.get<ProductsListResponse>("/products", {
        params: {
          search: filters?.search || undefined,
          status: filters?.status || undefined,
          cursor: filters?.cursor || undefined,
          limit: filters?.limit,
          order: filters?.order,
        },
      }),
    enabled: options?.enabled ?? true,
  });
}

export function useProductQuery(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiClient.get<Product>(`/products/${id}`),
    enabled: options?.enabled ?? (id > 0),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProduct) =>
      apiClient.post<Product>("/products", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProduct }) =>
      apiClient.put<Product>(`/products/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete<Product>(`/products/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
