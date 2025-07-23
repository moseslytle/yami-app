import { Heart, Home } from '@tamagui/lucide-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from "expo-router";
import { Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, XStack } from 'tamagui';

interface CustomTabBarProps {
	state: any;
	descriptors: any;
	navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
	const insets = useSafeAreaInsets();
	const colorScheme = useColorScheme();
	
	return (
		<View
			style={{
				position: 'absolute',
				bottom: insets.bottom,
				left: 0,
				right: 0,
				alignItems: 'center',
				justifyContent: 'center',
				pointerEvents: 'box-none',
			}}
		>
			<BlurView
				intensity={50}
				tint={colorScheme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight'}
				style={{
					borderRadius: 25,
					overflow: 'hidden',
					paddingHorizontal: 4,
					paddingVertical: 3,
					backgroundColor: colorScheme === 'dark' ? 'rgba(17, 17, 17, 0.0)' : 'rgba(248, 248, 248, 0)',
					shadowColor: colorScheme === 'dark' ? '#000' : '#000',
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: colorScheme === 'dark' ? 0.4 : 0.15,
					shadowRadius: 20,
				}}
			>
				<XStack
					backgroundColor="transparent"
					borderRadius="$10"
					padding="$1"
					shadowColor="$shadowColor"
					shadowOffset={{
						width: 0,
						height: 4,
					}}
					shadowOpacity={0.25}
					shadowRadius={20}
					elevation={10}
					width="auto"
					minWidth={300}
					maxWidth="80%"
				>
				{state.routes.map((route: any, index: number) => {
					const { options } = descriptors[route.key];
					const label = options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name);
						}
					};

					const IconComponent = route.name === 'index' ? Home : Heart;

					return (
						<Pressable
							key={route.key}
							onPress={onPress}
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								paddingVertical: 10,
								paddingHorizontal: 14,
								borderRadius: 18,
								backgroundColor: isFocused 
									? (colorScheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
									: 'transparent',
								shadowColor: isFocused ? '#000' : 'transparent',
								shadowOffset: {
									width: 0,
									height: 2,
								},
								shadowOpacity: isFocused ? 0.1 : 0,
								shadowRadius: 4,
								elevation: isFocused ? 2 : 0,
								borderWidth: isFocused ? 1 : 0,
								borderColor: isFocused 
									? (colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')
									: 'transparent',
							}}
						>
							<IconComponent
								color={isFocused ? '#E11D48' : (colorScheme === 'dark' ? '#AAAAAA' : '#666666')}
								size={18}
								fill={isFocused ? '#E11D48' : 'transparent'}
							/>
							<Text 
								marginLeft={6}
								fontSize={15}
								fontWeight={isFocused ? '600' : '500'}
								color={isFocused ? '#E11D48' : (colorScheme === 'dark' ? '#AAAAAA' : '#666666')}
							>
								{label}
							</Text>
						</Pressable>
					);
				})}
				</XStack>
			</BlurView>
		</View>
	);
}

export default function TabsLayout() {
	const colorScheme = useColorScheme();
	
	return (
		<View style={{ 
			flex: 1,
			backgroundColor: colorScheme === 'dark' ? '#111111' : '#FFFFFF'
		}}>
			<Tabs
				tabBar={(props) => <CustomTabBar {...props} />}
				screenOptions={{
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Home",
					}}
				/>
				<Tabs.Screen
					name="collections"
					options={{
						title: "Collections",
					}}
				/>
			</Tabs>
		</View>
	);
}