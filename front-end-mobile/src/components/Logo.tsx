import { View, Text, Image } from "react-native";
import { theme } from "../constants/theme";

interface ILogoProps {
  sizeText?: number;
  sizeImg?: number;
}

export const Logo = ({ sizeImg = 70, sizeText = 42 }: ILogoProps) => {
  return (
    <View className=" flex-row items-center ">
      <Text
        style={{
          fontSize: sizeText,
          fontFamily: theme.fonts.family.jetBold,
          color: theme.colors.purple,
          textShadowColor: "rgba(0,0,0,0.6)",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
        }}
      >
        Stack<Text className="text-text">Chat</Text>
      </Text>
      <Image
        source={require("./../../assets/images/logo.png")}
        style={{ width: sizeImg, height: sizeImg }}
      />
    </View>
  );
};
