import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./../global.css";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../contexts/auth-context";

import { theme } from "../constants/theme";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();

  //espera fontes carregarem
  const [loaded, error] = useFonts({
    JetBrainsMonoBold: require("./../../assets/fonts/JetBrainsMono/JetBrainsMono-Bold.ttf"),
    RobotoRegular: require("./../../assets/fonts/Roboto/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar
          style="light"
          backgroundColor={theme.colors.background}
          translucent={false}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat/[roomId]" />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
