// Create 07/22/2025 by Joshua, first version for profile page
// Updated 07/25/2025 by Joshua - Integrated with authentication, change the stub to real user data, implement the logout feature. 
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
import { Heart, MapPin, Star, User, Mail, Calendar, LogOut } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth-store';
import Constants from 'expo-constants';

// API configuration
let API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'http://localhost:3000/api/v1';
  
const { expoGoConfig } = Constants;
const debuggerHost = expoGoConfig?.debuggerHost;

if (debuggerHost) {
  const ip = debuggerHost.split(':')[0];
  API_BASE_URL = `http://${ip}:3000/api/v1`;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  created_at: string;
  is_verified: boolean;
}

interface Provider {
  id: number;
  name: string;
  address: string;
  rating: number;
  price_level: string;
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
  const { user: authUser, token, getCurrentUser, isAuthenticated, logout } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Added auth status to work the authenticatation
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchUserProfile();
    fetchUserFavorites();
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserProfile(data.user);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchUserFavorites = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.data.favorites || []);
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

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Check if user is not authenticated
  if (!isAuthenticated) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$background">
        <User size="$8" color="$color" opacity={0.3} />
        <H2 marginTop="$4" color="$color">Please Login First</H2>
        <Text marginTop="$2" color="$color" opacity={0.7} textAlign="center">
          You need to be logged in to view your profile
        </Text>
        <Button
          marginTop="$4"
          size="$4"
          backgroundColor="$brand"
          color="white"
          onPress={() => router.push('/login')}
          pressStyle={{ backgroundColor: "$brandPress" }}
        >
          Go to Login
        </Button>
      </YStack>
    );
  }

  // Status report and error handler
  if (loading) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
          <Spinner size="large" color="blue" />
          <Text marginTop="$4" color="$color">Loading user details...</Text>
        </YStack>
      );
    }
  
    if (error || !userProfile) {
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
          headerRight: () => (
            <Button
              size="$3"
              icon={LogOut}
              onPress={handleLogout}
              backgroundColor="transparent"
              color="$color"
              pressStyle={{ backgroundColor: "$backgroundPress" }}
              marginRight="$3"
            />
          )
        }}
      />

      
      <ScrollView flex={1} backgroundColor="$background" paddingTop={insets.top}>
        <YStack flex={1} gap="$4">
          
          {/* Logout Button */}
          <XStack justifyContent="flex-end" padding="$4" paddingBottom="$0">
            <Button
              size="$3"
              icon={LogOut}
              onPress={handleLogout}
              backgroundColor="$backgroundPress"
              color="$color"
              pressStyle={{ backgroundColor: "$backgroundFocus" }}
            >
              Logout
            </Button>
          </XStack>
          
          {/* User Image */}
          <YStack alignItems="center" paddingTop="$2">
            <Avatar size="$10" borderWidth={2} borderColor="$borderColor">
              <Avatar.Image source={{ uri: `https://ui-avatars.com/api/?name=${userProfile.name}&size=200` }} />
              <Avatar.Fallback backgroundColor="$backgroundPress">
                <Text fontSize="$8" color="$color">
                  {userProfile.name.charAt(0).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            </Avatar>
            
            <H2 marginTop="$3">{userProfile.name}</H2>
            <Text color="$color" opacity={0.7}>{userProfile.email}</Text>
            {userProfile.is_verified && (
              <XStack gap="$1" alignItems="center" marginTop="$1">
                <Text fontSize="$2" color="green">✓ Verified</Text>
              </XStack>
            )}
          </YStack>

          {/* Head Information Card Designed for User*/}
          <Card elevate size="$4" margin="$4" marginTop="$2">
            <Card.Header padded>
              <XStack justifyContent="space-around" alignItems="center">
                <YStack alignItems="center">
                  <H3>{favorites.length}</H3>
                  <Text fontSize="$2" color="$color" opacity={0.7}>Favorites</Text>
                </YStack>
                
                <Separator vertical height="$4" />
                
                <YStack alignItems="center">
                  <H3>0</H3>
                  <Text fontSize="$2" color="$color" opacity={0.7}>Collections</Text>
                </YStack>
                
                <Separator vertical height="$4" />
                
                <YStack alignItems="center">
                  <Calendar size="$1" color="$color" opacity={0.7} />
                  <Text fontSize="$2" color="$color" opacity={0.7}>Joined</Text>
                  <Text fontSize="$1" color="$color" opacity={0.7}>
                    {formatDate(userProfile.created_at)}
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
                              
                              {favorite.provider.price_level && (
                                <Text fontSize="$2" color="green">
                                  {'$'.repeat(parseInt(favorite.provider.price_level))}
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