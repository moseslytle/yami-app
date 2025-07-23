// Created 07/22/2025 By Linus Xiong
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios-client';

// Types
interface CollectionItem {
  id: number;
  collection_id: number;
  provider_id: number;
  user_note?: string;
  created_at: string;
  updated_at: string;
}

interface CreateCollectionItemData {
  collection_id: number;
  provider_id: number;
  user_note?: string;
}

interface UpdateCollectionItemData {
  user_note?: string;
}

// Get collection items for a specific collection
export const useCollectionItems = (collectionId: number) => {
  return useQuery({
    queryKey: ['collection-items', collectionId],
    queryFn: async (): Promise<CollectionItem[]> => {
      const response = await apiClient.get(`/api/v1/user/collections/${collectionId}/items`);
      return response.data;
    },
    enabled: !!collectionId,
  });
};



// Create a new collection item
export const useCreateCollectionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemData: CreateCollectionItemData): Promise<CollectionItem> => {
      const { collection_id, ...restData } = itemData;
      const response = await apiClient.post(`/api/v1/user/collections/${collection_id}/items`, restData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the collection items list for the specific collection
      queryClient.invalidateQueries({ queryKey: ['collection-items', data.collection_id] });
      // Also invalidate the user collections in case the collection metadata changed
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
    },
  });
};

// Update a collection item
export const useUpdateCollectionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ collectionId, itemId, data }: { collectionId: number; itemId: number; data: UpdateCollectionItemData }): Promise<CollectionItem> => {
      const response = await apiClient.patch(`/api/v1/user/collections/${collectionId}/items/${itemId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the collection items list for the specific collection
      queryClient.invalidateQueries({ queryKey: ['collection-items', data.collection_id] });
    },
  });
};

// Delete a collection item
export const useDeleteCollectionItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ collectionId, itemId }: { collectionId: number; itemId: number }): Promise<void> => {
      await apiClient.delete(`/api/v1/user/collections/${collectionId}/items/${itemId}`);
    },
    onSuccess: (_, { collectionId, itemId }) => {
      // Invalidate the collection items list for the specific collection
      queryClient.invalidateQueries({ queryKey: ['collection-items', collectionId] });
      // Also invalidate user collections in case the collection metadata changed
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
    },
  });
}; 