import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    <LoadingSpinner />;
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
