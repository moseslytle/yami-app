import { Text, View } from "react-native";
import { Button, Input, XStack } from "tamagui";
import { useRouter } from "expo-router";
import { User, MapPin } from "@tamagui/lucide-icons";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [providerId, setProviderId] = useState("");
  
  const handleNavigateToProfile = () => {
    router.push("/example");
  };
  
  const handleNavigateToProvider = () => {
    if (providerId.trim()) {
      router.push(`/providers/${providerId.trim()}`);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World Yami.</Text>
      <Button theme="blue">Hello world</Button>
      <Button
        size="$4"
        theme="blue"
        icon={User}
        onPress={handleNavigateToProfile}
        borderRadius="$4"
      >
        Go to Profile
      </Button>
      
      {/* Provider Test Section */}
      <XStack alignItems="center" gap="$2" marginTop="$4">
        <Input
          placeholder="Enter Provider ID"
          value={providerId}
          onChangeText={setProviderId}
          size="$4"
          width={150}
          borderRadius="$4"
        />
        <Button
          size="$4"
          theme="green"
          icon={MapPin}
          onPress={handleNavigateToProvider}
          borderRadius="$4"
          disabled={!providerId.trim()}
        >
          Go to Provider
        </Button>
      </XStack>
    </View>
  );
}
