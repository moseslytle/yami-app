// Created 07/27/2025 By Linus Xiong
import { ArrowLeft } from '@tamagui/lucide-icons';
import type { AnimationProp } from '@tamagui/web';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, View as RNView, TouchableOpacity, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H4,
  Image,
  isWeb,
  ScrollView,
  Spinner,
  styled,
  Text,
  View,
  XStack,
  YStack
} from 'tamagui';
import { useCollectionItemsWithAuth, useDeleteCollectionItem } from '../../hooks/useCollectionItems';
import { useCollection, useDeleteCollection } from '../../hooks/useCollections';
import { useAuthStore } from '../../store/auth-store';

// Animation configurations
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

// Styled components for provider grid
const GridItemFrame = styled(View, {
  width: '100%',
  animateOnly: ['borderRadius', 'transform'],
  height: 200,
  borderWidth: 1,
  borderColor: '$color3',
  borderRadius: '$10',
  backgroundColor: '$background',
  shadowColor: '$shadowColor',
  shadowRadius: 3,

  hoverStyle: {
    scale: 1.05,
    borderRadius: '$11',
    shadowColor: '$shadowColor',
    shadowRadius: 20,
  },
});

const GridItemInner = styled(View, {
  width: '100%',
  height: 200,
  overflow: 'hidden',
  borderRadius: '$10',

  hoverStyle: {
    borderRadius: '$11',
  },
});

// Collection Item Component with Provider Data
interface CollectionItemProps {
  item: {
    id: number;
    collection_id: number;
    provider_id: number;
    user_note?: string;
    created_at: string;
    updated_at: string;
    provider: {
      name: string;
      category: string;
      rating: string;
      image_url: string;
      price_range?: string;
      favorites_count: number;
    };
  };
  onDelete: (itemId: number) => void;
  isAuthenticated: boolean;
  showOnlyMyCollections: boolean;
}

function GridItem({ item, onDelete, isAuthenticated, showOnlyMyCollections }: CollectionItemProps) {
  const deleteCollectionItem = useDeleteCollectionItem();

  const handleDelete = async () => {
    if (!isAuthenticated || !showOnlyMyCollections) return;
    
    try {
      await deleteCollectionItem.mutateAsync({
        collectionId: item.collection_id,
        itemId: item.id
      });
      onDelete(item.id);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleLongPress = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'You need to be logged in to delete items from collections.');
      return;
    }

    if (!showOnlyMyCollections) {
      return; // Don't show delete option if not in user's own collections
    }

    Alert.alert(
      'Remove Provider',
      `Are you sure you want to remove "${item.provider.name}" from this collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: handleDelete 
        }
      ]
    );
  };

  const handleProviderPress = () => {
    router.push(`/providers/${item.provider_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleProviderPress}
      onLongPress={isAuthenticated && showOnlyMyCollections ? handleLongPress : undefined}
      delayLongPress={500}
      activeOpacity={0.8}
      style={{ flex: 1 }}
    >
      <GridItemFrame
        animation={animationFast}
      >
        <GridItemInner animation="bouncy">
          <View
            flexDirection="column"
            flex={1}
            scale={1.2}
            animation={animationMedium}
            $group-listitem-hover={{
              scale: 1.2,
            }}
          >
            {item.provider.image_url ? (
              <Image
                width="100%"
                height={200}
                source={{
                  uri: item.provider.image_url,
                  width: 200,
                  height: 200,
                }}
                scale={1}
              />
            ) : (
              <View
                width="100%"
                height={200}
                backgroundColor="$background"
                alignItems="center"
                justifyContent="center"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text
                  color="$colorPress"
                  fontSize="$4"
                  fontWeight="500"
                  textAlign="center"
                >
                  No Image
                </Text>
              </View>
            )}
          </View>
          <View
            position="absolute"
            animation={animationMedium}
            bottom={0}
            left={0}
            right={0}
            paddingVertical="$4"
            backgroundColor="rgba(0,0,0,0.25)"
            $group-listitem-hover={{
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <Text
              animation={animationSlow}
              color="#fff"
              marginVertical="auto"
              alignSelf="center"
              fontWeight={600}
              y={0}
              textShadowColor="$shadowColor"
              textShadowOffset={{ height: 1, width: 0 }}
              textShadowRadius={0}
              numberOfLines={2}
              textAlign="center"
              paddingHorizontal="$2"
              $group-listitem-hover={{
                y: -4,
                scale: 1.075,
                textShadowColor: '$shadowColor',
                textShadowOffset: { height: 2, width: 0 },
                textShadowRadius: 10,
              }}
            >
              {item.provider.name}
            </Text>
            {(item.provider.rating && item.provider.rating !== "0.0") || item.provider.favorites_count > 0 ? (
              <XStack
                alignSelf="center"
                alignItems="center"
                gap="$2"
                marginTop="$1"
              >
                {item.provider.rating && item.provider.rating !== "0.0" && (
                  <Text
                    color="#fff"
                    fontSize="$2"
                    textAlign="center"
                  >
                    ⭐ {item.provider.rating}
                  </Text>
                )}
                {item.provider.favorites_count > 0 && (
                  <Text
                    color="#fff"
                    fontSize="$2"
                    textAlign="center"
                  >
                    ❤️ {item.provider.favorites_count}
                  </Text>
                )}
              </XStack>
            ) : null}
          </View>
        </GridItemInner>
      </GridItemFrame>
    </TouchableOpacity>
  );
}

// Vertical 2-Column Grid Component
function ProviderGrid({ items, onItemDelete, isAuthenticated, showOnlyMyCollections }: { items: CollectionItemProps['item'][], onItemDelete: (itemId: number) => void, isAuthenticated: boolean, showOnlyMyCollections: boolean }) {
  // Split items into pairs for 2-column layout
  const itemPairs = [];
  for (let i = 0; i < items.length; i += 2) {
    itemPairs.push(items.slice(i, i + 2));
  }

  return (
    <ScrollView
      flex={1}
      showsVerticalScrollIndicator={false}
      paddingHorizontal="$4"
      paddingVertical="$3"
    >
      <YStack
        width="100%"
        maxWidth={isWeb ? 600 : '100%'}
        gap="$4"
        alignSelf="center"
      >
        {itemPairs.map((pair, index) => (
          <XStack key={index} gap="$4" width="100%">
            {pair.map((item) => (
              <View key={item.id} flex={1}>
                <GridItem item={item} onDelete={onItemDelete} isAuthenticated={isAuthenticated} showOnlyMyCollections={showOnlyMyCollections} />
              </View>
            ))}
            {/* If odd number of items, add empty space for last row */}
            {pair.length === 1 && <View flex={1} />}
          </XStack>
        ))}
      </YStack>
    </ScrollView>
  );
}

// Main Collection Detail Component
export default function CollectionDetailPage() {
  const { id, showOnlyMyCollections } = useLocalSearchParams<{ id: string; showOnlyMyCollections?: string }>();
  const collectionId = parseInt(id || '0', 10);
  const isUserCollection = showOnlyMyCollections === 'true';
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();

  const { 
    data: collection, 
    isLoading: collectionLoading, 
    error: collectionError 
  } = useCollection(collectionId, isAuthenticated);

  const { 
    data: items = [], 
    isLoading: itemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useCollectionItemsWithAuth(collectionId, isAuthenticated);

  const deleteCollection = useDeleteCollection();

  const handleItemDelete = (itemId: number) => {
    // Item will be automatically removed from the list due to query invalidation
    console.log('Item deleted:', itemId);
  };

  const handleDeleteCollection = async () => {
    if (!isAuthenticated || !isUserCollection) {
      Alert.alert('Permission Required', 'You can only delete your own collections.');
      return;
    }

    if (!collection) return;

    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.title}"? This action cannot be undone and will remove all items in this collection.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCollection.mutateAsync(collectionId);
              router.back();
            } catch (error) {
              console.error('Failed to delete collection:', error);
              Alert.alert('Error', 'Failed to delete collection. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleCollectionLongPress = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'You need to be logged in to delete collections.');
      return;
    }

    if (!isUserCollection) {
      return; // Don't show delete option if not user's own collection
    }

    handleDeleteCollection();
  };

  if (collectionLoading || itemsLoading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$brand" />
        <Text marginTop="$4" fontSize="$4" color="$colorPress">
          Loading collection...
        </Text>
      </View>
    );
  }

  if (collectionError || itemsError || !collection) {
    return (
      <View flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" paddingHorizontal="$4">
        <Text fontSize="$6" color="$brand" textAlign="center" marginBottom="$4" fontWeight="600">
          Failed to load collection
        </Text>
        <Button 
          onPress={() => router.back()}
          backgroundColor="$brand"
          color="white"
          hoverStyle={{
            backgroundColor: '$brandHover',
          }}
          pressStyle={{
            backgroundColor: '$brandPress',
          }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <RNView style={{ 
      flex: 1, 
      maxWidth: 500,
      alignSelf: 'center',
      width: '100%',
    }}>
      {/* Collection Providers Grid - render first per expo-blur docs */}
      <RNView style={{ 
        flex: 1, 
        paddingTop: insets.top + (collection.description ? 120 : 100),
        backgroundColor: colorScheme === 'dark' ? '#111111' : '#FFFFFF',
      }}>
        {items.length === 0 ? (
          <View
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$8"
            gap="$4"
          >
            <Text fontSize="$5" color="$colorPress" textAlign="center">
              No providers in this collection yet
            </Text>
            <Text fontSize="$3" color="$colorTransparent" textAlign="center" paddingHorizontal="$4">
              Browse providers and add them to your collection
            </Text>
          </View>
        ) : (
          <ProviderGrid items={items} onItemDelete={handleItemDelete} isAuthenticated={isAuthenticated} showOnlyMyCollections={isUserCollection} />
        )}
      </RNView>

      {/* Floating Header with Blur Effect - render after dynamic content */}
      <RNView 
        style={{
          position: 'absolute',
          top: insets.top,
          left: 16,
          right: 16,
          zIndex: 100,
          pointerEvents: 'box-none',
        }}
      >
        <BlurView
          intensity={50}
          tint={colorScheme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight'}
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: 40,
            backgroundColor: colorScheme === 'dark' ? 'rgba(17, 17, 17, 0.8)' : 'rgba(248, 248, 248, 0.5)',
            shadowColor: colorScheme === 'dark' ? '#000' : '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: colorScheme === 'dark' ? 0.4 : 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <XStack 
            flex={1}
            justifyContent="space-between" 
            alignItems="center"
            paddingHorizontal="$4"
            paddingVertical="$2"
          >
            {/* Back Button */}
            <Button
              size="$3"
              circular
              backgroundColor="transparent"
              color={colorScheme === 'dark' ? '#F5F5F5' : '#111111'}
              icon={ArrowLeft}
              onPress={() => router.back()}
              pressStyle={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                scale: 0.9,
              }}
            />

            {/* Collection Info */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onLongPress={isAuthenticated && isUserCollection ? handleCollectionLongPress : undefined}
              delayLongPress={800}
            >
              <YStack flex={1} paddingHorizontal="$3" alignItems="center">
                <H4 
                  color={colorScheme === 'dark' ? '#F5F5F5' : '#111111'} 
                  textAlign="center"
                  fontSize="$7"
                  fontWeight="bold"
                  numberOfLines={1}
                >
                  {collection.title}
                </H4>
                {collection.description && (
                  <Text 
                    color={colorScheme === 'dark' ? 'rgba(245, 245, 245, 0.7)' : 'rgba(17, 17, 17, 0.7)'} 
                    textAlign="center"
                    fontSize="$3"
                    numberOfLines={1}
                    marginTop="$1"
                  >
                    {collection.description}
                  </Text>
                )}
                <Text 
                  color={colorScheme === 'dark' ? 'rgba(245, 245, 245, 0.5)' : 'rgba(17, 17, 17, 0.5)'} 
                  textAlign="center"
                  fontSize="$2"
                  marginTop="$1"
                >
                  {items.length} {items.length === 1 ? 'provider' : 'providers'}
                </Text>
                {isAuthenticated && isUserCollection && (
                  <Text 
                    color={colorScheme === 'dark' ? 'rgba(245, 245, 245, 0.3)' : 'rgba(17, 17, 17, 0.3)'} 
                    textAlign="center"
                    fontSize="$1"
                    marginTop="$1"
                  >
                    Long press to delete
                  </Text>
                )}
              </YStack>
            </TouchableOpacity>

            {/* Spacer for balance (same width as back button) */}
            <View width="$3" />
          </XStack>
        </BlurView>
      </RNView>
    </RNView>
  );
}