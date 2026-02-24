import { Avatar, Badge } from "react-native-paper";
import { theme } from "../constants/theme";
import { Text, View } from "react-native";

interface IChatCardProps {
  img: string;
  title: string;
  lastMessage: string;
  lastUser: string;
  unreadMessagesCount: number;
  lastUnreadMessageTime: number;
}

export const ChatCard = ({
  img,
  lastMessage,
  lastUser,
  title,
  unreadMessagesCount,
  lastUnreadMessageTime,
}: IChatCardProps) => {
  return (
    <View className="w-full flex-row justify-between items-center ">
      <View className="flex-row items-center gap-4">
        <View>
          <Avatar.Image source={{ uri: img }} />
        </View>

        <View>
          <Text className="text-text text-2xl font-bold">JavaScript</Text>
          <Text className="text-text">
            Bruno: <Text className="text-gray">O que é uma promise?</Text>
          </Text>
        </View>
      </View>

      <View className="gap-2 items-center justify-center">
        <Text className="text-purple">
          {new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Badge
          size={24}
          style={{
            backgroundColor: theme.colors.details_bg,
          }}
        >
          3
        </Badge>
      </View>
    </View>
  );
};
