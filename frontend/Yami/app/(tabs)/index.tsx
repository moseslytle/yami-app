// Created 07/20/2025 by Linus Xiong.
// Edited 07/21/2025 by Paulina Salazar - implemented index page after it was initialized.
// Edited 07/22/2025 by Paulina Salazar - implemented no image, redesigned how providers are presented, fixed sorting.

import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Image, XStack, YStack, Stack, Button, Spinner, Input } from "tamagui";
import { useRouter } from "expo-router";
import { User, Bookmark, Filter, Star, ArrowRight, ArrowLeft } from "@tamagui/lucide-icons";
import { useProvider, useProviders, Provider } from "../../hooks/useProviders";
// import { useCollections } from '../hooks/useCollections';

const SORT_OPTIONS = [
  { label: "Name Ascending", value: "name" },
  { label: "Highest Rating", value: "rating" },
  { label: "Distance", value: "distance" },
];

/**
 * Created 07/21/2025 by Paulina Salazar.
 * Edited 07/22/2025 by Paulina Salazar - redesigned some elements and fixed sorting.
 * 
 * Main page, user is able to search, sort, and access their profile and collections.
 */
export default function IndexPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  /// Used debouncedSearch to avoid too many API calls.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  // Debounces search so search doesn;t update with every key input.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Page is reset if sorted.
  useEffect(() => {
    setPage(1);
  }, [sort]);

  // Get providers with pagination, sort, and search.
  const { data, isLoading, isError, refetch } = useProviders({
    page,
    limit: 10,
    sort,
    search: debouncedSearch,
  });

  const goToProvider = (id: string) => {
    router.push(`/providers/${id}`);
  };

  const goToProfile = () => {
    router.push('/favorites');
  };

  const goToCollections = () => {
    router.push('/collections');
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text>Failed to load providers. Please try again.</Text>
        <Button onPress={() => refetch()}>Retry</Button>
      </YStack>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
      <YStack flex={1} padding={16} gap="$4">
      <XStack space="$2" alignItems="center">
        <Input
          flex={1}
          placeholder="Search providers..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          height={48}
          fontSize={18}
          paddingVertical={12}
        />

        <Button size={48} onPress={() => setShowFilters(!showFilters)} icon={Filter}>
          Filters
        </Button>
      </XStack>

      {showFilters && (
        <XStack gap="$2" flexWrap="wrap">
          {SORT_OPTIONS.map(({ label, value }) => (
            <Button
              key={value}
              size="$3"
              chromeless
              bordered={sort !== value}
              backgroundColor={sort === value ? "gray" : "transparent"}
              onPress={() => setSort(value)}
            >
              <Text color={sort === value ? "white" : "$color"}>{label}</Text>
            </Button>
          ))}
        </XStack>
      )}

      <ScrollView>
        {data?.data.providers.map((provider: Provider) => (
          <TouchableOpacity key={provider.id} onPress={() => goToProvider(provider.id)}>
            <YStack
            borderRadius={12}
            overflow="hidden"
            marginBottom={16}
            shadowColor="black"
            shadowOpacity={0.1}
            shadowOffset={{ width: 0, height: 2 }}
            shadowRadius={6}
            >
              
              {provider.image_url ? (
                <Image
                  source={{ uri: provider.image_url }}
                  style={{ width: "100%", height: 180 }}
                  objectFit="cover"
                />
              ) : (
                <YStack
                  width="100%"
                  height={180}
                  backgroundColor="#333333"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white" fontSize={16}>No Image</Text>
                </YStack>
              )}

              <YStack padding="$3" gap="$2">
                <Text fontWeight="bold" fontSize={18}>{provider.name}</Text>
                <Text>
                  {provider.category} · {provider.price_range} · ⭐{" "}
                  {Number(provider.rating).toFixed(1)}
                  </Text>
                  <Text color="gray">{provider.address}</Text>
               </YStack>
             </YStack>
          </TouchableOpacity>
        ))}

        <YStack flexDirection="row" justifyContent="space-between" paddingVertical={10}>
          <Button disabled={page === 1} onPress={() => setPage((p) => Math.max(p - 1, 1))}
            icon={ArrowLeft}
            chromeless
          />
          <Button
            disabled={!data?.data.pagination.has_next}
            onPress={() => setPage((p) => p + 1)} 
            icon={ArrowRight}
            chromeless
          />
        </YStack>
      </ScrollView>
    </YStack>

    {/* <XStack
        borderTopWidth={1}
        borderColor="#ccc"
        padding="$3"
        justifyContent="space-around"
      >
        <Button
          icon={User}
          size={48}
          chromeless
          onPress={goToProfile}
        />
        <Button
          icon={Bookmark}
          size={48}
          chromeless
          onPress={goToCollections}
        />
      </XStack> */}
    </SafeAreaView>
    
  );
}
