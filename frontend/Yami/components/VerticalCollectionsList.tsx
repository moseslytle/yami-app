// Created 07/22/2025 by Linus Xiong - Vertical Collections List with Infinite Scroll
import { Plus } from '@tamagui/lucide-icons';
import type { AnimationProp } from '@tamagui/web';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import {
    Button,
    Card,
    Circle,
    H3,
    Image,
    Paragraph,
    Spinner,
    Text,
    View,
    YStack,
    styled,
    useTheme,
} from 'tamagui';
import { useInfinitePublicCollections } from '../hooks/useCollections';
import { router } from 'expo-router';

// Types for collections (matching the API structure)
interface Collection {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface VerticalCollectionsListProps {
  onCreateCollection?: () => void;
}

// Animations
const animationFast = [
  'quick',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp;

const animationMedium = [
  'slow',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp;

const animationSlow = [
  'medium',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp;

// Collection Card Component
function CollectionCard({ collection }: { collection: Collection }) {
  const theme = useTheme();
  const handlePress = () => {
    router.push(`/collections/${collection.id}`);
  };
  // Generate a placeholder image based on collection ID
  const placeholderImage = `https://picsum.photos/400/240?random=${collection.id}`;

  return (
    <CollectionFrame
      animation={animationFast}
      pressStyle={{
        scale: 0.98,
      }}
      marginBottom="$4"
      onPress={handlePress}
    >
                           <CollectionInner animation="bouncy">
        {/* Image Section */}
        <View
          position="relative"
          height={160}
          overflow="hidden"
          animation={animationMedium}
          $group-collection-hover={{
            scale: 1.02,
          }}
        >
          <Image
            source={{
              uri: placeholderImage,
              width: 400,
              height: 240,
            }}
            width="100%"
            height="100%"
            borderTopLeftRadius="$4"
            borderTopRightRadius="$4"
          />
          
          {/* Gradient Overlay */}
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={80}
            style={{
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            }}
            className="bg-gradient-to-t from-black/70 to-transparent"
          />
          
          {/* Title Overlay */}
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding="$4"
          >
            <H3
              color="white"
              fontWeight="600"
              fontSize="$7"
              textShadowColor="rgba(0,0,0,0.8)"
              textShadowOffset={{ width: 0, height: 1 }}
              textShadowRadius={4}
              animation={animationSlow}
              $group-collection-hover={{
                y: -2,
                scale: 1.02,
              }}
              numberOfLines={2}
              textAlign="left"
            >
              {collection.title}
            </H3>
          </View>
        </View>

                {/* Content Section */}
        <YStack padding="$3" space="$2">
          {collection.description && (
            <Paragraph
              fontSize="$4"
              color="$color11"
              numberOfLines={2}
              lineHeight={16}
              textAlign="left"
            >
              {collection.description}
            </Paragraph>
          )}
          
          {/* Metadata */}
          <Text fontSize="$2" color="$color9" textAlign="left">
            {new Date(collection.created_at).toLocaleDateString()}
            {collection.is_public ? ' • Public' : ''}
          </Text>
        </YStack>
      </CollectionInner>
    </CollectionFrame>
  );
}

// Main Component
export function VerticalCollectionsList({ onCreateCollection }: VerticalCollectionsListProps) {
  const theme = useTheme();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfinitePublicCollections(10);

  // Flatten the pages data
  const collections = data?.pages.flatMap(page => page.collections) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item }: { item: Collection }) => (
    <CollectionCard collection={item} />
  ), []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View padding="$4" alignItems="center">
        <Spinner size="large" color="$color11" />
                 <Text fontSize="$3" color="$color9" marginTop="$2">
           Loading more collections...
         </Text>
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => (
    <YStack 
      flex={1} 
      alignItems="center" 
      justifyContent="center" 
      padding="$6"
      space="$4"
    >
      <Circle
        size={80}
        backgroundColor="$color3"
        alignItems="center"
        justifyContent="center"
      >
        <Plus size={32} color="$color11" />
      </Circle>
      <YStack alignItems="center" space="$2">
        <H3 color="$color12" textAlign="center">
          No Collections Yet
        </H3>
        <Paragraph color="$color11" textAlign="center" maxWidth={260}>
          Start exploring by creating your first collection or discover public ones.
        </Paragraph>
      </YStack>
      {onCreateCollection && (
        <Button
          size="$4"
          backgroundColor="$brand"
          color="white"
          borderRadius="$6"
          onPress={onCreateCollection}
          icon={Plus}
          fontWeight="600"
          pressStyle={{ 
            backgroundColor: "$brandPress",
            scale: 0.98 
          }}
        >
          Create Collection
        </Button>
      )}
    </YStack>
  ), [onCreateCollection]);

  if (isLoading) {
    return (
            <View flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" color="$brand" />
        <Text fontSize="$4" color="$color11" marginTop="$3">
          Loading collections...
        </Text>
      </View>
    );
  }

  return (
    <View flex={1}>
      <FlatList
        data={collections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
                         refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            tintColor="$brand"
            colors={['$brand']}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 80,
          paddingBottom: 16,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Styled Components
const CollectionFrame = styled(Card, {
  width: '100%',
  animateOnly: ['borderRadius', 'transform'],
  borderWidth: 1,
  borderColor: '$color4',
  borderRadius: '$8',
  backgroundColor: '$background',
  shadowColor: '$shadowColor',
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  elevation: 3,
  overflow: 'hidden',

  hoverStyle: {
    scale: 1.02,
    borderRadius: '$7',
    shadowColor: '$shadowColor',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    borderColor: '$brand',
  },
});

const CollectionInner = styled(View, {
  width: '100%',
  overflow: 'hidden',
  borderRadius: '$6',

  hoverStyle: {
    borderRadius: '$7',
  },
});

export default VerticalCollectionsList; 
