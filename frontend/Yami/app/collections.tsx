// Created 07/20/2025 By Linus Xiong
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from "@tamagui/scroll-view";
import { Text, YStack, Card, XStack, View } from 'tamagui';
import apiClient from '../lib/axios-client';

interface Collection {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export default function Collections() {
  const queryResult = useQuery({
    queryKey: ['public-collections'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/collections');
      return response.data as Collection[];
    },
    experimental_prefetchInRender: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const collections = queryResult && queryResult.data ? queryResult.data : [];
  const isLoading = queryResult ? queryResult.isLoading : true;
  const error = queryResult ? queryResult.error : null;

  if (isLoading) {
    return (
      <ScrollView>
        <YStack padding="$4">
          <Text>Loading collections...</Text>
        </YStack>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView>
        <YStack padding="$4">
          <Text color="$red10">Error: {error instanceof Error ? error.message : 'Unknown error'}</Text>
        </YStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <YStack gap="$3" padding="$4">
        <Text fontSize="$6">Collections ({collections.length})</Text>
        
        {collections.length > 0 ? (
          collections.map((collection) => (
            <Card key={collection.id} p="$3">
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="bold" color="$color">
                  {collection.title}
                </Text>
                
                {collection.description && (
                  <Text fontSize="$3">
                    {collection.description}
                  </Text>
                )}
                
                <XStack gap="$2" alignItems="center">
                  <Text fontSize="$2">
                    {collection.is_public ? 'Public' : 'Private'}
                  </Text>
                  <Text fontSize="$2" >
                    • Created: {new Date(collection.created_at).toLocaleDateString()}
                  </Text>
                </XStack>
              </YStack>
            </Card>
          ))
        ) : (
          <Text>No collections found.</Text>
        )}
      </YStack>
    </ScrollView>
  );
}