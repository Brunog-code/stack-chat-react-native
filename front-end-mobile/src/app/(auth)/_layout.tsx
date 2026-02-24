import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function AuthLayout() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.colors.purple} />
    </View>;
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
