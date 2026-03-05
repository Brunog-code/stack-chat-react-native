import { Logo } from "@/src/components/Logo";
import { theme } from "@/src/constants/theme";
import { View, Text, FlatList, Pressable } from "react-native";
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
import { getSocket } from "@/src/lib/socket";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const { user } = useAuth();

  const socket = getSocket();

  const [loadingFetchDataRooms, setLoadingFetchDataRooms] =
    useState<boolean>(true);
  const [roomData, setRoomsData] = useState<IResponseDataRooms[] | null>(null);

  useEffect(() => {
    socket.on("room_updated", handleRoomUpdated);

    return () => {
      socket.off("room_updated", handleRoomUpdated);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchRoomsData();
  }, [user]);

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
    return <LoadingSpinner />;
  }

  function handleOpenRoom(id: string, name: string, image: string) {
    router.push({
      pathname: "/chat/[roomId]",
      params: { roomId: id, name: name, image: image },
    });
  }

  async function handleRoomUpdated(data: {
    roomId: string;
    lastMessage: string;
    messageType: string;
    createdAt: string;
    name: string;
  }) {
    setRoomsData((prev) => {
      if (!prev) return prev;

      const updatedRooms = prev.map((room) => {
        if (room.id === data.roomId) {
          return {
            ...room,
            unreadCount: room.unreadCount + 1,
            messages: [
              {
                ...room.messages[0],
                content:
                  data.messageType == "text"
                    ? data.lastMessage
                    : "Arquivo de mídia",
                createdAt: data.createdAt,
                user: {
                  ...room.messages[0].user,
                  name: data.name,
                },
              },
            ],
          };
        }
        return room;
      });

      return updatedRooms;

      // move pro topo
      // return updateRooms.sort(
      //   (a, b) =>
      //     new Date(b.messages[0]?.createdAt).getTime() -
      //     new Date(a.messages[0]?.createdAt).getTime(),
      // );
    });
  }

  return (
    <View
      className="flex-1 "
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <View className="flex-row justify-between items-center">
        <Logo sizeImg={60} sizeText={32} />
        <Pressable onPress={() => router.push("/search/search")}>
          <Feather name="search" size={32} color={theme.colors.text} />
        </Pressable>
      </View>

      <View className="flex-1 mt-6">
        <FlatList
          data={roomData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
