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

  //refs
  const flatListRef = useRef<FlatList<IMessage>>(null);
  const shouldScrollToBottom = useRef(false);
  const didInitialScroll = useRef(false);

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

    // Função para garantir que estamos na sala
    const joinRoom = () => {
      socket.emit("join_room", roomId);
    };

    // 1. Tenta entrar imediatamente
    if (socket.connected) {
      joinRoom();
    }

    // 2. Se o socket cair e voltar (reconnect), entra na sala de novo automaticamente
    socket.on("connect", joinRoom);

    //quando recebe mensagem
    function handleReceiveMessage(message: IMessage & { tempId?: string }) {
      setMessages((prev) => {
        //só substitui temporária se ela existir na lista (ou seja, foi criada por mim)
        const tempExists =
          message.tempId && prev.some((msg) => msg.id === message.tempId);

        if (tempExists) {
          return prev.map((msg) =>
            msg.id === message.tempId ? { ...message, sending: false } : msg,
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
      socket.emit("leave_room", roomId);
      socket.off("connect", joinRoom);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("join_error", handleJoinError);
      socket.off("message_error", handleMessageError);
    };
  }, [roomId]);

  //rolar até a ultima mensagem lida
  useEffect(() => {
    if (didInitialScroll.current || messages.length === 0) return;

    // Se não há lastReadMessageId, libera direto (já está no topo/mais recente)
    if (!lastReadMessageId) {
      didInitialScroll.current = true;

      return;
    }

    const index = messages.findIndex((msg) => msg.id === lastReadMessageId);

    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: false,
      });

      //habilita leitura
      setTimeout(() => {
        didInitialScroll.current = true;
      }, 300);
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
      content: messageInput,
      createdAt: new Date().toISOString(),
      user: {
        name: user!.name,
      },
      sending: true,
    };

    shouldScrollToBottom.current = true;

    setMessages((prev) => [tempMessage, ...prev]);

    socket.emit("send_message", {
      roomId,
      type: "text",
      content: messageInput,
      tempId: tempMessage.id,
    });

    setMessageInput("");
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
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

  //marcar como lida a mensagem
  const lastSentReadRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null | number>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (!didInitialScroll.current) return; // 🔴 BLOQUEIA

    if (!viewableItems.length) return;

    //pega os itens visíveis
    const visibleMessages = viewableItems
      .map((v: any) => v.item)
      //ignora mensagens enviadas por mim
      .filter((msg: IMessage) => msg.userId !== user?.id);

    if (visibleMessages.length === 0) return;

    //como a lista é inverted, pega a MAIS RECENTE visível
    const newestVisible = visibleMessages.reduce(
      (latest: any, current: any) => {
        const latestDate = new Date(latest.createdAt).getTime();
        const currentDate = new Date(current.createdAt).getTime();
        return currentDate > latestDate ? current : latest;
      },
    );

    const newDate = new Date(newestVisible.createdAt).toISOString();

    if (lastSentReadRef.current === newDate) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      lastSentReadRef.current = newDate;

      socket.emit("mark_as_read", {
        roomId,
        lastReadAt: newDate,
      });
    }, 400);
  }).current;

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
        onViewableItemsChanged={onViewableItemsChanged} //O React Native começa a monitorar quais itens estão visíveis na tela.
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onContentSizeChange={() => {
          if (shouldScrollToBottom.current) {
            flatListRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });

            shouldScrollToBottom.current = false;
          }
        }}
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
