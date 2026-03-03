import { Image, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { stringToColor } from "../utils/string-to-color";
import { Video, ResizeMode } from "expo-av";

interface IChatMessageCardProps {
  mediaUrl: string | null;
  imageUser?: string;
  name: string;
  createdAt: string;
  message: string | null;
  role: "other" | "me";
  messageType: "text" | "image" | "video";
}

export const ChatMessageCard = ({
  mediaUrl,
  imageUser,
  createdAt,
  message,
  name,
  role,
  messageType
}: IChatMessageCardProps) => {
  const isMe = role === "me";
  const time = new Date(createdAt).toLocaleTimeString("pt-br", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nameColor = stringToColor(name);
  
  return (
    <View
      style={{
        flexDirection: isMe ? "row-reverse" : "row",
        alignItems: "flex-end",

        marginHorizontal: 12,
        marginVertical: 6,
        gap: 4,
        width: "90%",

      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: imageUser ?? "https://via.placeholder.com/40" }}
        style={{ width: 44, height: 44, borderRadius: 22 }}
      />

      {/* Balão */}
      <View
        style={{
          maxWidth: "70%",
          minWidth: "50%",
          backgroundColor: isMe ? theme.colors.purple : theme.colors.details_bg,
          borderRadius: 16,
          borderBottomRightRadius: isMe ? 4 : 16,
          borderBottomLeftRadius: isMe ? 16 : 4,
          padding: 10,
          gap: 6,
        }}
      >
        {/* Nome + hora */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Text
            style={{
              color: isMe ? "#fff" : nameColor,
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {name}
          </Text>
          <Text style={{ color: theme.colors.gray, fontSize: 11 }}>{time}</Text>
        </View>

        {/* Mensagem */}
        {messageType === "text" && message && (
          <Text style={{ color: theme.colors.text, fontSize: 14 }}>
            {message}
          </Text>
        )}

        {messageType === "image" && mediaUrl && (
          <Image
            source={{ uri: mediaUrl }}
            style={{ width: 180, height: 180, borderRadius: 12 }}
          />
        )}
        {messageType === "video" && mediaUrl && (
          <Video
            source={{ uri: mediaUrl }}
            style={{ width: 220, height: 220, borderRadius: 12 }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping={false}
          />
        )}
      </View>

    </View>
  );
};
