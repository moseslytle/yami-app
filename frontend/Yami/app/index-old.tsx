import { Heart, Sparkles, User } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  Circle,
  H1,
  H2,
  Paragraph,
  useTheme,
  XStack,
  YStack
} from "tamagui";
import AdvancedYamiLogo from "../components/AdvancedYamiLogo";

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  const handleNavigateToProfile = () => {
    router.push("/login");
  };

  const handleNavigateToCollections = () => {
    router.push("/collections");
  };

  return (
    <YStack 
      flex={1} 
      backgroundColor="$background" 
      padding="$4"
      maxWidth={500}
      alignSelf="center"
      width="100%"
      paddingBottom={insets.bottom + 50}
    >
      {/* Header Section */}
      <YStack space="$4" paddingTop={insets.top}>
        <YStack alignItems="center" space="$3">
          {/* Brand Logo Circle */}
          <Circle 
            size={80} 
            backgroundColor="$brand" 
            alignItems="center" 
            justifyContent="center"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={8}
          >
            <Sparkles size={32} color="white" />
          </Circle>
          
          {/* Welcome Text */}
          <YStack alignItems="center" space="$2">
            <H1 
              color="$color" 
              textAlign="center"
              fontSize="$9"
              fontWeight="bold"
            >
              Welcome to                     

            </H1>
            <AdvancedYamiLogo
                        size={100}
                        primaryColor="#2563eb"
                        secondaryColor="#7c3aed"
                  />
            <Paragraph 
              color="$color" 
              textAlign="center"
              size="$5"
              maxWidth={280}
              opacity={0.8}
            >
              Dummy Page, feel free to delete this
            </Paragraph>
          </YStack>
        </YStack>
      </YStack>

      {/* Action Cards */}
      <YStack space="$4" flex={1} justifyContent="center">
        {/* Collections Card */}
        <Card 
          elevate 
          size="$4" 
          bordered
          backgroundColor="$background"
          borderColor="$borderColor"
          onPress={handleNavigateToCollections}
          pressStyle={{ scale: 0.98 }}
          hoverStyle={{ borderColor: "$brand" }}
        >
          <Card.Header>
            <XStack space="$4" alignItems="center">
              <Circle 
                size={48} 
                backgroundColor="$brandSubtle" 
                alignItems="center" 
                justifyContent="center"
              >
                <Heart size={24} color="$brand" />
              </Circle>
              
              <YStack flex={1} space="$2">
                <H2 color="$color" size="$7">Collections</H2>
                <Paragraph color="$color" size="$4" opacity={0.7}>
                  Browse and manage your collections
                </Paragraph>
              </YStack>
            </XStack>
          </Card.Header>
        </Card>

        {/* Profile Card */}
        <Card 
          elevate 
          size="$4" 
          bordered
          backgroundColor="$background"
          borderColor="$borderColor"
          onPress={handleNavigateToProfile}
          pressStyle={{ scale: 0.98 }}
          hoverStyle={{ borderColor: "$brand" }}
        >
          <Card.Header>
            <XStack space="$4" alignItems="center">
              <Circle 
                size={48} 
                backgroundColor="$brandSubtle" 
                alignItems="center" 
                justifyContent="center"
              >
                <User size={24} color="$brand" />
              </Circle>
              
              <YStack flex={1} space="$2">
                <H2 color="$color" size="$7">Profile</H2>
                <Paragraph color="$color" size="$4" opacity={0.7}>
                  Sign in to access your account
                </Paragraph>
              </YStack>
            </XStack>
          </Card.Header>
        </Card>
      </YStack>

      {/* Bottom Action */}
      <YStack space="$3" paddingBottom="$4">
        <Button
          size="$5"
          backgroundColor="$brand"
          borderRadius="$6"
          onPress={handleNavigateToCollections}
          icon={Heart}
          fontWeight="600"
          pressStyle={{ 
            backgroundColor: "$brandPress",
            scale: 0.98 
          }}
          hoverStyle={{ 
            backgroundColor: "$brandHover" 
          }}
        >
          <Paragraph color="white">Explore Collections</Paragraph>
        </Button>
        
        <Button
          size="$4"
          variant="outlined"
          borderColor="$brand"
          borderRadius="$6"
          onPress={handleNavigateToProfile}
          icon={User}
          pressStyle={{ 
            borderColor: "$brandPress",
            scale: 0.98 
          }}
        >
          <Paragraph color="$brand">Get Started</Paragraph>
        </Button>
      </YStack>
    </YStack>
  );
}

