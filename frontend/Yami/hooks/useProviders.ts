// Created 07/21/2025 by Paulina Salazar.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from '../lib/axios-client';

export interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  price_range: string;
  address: string;
  phone: string;
  hours: string;
  image_url: string;
  favorites_count: number;
}

interface ProviderPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ProviderResponse {
  success: boolean;
  data: {
    providers: Provider[];
    pagination: ProviderPagination;
  };
}

// Using a hook to get the paginated list with filters and sorting applied.
export const useProviders = ({
  page = 1,
  sort = "name",
  search = "",
  category,
  min_rating,
  price_range,
  limit = 20,
}: {
  page?: number;
  sort?: string;
  search?: string;
  category?: string | null;
  min_rating?: number | null;
  price_range?: string | null;
  limit?: number;
}) => {
  return useQuery({
    // Key based on all parameters.
    queryKey: ["providers", page, sort, search, category, min_rating, price_range],
    // Calls API with parameters.
    queryFn: async (): Promise<ProviderResponse> => {
      const response = await apiClient.get("/api/v1/providers/search", {
        params: {
          page,
          sort,
          q: search,
          category: category ?? undefined,
          min_rating: min_rating && min_rating > 1 ? min_rating : undefined,
          price_range: price_range ?? undefined,
          limit,
        },
      });
      return response.data;
    },
  });
};

// Using hook to get a provider through their ID.
export const useProvider = (id: string) => {
  return useQuery({
    queryKey: ["provider", id],
    queryFn: async (): Promise<Provider> => {
      const response = await apiClient.get(`/api/v1/providers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
