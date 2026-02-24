import { Logo } from "@/src/components/Logo";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { View, Text, ScrollView } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { api } from "@/src/lib/api";
import { IResponseDataRooms } from "@/src/types";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [loadingFetchDataRooms, setLoadingFetchDataRooms] =
    useState<boolean>(true);
  const [roomData, setRoomsData] = useState<IResponseDataRooms[] | null>(null);

  const { logout } = useAuth();

  useEffect(() => {
    fetchRoomsData();
  }, []);

  async function fetchRoomsData() {
    try {
      const response = await api.get<IResponseDataRooms[]>("/chat-room");

      console.log(response.data);
      setRoomsData(response.data);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setLoadingFetchDataRooms(false);
    }
  }

  if (loadingFetchDataRooms) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.purple} />
      </View>
    );
  }

  return (
    <View
      className="flex-1 "
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <View className="flex-row justify-between items-center">
        <Logo sizeImg={60} sizeText={32} />
        <Feather name="search" size={32} color={theme.colors.text} />
      </View>

      <ScrollView></ScrollView>
      <Text>Home</Text>
      <Button onPress={logout}>Sair</Button>
    </View>
  );
}
