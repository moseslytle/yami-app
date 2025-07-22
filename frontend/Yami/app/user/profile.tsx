// Create 07/22/2025 by Joshua, first version for profile page
// TODO: Implement the auth
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import {
  YStack,
  XStack,
  Text,
  Spinner,
  Card,
  Button,
  Separator,
  H2,
  H3,
  ScrollView,
  Image,
  Avatar,
} from 'tamagui';
import { Heart, MapPin, Star, User, Mail, Calendar } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';

interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  favorites_count: number;
  collections_count: number;
}

interface Provider {
  id: number;
  name: string;
  address: string;
  rating: number;
  price_range: string;
  category: string;
  image_url?: string;
}

interface Favorite {
  id: number;
  provider: Provider;
  created_at: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserFavorites();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Using test data until authentication is implemented
      setUser({
        id: 1,
        email: 'user@exp.com',
        username: 'Joshua',
        created_at: '2025-07-21 02:06:57.389',
        favorites_count: 1,
        collections_count: 1,
      });
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const fetchUserFavorites = async () => {
    try {
      // Using test data until authentication is implemented
      setFavorites([
        {
          id: 1,
          provider: {
            id: 9655,
            name: 'Wheels Unlimited',
            address: '1928 E Main St, Columbus, OH 43205, United States',
            rating: 4.4,
            price_range: '2',
            category: 'wheelrimrepair',
            image_url: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATKogpcT-jVq6z1kDm_5cqz-FRAfYzkh9GPcL0oxvXOJqyd5HHqHOqya-5QqRmuBQewhUciHJkaxIBFuVgti9kno8VMIxihKTS9JddxbVTVcSxU-UAYMMILmb__xQdez3kYZ4LHTw1fQ7X-Ov3RPKsI0qS7RNIPFZ9YOnOlyiW6IymTwAPWJY0rJicAqBR45kv7_5SVBkhhxMIPM7twvma10fcngayYKA4AgzwbG4GE4AHRfKo2Ugs3FWM-bSwdU7lPEGayDm1NHhEPiAYS6R1gkhaIbvvJLg6KIGbQt9oRZEoQaB5S_6S0&key=AIzaSyCOMbOGgsKILum4N2jI5DhTuOZOIzH7OvM'
          },
          created_at: '2025-07-21 02:06:57.389'
        },
        
      ]);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Click to visit the provider
  const navigateToProvider = (providerId: number) => {
    router.push(`/providers/${providerId}`);
  };

  // Display the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Status report and error handler
  if (loading) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
          <Spinner size="large" color="blue" />
          <Text marginTop="$4" color="$color">Loading user details...</Text>
        </YStack>
      );
    }
  
    if (error || !user) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$background">
          <Text color="red" textAlign="center" fontSize="$5">
            {error || 'User not found'}
          </Text>
        </YStack>
      );
    }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
           headerRight: () => null
        }}
      />

      <ScrollView flex={1} backgroundColor="$background">
        <YStack flex={1} gap="$4">
          
          {/* User Image */}
          <YStack alignItems="center" paddingTop="$4">
            <Avatar size="$10" borderWidth={2} borderColor="$borderColor">
              <Avatar.Image source={{ uri: `https://ui-avatars.com/api/?name=${user.username}&size=200` }} />
              <Avatar.Fallback backgroundColor="$backgroundPress">
                <Text fontSize="$8" color="$color">
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            </Avatar>
            
            <H2 marginTop="$3">{user.username}</H2>
            <Text color="$color" opacity={0.7}>{user.email}</Text>
          </YStack>

          {/* Head Information Card Designed for User*/}
          <Card elevate size="$4" margin="$4" marginTop="$2">
            <Card.Header padded>
              <XStack justifyContent="space-around" alignItems="center">
                <YStack alignItems="center">
                  <H3>{user.favorites_count}</H3>
                  <Text fontSize="$2" color="$color" opacity={0.7}>Favorites</Text>
                </YStack>
                
                <Separator vertical height="$4" />
                
                <YStack alignItems="center">
                  <H3>{user.collections_count}</H3>
                  <Text fontSize="$2" color="$color" opacity={0.7}>Collections</Text>
                </YStack>
                
                <Separator vertical height="$4" />
                
                <YStack alignItems="center">
                  <Calendar size="$1" color="$color" opacity={0.7} />
                  <Text fontSize="$2" color="$color" opacity={0.7}>Joined</Text>
                  <Text fontSize="$1" color="$color" opacity={0.7}>
                    {formatDate(user.created_at)}
                  </Text>
                </YStack>
              </XStack>
            </Card.Header>
          </Card>

          {/* Favorites Section */}
          <YStack padding="$4" paddingTop="$0">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <H3>My Favorites</H3>
              <Heart size="$1" color="red" />
            </XStack>

            {favorites.length === 0 ? (
              <Card elevate size="$4">
                <Card.Header padded>
                  <YStack alignItems="center" padding="$4">
                    <Heart size="$4" color="$color" opacity={0.3} />
                    <Text marginTop="$2" color="$color" opacity={0.7}>
                      No favorites
                    </Text>
                  </YStack>
                </Card.Header>
              </Card>
            ) : (
              <YStack gap="$3">
                {favorites.map((favorite) => (
                  <TouchableOpacity
                    key={favorite.id}
                    onPress={() => navigateToProvider(favorite.provider.id)}
                    activeOpacity={0.7}
                  >
                    <Card elevate size="$4" animation="quick" hoverStyle={{ scale: 0.98 }}>
                      <Card.Header padded>
                        <XStack gap="$3">
                          {/* Provider Image */}
                          <ProviderImage 
                            imageUrl={favorite.provider.image_url}
                            name={favorite.provider.name}
                          />

                          {/* Provider Info */}
                          <YStack flex={1} gap="$1">
                            <Text fontSize="$5" fontWeight="600" numberOfLines={1}>
                              {favorite.provider.name}
                            </Text>
                            
                            <XStack gap="$2" alignItems="center">
                              <MapPin size="$0.5" color="$color" opacity={0.7} />
                              <Text fontSize="$2" color="$color" opacity={0.7} numberOfLines={1} flex={1}>
                                {favorite.provider.address}
                              </Text>
                            </XStack>

                            <XStack gap="$3" alignItems="center">
                              <XStack gap="$1" alignItems="center">
                                <Star size="$0.5" color="orange" fill="orange" />
                                <Text fontSize="$2">{favorite.provider.rating || 'N/A'}</Text>
                              </XStack>
                              
                              {favorite.provider.price_range && (
                                <Text fontSize="$2" color="green">
                                  {'$'.repeat(parseInt(favorite.provider.price_range))}
                                </Text>
                              )}
                              
                              <Text fontSize="$2" color="$color" opacity={0.5}>
                                {favorite.provider.category}
                              </Text>
                            </XStack>
                          </YStack>
                        </XStack>
                      </Card.Header>
                    </Card>
                  </TouchableOpacity>
                ))}
              </YStack>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}

// Provider Image, same logic as provider page
function ProviderImage({ imageUrl, name }: { imageUrl?: string; name: string }) {
  const [imageErrored, setImageErrored] = useState(false);

  return (
    <YStack 
      width={60} 
      height={60} 
      borderRadius="$2" 
      backgroundColor="$backgroundPress"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      
      {!imageErrored && imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          width="100%"
          height="100%"
          onError={() => setImageErrored(true)}
        />
      ) : (
        <Text fontSize="$8" color="$color">
          {name.charAt(0).toUpperCase()}
        </Text>
      )}
    </YStack>
  );
}