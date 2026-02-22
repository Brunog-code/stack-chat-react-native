import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./../global.css";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const segmentes = useSegments();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [userIsAuthenticated, setUserIsAuthenticated] =
    useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const isAuthRoute = segmentes[0] === "(auth)";

    if (isMounted && !userIsAuthenticated && !isAuthRoute) {
      router.replace("/(auth)/login");
    } else if (isMounted && userIsAuthenticated && isAuthRoute) {
      // router.replace("/");
    }
  }, [isMounted, userIsAuthenticated, segmentes]);

  return <>{children}</>;
}

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
    <SafeAreaProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </SafeAreaProvider>
  );
}
