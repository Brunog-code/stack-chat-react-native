import { Redirect, Stack } from "expo-router";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function ChatLayout() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: "#fff",
        headerShadowVisible: true,
      }}
    />
  );
}
