import { theme } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormData, authSchema } from "@/src/schemas/authSchema";
import { useAuth } from "@/src/contexts/auth-context";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { getApiError } from "@/src/utils/get-api-error";
import { Logo } from "@/src/components/Logo";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  async function handleLogin(data: AuthFormData) {
    try {
      setLoading(true);

      const email = data.email;
      const password = data.password;

      const message = await login(email, password);

      Toast.show({
        type: "success",
        text1: message,
      });

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: getApiError(error),
      });
    } finally {
      setLoading(false);
    }
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
              opacity: 0.5,
            }}
          />
        </View>

        <View className=" items-center ">
          <Logo />

          <Text className="text-text text-xl font-roboto">
            Conecte-se à comunidade dev
          </Text>
        </View>

        <View className="w-[80%] gap-1">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ backgroundColor: "#24304A" }}
                outlineColor="#4b5563"
                activeOutlineColor="#8B5CF6"
                textColor="#ffffff"
                placeholderTextColor="#9ca3af"
                theme={{ roundness: 8 }}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500">{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="senha"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                secureTextEntry
                style={{ backgroundColor: "#24304A" }}
                outlineColor="#4b5563"
                activeOutlineColor="#8B5CF6"
                textColor="#ffffff"
                placeholderTextColor="#9ca3af"
                theme={{ roundness: 8 }}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500">{errors.password.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(handleLogin)}
            buttonColor={theme.colors.purple}
            textColor={loading ? theme.colors.details_bg : theme.colors.text}
            style={{
              height: 50,
              borderRadius: 12,
              justifyContent: "center",
              marginTop: 10,
              backgroundColor: theme.colors.purple, // força via style
              opacity: loading ? 0.6 : 1,
            }}
            labelStyle={{ fontSize: 20, fontWeight: "bold" }}
            disabled={loading}
            icon={
              loading
                ? () => (
                    <ActivityIndicator
                      color={theme.colors.details_bg}
                      size={18}
                    />
                  )
                : undefined
            }
          >
            {loading ? "Entrando..." : "Entrar"}
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
                onPress={() => router.push("/register")}
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
