import { theme } from "@/src/constants/theme";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
          // paddingTop: insets.top,
        },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" />
    </Stack>
  );
}
