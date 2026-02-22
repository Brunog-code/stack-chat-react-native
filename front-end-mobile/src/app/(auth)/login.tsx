import { theme } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  function handleAlterToRegister() {
    router.push("/register");
  }
  return (
    <KeyboardAvoidingView className="flex-1 relative" behavior={"padding"}>
      <View className="flex-1 items-center justify-center gap-6">
        <View className="absolute top-0 left-0 right-0 items-center">
          <View
            style={{
              width: width * 1,
              height: width * 0.5,
              backgroundColor: theme.colors.purple,
              borderBottomLeftRadius: width,
              borderBottomRightRadius: width,
              opacity: 0.6,
            }}
          />
        </View>

        <View className=" items-center ">
          <View className=" flex-row items-center">
            <Text
              className="text-5xl font-jet text-purple"
              style={{
                textShadowColor: "rgba(0,0,0,0.6)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Stack<Text className="text-text">Chat</Text>
            </Text>
            <Image
              source={require("./../../../assets/images/logo.png")}
              className="w-[70px] h-[70px]"
            />
          </View>
          <Text className="text-text text-xl font-roboto">
            Conecte-se à comunidade dev
          </Text>
        </View>

        <View className="w-[80%] ">
          <TextInput
            label="Email"
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ backgroundColor: "#24304A" }}
            outlineColor="#4b5563"
            activeOutlineColor="#8B5CF6"
            textColor="#ffffff"
            placeholderTextColor="#9ca3af"
            theme={{ roundness: 8 }}
          />

          <TextInput
            label="password"
            mode="outlined"
            autoCapitalize="none"
            secureTextEntry
            style={{ backgroundColor: "#24304A" }}
            outlineColor="#4b5563"
            activeOutlineColor="#8B5CF6"
            textColor="#ffffff"
            placeholderTextColor="#9ca3af"
            theme={{ roundness: 8 }}
          />

          <Button
            mode="contained"
            buttonColor={theme.colors.purple}
            textColor={theme.colors.text}
            style={{
              height: 50,
              borderRadius: 12,
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            Entrar
          </Button>

          <View className="items-center justify-center mt-6 gap-4">
            <Text
              className="text-purple text-md"
              onPress={() => {
                // ação futura
              }}
            >
              Esqueci minha senha
            </Text>

            <Text className="text-text text-lx">
              Primeiro acesso?{" "}
              <Text
                className="text-purple font-bold"
                onPress={handleAlterToRegister}
              >
                Criar conta
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={require("./../../../assets/images/logo.png")}
        className="w-[250px] h-[250px] absolute -bottom-20 -right-20 opacity-30 -rotate-45"
      />
    </KeyboardAvoidingView>
  );
}
