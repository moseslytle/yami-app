// Created 07/20/2025 by Linus Xiong.
// Edited 07/21/2025 by Paulina Salazar - implemented index page after it was initialized.
// Edited 07/22/2025 by Paulina Salazar - implemented no image, redesigned how providers are presented, fixed sorting.
// Edited 07/23/2025 by Paulina Salazar - implemented filters and sorting dropdown menu, and geolocation with user's permission.

import React, { useState, useEffect } from "react";
import {
	ScrollView,
	TouchableOpacity,
	useColorScheme,
	View,
	ActionSheetIOS,
	Platform,
	Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Image, XStack, YStack, Button, Spinner, Input } from "tamagui";
import { useRouter } from "expo-router";
import {
	Filter,
	Star,
	ArrowRight,
	ArrowLeft,
	ArrowDownUp,
} from "@tamagui/lucide-icons";
import { useProviders, Provider } from "../../hooks/useProviders";
import * as Location from "expo-location";

// Constants for sorting options and filtering options.
const SORT_OPTIONS = [
	{ label: "Name Ascending", value: "name" },
	{ label: "Highest Rating", value: "rating" },
	{ label: "Distance", value: "distance" },
];
const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];
const RATINGS = [5, 4, 3, 2, 1];

/**
 * Created 07/21/2025 by Paulina Salazar.
 * Edited 07/22/2025 by Paulina Salazar - redesigned some elements and fixed sorting.
 *
 * Main page, user is able to search, sort, and access their profile and collections.
 */
export default function IndexPage() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	// Used debouncedSearch to avoid too many API calls.
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [sort, setSort] = useState("name");
	const [showFilters, setShowFilters] = useState(false);
	const [priceFilter, setPriceFilter] = useState<string | null>(null);
	const [ratingFilter, setRatingFilter] = useState<number | null>(null);
	const [coords, setCoords] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	// Debounces search so search doesn't update with every key input.
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

	// Request user's location.
	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.warn("Permission to access location was denied");
				return;
			}
			const location = await Location.getCurrentPositionAsync({});
			setCoords({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		})();
	}, []);

	// Get providers with pagination, sort, and search.
	const { data, isLoading, isError, refetch } = useProviders({
		page,
		limit: 30,
		sort,
		search: debouncedSearch,
		latitude: coords?.latitude,
		longitude: coords?.longitude,
		price_range: priceFilter || undefined,
		min_rating: ratingFilter || undefined,
	});

	const goToProvider = (id: string) => {
		router.push(`/providers/${id}`);
	};

	// Loading animation if anything is loading.
	if (isLoading) {
		return (
			<YStack flex={1} justifyContent="center" alignItems="center">
				<Spinner />
			</YStack>
		);
	}

	// Print error if there is one.
	if (isError) {
		return (
			<YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
				<Text>Failed to load providers. Please try again.</Text>
				<Button onPress={() => refetch()}>Retry</Button>
			</YStack>
		);
	}

	return (
		<View style={{ flex: 1, paddingTop: insets.top }}>
			<YStack
				flex={1}
				paddingTop={16}
				paddingRight={16}
				paddingLeft={16}
				gap="$2"
			>
				{/* Search bar design */}
				<XStack gap="$2" alignItems="center" marginBottom="$2">
					<Input
						flex={1}
						minWidth={100}
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
				</XStack>

				{/* Filters design, overrode style to match Sort */}
				<XStack gap="$2" alignItems="center" marginBottom="$2">
					<Button
            flex={1}
						onPress={() => setShowFilters((prev) => !prev)}
						icon={Filter}
						size="$4"
						height={40}
						borderWidth={1}
						borderColor="$color4"
						backgroundColor="$color1"
						hoverStyle={{ backgroundColor: "$backgroundHover" }}
						pressStyle={{ backgroundColor: "$backgroundPress" }}
					>
						Filters
					</Button>

					{/* Sort dropdown menu design, overrode style to match Filters */}
					<Button
						icon={ArrowDownUp}
            flex={1}
						size="$4"
						height={40}
						minWidth={100}
						borderWidth={1}
						borderColor="$color4"
						backgroundColor="$color1"
						onPress={() => {
							const options = [
								...SORT_OPTIONS.map((opt) => opt.label),
								"Cancel",
							];
							const cancelButtonIndex = options.length - 1;

							if (Platform.OS === "ios") {
								ActionSheetIOS.showActionSheetWithOptions(
									{
										options,
										cancelButtonIndex,
										title: "Sort by",
									},
									(buttonIndex) => {
										if (buttonIndex !== cancelButtonIndex) {
											setSort(SORT_OPTIONS[buttonIndex].value);
										}
									},
								);
							} else {
								// Android Alert
								Alert.alert("Sort by", "Choose sorting option", [
									...SORT_OPTIONS.map((option) => ({
										text: option.label,
										onPress: () => setSort(option.value),
									})),
									{ text: "Cancel", style: "cancel" },
								]);
							}
						}}
					>
						{SORT_OPTIONS.find((option) => option.value === sort)?.label ||
							"Sort"}
					</Button>
				</XStack>

				{/* Filters user can pick from */}
				{showFilters && (
					<YStack>
						<Text marginBottom={4}>Filter by Rating</Text>
						<XStack gap="$2" marginBottom={12}>
							{RATINGS.map((star) => (
								<Button
									key={star}
									size="$2"
									onPress={() =>
										setRatingFilter(ratingFilter === star ? null : star)
									}
									icon={Star}
									iconAfter={<Text>{star}+</Text>}
									chromeless={false}
									bordered
								/>
							))}
						</XStack>
						<Text marginBottom={4}>Filter by Price</Text>
						<XStack gap="$2">
							{PRICE_RANGES.map((price) => (
								<Button
									key={price}
									size="$2"
									onPress={() =>
										setPriceFilter(priceFilter === price ? null : price)
									}
									chromeless={false}
									bordered
								>
									{price}
								</Button>
							))}
						</XStack>
					</YStack>
				)}

				<ScrollView showsVerticalScrollIndicator = {false}>
					{/* Providers information design */}
					{data?.data.providers.map((provider: Provider) => (
						<TouchableOpacity
							key={provider.id}
							onPress={() => goToProvider(provider.id)}
						>
							<YStack borderRadius={12} overflow="hidden" marginBottom={16}>
								{/* Provide business image if available, or let user know there isn't one if not */}
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
										<Text color="white" fontSize={16}>
											No Image
										</Text>
									</YStack>
								)}

								<YStack padding="$3" gap="$2">
									<Text fontWeight="bold" fontSize={18}>
										{provider.name}
									</Text>
									<Text>
										{provider.category}
										{provider.price_range ? ` · ${provider.price_range}` : ""}
										{" ·⭐ "}
										{Number(provider.rating).toFixed(1)}
									</Text>
									{provider.distance !== undefined &&
										provider.distance !== null && (
											<Text color="gray">
												{provider.distance.toFixed(2)} mi away
											</Text>
										)}
									<Text color="gray">{provider.address}</Text>
								</YStack>
							</YStack>
						</TouchableOpacity>
					))}

					{/* Button design to pick what page user wants to be on */}
					<YStack
						flexDirection="row"
						justifyContent="space-between"
						paddingVertical={10}
					>
						<Button
							disabled={page === 1}
							onPress={() => setPage((p) => Math.max(p - 1, 1))}
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
		</View>
	);
}
