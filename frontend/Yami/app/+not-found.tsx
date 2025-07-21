import { Stack } from "expo-router";
import NotFoundScreen from "../components/NotFoundScreen";
export default function NotFound() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Page Not Found",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <NotFoundScreen />
    </>
  );
}
