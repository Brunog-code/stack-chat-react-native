import { theme } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  function handleAlterToRegister() {
    router.push("/register");
  }
  return (
    <View>
      <Text>Login</Text>
      <Pressable onPress={handleAlterToRegister}>
        <Text style={{ fontFamily: theme.fonts.family.jetBold }}>Alterar</Text>
      </Pressable>
    </View>
  );
}
