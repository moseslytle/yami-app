import { Text, View } from "react-native";
import { Button } from 'tamagui'

export default function Index() {
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
    </View>
  );
}
