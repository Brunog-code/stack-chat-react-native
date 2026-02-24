import { theme } from "@/src/constants/theme";
import { View, Text } from "react-native";

export default function PerfilScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text>perfil</Text>
    </View>
  );
}
