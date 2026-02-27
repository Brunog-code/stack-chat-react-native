import { CustomTabs } from "@/src/components/CustomTabs";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { useAuth } from "@/src/contexts/auth-context";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs tabBar={(props) => <CustomTabs {...props} />}>
      <Tabs.Screen
        name="home"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: "Perfil", headerShown: false }}
      />
    </Tabs>
  );
}
