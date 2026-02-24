import { CustomTabs } from "@/src/components/CustomTabs";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function TabsLayout() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.colors.purple} />
    </View>;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs tabBar={(props) => <CustomTabs {...props} />}>
        <Tabs.Screen
          name="home"
          options={{ headerShown: false, title: "Home" }}
        />
        <Tabs.Screen
          name="perfil"
          options={{ headerShown: false, title: "Perfil" }}
        />
      </Tabs>
    </View>
  );
}
