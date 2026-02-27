import { Logo } from "@/src/components/Logo";
import { theme } from "@/src/constants/theme";
import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { api } from "@/src/lib/api";
import { IResponseDataRooms } from "@/src/types";
import { ChatCard } from "@/src/components/ChatRoomCard";
import { useAuth } from "@/src/contexts/auth-context";
import { useRouter } from "expo-router";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const { user } = useAuth();

  const [loadingFetchDataRooms, setLoadingFetchDataRooms] =
    useState<boolean>(true);
  const [roomData, setRoomsData] = useState<IResponseDataRooms[] | null>(null);

  useEffect(() => {
    fetchRoomsData();
  }, []);

  async function fetchRoomsData() {
    try {
      const response = await api.get<IResponseDataRooms[]>("/chat-room", {
        params: { user_id: user?.id },
      });

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
    <LoadingSpinner />;
  }

  function handleOpenRoom(id: string, name: string, image: string) {
    router.push({
      pathname: "/chat/[roomId]",
      params: { roomId: id, name: name, image: image },
    });
  }

  return (
    <View
      className="flex-1 "
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
        // paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <View className="flex-row justify-between items-center">
        <Logo sizeImg={60} sizeText={32} />
        <Feather name="search" size={32} color={theme.colors.text} />
      </View>

      <View className="flex-1 mt-6">
        <FlatList
          data={roomData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatCard
              img={item.image}
              title={item.name}
              lastUserName={item.messages[0].user.name}
              lastMessage={item.messages[0].content ?? ""}
              unreadMessagesCount={item.unreadCount}
              lastUnreadMessageTime={item.messages[0].createdAt}
              onPress={() => handleOpenRoom(item.id, item.name, item.image)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 26 }} />}
          contentContainerStyle={{
            paddingBottom: 110,
          }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-center text-text text-lg leading-7">
                Nenhum grupo para exibir
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
