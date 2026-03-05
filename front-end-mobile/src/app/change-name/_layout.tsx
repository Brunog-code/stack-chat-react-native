import { Redirect, Stack } from "expo-router";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { Logo } from "@/src/components/Logo";

export default function ChangeNameLayout() {
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
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitle: () => <Logo sizeImg={60} sizeText={32} />,
      }}
    />
  );
}
