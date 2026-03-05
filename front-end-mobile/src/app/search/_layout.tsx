import { Redirect, Stack } from "expo-router";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function SearchLayout() {
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
        headerShown: false,
        // headerStyle: {
        //   backgroundColor: theme.colors.background,
        // },
        // headerTintColor: "#fff",
        // headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );
}
