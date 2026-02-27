import { Avatar, Badge } from "react-native-paper";
import { theme } from "../constants/theme";
import { Pressable, Text, View } from "react-native";

interface IChatCardProps {
  img: string;
  title: string;
  lastMessage: string;
  lastUserName: string;
  unreadMessagesCount: number;
  lastUnreadMessageTime: string;
  onPress: () => void;
}

export const ChatCard = ({
  img,
  lastMessage,
  lastUserName,
  title,
  unreadMessagesCount,
  lastUnreadMessageTime,
  onPress,
}: IChatCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row justify-between items-center "
    >
      <View className="flex-row items-center gap-4">
        <View>
          <Avatar.Image source={{ uri: img }} />
        </View>

        <View>
          <Text className="text-text text-2xl font-bold">{title}</Text>
          <Text className="text-text">
            {lastUserName}: <Text className="text-gray">{lastMessage}</Text>
          </Text>
        </View>
      </View>

      <View className="gap-2 items-center justify-center">
        <Text className="text-purple">
          {new Date(lastUnreadMessageTime).toLocaleTimeString("pt-BR", {
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
          {unreadMessagesCount}
        </Badge>
      </View>
    </Pressable>
  );
};
