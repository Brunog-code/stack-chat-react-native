import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { theme } from "@/src/constants/theme";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/contexts/auth-context";
import { IMessage, IResponseMessageRoom } from "@/src/types";
import { ChatMessageCard } from "@/src/components/ChatMessageCard";
import { LinearGradient } from "expo-linear-gradient";
import EmojiPicker from "rn-emoji-keyboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import { getSocket } from "@/src/lib/socket";

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

  const socket = getSocket();

  const insets = useSafeAreaInsets();

  const flatListRef = useRef<FlatList<IMessage>>(null);

  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(
    null,
  );

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const [pressedSendBtn, setPressedSendBtn] = useState(false);
  const isDisabled = messageInput.trim().length === 0;

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

  useEffect(() => {
    if (!roomId) return;

    //entra na 'sala'
    socket.emit("join_room", roomId);

    //quando recebe mensagem
    function handleReceiveMessage(message: IMessage & { tempId?: string }) {
      setMessages((prev) => {
        //se for mensagem temporária (imagem enviando)
        if (message.tempId) {
          return prev.map((msg) =>
            msg.id === message.tempId ? { ...msg, sending: false } : msg,
          );
        }

        return [message, ...prev];
      });
    }

    //erro ao entrar na sala
    function handleJoinError(error: string) {
      Toast.show({
        type: "error",
        text1: error,
      });
    }

    //erro ao enviar mensagem
    function handleMessageError(data: { tempId: string; error: string }) {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.tempId));

      Toast.show({
        type: "error",
        text1: data.error,
      });
    }

    //escuta
    socket.on("receive_message", handleReceiveMessage);
    socket.on("join_error", handleJoinError);
    socket.on("message_error", handleMessageError);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("join_error", handleJoinError);
      socket.off("message_error", handleMessageError);
    };
  }, [roomId]);

  //rolar até a ultima mensagem lida
  useEffect(() => {
    if (!lastReadMessageId || messages.length === 0) return;

    const index = messages.findIndex((msg) => msg.id === lastReadMessageId);

    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  }, [messages, lastReadMessageId]);

  //buscar mensagens do backend primeiro render
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

  async function handleSendMessage() {
    if (messageInput.trim().length < 1) {
      Toast.show({
        type: "error",
        text1: "Digite algo para enviar",
      });
      return;
    }

    const tempMessage: IMessage = {
      id: "temp-" + Date.now(),
      chatRoomId: roomId,
      userId: user!.id,
      imageUrl: "",
      messageType: "text",
      content: "",
      createdAt: new Date().toISOString(),
      user: {
        name: user!.name,
      },
      sending: true,
    };

    setMessages((prev) => [tempMessage, ...prev]);

    socket.emit("send_message", {
      roomId,
      type: "text",
      content: messageInput,
      tempId: tempMessage.id,
    });
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão para acessar galeria é necessária",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      Toast.show({
        type: "error",
        text1: "Erro ao selecionar arquivo",
      });
      return;
    }

    const asset = result.assets[0];

    const tempMessage: IMessage = {
      id: "temp-" + Date.now(),
      chatRoomId: roomId,
      userId: user!.id,
      imageUrl: asset.uri,
      messageType: asset.type === "video" ? "video" : "image",
      content: "",
      createdAt: new Date().toISOString(),
      user: {
        name: user!.name,
      },
      sending: true,
    };

    setMessages((prev) => [tempMessage, ...prev]);

    await uploadAndSend(asset, tempMessage.id);
  }

  async function uploadAndSend(
    asset: ImagePicker.ImagePickerAsset,
    tempId: string,
  ) {
    try {
      const formData = new FormData();

      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? `upload.${asset.uri.split(".").pop()}`,
        type: asset.mimeType ?? "application/octet-stream",
      } as any);

      //chamar api para upload
      const response = await api.post("/upload", formData);

      const fileUrl = response.data.url;

      socket.emit("send_message", {
        roomId,
        type: asset.type == "video" ? "video" : "image",
        content: fileUrl,
        tempId,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    }
  }

  if (loadingMessages) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1  relative"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={messages}
        inverted
        style={{ flex: 1 }}
        ref={flatListRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 300);
        }}
        renderItem={({ item }) => (
          <ChatMessageCard
            role={user?.id === item.userId ? "me" : "other"}
            createdAt={item.createdAt}
            mediaUrl={item.imageUrl}
            message={item.content}
            name={item.user.name}
            imageUser={item.user.image ?? ""}
            messageType={item.messageType}
          />
        )}
        contentContainerStyle={{
          paddingTop: insets.top + 100,
          paddingBottom: 10,
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-center text-text text-lg leading-7">
              Nenhuma mensagem
            </Text>
          </View>
        }
      />

      <LinearGradient
        colors={["rgba(32,41,66,0)", "rgba(32,41,66,0.8)", "rgba(32,41,66,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 40,
          paddingBottom: insets.bottom + 10,
        }}
      >
        <View className=" w-full flex-row items-center justify-between px-1">
          <TextInput
            mode="outlined"
            value={messageInput}
            onChangeText={setMessageInput}
            outlineColor={theme.colors.gray}
            textColor={theme.colors.text}
            activeOutlineColor={theme.colors.purple}
            theme={{ roundness: 50 }}
            placeholder="Message"
            placeholderTextColor={theme.colors.gray}
            style={{
              backgroundColor: theme.colors.details_bg,
              borderRadius: 50,
              width: "85%",
            }}
            contentStyle={{
              paddingVertical: 8,
            }}
            left={
              <TextInput.Icon
                icon="emoticon-outline"
                color={theme.colors.purple}
                size={28}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowEmojiPicker(true);
                }}
              />
            }
            right={
              <TextInput.Icon
                icon="paperclip" //📎grampo
                color={theme.colors.purple}
                size={28}
                onPress={handlePickImage}
              />
            }
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={isDisabled}
            onPressIn={() => setPressedSendBtn(true)}
            onPressOut={() => setPressedSendBtn(false)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: isDisabled
                ? theme.colors.gray
                : pressedSendBtn
                  ? theme.colors.purple + "CC"
                  : theme.colors.purple,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="send" size={24} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>
      <EmojiPicker
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelected={(emoji) => {
          setMessageInput((prev) => prev + emoji.emoji);
        }}
        theme={{
          backdrop: "#16161888",
          knob: "#766dfc",
          container: "#282829",
          header: "#fff",
          skinTonesContainer: "#252427",
          category: {
            icon: "#766dfc",
            iconActive: "#fff",
            container: "#252427",
            containerActive: "#766dfc",
          },
        }}
      />
    </KeyboardAvoidingView>
  );
}

{
}
