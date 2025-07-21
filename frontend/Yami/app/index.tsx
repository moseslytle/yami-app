import { Text, View } from "react-native";
import { Button } from "tamagui";
import { useRouter } from "expo-router";
import { User } from "@tamagui/lucide-icons";

export default function Index() {
  const router = useRouter();
  const handleNavigateToProfile = () => {
    router.push("/example");
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
    </View>
  );
}
