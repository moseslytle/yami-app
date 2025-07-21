// Created 07/20/2025 By Linus Xiong
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios-client';

// Types
interface Collection {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateCollectionData {
  title: string;
  description?: string;
  is_public?: boolean;
}

interface UpdateCollectionData {
  title?: string;
  description?: string;
  is_public?: boolean;
}

// Public Collections Hooks
export const usePublicCollections = () => {
  return useQuery({
    queryKey: ['public-collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await apiClient.get('/api/v1/collections');
      return response.data;
    },
  });
};

export const usePublicCollection = (id: number) => {
  return useQuery({
    queryKey: ['public-collection', id],
    queryFn: async (): Promise<Collection> => {
      const response = await apiClient.get(`/api/v1/collections/${id}`);
      return response.data;
    },
    enabled: !!id, // Execute the query only if the id exists
  });
};

// User Collections Hooks

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (collectionData: CreateCollectionData): Promise<Collection> => {
      const response = await apiClient.post('/api/v1/user/collections', collectionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      queryClient.invalidateQueries({ queryKey: ['public-collections'] });
    },
  });
};

// Update Collections
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCollectionData }): Promise<Collection> => {
      const response = await apiClient.patch(`/api/v1/user/collections/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      queryClient.invalidateQueries({ queryKey: ['user-collection', data.id] });
      queryClient.invalidateQueries({ queryKey: ['public-collections'] });
      queryClient.invalidateQueries({ queryKey: ['public-collection', data.id] });
    },
  });
};

// Delete collection
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/api/v1/user/collections/${id}`);
    },
    onSuccess: (_, id) => {
      // Refresh the relevant query and remove the cache after successful deletion
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      queryClient.invalidateQueries({ queryKey: ['public-collections'] });
      queryClient.removeQueries({ queryKey: ['user-collection', id] });
      queryClient.removeQueries({ queryKey: ['public-collection', id] });
    },
  });
};

// Publishing Collections
export const usePublishCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<Collection> => {
      const response = await apiClient.put(`/api/v1/user/collections/${id}/publish`);
      return response.data;
    },
    onSuccess: (data) => {
      // Refresh related queries after successful posting
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      queryClient.invalidateQueries({ queryKey: ['user-collection', data.id] });
      queryClient.invalidateQueries({ queryKey: ['public-collections'] });
      queryClient.invalidateQueries({ queryKey: ['public-collection', data.id] });
    },
  });
};

// Getting a user's collection
export const useUserCollections = () => {
  return useQuery({
    queryKey: ['user-collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await apiClient.get('/api/v1/user/collections');
      return response.data;
    },
  });
};

// Get a single user's collection.
export const useUserCollection = (id: number) => {
  return useQuery({
    queryKey: ['user-collection', id],
    queryFn: async (): Promise<Collection> => {
      const response = await apiClient.get(`/api/v1/user/collections/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};