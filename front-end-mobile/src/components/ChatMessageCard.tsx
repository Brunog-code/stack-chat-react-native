import { Image, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface IChatMessageCardProps {
  image: string;
  name: string;
  createdAt: string;
  message: string;
  role: "other" | "me";
}

export const ChatMessageCard = ({
  image,
  createdAt,
  message,
  name,
  role,
}: IChatMessageCardProps) => {
  const isMe = role == "me";
  const time = new Date(createdAt).toLocaleTimeString("pt-br", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <View
      style={{
        flexDirection: isMe ? "row-reverse" : "row",
        alignItems: "flex-end",
        marginHorizontal: 12,
        marginVertical: 6,
        gap: 8,
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: image ?? "https://via.placeholder.com/40" }}
        style={{ width: 44, height: 44, borderRadius: 22 }}
      />

      {/* Balão */}
      <View
        style={{
          maxWidth: "70%",
          backgroundColor: isMe ? theme.colors.purple : theme.colors.details_bg,
          borderRadius: 16,
          borderBottomRightRadius: isMe ? 4 : 16,
          borderBottomLeftRadius: isMe ? 16 : 4,
          padding: 10,
          gap: 4,
        }}
      >
        {/* Nome + hora */}
        <View
          style={{
            flexDirection: isMe ? "row-reverse" : "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Text
            style={{
              color: isMe ? "#fff" : theme.colors.purple,
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            {name}
          </Text>
          <Text style={{ color: theme.colors.gray, fontSize: 11 }}>{time}</Text>
        </View>

        {/* Mensagem */}
        <Text style={{ color: "#fff", fontSize: 14 }}>{message}</Text>
      </View>
    </View>
  );
};
