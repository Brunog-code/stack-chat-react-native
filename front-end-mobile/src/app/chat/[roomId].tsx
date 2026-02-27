import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { theme } from "@/src/constants/theme";

import { useEffect, useLayoutEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/contexts/auth-context";
import { IMessage, IResponseMessageRoom } from "@/src/types";
import { ChatMessageCard } from "@/src/components/ChatMessageCard";
import { LinearGradient } from "expo-linear-gradient";

function ChatHeader({ name, image }: { name: string; image: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          marginRight: 10,
        }}
      />
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        {name}
      </Text>
    </View>
  );
}

export default function ChatRoom() {
  const navigation = useNavigation();

  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(
    null,
  );

  const { user } = useAuth();

  const { roomId, image, name } = useLocalSearchParams<{
    roomId: string;
    name: string;
    image: string;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerTitle: () => <ChatHeader name={name} image={image} />,
    });
  }, [name, image]);

  useEffect(() => {
    fetchRoomMessages();
  }, []);

  //buscar mensagens do backend
  async function fetchRoomMessages() {
    try {
      const response = await api.get<IResponseMessageRoom>(
        `/chat-room/messages`,
        {
          params: {
            userId: user?.id,
            roomId: roomId,
          },
        },
      );

      setLastReadMessageId(response.data.lastReadMessageId);
      setMessages(response.data.messages);
      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setLoadingMessages(false);
    }
  }

  if (loadingMessages) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 items-center justify-center relative"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatMessageCard
            role={user?.id == item.userId ? "me" : "other"}
            createdAt={item.createdAt}
            image={item.imageUrl}
            message={item.content}
            name={item.user.name}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-center text-text text-lg leading-7">
              Nenhuma mensagem
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 170,
          paddingTop: 20,
        }}
      />

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(32,41,66,0)", "rgba(32,41,66,0.8)", "rgba(32,41,66,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: "100%",
          height: 120,
          position: "absolute",
          bottom: 0,
          justifyContent: "flex-end",
          paddingBottom: 15,
        }}
      >
        <View className=" w-11/12 mx-auto">
          <TextInput
            mode="outlined"
            outlineColor={theme.colors.gray}
            activeOutlineColor={theme.colors.purple}
            left={
              <TextInput.Icon
                icon="emoticon-outline"
                color={theme.colors.purple}
                size={28}
              />
            }
            right={
              <TextInput.Icon
                icon="paperclip" // 📎 grampo
                color={theme.colors.purple}
                size={28}
                onPress={() => {
                  console.log("Anexar arquivo");
                }}
              />
            }
            theme={{ roundness: 50 }}
            placeholder="Message"
            placeholderTextColor={theme.colors.gray}
            style={{
              backgroundColor: theme.colors.details_bg,
              borderRadius: 50,
            }}
            contentStyle={{
              paddingVertical: 8,
            }}
          />
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
