//Create 07/21/2025 by Joshua, first version for providers page
// TODO: Implement favorite toggle API call
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  YStack,
  XStack,
  Text,
  Spinner,
  Card,
  Button,
  Separator,
  H2,
  Paragraph,
  ScrollView,
  Image,
} from 'tamagui';
import { Star, MapPin, Phone, Clock, Heart } from '@tamagui/lucide-icons';
import { Alert, Linking, Platform } from 'react-native';
import {FloatingBackButton} from '../../components/FloatingBackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Provider {
  id: number;
  name: string;
  category: string;
  rating: string;
  review_count: number;
  address: string;
  phone: string;
  price_range: string;
  hours: string;
  image_url: string;
  favorites_count: number;
  latitude: string;
  longitude: string;
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageErrored, setImageErrored] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchProviderDetails();
  }, [id]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      // The provider router here
      const response = await fetch(`http://localhost:3000/api/v1/providers/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProvider(data.data.provider);
        setIsFavorited(data.data.provider.is_favorited);
        setImageErrored(false); // Reset image error state for new provider
      } else {
        setError('Failed to load provider details');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (provider?.phone) {
      const phoneUrl = `tel:${provider.phone}`;
      Linking.openURL(phoneUrl).catch(() => {
        Alert.alert('Error');
      });
    }
  };

  // The direction button handler
  const handleDirections = () => {
    if (provider?.latitude && provider?.longitude) {
      // Use coordinates for navigation
      const lat = provider.latitude;
      const lng = provider.longitude;
      const label = encodeURIComponent(provider.name);
      
      // For web browsers, always use Google Maps web
      if (Platform.OS === 'web') {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${label}`;
        window.open(webUrl, '_blank');
        return;
      }
      
      // For mobile apps, use native apps
      const url = Platform.select({
        ios: `maps:${lat},${lng}?q=${label}`,
        android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
      });
      
      if (url) {
        Linking.openURL(url).catch(() => {
          // Fallback to Google Maps web if native apps fail
          const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${label}`;
          Linking.openURL(fallbackUrl).catch(() => {
            Alert.alert('Error');
          });
        });
      }
    } else if (provider?.address) {
      // Fallback to no coordinates in database
      const address = encodeURIComponent(provider.address);
      
      // Web browsers
      if (Platform.OS === 'web') {
        const webUrl = `https://www.google.com/maps/search/${address}`;
        window.open(webUrl, '_blank');
        return;
      }
      
      // Mobile apps
      const url = Platform.select({
        ios: `maps:?q=${address}`,
        android: `geo:0,0?q=${address}`,
      });
      
      if (url) {
        Linking.openURL(url).catch(() => {
          const fallbackUrl = `https://www.google.com/maps/search/${address}`;
          Linking.openURL(fallbackUrl).catch(() => {
            Alert.alert('Error');
          });
        });
      }
    } else {
      Alert.alert('No Location');
    }
  };

  const toggleFavorite = async () => {
    // TODO: Implement favorite toggle API call
    setIsFavorited(!isFavorited);
  };

  const formatHours = (hours: string | null) => {
    if (!hours) return 'Hours not available';
    try {
      const parsed = JSON.parse(hours);
      return Array.isArray(parsed) ? parsed.join('\n') : hours;
    } catch {
      return hours;
    }
  };

  // Status report and error handler
  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="blue" />
        <Text marginTop="$4" color="$color">Loading provider details...</Text>
      </YStack>
    );
  }

  if (error || !provider) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$background">
        <Text color="red" textAlign="center" fontSize="$5">
          {error || 'Provider not found'}
        </Text>
        <Button marginTop="$4" onPress={fetchProviderDetails} theme="blue">
          Try Again
        </Button>
      </YStack>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: provider.name,
          headerRight: () => (
            <Button
              size="$3"
              circular
              icon={Heart}
              onPress={toggleFavorite}
              backgroundColor={isFavorited ? 'red' : '$borderColor'}
              color={isFavorited ? 'white' : '$color'}
              pressStyle={{ scale: 0.9, opacity: 0.8 }}
            />
          ),
        }}
      />
      <FloatingBackButton />
      <ScrollView flex={1} backgroundColor="$background" paddingTop={insets.top}>
        
        <YStack flex={1} gap="$4">
          
          {/* Provider Image */}
          <YStack alignItems="center" paddingTop="$4">
            <YStack 
              width={120} 
              height={120} 
              borderRadius="$10" 
              borderWidth={2} 
              borderColor="$borderColor"
              overflow="hidden"
              backgroundColor="$backgroundPress"
              justifyContent="center"
              alignItems="center"
            >
              {/* Switch the state of url loading and error handling */}
              {!imageErrored && provider.image_url ? (
                <Image
                  source={{ uri: provider.image_url }}
                  width="100%"
                  height="100%"
                  onError={() => setImageErrored(true)}
                />
              ) : (
                <Text fontSize="$8" color="$color">
                  {provider.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Head Information Card */}
          <Card elevate size="$4" margin="$4" marginTop="$2">
            <Card.Header padded>
              <YStack gap="$2">
                <H2 color="$color" textAlign="center">{provider.name}</H2>
                <Text 
                  color="gray" 
                  fontSize="$4" 
                  textAlign="center"
                  textTransform="capitalize"
                >
                  {provider.category.replace(/[_-]/g, ' ')}
                </Text>
                
                {/* Review Info */}
                <XStack alignItems="center" justifyContent="center" gap="$3">
                  <XStack alignItems="center" gap="$1">
                    <Star size={16} color="orange" />
                    <Text fontWeight="600" color="$color">
                      {provider.rating}
                    </Text>
                  </XStack>
                  
                  {provider.review_count && (
                    <Text color="gray" fontSize="$3">
                      ({provider.review_count} reviews)
                    </Text>
                  )}
                  
                  {provider.price_range && (
                    <>
                      <Text color="gray">•</Text>
                      <Text color="green" fontWeight="500">
                        {provider.price_range}
                      </Text>
                    </>
                  )}
                </XStack>

                {/* Favorites Count */}
                <XStack alignItems="center" justifyContent="center" gap="$1">
                  <Heart size={14} color="gray" />
                  <Text color="gray" fontSize="$2">
                    {provider.favorites_count} favorites
                  </Text>
                </XStack>

                {/* Provider ID */}
                <Text color="gray" fontSize="$2" textAlign="center">
                  ID: #{provider.id}
                </Text>
              </YStack>
            </Card.Header>
          </Card>

          {/* Detailed Information Card */}
          <Card elevate size="$4" margin="$4" marginTop="$0">
            <Card.Header padded>
              <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$3">
                Contact Information
              </Text>
              
              <YStack gap="$4">
                {/* Address */}
                <XStack alignItems="flex-start" gap="$3">
                  <MapPin size={20} color="blue" marginTop="$1" />
                  <YStack flex={1} gap="$1">
                    <Text fontWeight="500" color="$color">Address</Text>
                    <Paragraph color="gray" fontSize="$3" lineHeight="$1">
                      {provider.address}
                    </Paragraph>
                  </YStack>
                </XStack>

                {/* Phone */}
                {provider.phone && (
                  <>
                    <Separator />
                    <XStack alignItems="center" gap="$3">
                      <Phone size={20} color="green" />
                      <YStack flex={1} gap="$1">
                        <Text fontWeight="500" color="$color">Phone</Text>
                        <Text color="blue" fontSize="$4">
                          {provider.phone}
                        </Text>
                      </YStack>
                    </XStack>
                  </>
                )}

                {/* Hours */}
                <Separator />
                <XStack alignItems="flex-start" gap="$3">
                  <Clock size={20} color="orange" marginTop="$1" />
                  <YStack flex={1} gap="$1">
                    <Text fontWeight="500" color="$color">Hours</Text>
                    <Paragraph 
                      color="gray" 
                      fontSize="$3" 
                      lineHeight="$2"
                      whiteSpace="pre-line"
                    >
                      {formatHours(provider.hours)}
                    </Paragraph>
                  </YStack>
                </XStack>

                {/* Date Information */}
                <Separator />
                <XStack alignItems="flex-start" gap="$3">
                  <Clock size={20} color="gray" marginTop="$1" />
                  <YStack flex={1} gap="$2">
                    <Text fontWeight="500" color="$color">Source Data Info</Text>
                    <YStack gap="$1">
                      <Text color="gray" fontSize="$2">
                        Added: {new Date(provider.created_at).toLocaleDateString()}
                      </Text>
                      {provider.updated_at !== provider.created_at && (
                        <Text color="gray" fontSize="$2">
                          Updated: {new Date(provider.updated_at).toLocaleDateString()}
                        </Text>
                      )}
                    </YStack>
                  </YStack>
                </XStack>
              </YStack>
            </Card.Header>
          </Card>

          {/* Action Buttons */}
          <XStack padding="$4" gap="$3">
            <Button
              flex={1}
              size="$4"
              theme="blue"
              icon={Phone}
              onPress={handleCall}
              disabled={!provider.phone}
              fontSize="$4"
              fontWeight="600"
            >
              Call
            </Button>
            
            <Button
              flex={1}
              size="$4"
              theme="green"
              icon={MapPin}
              onPress={handleDirections}
              disabled={!provider.latitude && !provider.address}
              fontSize="$4"
              fontWeight="600"
            >
              Directions
            </Button>
          </XStack>

          <YStack height="$4" />
        </YStack>
      </ScrollView>
    </>
  );
}