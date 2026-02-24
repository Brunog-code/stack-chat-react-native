import { Redirect } from "expo-router";
import { useAuth } from "../contexts/auth-context";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../constants/theme";

export default function index() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.purple} />
      </View>
    );
  }

  return user ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
