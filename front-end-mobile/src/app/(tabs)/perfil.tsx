import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/auth-context";
import { View, Text, Pressable } from "react-native";

export default function PerfilScreen() {
  const { logout } = useAuth();
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text>perfil</Text>
      <Pressable onPress={logout}>
        <Text>Sair</Text>
      </Pressable>
    </View>
  );
}
